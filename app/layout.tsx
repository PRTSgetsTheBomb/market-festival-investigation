// 定义网页的元数据（显示在浏览器标签页上的标题和SEO描述）
export const metadata = {
    title: 'Market Analysis API',
    description: 'Holiday effect API for the market',
}

// 接收所有子页面作为 children 渲染
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'system-ui, sans-serif', margin: 40, lineHeight: 1.6 }}>
                {children}
            </body>
        </html>
    )
}