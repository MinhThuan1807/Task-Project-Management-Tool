'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, redirect } from 'next/navigation'
import { authApi } from '@/lib/services/auth.service'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'

export default function VerificationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )

  useEffect(() => {
    const verifyEmail = async () => {
      // Get params from URL
      const email = searchParams.get('email')
      const token = searchParams.get('token')

      // Validate params
      if (!email || !token) {
        setStatus('error')
        return
      }

      try {
        const data = { email, token }

        // Call verify API
        const response = await authApi.verifyEmail(data)

        toast.success(response.message)
        setStatus('success')

        // Redirect to login after 3 seconds
        setTimeout(() => {
          //   router.push('user/login?verified=true');
          redirect('/login?verified=true')
        }, 3000)
      } catch (error) {
        setStatus('error')
        toast.error(getErrorMessage(error))
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying...</h2>
            <p className="text-gray-600">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">
              Verification successful!
            </h2>
            <p className="text-gray-600 mb-4">
              You will be redirected to the login page...
            </p>
            <button
              onClick={() => router.push('/user/login')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login now
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Verification failed
            </h2>
            <p className="text-gray-600 mb-4">
              Verification failed. Token may have expired.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/resend-verification')}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Resend verification email
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
              >
                Go to homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
