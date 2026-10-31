import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'kuwitoDEV',
  description: 'Портфолио kuwito: сайты и цифровые продукты с продуманным дизайном и надёжной работой.',
  generator: 'kuwito',
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon.ico',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#06111f',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
