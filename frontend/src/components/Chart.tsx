import { useEffect, useRef } from "react";
import * as echarts from 'echarts';

interface Props {
    option: echarts.EChartsOption
    height?: number
}

export default function Chart({ option, height = 360 }: Props) {
    const box = useRef<HTMLDivElement>(null)
    const inst = useRef<echarts.ECharts | null>(null)

    // 挂载一次：创建实例，卸载时释放资源
    useEffect(() => {
        if (!box.current) return
        const chart = echarts.init(box.current)
        inst.current = chart

        const onResize = () => chart.resize()
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            chart.dispose()
            inst.current = null
        }
    }, [])

    // 每次选项更改时替换，不合并
    useEffect(() => {
        inst.current?.setOption(option, true)
    }, [option])

    return <div ref={box} style={{ width: '100%', height }}></div>
}