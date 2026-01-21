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
import SprintCard from '@/app/(dashboard)/projects/[id]/sprint/components/SprintCard'
import { Project, Sprint, User } from '@/lib/types'

interface ProjectTabsProps {
  project: Project
  sprints: Sprint[]
  user: User
  onDirect: () => void
  openInviteModal: () => void
}

function ProjectTabs({
  project,
  sprints,
  user,
  onDirect,
  openInviteModal
}: ProjectTabsProps) {
  const isOwner = project.ownerId === user._id
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
                {sprints.map((sprint: any) => (
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
              {project?.members?.map((member: any) => {
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
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      {activity.target && (
                        <span className="font-medium">{activity.target}</span>
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
  )
}

export default ProjectTabs
