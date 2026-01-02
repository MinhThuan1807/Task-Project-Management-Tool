import { Project, Sprint, User } from './types';

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'pm@sprintos.com',
  displayName: 'Project Manager',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PM',
  role: 'user',
};

// Mock all projects data
export const mockAllProjects: Project[] = [
  {
    id: 'project-1',
    ownerId: 'user-1',
    name: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project1',
    members: ['user-1', 'user-2', 'user-3'],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'project-2',
    ownerId: 'user-1',
    name: 'Mobile App Development',
    description: 'Build iOS and Android mobile applications',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project2',
    members: ['user-1', 'user-2', 'user-4', 'user-5'],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'project-3',
    ownerId: 'user-5',
    name: 'E-commerce Platform',
    description: 'Build online shopping platform',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project3',
    members: ['user-5', 'user-1', 'user-3', 'user-6'],
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project-4',
    ownerId: 'user-2',
    name: 'API Integration',
    description: 'Integrate third-party APIs',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project4',
    members: ['user-2', 'user-1'],
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock sprints data
export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    projectId: 'project-1',
    name: 'Sprint 1',
    goal: 'Complete homepage and authentication',
    storyPoint: 40,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sprint-2',
    projectId: 'project-1',
    name: 'Sprint 2',
    goal: 'Build product catalog and cart',
    storyPoint: 50,
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sprint-3',
    projectId: 'project-2',
    name: 'Sprint 1',
    goal: 'Setup mobile app foundation',
    storyPoint: 35,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
