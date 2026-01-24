'use client'

import { Separator } from '../ui/separator'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '../ui/sidebar'
import { useParams, useRouter } from 'next/navigation'
import { useJoinedProjects } from '@/lib/hooks/useProjects'
import { Project } from '@/lib/types'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { Suspense, useState } from 'react'
import ProjectCollapSkeleton from './ProjectCollapSkeleton'
import ProjectCollap from './ProjectCollap'

function ParticipatedProjects() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const param = useParams()
  const router = useRouter()
  const selectedProjectId = param.id as string

  const { data: joinedProjects } = useJoinedProjects()
  const { data: sprints } = useSprintsByProject(selectedProjectId)

  const isProjectSelected = (project: Project): boolean => {
    return selectedProjectId === project._id
  }

  if (!joinedProjects) {
    return <ProjectCollapSkeleton />
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
                  const isSelected = isProjectSelected(project)
                  const sprintActiveId = sprints?.find(
                    (s) => s.status === 'active'
                  )?._id
                  const sprintLink = sprintActiveId
                    ? `sprint/${sprintActiveId}`
                    : 'backlog'

                  return (
                    <Suspense key={project._id} fallback={<div>Loading</div>}>
                      <ProjectCollap
                        project={project}
                        isSelected={isSelected}
                        onSelect={() => router.push(`/projects/${project._id}`)}
                        sprintLink={sprintLink}
                        onOpenChange={(open: boolean) =>
                          setOpenProjectId(open ? project._id : null)

                        }
                        isOpen={openProjectId === project._id}
                      />
                    </Suspense>
                  )
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
