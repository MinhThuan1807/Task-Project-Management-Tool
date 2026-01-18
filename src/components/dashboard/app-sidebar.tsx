'use client';
import {
  LayoutDashboard,
  FolderKanban,
  List,
  MessageSquare,
  ChevronRight,
  Plus,
  BarChart2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import { CreateProjectModal } from '@/app/(dashboard)/projects/components/CreateProjectModal';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { Project } from '@/lib/types';
import { useDispatch } from 'react-redux';
import { openCreateModal } from '@/lib/features/project/projectSlice';
import { useParams, useSearchParams } from 'next/dist/client/components/navigation';
import { useRouter } from 'next/navigation';
import { useSprintsByProject } from '@/lib/hooks/useSprints';



export function AppSidebar() {

  const dispatch = useDispatch();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { ownedProjects, joinedProjects } = useAllProjects();
  const param = useParams();
  const selectedProjectId = param.id as string;

  const { data: sprints } = useSprintsByProject(selectedProjectId);
  const sprintActiveId = sprints?.find((s) => s.status === 'active')?._id;
  let sprintLink  = () => {
    if (sprintActiveId) {
      return `sprint/${sprintActiveId}`;
    }
    return `backlog`;
  }
  
  const isProjectSelected = (project: Project): boolean => {
    return selectedProjectId === project._id;
  };

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
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>My Projects</span>
              <Button
                className="p-0.5 hover:bg-sidebar-accent rounded group-data-[collapsible=icon]:hidden"
                variant="ghost"
                onClick={() => dispatch(openCreateModal())}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ownedProjects.length === 0 && (
                  <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                    No projects yet
                  </div>
                )}
                {ownedProjects.map((project: Project) => {
                  return (
                    <Collapsible
                      key={project._id}
                      defaultOpen={isProjectSelected(project)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isProjectSelected(project)}
                            onClick={() => router.push(`/projects/${project._id}`)}
                            tooltip={project.name}
                          >
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={project.imageUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px]">
                                {project.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{project.name}</span>
                            <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/projects/${project._id}/backlog`}>
                                  <List className="w-4 h-4" />
                                  <span>Product Backlog</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/projects/${project._id}/${sprintLink()}`}>
                                  <FolderKanban className="w-4 h-4" />
                                  <span>Sprint Board</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/projects/${project._id}/report`}>
                                  <BarChart2 className="w-4 h-4" />
                                  <span>Reports</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Participating Projects */}
          {joinedProjects.length > 0 && (
            <>
              <Separator className="my-2" />
              <SidebarGroup>
                <SidebarGroupLabel>Participating</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {joinedProjects.map((project: Project) => {
                    
                      return (
                        <Collapsible
                          key={project._id}
                          defaultOpen={isProjectSelected(project)}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                isActive={isProjectSelected(project)}
                                onClick={() => router.push(`/projects/${project._id}`)}
                                tooltip={project.name}
                              >
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={project.imageUrl} />
                                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-[10px]">
                                    {project.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{project.name}</span>
                                <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/projects/${project._id}/backlog`}>
                                      <List className="w-4 h-4" />
                                      <span>Product Backlog</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/projects/${project._id}/${sprintLink()}`}>
                                      <FolderKanban className="w-4 h-4" />
                                      <span>Sprint Board</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={`/projects/${project._id}/report`}>
                                      <BarChart2 className="w-4 h-4" />
                                      <span>Reports</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </SidebarContent>

        {/* User Profile Footer */}
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip={user?.displayName}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user?.displayName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm truncate">{user?.displayName}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email}
                  </p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Create Project Modal */}
      <CreateProjectModal/>
    </>
  );
}