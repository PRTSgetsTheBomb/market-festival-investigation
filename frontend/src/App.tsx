import { useEffect, useState } from 'react'
import {
  api,
  HOLIDAYS,
  BIZ_GROUPS,
  type ComparisonRow,
  type TopProductRow,
  type TrendRow,
  type YoyRow,
} from './api'
import TopBar from './components/TopBar'
import TrendChart from './components/TrendChart'
import ComparisonChart from './components/ComparisonChart'
import ProductTable from './components/ProductTable'
import './styles/App.css'

export default function App() {
  const [holiday, setHoliday] = useState('Easter');
  const [bizGroup, setBizGroup] = useState(''); // Store total
  const [yr, setYr] = useState(2024);

  const [yoy, setYoy] = useState<YoyRow[]>([]);
  const [trend, setTrend] = useState<TrendRow[]>([]);
  const [comparison, setComparison] = useState<ComparisonRow[]>([]);
  const [products, setProducts] = useState<TopProductRow[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true)
    setError(null)

    Promise.all([
      api.yoy(holiday, bizGroup || undefined),
      api.trend(holiday, bizGroup || undefined),
      api.comparison(holiday, yr),
      api.topProducts(holiday, yr, 20),
    ])
      .then(([y, t, c, p]) => {
        if (cancelled) return;
        setYoy(y.data);
        setTrend(t.data);
        setComparison(c.data);
        setProducts(p.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      })

    return () => {
      cancelled = true
    }
  }, [holiday, bizGroup, yr])

  return (
    <main className="app">
      <h1 className='title'>Holiday Sales Inspect</h1>
      <p className='description'>
        snapshot: 2022-12-01 - 2026-10-22 · index 1.00 = a normal day of that weekday
      </p>

      <TopBar
        holiday={holiday}
        bizGroup={bizGroup}
        yr={yr}
        onHoliday={setHoliday}
        onBizGroup={setBizGroup}
        onYear={setYr}
      />

      {error && (
        <div className='error-message'>
          {error}
        </div>
      )}
      {loading && <div className='loading'>loading...</div>}

      <section className='section'>
        <h2>Year over year - {holiday}</h2>
        <TrendChart rows={yoy} />
      </section>

      <section className='section'>
        <h2>Daily Series {bizGroup || 'store local'}</h2>
        <TrendChart rows={trend} mode="window" />
      </section>

      <section className='section'>
        <h2>Category index - {holiday} {yr}</h2>
        <ComparisonChart rows={comparison} />
      </section>

      <section className='section'>
        <h2>Top products - {holiday} {yr}</h2>
        <ProductTable rows={products} />
      </section>
    </main>
  )
}