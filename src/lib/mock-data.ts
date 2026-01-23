import { Project, Sprint, User } from './types'

// Mock current user
// export const mockCurrentUser: User = {
//   _id: 'user-1',
//   email: 'pm@sprintos.com',
//   displayName: 'Project Manager',
//   avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PM',
//   role: 'user',
// };

// Mock all projects data
// export const mockAllProjects: Project[] = [
//   {
//     id: 'project-1',
//     ownerId: 'user-1',
//     name: 'Website Redesign',
//     description: 'Redesign company website with modern UI/UX',
//     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project1',
//     members: ['user-1', 'user-2', 'user-3'],
//     status: 'active',
//     createdAt: new Date(),
//   },
//   {
//     id: 'project-2',
//     ownerId: 'user-1',
//     name: 'Mobile App Development',
//     description: 'Build iOS and Android mobile applications',
//     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project2',
//     members: ['user-1', 'user-2', 'user-4', 'user-5'],
//     status: 'active',
//     createdAt: new Date(),
//   },
//   {
//     id: 'project-3',
//     ownerId: 'user-5',
//     name: 'E-commerce Platform',
//     description: 'Build online shopping platform',
//     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project3',
//     members: ['user-5', 'user-1', 'user-3', 'user-6'],
//     status: 'active',
//     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//   },
//   {
//     id: 'project-4',
//     ownerId: 'user-2',
//     name: 'API Integration',
//     description: 'Integrate third-party APIs',
//     imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project4',
//     members: ['user-2', 'user-1'],
//     status: 'active',
//     createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
//   },
// ];

// Mock sprints data
export const mockSprints: Sprint[] = [
  {
    _id: 'sprint-1',
    projectId: '6968b98d337550ce8b9084c5',
    name: 'Sprint 1',
    goal: 'Complete homepage and authentication',
    maxStoryPoint: 40,
    status: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'sprint-2',
    projectId: '6968b98d337550ce8b9084c5',
    name: 'Sprint 2',
    goal: 'Build product catalog and cart',
    maxStoryPoint: 50,
    status: 'active',
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'sprint-3',
    projectId: '6968b98d337550ce8b9084c5',
    name: 'Sprint 1',
    goal: 'Setup mobile app foundation',
    maxStoryPoint: 35,
    status: 'active',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
  }
]
