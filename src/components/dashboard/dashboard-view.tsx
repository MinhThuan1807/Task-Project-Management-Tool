import { useState } from 'react';
import { User, Project, Sprint } from '../../lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Plus,
  FolderKanban,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Settings,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn, formatDate, getStatusColor } from '../../lib/utils';

type DashboardViewProps = {
  currentUser: User;
  allProjects: Project[];
  sprints: Sprint[];
  onProjectSelect: (projectId: string) => void;
  onEditProject: (projectId: string) => void;
  onCreateProject: () => void;
};

export function DashboardView({
  currentUser,
  allProjects,
  sprints,
  onProjectSelect,
  onEditProject,
  onCreateProject,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState('all');

  const myProjects = allProjects.filter((p) => p.ownerId === currentUser.id);
  const participatingProjects = allProjects.filter(
    (p) => p.ownerId !== currentUser.id && p.members.includes(currentUser.id)
  );

  const displayProjects =
    activeTab === 'my' ? myProjects : activeTab === 'participating' ? participatingProjects : allProjects;

  const getProjectSprints = (projectId: string) => {
    return sprints.filter((s) => s.projectId === projectId);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{allProjects.length}</div>
                <FolderKanban className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{sprints.length}</div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">24</div>
                <CheckCircle2 className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">12</div>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Projects</CardTitle>
                <CardDescription>Manage and track your projects</CardDescription>
              </div>
              <Button
                onClick={onCreateProject}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Projects ({allProjects.length})</TabsTrigger>
                <TabsTrigger value="my">My Projects ({myProjects.length})</TabsTrigger>
                <TabsTrigger value="participating">
                  Participating ({participatingProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {displayProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first project</p>
                    <Button
                      onClick={onCreateProject}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProjects.map((project) => {
                      const projectSprints = getProjectSprints(project.id);
                      const isOwner = project.ownerId === currentUser.id;

                      return (
                        <Card
                          key={project.id}
                          className="hover:shadow-xl transition-all cursor-pointer group border-0 shadow-md"
                          onClick={() => onProjectSelect(project.id)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={project.imageUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {project.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                            </div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {project.description || 'No description'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Progress */}
                            <div>
                              <div className="flex items-center justify-between mb-2 text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-gray-900">65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{projectSprints.length} sprints</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{project.members.length} members</span>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(project.createdAt)}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {isOwner ? 'Owner' : 'Member'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: 'Alice Johnson',
                  action: 'completed task',
                  target: 'Setup authentication module',
                  time: '2 hours ago',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
                },
                {
                  user: 'Bob Smith',
                  action: 'created sprint',
                  target: 'Sprint 4',
                  time: '5 hours ago',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
                },
                {
                  user: 'Charlie Wilson',
                  action: 'commented on',
                  target: 'Payment integration',
                  time: '1 day ago',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}