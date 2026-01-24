'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sprint } from '@/lib/types'
import { CreateSprintModal } from '@/components/CreateSprintModal'
import { toast } from 'sonner'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject, useUpdateSprint } from '@/lib/hooks/useSprints'
import { getErrorMessage } from '@/lib/utils'
import MainBacklogArea from './MainBacklogArea'
import BlacklogSprintPlanning from './BlacklogSprintPlanning'
import BacklogContainerSkeleton from './BacklogContainerSkeleton'

function BacklogContainer() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const { data: allProjects } = useAllProjects()
  const { data: sprints } = useSprintsByProject(projectId)

  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false)

  const project = allProjects.find((p) => p._id === projectId)
  const projectSprints = sprints?.filter((s) => s.projectId === projectId) || []
  const plannedSprint = sprints?.find((s) => s.status === 'planned')
  const sprintPlannedId = plannedSprint ? plannedSprint._id : ''

  const updateStatusSprint = useUpdateSprint({ sprintId: sprintPlannedId, projectId })

  const handleStartSprint = async (sprint: Sprint) => {
    if (sprint.status === 'planned') {
      await updateStatusSprint.mutate(
        { status: 'active' },
        {
          onSuccess: () => {
            toast.success(`Sprint "${sprint.name}" started successfully!`)
          },
          onError: (error) => {
            toast.error(getErrorMessage(error) || 'Failed to start sprint')
          }
        }
      )
    }
    router.push(`/projects/${projectId}/sprint/${sprint._id}`)
  }

  if (!project) {
    return (
      <BacklogContainerSkeleton />
    )
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Main Backlog Area */}
      <MainBacklogArea
        sprints={projectSprints}
        onCreateSprint={() => setIsCreateSprintOpen(true)}
        // project={project}
      />

      {/* Sprint Planning Sidebar */}
      <BlacklogSprintPlanning
        sprints={projectSprints}
        onCreateSprint={() => setIsCreateSprintOpen(true)}
        onStartSprint={handleStartSprint}
      />
      {/* Modals */}
      <CreateSprintModal
        projectId={projectId}
        open={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
      />

    </div>
  )
}

export default BacklogContainer
