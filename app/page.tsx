// 硬编码的 API 测试链接列表
const endpoints = [
    ['/api/yoy?holiday=Easter', 'year-over-year daily curve'],
    ['/api/trend?holiday=Easter&biz_group=Fresh%20%26%20Frozen', 'daily series inside the window'],
    ['/api/comparison?holiday=Zhongqiu', 'index per category'],
    ['/api/top-products?holiday=Zhongqiu&yr=2024&limit=20', 'top moving products'],
]

// 首页组件
export default function Home() {
    return (
        <main>
            <h1>Market Analysis API</h1>
            <p>Data Snapshot: 2023-12-01 to 2026-10-22 (prod_20261023)</p>
            <ul>
                {endpoints.map(([url, label]) => (
                    <li key={url}>
                        <a href={url}>{url}</a> &mdash; {label}
                    </li>
                ))}
            </ul>
        </main>
    )
}