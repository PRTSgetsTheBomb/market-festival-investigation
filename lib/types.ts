export interface TrendRow {
    d: string
    day_offset: number,
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
    ratio: number | null 
    flag: string 
}

export interface YoyRow {
    yr: number 
    day_offset: number 
    sales: number
}