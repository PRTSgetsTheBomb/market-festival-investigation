import type { NextRequest } from "next/server";
import { getComparison } from "@/lib/queries";
import { HttpError, readHoliday, readYear } from '@/lib/validate';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        const holiday = readHoliday(sp.get('holiday'))
        const yr = readYear(sp.get('yr'))
        const data = await getComparison(holiday, yr)
        return Response.json({
            data,
            meta: {
                holiday,
                yr: yr ?? 'all years',
                rows: data.length,
                index: 'weekday-matched, 1.00 = normal',
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