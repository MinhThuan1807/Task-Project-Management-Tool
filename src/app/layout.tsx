import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import StoreProvider from './providers/StoreProvider'
import { SocketProvider } from './providers/SocketProvider'
import { QueryProviders } from './providers/QueryProvider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sprintos - Task & Project Management',
  description:
    'Modern task and project management tool with sprint planning, kanban boards, and team collaboration.',
  keywords: [
    'project management',
    'task management',
    'sprint planning',
    'kanban',
    'agile'
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
       <QueryProviders>
          <StoreProvider>
            <SocketProvider>
              {children}
              <Toaster position="top-right" />
            </SocketProvider>
          </StoreProvider>
       </QueryProviders>
      </body>
    </html>
  )
}
