import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetRadar Hub - Premium Sportsbook & Casino Comparison',
  description: 'Compare welcome bonuses and offers from the top 20 online sportsbooks and casinos. Find the best betting sites for your region.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
