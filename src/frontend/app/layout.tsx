import './globals.css'

export const metadata = {
  title: '天策三角洲社区',
  description: '游戏玩家社区平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
