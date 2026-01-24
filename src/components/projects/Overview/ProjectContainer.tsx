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
import { InviteTeamModal } from '@/components/modal/InviteTeamModal'
import { useRouter } from 'next/navigation'
import { EditProjectModal } from '@/components/EditProjectModal'
import { useProjectDetail } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { useParams } from 'next/navigation'
import ProjectHeader from '@/components/projects/Overview/ProjectHeader'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import ProjectStats from './ProjectStats'
import ProjectTabs from './ProjectTabs'
import ProjectContainerSkeleton from './ProjectContainerSkeleton'

function ProjectContainer() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)

  const { data: user } = useCurrentUser()
  const { data: sprints = [] } = useSprintsByProject(projectId)
  const { data: project } = useProjectDetail(projectId)

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

  if (!project || !user) {
    return <ProjectContainerSkeleton />
  }

  // const handleEditProject = (projectId: string, projectData: any) => {
  // toast.success('Project updated successfully')
  // }
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
          user={user}
          onEdit={handleOpenEditModal}
        />

        {/* Stats Cards */}
        {/** sprints gọi dựa trên id projects
         * Lấy data id project từ params
         * Hiển thị các thẻ thông tin về sprint trong project đó
         */}
        <ProjectStats sprintStats={sprintStats} />

        {/* Quick Actions */}
        {/** các useState */}
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
              <Button variant="outline" onClick={() => handleDirectToBacklog()}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Sprint
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsInviteTeamOpen(true)}
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
          user={user}
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
        // onSave={handleEditProject}
      />
    </div>
  )
}

export default ProjectContainer
