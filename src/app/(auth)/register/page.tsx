'use client';

import { useRouter } from 'next/navigation';
import { RegisterPageNew } from '@/components/auth/register-page';
import { User } from '@/lib/types';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (name: string, email: string, password: string) => {
    // Mock registration - in real app, create user account
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      displayName: name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: 'user',
    };

    // Store user in localStorage (mock session)
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');

    toast.success('Account created successfully!');
    router.push('/dashboard');
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  const handleNavigateToLanding = () => {
    router.push('/');
  };

  return (
    <RegisterPageNew
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateToLanding={handleNavigateToLanding}
    />
  );
}
