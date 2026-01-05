'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPageNew } from '@/components/auth/login-page';
import { mockCurrentUser } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, validate credentials
    if (email && password) {
      // Store user in localStorage (mock session)
      localStorage.setItem('currentUser', JSON.stringify(mockCurrentUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/register');
  };

  const handleNavigateToLanding = () => {
    router.push('/');
  };

  return (
    <LoginPageNew
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
      onNavigateToLanding={handleNavigateToLanding}
    />
  );
}
