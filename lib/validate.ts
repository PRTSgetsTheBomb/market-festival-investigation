import { WEBPACK_LAYERS } from "next/dist/lib/constants"

// 定义允许的节假日白名单，镜像数据库里的真实数据
// as const 保证这些值是不可变的字面量类型
export const HOLIDAYS = [
  'AFL Grand Final',
  'Anzac Day',
  'Australia Day',
  'Christmas & New Year',
  'Duanwu',
  'Easter',
  'Lunar New Year',
  'Melbourne Cup',
  'Mothers Day',
  'Yuanxiao',
  'Zhongqiu',
] as const

// 定义允许的业务组白名单
export const BIZ_GROUPS = [
  'Asian Grocery',
  'Baby',
  'Bakery & Festive',
  'Fresh & Frozen',
  'Health & Supplements',
  'Household',
  'In-store Food & Wholesale',
  'Manual Price',
  'Personal Care',
  'Snacks Drinks Liquor',
] as const

// 允许查询的年份白名单
export const YEARS = [2023, 2024, 2025, 2026] as const

//// 自定义 HTTP 错误类，方便在 API 路由中统一捕获并返回对应的状态码（如 400）
export class HttpError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.status = status 
    }
}

// 校验并读取 holiday 参数（必填）。如果没传或不在白名单，直接抛出 400 错误
export function readHoliday(v: string | null): string {
    if(!v) throw new HttpError(400, 'Holiday is required')
    if(!(HOLIDAYS as readonly string[]).includes(v)) {
        throw new HttpError(400, `unknown holiday: ${v}`)
    }
    return v
}

// 校验并读取 biz_group 参数（选填）。如果没传返回 undefined，传错了报 400
export function readBizGroup(v: string | null): string | undefined {
    if(!v) return undefined 
    if(!(BIZ_GROUPS as readonly string[]).includes(v)) {
        throw new HttpError(400, `unknown biz_group: ${v}`)
    }
    return v 
}

// 校验并读取 yr 参数（选填）。不仅要能转成数字，还要是整数且在 YEARS 白名单内
export function readYear(v: string | null): number | undefined {
    if(!v) return undefined
    const n = Number(v)
    if(!Number.isInteger(n) || !(YEARS as readonly number[]).includes(n)) {
        throw new HttpError(400, `unknown year: ${v}`)
    }
    return n
}

// 校验并读取 limit 参数（分页用）。默认 20，最大 100。防止恶意请求一次拉取几百万条数据
export function readLimit(v: string | null, def = 20, max = 100): number {
    if(!v) return def
    const n = Number(v)
    if(!Number.isInteger(n) || n < 1 || n > max) {
        throw new HttpError(400, `limit must be 1...${max}`)
    }
    return n
}