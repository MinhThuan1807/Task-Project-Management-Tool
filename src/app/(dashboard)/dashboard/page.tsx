'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  FolderKanban, 
  Calendar, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  MoreVertical,
  Clock
} from 'lucide-react';
import { useAllProjects } from '@/lib/hooks/useProjects';
import { Project } from '@/lib/types';
import { ProjectCard } from '../projects/components/ProjectCard';
import { CreateProjectModal } from '../projects/components/CreateProjectModal';
import { useDispatch } from 'react-redux';
import { openCreateModal } from '@/lib/features/project/projectSlice';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import ProjectSection from '@/components/dashboard/ProjectSection';
export default function DashboardPage() {

  // const projects = [
  //   {
  //     id: '1',
  //     name: 'E-commerce Platform',
  //     description: 'Building a modern e-commerce platform with Next.js',
  //     status: 'In Progress',
  //     progress: 65,
  //     sprints: 3,
  //     members: 5,
  //     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ecommerce',
  //     isOwner: true,
  //   },
  //   {
  //     id: '2',
  //     name: 'Mobile App',
  //     description: 'Cross-platform mobile app development',
  //     status: 'Planning',
  //     progress: 25,
  //     sprints: 1,
  //     members: 3,
  //     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=mobile',
  //     isOwner: false,
  //   },
  //   {
  //     id: '3',
  //     name: 'Analytics Dashboard',
  //     description: 'Real-time analytics and reporting dashboard',
  //     status: 'In Progress',
  //     progress: 80,
  //     sprints: 4,
  //     members: 4,
  //     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=analytics',
  //     isOwner: true,
  //   },
  // ];
    const recentActivity = [
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
    {
      user: 'Diana Chen',
      action: 'moved task',
      target: 'API documentation',
      time: '2 days ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    },
  ];

  const { data: projects, ownedProjects, joinedProjects } = useAllProjects();


  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{projects.length}</div>
                <FolderKanban className="w-8 h-8 opacity-80" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                <TrendingUp className="w-4 h-4" />
                <span>+2 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">8</div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                <TrendingUp className="w-4 h-4" />
                <span>3 ending soon</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">156</div>
                <CheckCircle2 className="w-8 h-8 opacity-80" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                <TrendingUp className="w-4 h-4" />
                <span>+24 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {ownedProjects.reduce((total: number, p: Project) => total + p.members.length, 0)}
                </div>
                <Users className="w-8 h-8 opacity-80" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                <TrendingUp className="w-4 h-4" />
                <span>Across 3 projects</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <ProjectSection/>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across your projects</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {activity.user.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Task
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Project Modal */}
        <CreateProjectModal/>
      </div>
    </div>
  );
}