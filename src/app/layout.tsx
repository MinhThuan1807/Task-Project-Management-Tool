import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import StoreProvider from './providers/StoreProvider';
import { QueryProviders } from './providers/QueryProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sprintos - Task & Project Management',
  description: 'Modern task and project management tool with sprint planning, kanban boards, and team collaboration.',
  keywords: ['project management', 'task management', 'sprint planning', 'kanban', 'agile'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProviders>
          <StoreProvider>
            {children}
            <Toaster position="top-right"/>
          </StoreProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
