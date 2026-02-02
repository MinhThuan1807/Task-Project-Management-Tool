import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, AlertCircle } from 'lucide-react'
import SprintCard from '@/components/projects/sprint/SprintCard'
import { Project, ProjectMember, Sprint, User } from '@/lib/types'
import { useSocket } from '@/app/providers/SocketProvider'
import { useEffect, useState } from 'react'
import { notificationApi } from '@/lib/services/notifications.service'

interface ProjectTabsProps {
  project: Project
  sprints: Sprint[]
  user: User
  onDirect: () => void
  openInviteModal: () => void
}

interface INotification {
  _id: string
  userId?: string
  projectId?: string
  taskId?: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

function ProjectTabs({
  project,
  sprints,
  user,
  onDirect,
  openInviteModal
}: ProjectTabsProps) {
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const isOwner = project.ownerId === user._id
  // console.log('ProjectTabs render with notifications:', notifications)
  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await notificationApi.getProjectNotifications(
        project._id
      )
      setNotifications(notifications.data)
    }
    fetchNotifications()
  }, [project._id])

  useEffect(() => {
    if (!socket || !isConnected) return

    // Join project room for real-time updates
    socket.emit('join_notifications_for_project', project._id)

    const handleNewNotification = (notification: INotification) => {
      // console.log('New notification:', notification)
      setNotifications((prev) => [notification, ...prev])
    }

    socket.on('project_notification', handleNewNotification)

    return () => {
      socket.off('project_notification', handleNewNotification)
    }
  }, [socket, isConnected, project._id])

  const formatDate = (timestamp: Date | number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }
  return (
    <Tabs defaultValue="sprints" className="space-y-6">
      <TabsList>
        <TabsTrigger value="sprints">Sprints</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      {/** sprints từ project */}
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
                <h3 className="text-lg text-gray-900 mb-2">No sprints yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first sprint to get started
                </p>
                <Button onClick={onDirect}>Go to Product Backlog</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sprints.map((sprint: Sprint) => (
                  <SprintCard
                    key={sprint._id}
                    sprint={sprint}
                    projectId={project._id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/** team members trong project */}
      <TabsContent value="team">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {project?.members?.length || 0} members in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project?.members?.map((member: ProjectMember) => {
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
                onClick={openInviteModal}
              >
                <Users className="w-4 h-4 mr-2" />
                Invite Team Members
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/** hoạt động gần đây trong project */}
      <TabsContent value="activity">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={notification._id || index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.userId || 'user'}`}
                      />
                      <AvatarFallback>
                        {notification.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {notification.title}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ProjectTabs
// ProjectTab