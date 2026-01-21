import {
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { CreateProjectModal } from '@/app/(dashboard)/projects/components/CreateProjectModal';
import { Suspense } from 'react';
import MyProject from '../MyProject';
import ParticipatedProjects from '../ParticipatedProjects';
import UserFooter from '../UserFooter';

export function AppSidebar() {
  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center gap-2 p-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
              <span className="text-xl">⚡</span>
            </div>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <h1 className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sprintos
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Project Management</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Chat">
                    <Link href="/chat">
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-2" />

          {/* My Projects */}
          <MyProject/>

          {/* Participating Projects */}
          <ParticipatedProjects  />

        </SidebarContent>

        {/* User Profile Footer */}
        <Suspense fallback={<div className="p-2 text-sm text-center">Loading...</div>}>
          <UserFooter />
        </Suspense>
      </Sidebar>

      {/* Create Project Modal */}
      <CreateProjectModal/>
    </>
  );
}