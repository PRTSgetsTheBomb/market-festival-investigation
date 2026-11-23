import mysql from 'mysql2/promise'

const g = globalThis as unknown as { __pool?: mysql.Pool}

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

export async function q<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    const [rows] = await pool.query(sql, params)
    return rows as T[]
}