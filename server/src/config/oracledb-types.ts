/**
 * oracledb 타입을 보완하고 런타임에는 실제 oracledb를 사용합니다.
 * node_modules/oracledb 타입이 불완전할 때 이 래퍼를 import 하세요.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _oracledb = require('oracledb');

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
  outBinds?: any;
  metadata?: unknown[];
  [key: string]: unknown;
}

export interface OracledbInstance {
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
  initOracleClient: (options?: unknown) => void;
  createPool: (config: PoolAttributes) => Promise<Pool>;
}

const oracledb = _oracledb as OracledbInstance;
export default oracledb;
