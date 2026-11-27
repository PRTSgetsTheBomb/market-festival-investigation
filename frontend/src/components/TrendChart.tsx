import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import Chart from './Chart';
import type { TrendRow, YoyRow } from '../api';

type Props =
    | { rows: YoyRow[]; mode?: 'yoy' }
    | { rows: TrendRow[]; mode: 'window' }

export default function TrendChart(props: Props) {
    const option = useMemo<EChartsOption>(() => {
        return props.mode === 'window' ? windowOption(props.rows) : yoyOption(props.rows)
    }, [props])

    return <Chart option={option} height={340} />
}

function yoyOption(rows: YoyRow[]): EChartsOption {
    const years = Array.from(new Set(rows.map(r => r.yr))).sort()

    return {
        tooltip: { trigger: 'axis' },
        legend: { data: years.map(String), top: 0 },
        grid: { left: 64, right: 24, top: 40, bottom: 44 },
        xAxis: { type: 'value', name: 'day offset', nameLocation: 'middle', nameGap: 28 },
        yAxis: { type: 'value', name: 'sales / day' },
        series: years.map((y) => ({
            name: String(y),
            type: 'line',
            smooth: true,
            symbolSize: 4,
            data: rows.filter(r => (r.yr === y)).map(r => [r.day_offset, r.sales]),
        })),
    }
}

function windowOption(rows: TrendRow[]): EChartsOption {
    const points = rows.map((r) => [r.day_offset, r.sales])
    const during = rows.filter((r) => r.holiday_phase === 'during').map((r) => r.day_offset)
    const lo = during.length ? Math.min(...during) : null
    const hi = during.length ? Math.max(...during) : null

    const series: any = {
        type: 'line',
        symbolSize: 4,
        data: points,
    }
    if (lo !== null && hi !== null) {
        series.markArea = {
            silent: true,
            itemStyle: { color: 'rgba(255, 170, 0, 0.18)' },
            data: [[{ xAxis: lo }, { xAxis: hi }]],
        }
    }

    return {
        tooltip: { trigger: 'axis' },
        grid: { left: 64, right: 24, top: 20, bottom: 44 },
        xAxis: { type: 'value', name: 'day offset', nameLocation: 'middle', nameGap: 28 },
        yAxis: { type: 'value', name: 'sales / day' },
        series: [series],
    }
}