import { WEBPACK_LAYERS } from "next/dist/lib/constants"

// Whitelists mirror what actually exists in c_index_dow / c_daily_group.
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

export const YEARS = [2023, 2024, 2025, 2026] as const

export class HttpError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.status = status 
    }
}

export function readHoliday(v: string | null): string {
    if(!v) throw new HttpError(400, 'Holiday is required')
    if(!(HOLIDAYS as readonly string[]).includes(v)) {
        throw new HttpError(400, `unknown holiday: ${v}`)
    }
    return v
}

export function readBizGroup(v: string | null): string | undefined {
    if(!v) return undefined 
    if(!(BIZ_GROUPS as readonly string[]).includes(v)) {
        throw new HttpError(400, `unknown biz_group: ${v}`)
    }
    return v 
}

export function readYear(v: string | null): number | undefined {
    if(!v) return undefined
    const n = Number(v)
    if(!Number.isInteger(n) || !(YEARS as readonly number[]).includes(n)) {
        throw new HttpError(400, `unknown year: ${v}`)
    }
    return n
}

export function readLimit(v: string | null, def = 20, max = 100): number {
    if(!v) return def
    const n = Number(v)
    if(!Number.isInteger(n) || n < 1 || n > max) {
        throw new HttpError(400, `limit bmust be 1..${max}`)
    }
    return n
}