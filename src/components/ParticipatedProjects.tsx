'use client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Separator } from './ui/separator';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BarChart2, ChevronRight, FolderKanban, List } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useJoinedProjects } from '@/lib/hooks/useProjects';
import { Project } from '@/lib/types';
import { useSprintsByProject } from '@/lib/hooks/useSprints';
import { Suspense } from 'react';
import ProjectCollapSkeleton from './projects/ProjectCollapSkeleton';
import ProjectCollap from './projects/ProjectCollap';
function ParticipatedProjects() {
    const param = useParams();
    const router = useRouter();
    const selectedProjectId = param.id as string;
    
    const { data: joinedProjects } = useJoinedProjects();
    const { data: sprints } = useSprintsByProject(selectedProjectId);

  
    const isProjectSelected = (project: Project): boolean => {
      return selectedProjectId === project._id;
    };
    const sprintActiveId = sprints?.find((s) => s.status === 'active')?._id;
    let sprintLink  = () => {
        if (sprintActiveId) {
          return `sprint/${sprintActiveId}`;
        }
        return `backlog`;
    }
    if (!joinedProjects ) {
      return <ProjectCollapSkeleton />;
    }
  return (
    <>
      {joinedProjects?.length > 0 && (
            <>
              <Separator className="my-2" />
              <SidebarGroup>
                <SidebarGroupLabel>Participating</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {joinedProjects?.map((project: Project) => {
                      // Tính toán các giá trị cần thiết
                                        const isSelected = isProjectSelected(project);
                                        // Tính toán sprintLink cho từng project (nếu cần fetch riêng thì truyền vào)
                                        const sprintActiveId = sprints?.find((s) => s.status === 'active')?._id;
                                        const sprintLink = sprintActiveId ? `sprint/${sprintActiveId}` : 'backlog';
                    
                      return (
                       <Suspense key={project._id} fallback={<div>Loading</div>}>
                                             <ProjectCollap
                                               project={project}
                                               isSelected={isSelected}
                                               onSelect={() => router.push(`/projects/${project._id}`)}
                                               sprintLink={sprintLink}
                                             />
                        </Suspense>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
    )}
    </>
  )
}

export default ParticipatedProjects
