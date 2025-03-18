// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}