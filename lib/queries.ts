import { q } from './db'
import type { ComparisonRow, TopProductRow, TrendRow, YoyRow } from './types'

const CAL = 'c_calendar'
const GRP = 'c_daily_group'

/** Daily series inside the holiday window (T-lead ... T+trail). */
export async function getTrend(holiday: string, bizGroup?: string): Promise<TrendRow[]> {
    if(bizGroup) {
        return q<TrendRow> (
            `SELECT c.d, c.day_offset, c.holiday_phase, g.biz_group,
                    ROUND(g.sales, 2) AS sales, ROUND(g.qty, 2) AS qty
                FROM ${CAL} c
                JOIN ${GRP} g ON g.d = c.d
            WHERE c.holiday = ? AND g.biz_group = ?
            ORDER BY c.day_offset`,
            [holiday, bizGroup],
        )
    }
    return q<TrendRow> (
        `SELECT c.d, c.day_offset, c.holiday_phase, 
            ROUND(g.sales, 2) AS sales, ROUND(g.qty, 2) AS qty
            FROM ${CAL} c
            JOIN ${GRP} g ON g.d = c.d
        WHERE c.holiday = ?
        ORDER BY c.day_offset`,
        [holiday],
    )
}

/** Weekday-adjusted index per category. */
export async function getComparison(holiday: string, yr?: number): Promise<ComparisonRow[]> {
    const params: unknown[] = [holiday]
    let where = 'holiday = ?'
    if(yr) {
        where += ' AND yr = ?'
        params.push(yr)
    }
    return q<ComparisonRow> (
        `SELECT biz_group, days,
                ROUND(sales_day, 2) AS sales_day,
                ROUND(expect_day, 2) AS expect_day,
                ROUND(idx_dow, 3) AS idx
        FROM c_index_dow
        WHERE ${where}
        ORDER BY idx_dow DESC`,
        params
    )
}

/** Products with the largest absolute sales increase during the holiday. */
export async function getTopProducts(holiday: string, yr: number, limit: number): Promise<TopProductRow[]> {
    return q<TopProductRow> (
        `SELECT l.product_code, 
                COALESCE(NULLIF(p.ChineseName, ''), NULLIF(p.KoreanName, ''), p.Description) AS name,
                p.CategoryName AS category,
                ROUND(l.during_sales, 2) AS during_sales,
                ROUND(l.expect_sales, 2) AS expect_sales,
                ROUND(l.uplift, 2) AS uplift,
                l.ratio,
                l.flag
        FROM c_sku_lift l
        LEFT JOIN product p ON p.ProductCode = l.product_code
        WHERE l.holiday = ? AND l.yr = ?
        ORDER BY l.uplift DESC
        LIMIT ?`,
        [holiday, yr, limit],
    )
}

/** Year-over-year curve. Store level comes from the view; category level is aggregated live. */
export async function getYoy(holiday: string, bizGroup?: string): Promise<YoyRow[]> {
    if(!bizGroup) {
        return q<YoyRow> (
            `SELECT yr, day_offset,
                    ROUND(sales_per_day, 0) AS sales,
                    ROUND(qty_per_day, 0) AS qty
            FROM v_yoy
            WHERE holiday = ?
            ORDER BY day_offset, yr`,
            [holiday],
        )
    }
    return q<YoyRow> (
        `SELECT c.yr, c.day_offset,
                ROUND(AVG(g.sales), 0) AS sales,
                ROUND(AVG(g.qty), 0)   AS qty
        FROM ${CAL} c
        JOIN ${GRP} g ON g.d = c.d
        WHERE c.holiday = ? AND g.biz_group = ?
        GROUP BY c.yr, c.day_offset
        ORDER BY c.day_offset, c.yr`,
        [holiday, bizGroup],
    )
}