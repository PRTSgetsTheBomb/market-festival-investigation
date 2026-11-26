import type { NextRequest } from "next/server";
import { getTrend } from "@/lib/queries";
import { HttpError, readBizGroup, readHoliday } from "@/lib/validate";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        const holiday = readHoliday(sp.get('holiday'))
        const bizGroup = readBizGroup(sp.get('biz_group'))
        const data = await getTrend(holiday, bizGroup)
        return Response.json({
            data,
            meta: {
                holiday,
                biz_group: bizGroup ?? 'store detail',
                rows: data.length,
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