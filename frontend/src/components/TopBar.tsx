import { BIZ_GROUPS, HOLIDAYS } from "../api";
import '../styles/TopBar.css';

const YEARS = [2023, 2024, 2025, 2026];

interface Props {
    holiday: string
    bizGroup: string
    yr: number
    onHoliday: (v: string) => void
    onBizGroup: (v: string) => void
    onYear: (v: number) => void
}

export default function TopBar({ holiday, bizGroup, yr, onHoliday, onBizGroup, onYear }: Props) {
    return (
        <div className="div">
            <label className="label">
                Holiday
                <select value={holiday} onChange={((e) => onHoliday(e.target.value))} className="select">
                    {HOLIDAYS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
            </label>

            <label className="label">
                Category
                <select value={bizGroup} onChange={((e) => onBizGroup(e.target.value))} className="select">
                    {BIZ_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </label>

            <label className="label">
                Year
                <select value={yr} onChange={((e) => onYear(Number(e.target.value)))} className="select">
                    {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </label>
        </div>
    )
}