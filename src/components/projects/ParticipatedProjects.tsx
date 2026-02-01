'use client'

import { Separator } from '../ui/separator'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '../ui/sidebar'
import { useParams } from 'next/navigation'
import { useJoinedProjects } from '@/lib/hooks/useProjects'
import { Project } from '@/lib/types'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { Suspense, useState } from 'react'
import ProjectCollapSkeleton from './ProjectCollapSkeleton'
import ProjectCollap from './ProjectCollap'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { useSelector } from 'react-redux'

function ParticipatedProjects() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

  const param = useParams<{ id: string }>()
  const selectedProjectId = param.id

  const { data: joinedProjects } = useJoinedProjects()
  const { data: sprints } = useSprintsByProject(selectedProjectId)

  const isProjectSelected = (project: Project): boolean => {
    return selectedProjectId === project._id
  }

  const currentUser = useSelector(selectCurrentUser)

  const isActiveProject = joinedProjects?.some((project) =>
    project.members.some(
      (member) =>
        member.memberId === currentUser?._id && member.status === 'active'
    )
  )

  if (!joinedProjects && !isActiveProject) {
    return <ProjectCollapSkeleton />
  }

  return (
    <>
      {!isActiveProject && (
        <>
          <Separator className="my-2" />
          <div className="px-4 py-2 text-sm text-gray-500">
            You are not participating in any projects.
          </div>
        </>
      )}
      {isActiveProject && (
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
                      <ProjectCollap
                        key={project._id}
                        project={project}
                        isSelected={isSelected}
                        sprintLink={sprintLink}
                        onOpenChange={(open: boolean) =>
                          setOpenProjectId(open ? project._id : null)
                        }
                        isOpen={openProjectId === project._id}
                      />
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
