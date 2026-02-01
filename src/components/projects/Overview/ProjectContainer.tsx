'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { CheckCircle2, Plus, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProjectDetail, useUpdateProject } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import ProjectHeader from '@/components/projects/Overview/ProjectHeader'
import ProjectStats from './ProjectStats'
import ProjectTabs from './ProjectTabs'
import ProjectContainerSkeleton from './ProjectContainerSkeleton'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { UpdateProjectRequest } from '@/lib/types/project.types'
import { useProjectPermissions } from '@/lib/hooks/useProjectPermissions'
import dynamic from 'next/dynamic'
const InviteTeamModal = dynamic(
  () => import('@/components/modal/InviteTeamModal'),
  { ssr: false }
)
const EditProjectModal = dynamic(
  () => import('@/components/modal/EditProjectModal'),
  { ssr: false }
)

interface ProjectContainerProps {
  projectId: string
}

function ProjectContainer({ projectId }: ProjectContainerProps) {
  const router = useRouter()

  const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)

  const { data: sprints = [] } = useSprintsByProject(projectId)
  const { data: project } = useProjectDetail(projectId)
  const currentUser = useSelector(selectCurrentUser)

  const { canEdit } = useProjectPermissions(project)

  const { mutateAsync, isPending } = useUpdateProject(projectId)

  const sprintStats = useMemo(() => {
    if (!project || !sprints) {
      return {
        activeSprints: [],
        completedSprints: [],
        totalSprints: 0,
        isOwner: false
      }
    }

    return {
      activeSprints: sprints.filter((s) => s.status === 'active'),
      completedSprints: sprints.filter((s) => s.status === 'completed'),
      totalSprints: sprints.length
    }
  }, [project, sprints])

  if (!project || !currentUser) {
    return <ProjectContainerSkeleton />
  }

  const handleEditProject = async (data: UpdateProjectRequest) => {
    await mutateAsync(data, {
      onSuccess: () => {
        setIsEditProjectOpen(false)
      }
    })
  }
  const handleOpenEditModal = () => {
    setIsEditProjectOpen(true)
  }
  const handleDirectToBacklog = () => {
    router.push(`/projects/${projectId}/backlog`)
  }
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Project Header */}
        <ProjectHeader
          project={project}
          user={currentUser}
          onEdit={handleOpenEditModal}
        />

        {/* Stats Cards */}
        <ProjectStats sprintStats={sprintStats} />

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleDirectToBacklog()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                View Product Backlog
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDirectToBacklog()}
                disabled={!canEdit}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Sprint
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsInviteTeamOpen(true)}
                disabled={!canEdit}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Members
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <ProjectTabs
          project={project}
          sprints={sprints}
          user={currentUser}
          onDirect={() => handleDirectToBacklog()}
          openInviteModal={() => setIsInviteTeamOpen(true)}
        />
      </div>

      {/* Modals */}
      <InviteTeamModal
        open={isInviteTeamOpen}
        onOpenChange={setIsInviteTeamOpen}
        projectId={project._id}
      />

      <EditProjectModal
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        onSave={handleEditProject}
        isPending={isPending}
      />
    </div>
  )
}

export default ProjectContainer
