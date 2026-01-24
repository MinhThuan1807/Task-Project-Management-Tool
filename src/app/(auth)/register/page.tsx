'use client'

import { useRouter } from 'next/navigation'
import { RegisterPageNew } from '@/components/auth/register-page'

export default function RegisterPage() {
  const router = useRouter()

  const handleNavigateToLogin = () => {
    router.push('/login')
  }

  const handleNavigateToLanding = () => {
    router.push('/')
  }

  return (
    <RegisterPageNew
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateToLanding={handleNavigateToLanding}
    />
  )
}
