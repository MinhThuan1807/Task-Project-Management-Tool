'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useState, useMemo } from 'react'
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  Plus,
  UserPlus,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { formatDate, getStatusColor } from '../../lib/utils'
import { InviteTeamModal, InvitationData } from './invite-team-modal'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useParams, useRouter } from 'next/navigation'
import  SprintCard  from '@/app/(dashboard)/projects/[id]/sprint/components/SprintCard'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { EditProjectModal } from '../EditProjectModal'
import { CreateSprintModal } from '../CreateSprintModal'
import { toast } from 'sonner'
const ProjectOverview = () => {
  
  const { data: user } = useCurrentUser()
  const { data: allProjects, isLoading: projectsLoading } = useAllProjects()
  const params = useParams()
  const projectId = params.id as string
  const project = allProjects?.find((p) => p._id === projectId)
  const { data: sprints } = useSprintsByProject(projectId);

  const router = useRouter()

  // Modal states
  const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);

  // Computed values với safe checks
  const { activeSprints, completedSprints, totalSprints, isOwner } =
    useMemo(() => {
      const active = sprints?.filter((s) => s.status === 'active')
      const total = sprints?.length || 0
      const completed = sprints?.filter((s) => s.status === 'completed')
      const owner = project?.ownerId === user?._id

      return {
        activeSprints: active,
        completedSprints: completed,
        totalSprints: total,
        isOwner: owner
      }
    }, [sprints, project, user])

  // Loading state
  if (projectsLoading || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }
  const handleEditProject = (projectId: string, projectData: Partial<Project>) => {
    // TODO: Implement với useMutation để update project qua API
    toast.success('Project updated successfully');
  };
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 rounded-xl shadow-lg">
              <AvatarImage src={project.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl rounded-xl">
                {project.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl text-gray-900">{project.name}</h1>
                {isOwner && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-300"
                  >
                    Owner
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 max-w-2xl">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => setIsEditProjectOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                </>
              )}
              {!isOwner && (
                <DropdownMenuItem className="text-red-600">
                  Leave Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                Total Sprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">{totalSprints}</div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">
                Active Sprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">
                  {activeSprints?.length}
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">{completedSprints?.length}</div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">
                  {totalSprints > 0
                    ? Math.round((completedSprints?.length / totalSprints) * 100)
                    : 0}
                  %
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push(`/projects/${projectId}/backlog`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                View Product Backlog
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/projects/${projectId}/backlog`)}
              >
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
        <Tabs defaultValue="sprints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="sprints" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Sprint Overview</CardTitle>
                <CardDescription>All sprints in this project</CardDescription>
              </CardHeader>
              <CardContent>
                {!sprints || sprints.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">
                      No sprints yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first sprint to get started
                    </p>
                    <Button onClick={() => router.push(`/projects/${projectId}/backlog`)}>
                      Go to Product Backlog
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                  { sprints.map((sprint) => (
                    <SprintCard key={sprint._id} sprint={sprint} projectId={projectId} />
                  ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {project.members?.length || 0} members in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members?.map((member) => {
                    const isProjectOwner = member.memberId === project.ownerId

                    return (
                      <div
                        key={member.memberId}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {member.email.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={isProjectOwner ? 'default' : 'outline'}
                          className={
                            isProjectOwner
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                              : ''
                          }
                        >
                          {isProjectOwner ? '👑 Owner' : member.role}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
                {isOwner && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setIsInviteTeamOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Invite Team Members
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: 'Alice Johnson',
                      action: 'completed sprint',
                      target: 'Sprint 3',
                      time: '2 hours ago'
                    },
                    {
                      user: 'Bob Smith',
                      action: 'created task',
                      target: 'Setup authentication',
                      time: '5 hours ago'
                    },
                    {
                      user: 'Charlie Wilson',
                      action: 'joined project',
                      target: '',
                      time: '1 day ago'
                    },
                    {
                      user: 'You',
                      action: 'created sprint',
                      target: 'Sprint 4',
                      time: '2 days ago'
                    }
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`}
                        />
                        <AvatarFallback>
                          {activity.user.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-gray-600">
                            {activity.action}
                          </span>{' '}
                          {activity.target && (
                            <span className="font-medium">
                              {activity.target}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
        />
              <CreateSprintModal
        projectId={projectId}
        open={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
      />
    </div>
  )
}
export default ProjectOverview
