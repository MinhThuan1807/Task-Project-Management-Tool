import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/dashboard/AppSideBar'
import TopBar from '@/components/dashboard/TopBar'
import { QueryProviders } from '../providers/QueryProvider';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProviders> 
        <SidebarProvider defaultOpen={false}>
          <AppSidebar/>
          <SidebarInset className="flex flex-col h-screen">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <TopBar />
            </header>
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
    </QueryProviders>
  )
}