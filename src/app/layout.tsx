import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GameProvider } from '@/lib/GameContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '陰謀論説得ゲーム',
  description: '陰謀論に傾いた人を説得で正気に戻すゲーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}