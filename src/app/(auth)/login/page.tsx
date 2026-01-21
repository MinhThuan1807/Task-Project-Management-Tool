'use client';

import { useRouter } from 'next/navigation';
import { LoginPageNew } from '@/components/auth/login-page';


export default function LoginPage() {
  const router = useRouter();
  const handleNavigateToLanding = () => {
    router.push('/');
  };

  return (
    <LoginPageNew
      onNavigateToResgister={() => router.push('/register')}
      onNavigateToLanding={handleNavigateToLanding}
    />
  );
}
