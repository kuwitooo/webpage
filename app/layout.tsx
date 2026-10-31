import type { Metadata, Viewport } from 'next'
import './globals.css'

const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/secret-phantasm' : ''

export const metadata: Metadata = {
  title: 'kuwitoDEV',
  description: 'Портфолио kuwito: сайты и цифровые продукты с продуманным дизайном и надёжной работой.',
  generator: 'kuwito',
  icons: {
    icon: `${basePath}/icons/favicon.ico`,
    shortcut: `${basePath}/icons/favicon.ico`,
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
      </body>
    </html>
  )
}
