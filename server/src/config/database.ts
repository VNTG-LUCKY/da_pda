import oracledb, {
  type ConnectionAttributes,
  type PoolAttributes,
  type Pool,
  type Connection,
  type ExecuteOptions,
  type BindParameters,
  type Result,
} from './oracledb-types';
import dotenv from 'dotenv';
import path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config(); // .env를 fallback으로 로드
console.log(`[DB] Loading env from: ${envFile} (NODE_ENV=${nodeEnv})`);

// Oracle Client 모드 설정 (Thick 모드 사용)
// Oracle Instant Client가 설치되어 있으면 자동으로 Thick 모드 사용
// 명시적으로 Thick 모드 활성화 시도
try {
  // Thick 모드 활성화 (Oracle Instant Client 필요)
  oracledb.initOracleClient();
  console.log('Oracle Thick mode initialized');
} catch (error: any) {
  console.warn('Oracle Thick mode initialization failed, using Thin mode:', error.message);
  console.warn('Note: Some Oracle versions may require Thick mode (Oracle Instant Client)');
}

// Oracle DB 연결 설정 (.env / .env.<NODE_ENV>에서만 로드 — 기본값에 자격 증명을 넣지 않음)
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbConnectString = process.env.DB_CONNECTION_STRING || '';

console.log('[DB] Config loaded:');
console.log('  User:', dbUser);
console.log('  Connect String:', dbConnectString);
console.log('  ENV:', nodeEnv);

const dbConfig: ConnectionAttributes = {
  user: dbUser,
  password: dbPassword,
  connectString: dbConnectString,
};

// 연결 풀 설정
const poolConfig: PoolAttributes = {
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: 0,  // 초기 연결 수를 0으로 설정하여 연결 실패 시 타임아웃 방지
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
  queueTimeout: 60000,  // 연결 대기 시간
};

let pool: Pool | null = null;

/**
 * 데이터베이스 연결 풀 초기화
 */
export async function initializePool(): Promise<void> {
  try {
    console.log('Attempting to initialize Oracle DB connection pool...');
    console.log('Connection string:', dbConfig.connectString);
    console.log('User:', dbConfig.user);
    console.log('Password length:', dbConfig.password ? dbConfig.password.length : 0);
    
    // 풀 생성 (poolMin=0이므로 즉시 생성됨)
    pool = await oracledb.createPool(poolConfig);
    console.log('Oracle DB connection pool created successfully');
    
    // 풀 초기화 시 테스트 연결은 제거 (첫 요청 시 자동으로 연결됨)
    console.log('Oracle DB connection pool initialized successfully');
  } catch (error: any) {
    console.error('Error initializing Oracle DB connection pool:');
    console.error('Error code:', error.errorNum || error.code);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

/**
 * 데이터베이스 연결 풀 종료
 */
export async function closePool(): Promise<void> {
  try {
    if (pool) {
      await pool.close(10);
      console.log('Oracle DB connection pool closed');
    }
  } catch (error) {
    console.error('Error closing Oracle DB connection pool:', error);
    throw error;
  }
}

/**
 * 데이터베이스 연결 가져오기
 */
export async function getConnection(): Promise<Connection> {
  if (!pool) {
    // 풀이 없으면 새로 초기화 시도
    console.log('Pool not initialized, attempting to initialize...');
    await initializePool();
    if (!pool) {
      throw new Error('Database pool is not initialized. Call initializePool() first.');
    }
  }
  try {
    return await pool.getConnection();
  } catch (error: any) {
    console.error('Error getting connection from pool:', error);
    throw error;
  }
}

/**
 * 쿼리 실행 헬퍼 함수
 */
export async function executeQuery<T = any>(
  sql: string,
  binds?: BindParameters,
  options?: ExecuteOptions
): Promise<Result<T>> {
  const connection = await getConnection();
  try {
    const executeOptions: ExecuteOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    };
    
    // binds가 없으면 빈 객체 {} 또는 undefined 전달
    const result = await connection.execute<T>(
      sql, 
      binds || {}, 
      executeOptions
    );
    
    return result;
  } finally {
    await connection.close();
  }
}

/**
 * 트랜잭션 실행 헬퍼 함수
 */
export async function executeTransaction<T>(
  callback: (connection: Connection) => Promise<T>
): Promise<T> {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.close();
  }
}

export default {
  initializePool,
  closePool,
  getConnection,
  executeQuery,
  executeTransaction,
};




