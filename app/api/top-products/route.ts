import type { NextRequest } from 'next/server';
import { getTopProducts } from '@/lib/queries';
import { HttpError, readHoliday, readLimit, readYear } from '@/lib/validate';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        const holiday = readHoliday(sp.get('holiday'))
        const yr = readYear(sp.get('yr')) ?? 2024
        const limit = readLimit(sp.get('limit'))
        const data = await getTopProducts(holiday, yr, limit)
        return Response.json({
            data,
            meta: {
                holiday,
                yr,
                rows: data.length,
                note: 'uplift = during_sales - expect_sales; product 291874 is the manual-price placeholder.',
            },
        })
    } catch (err) {
        const status = err instanceof HttpError ? err.status : 500
        return Response.json(
            { error: err instanceof Error ? err.message : 'internal error' },
            { status }
        )
    }
}