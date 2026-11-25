import type { NextRequest } from "next/server";
import { getYoy } from "@/lib/queries";
import { HttpError, readBizGroup, readHoliday } from "@/lib/validate";

export const runtime = 'nodejs' // 强制使用 Node.js 环境（因为用到了 mysql2，不能跑在 Edge 环境）
export const dynamic = 'force-dynamic' // 强制动态渲染，不使用静态缓存（保证每次请求都是最新数据）

export async function GET(req: NextRequest) {
    try {
        const sp = req.nextUrl.searchParams
        // 1. 校验参数
        const holiday = readHoliday(sp.get('holiday'))
        const bizGroup = readBizGroup(sp.get('biz_group'))
        // 2. 查数据库
        const data = await getYoy(holiday, bizGroup)
        // 3. 返回 JSON 格式数据，附带元信息（方便前端调试）
        return Response.json({
            data,
            meta: {
                holiday,
                biz_group: bizGroup ?? 'store detail',
                source: bizGroup ? 'c_calendar + c_daily_group (live)' : 'v_yoy',
                rows: data.length,
                note: 'day_offset 0 is the holiday anchor (Good Friday for Easter, 12-24 for Christmas).'
            },
        })
    } catch (err) {
        // 统一错误处理
        const status = err instanceof HttpError ? err.status : 500
        return Response.json(
            { error: err instanceof Error ? err.message : 'internal error' },
            { status }
        )
    }
}