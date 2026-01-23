export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const
  },
  projects: {
    all: ['projects'] as const,
    owned: () => [...queryKeys.projects.all, 'owned'] as const,
    joined: () => [...queryKeys.projects.all, 'joined'] as const,
    detail: (id: string) => [...queryKeys.projects.all, id] as const
  },
  tasks: {
    all: ['tasks'] as const,
    byProject: (projectId: string) => [...queryKeys.tasks.all, projectId] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const
  },
  sprints: {
    all: ['sprints'] as const,
    byProject: (projectId: string) => [...queryKeys.sprints.all, projectId] as const
  }
}