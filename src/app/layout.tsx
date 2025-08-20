import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/Input.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import SessionProvider from '@/components/providers/SessionProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AP Repair - ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์',
  description: 'ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์แบบครบวงจร สำหรับ Bitmain, Whatsminer, และ Avalon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
