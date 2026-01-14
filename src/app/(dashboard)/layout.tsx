'use client';

import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAllProjects } from '@/lib/hooks/useProjects';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: allProjects, isLoading: projectsLoading } = useAllProjects();

  const getSelectedProjectId = (): string | null => {
    const match = pathname.match(/\/projects\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const handleProjectSelect = (projectId: string | null) => {
    if (projectId) {
      router.push(`/projects/${projectId}`);
    } else {
      router.push('/dashboard');
    }
  };

  if (userLoading || projectsLoading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedProjectId = getSelectedProjectId();
  const selectedProject = allProjects.find(
    (p) => p.id === selectedProjectId || p._id === selectedProjectId
  );

  return (
    <SidebarProvider>
      <AppSidebar
        selectedProjectId={selectedProjectId}
        onProjectSelect={handleProjectSelect}
      />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <TopBar
            selectedProject={selectedProject}
            currentView={selectedProjectId ? 'project' : 'dashboard'}
          />
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}