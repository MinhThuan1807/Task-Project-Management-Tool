'use client'
import { Button } from '../ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '../ui/sidebar'
import { useDispatch } from 'react-redux'
import { openCreateModal } from '@/lib/features/project/projectSlice'
import { Plus } from 'lucide-react'
import { useOwnedProjects } from '@/lib/hooks/useProjects'
import { Project } from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { Suspense, useState } from 'react'
import ProjectCollap from './ProjectCollap'
import ProjectCollapSkeleton from './ProjectCollapSkeleton'

function MyProject() {
  const dispatch = useDispatch()
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const router = useRouter()
  const param = useParams()
  const selectedProjectId = param.id as string

  const { data: ownedProjects } = useOwnedProjects()
  const { data: sprints } = useSprintsByProject(selectedProjectId)

  const isProjectSelected = (project: Project): boolean => {
    return selectedProjectId === project._id
  }
  if (!ownedProjects) {
    return <ProjectCollapSkeleton />
  }
  return (
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
          {/** Projects Collapsible */}
          {ownedProjects?.length === 0 && (
            <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
              No projects yet
            </div>
          )}
          {ownedProjects?.map((project: Project) => {
            // Tính toán các giá trị cần thiết
            const isSelected = isProjectSelected(project)
            // Tính toán sprintLink cho từng project (nếu cần fetch riêng thì truyền vào)
            const sprintActiveId = sprints?.find(
              (s) => s.status === 'active'
            )?._id
            const sprintLink = sprintActiveId
              ? `sprint/${sprintActiveId}`
              : 'backlog'

            return (
              <Suspense key={project._id} fallback={<ProjectCollapSkeleton />}>
                <ProjectCollap
                  project={project}
                  isSelected={isSelected}
                  isOpen={openProjectId === project._id}
                  onOpenChange={(open: boolean) =>
                    setOpenProjectId(open ? project._id : null)
                  }
                  sprintLink={sprintLink}
                  onSelect={() => router.push(`/projects/${project._id}`)}
                />
              </Suspense>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default MyProject
