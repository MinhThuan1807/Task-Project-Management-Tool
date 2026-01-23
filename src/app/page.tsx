'use client'

import { LandingPageNew } from '@/components/auth/landing-page'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const handleNavigateToLogin = () => {
    router.push('/login')
  }

  return <LandingPageNew onNavigateToLogin={handleNavigateToLogin} />
}
