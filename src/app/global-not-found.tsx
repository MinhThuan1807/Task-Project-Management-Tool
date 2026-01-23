'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalNotFound() {
  const router = useRouter()

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl bg-white flex flex-col items-center text-center border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 text-lg"
            onClick={() => router.push('/')}
          >
            Go to Homepage
          </Button>
        </div>
      </body>
    </html>
  )
}