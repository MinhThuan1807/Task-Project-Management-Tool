import { Project, Sprint, User } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  TrendingUp,
  AlertCircle,
  Plus,
  UserPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { formatDate, getStatusColor } from '../../lib/utils';
import { CreateSprintModal, SprintFormData } from './create-sprint-modal';
import { InviteTeamModal, InvitationData } from './invite-team-modal';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { useParams } from 'next/navigation';
import { projectApi } from '@/lib/services/project.service';

interface ProjectMember {
  memberId: string;
  email: string;
  role: 'owner' | 'member' | 'viewer';
  status: 'active' | 'left';
  joinAt: Date;
}

type ProjectOverviewProps = {
  sprints: Sprint[];
  onNavigateToBacklog: () => void;
  onEditProject: () => void;
};

export function ProjectOverview({
  sprints,
  onNavigateToBacklog,
  onEditProject,
}: ProjectOverviewProps) {
  const { data: user } = useCurrentUser();
  const { data: allProjects, isLoading: projectsLoading } = useAllProjects();
  const params = useParams();

  const activeSprints = sprints.filter((s) => new Date(s.endDate) > new Date());
  const completedSprints = sprints.length - activeSprints.length;

  // Modal states
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false);
  
  const projectId = params.id as string;
  const project = allProjects.find((p) => p._id === projectId);
  const isOwner = project.ownerId === user?._id;

  const handleCreateSprint = (sprintData: SprintFormData) => {
    console.log('Creating sprint:', sprintData);
    // TODO: Implement actual sprint creation
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
                {/* <Badge className={getStatusColor(project.status)}>{project.status}</Badge> */}
                {isOwner && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    Owner
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 max-w-2xl">{project.description || 'No description'}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} members</span>
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
                  <DropdownMenuItem onClick={onEditProject}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
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
              <CardTitle className="text-sm text-gray-600">Total Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">{sprints.length}</div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Active Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl text-gray-900">{activeSprints.length}</div>
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
                <div className="text-3xl text-gray-900">{completedSprints}</div>
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
                <div className="text-3xl text-gray-900">68%</div>
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
                onClick={onNavigateToBacklog}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                View Product Backlog
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateSprintOpen(true)}
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
                {sprints.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">No sprints yet</h3>
                    <p className="text-gray-600 mb-4">Create your first sprint to get started</p>
                    <Button onClick={onNavigateToBacklog}>Go to Product Backlog</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sprints.map((sprint) => {
                      const isActive = new Date(sprint.endDate) > new Date();
                      const progress = Math.random() * 100; // Mock progress

                      return (
                        <Card key={sprint._id} className="border shadow-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg text-gray-900">{sprint.name}</h3>
                                  <Badge variant={isActive ? 'default' : 'outline'}>
                                    {isActive ? 'Active' : 'Completed'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{sprint.goal}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{sprint.maxStoryPoint} story points</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Board
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-gray-900">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>{project.members.length} members in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member: ProjectMember) => {
                    const isProjectOwner = member.memberId === project.ownerId;

                    return (
                      <div 
                        key={member.memberId} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} />
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
                          variant={isProjectOwner ? "default" : "outline"}
                          className={isProjectOwner 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                            : ''
                          }
                        >
                          {isProjectOwner ? '👑 Owner' : member.role}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                {isOwner && (
                  <Button variant="outline" className="w-full mt-4">
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
                <CardDescription>Latest updates in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'Alice Johnson', action: 'completed sprint', target: 'Sprint 3', time: '2 hours ago' },
                    { user: 'Bob Smith', action: 'created task', target: 'Setup authentication', time: '5 hours ago' },
                    { user: 'Charlie Wilson', action: 'joined project', target: '', time: '1 day ago' },
                    { user: 'You', action: 'created sprint', target: 'Sprint 4', time: '2 days ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`} />
                        <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-gray-600">{activity.action}</span>{' '}
                          {activity.target && <span className="font-medium">{activity.target}</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
      <CreateSprintModal
        open={isCreateSprintOpen}
        onOpenChange={setIsCreateSprintOpen}
        projectId={project._id}
        onSave={handleCreateSprint}
      />
      
      <InviteTeamModal
        open={isInviteTeamOpen}
        onOpenChange={setIsInviteTeamOpen}
        projectId={project._id}
        // onInvite={handleInviteTeam}
      />
    </div>
  );
}