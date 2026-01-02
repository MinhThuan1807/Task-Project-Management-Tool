'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Project } from '@/lib/types';
import { mockCurrentUser, mockAllProjects } from '@/lib/mock-data';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser');

    if (!isAuthenticated || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Get current view from pathname
  const getCurrentView = (): 'dashboard' | 'projects' | 'backlog' | 'sprint' | 'chat' | 'profile' | 'security' => {
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/security')) return 'security';
    if (pathname.includes('/sprint')) return 'sprint';
    if (pathname.includes('/backlog')) return 'backlog';
    if (pathname.includes('/projects')) return 'projects';
    return 'dashboard';
  };

  // Get selected project from pathname
  const getSelectedProjectId = (): string | null => {
    const match = pathname.match(/\/projects\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const handleViewChange = (
    view: 'dashboard' | 'projects' | 'backlog' | 'sprint' | 'chat' | 'profile' | 'security'
  ) => {
    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      chat: '/chat',
      profile: '/profile',
      security: '/security',
    };

    if (routes[view]) {
      router.push(routes[view]);
    }
  };

  const handleProjectSelect = (projectId: string | null) => {
    if (projectId) {
      router.push(`/projects/${projectId}`);
    } else {
      router.push('/dashboard');
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get all projects and selected project from localStorage
  const allProjectsData = localStorage.getItem('allProjects');
  const allProjects: Project[] = allProjectsData ? JSON.parse(allProjectsData) : mockAllProjects;
  const selectedProjectId = getSelectedProjectId();
  const selectedProject = allProjects.find((p) => p.id === selectedProjectId);

  return (
    <SidebarProvider>
      <AppSidebar
        currentUser={currentUser}
        allProjects={allProjects}
        selectedProjectId={selectedProjectId}
        currentView={getCurrentView()}
        onProjectSelect={handleProjectSelect}
        onViewChange={handleViewChange}
      />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <TopBar
            currentUser={currentUser}
            selectedProject={selectedProject}
            currentView={getCurrentView()}
          />
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
