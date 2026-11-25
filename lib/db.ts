import mysql from 'mysql2/promise'

// 借助 globalThis 缓存连接池。防止在开发环境（热更新）下每次都创建新连接池导致连接打满
const g = globalThis as unknown as { __pool?: mysql.Pool}

// 创建或复用连接池
export const pool: mysql.Pool =
    g.__pool ??
    (g.__pool = mysql.createPool({
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: Number(process.env.DB_PORT ?? 3307),
        user: process.env.DB_USER ?? 'da',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME ?? 'prod_20261023',
        connectionLimit: 5,
        waitForConnections: true,
        connectTimeout: 10000,
        dateStrings: true,
        decimalNumbers: true,
    }))

if(!g.__pool) g.__pool = pool

// 封装通用查询函数 q，返回泛型数组 T[]
// 使用 pool.query 而不是 execute，更方便处理动态拼接的 SQL
export async function q<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    const [rows] = await pool.query(sql, params)
    return rows as T[]
}