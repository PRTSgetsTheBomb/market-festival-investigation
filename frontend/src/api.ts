export interface TrendRow {
    d: string
    day_offset: number
    holiday_phase: 'before' | 'during' | 'after'
    biz_group?: string
    sales: number
    qty: number
}

export interface ComparisonRow {
    biz_group: string
    days: number
    sales_day: number
    expect_day: number
    idx: number
}

export interface TopProductRow {
    product_code: string
    name: string | null
    category: string | null
    during_sales: number
    expect_sales: number
    uplift: number
}

export interface YoyRow {
    yr: number
    day_offset: number 
    sales: number 
    qty: number 
}

export interface ApiResult<T> {
    data: T[]
    meta: Record<string, unknown>
}

export const HOLIDAYS = [
    'Easter',
    'Zhongqiu',
    'Lunar New Year',
    'Christmas & New Year',
    'AFL Grand Final',
    'Duanwu',
    'Yuanxiao',
    'Australia Day',
    'Anzac Day',
    'Melbourne Cup',
    'Mothers Day',
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

async function get<T>(
    path: string,
    params: Record<string, string | number | undefined>,
): Promise<ApiResult<T>> {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '') qs.set(k, String(v))
    }
    const res = await fetch(`/api${path}?${qs.toString()}`)
    const body = await res.json().catch(() => null)
    if (!res.ok) {
        const msg =
            body && typeof body === 'object' && 'error' in body
                ? String((body as { error: unknown }).error)
                : `HTTP ${res.status}`
        throw new Error(msg)
    }
    return body as ApiResult<T>
}

export const api = {
    yoy: (holiday: string, bizGroup?: string) =>
        get<YoyRow>('/yoy', { holiday, biz_group: bizGroup }),

    trend: (holiday: string, bizGroup?: string) =>
        get<TrendRow>('/trend', { holiday, biz_group: bizGroup }),

    comparison: (holiday: string, yr?: number) =>
        get<ComparisonRow>('/comparison', { holiday, yr }),

    topProducts: (holiday: string, yr: number, limit = 20) =>
        get<TopProductRow>('/top-products', { holiday, yr, limit }),
}