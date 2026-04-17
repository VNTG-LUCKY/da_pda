import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializePool, closePool, executeQuery } from './config/database';
import locationRoutes from './routes/location';
import slittingRoutes from './routes/slitting';
import loadingRoutes from './routes/loading';
import emailRoutes from './routes/email';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
// CORS 설정: 모든 origin 허용 (프로덕션에서는 특정 origin만 허용하도록 수정 권장)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/location', locationRoutes);
app.use('/api/slitting', slittingRoutes);
app.use('/api/loading', loadingRoutes);
app.use('/api/email', emailRoutes);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DA PDA Server is running!' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// DB 연결 테스트 엔드포인트 (풀 사용)
app.get('/api/db/test', async (req: Request, res: Response) => {
  try {
    const result = await executeQuery('SELECT SYSDATE FROM DUAL');
    res.json({ 
      status: 'success', 
      message: 'Database connection successful',
      data: result.rows 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// DB 환경 확인 엔드포인트
app.get('/api/db/env', (req: Request, res: Response) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_USER: process.env.DB_USER,
  });
});

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 연결 풀 초기화 (실패해도 서버는 시작)
    try {
      await initializePool();
    } catch (dbError) {
      console.warn('Database pool initialization failed, but server will continue to start.');
      console.warn('You can test DB connection later via /api/db/test endpoint');
    }
    
    // Express 서버 시작 (모든 인터페이스에서 리스닝)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log(`Server is accessible at http://172.17.1.56:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

startServer();

