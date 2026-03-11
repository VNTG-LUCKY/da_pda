/**
 * oracledb 패키지에 TypeScript 타입이 없거나 불완전할 때 사용하는 선언입니다.
 * 런타임에는 실제 oracledb 패키지가 사용됩니다.
 */
declare module 'oracledb' {
  export interface ConnectionAttributes {
    user?: string;
    password?: string;
    connectString?: string;
    [key: string]: unknown;
  }

  export interface PoolAttributes extends ConnectionAttributes {
    poolMin?: number;
    poolMax?: number;
    poolIncrement?: number;
    poolTimeout?: number;
    queueTimeout?: number;
    [key: string]: unknown;
  }

  export interface Pool {
    getConnection(): Promise<Connection>;
    close(drainTime?: number): Promise<void>;
  }

  export interface Connection {
    execute<T>(sql: string, binds?: BindParameters, options?: ExecuteOptions): Promise<Result<T>>;
    close(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    beginTransaction(): Promise<void>;
  }

  export interface ExecuteOptions {
    outFormat?: number;
    [key: string]: unknown;
  }

  export type BindParameters = Record<string, unknown> | unknown[];

  export interface Result<T = unknown> {
    rows?: T[];
    outBinds?: unknown;
    metadata?: unknown[];
    [key: string]: unknown;
  }

  export const OUT_FORMAT_OBJECT: number;
  export const OUT_FORMAT_ARRAY: number;
  export const BIND_IN: number;
  export const BIND_INOUT: number;
  export const BIND_OUT: number;
  export const CURSOR: number;
  export const STRING: number;
  export const DATE: number;

  export function initOracleClient(options?: unknown): void;
  export function createPool(config: PoolAttributes): Promise<Pool>;

  interface OracledbInstance {
    ConnectionAttributes: ConnectionAttributes;
    PoolAttributes: PoolAttributes;
    Pool: Pool;
    Connection: Connection;
    ExecuteOptions: ExecuteOptions;
    BindParameters: BindParameters;
    Result: Result;
    OUT_FORMAT_OBJECT: number;
    OUT_FORMAT_ARRAY: number;
    BIND_IN: number;
    BIND_INOUT: number;
    BIND_OUT: number;
    CURSOR: number;
    STRING: number;
    DATE: number;
    initOracleClient: typeof initOracleClient;
    createPool: typeof createPool;
  }

  const oracledb: OracledbInstance;
  export default oracledb;
}
