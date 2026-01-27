import { queryOptions } from '@tanstack/react-query'
import { projectApi } from '@/lib/services/project.service'

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  owned: () => [...projectKeys.lists(), 'owned'] as const,
  joined: () => [...projectKeys.lists(), 'joined'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  allProjects: () => [...projectKeys.lists(), 'all'] as const 
}

// Query Options
export function ownedProjectsOptions() {
  return queryOptions({
    queryKey: projectKeys.owned(),
    queryFn: async () => {
      const response = await projectApi.getOwnedProjects()
      return response.data
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function joinedProjectsOptions() {
  return queryOptions({
    queryKey: projectKeys.joined(),
    queryFn: async () => {
      const response = await projectApi.getJoinedProjects()
      return response.data
    },
    staleTime: 5 * 60 * 1000
  })
}

export function projectDetailOptions(projectId: string) {
  return queryOptions({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const response = await projectApi.getById(projectId)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!projectId
  })
}

export function allProjectsOptions() {
  return queryOptions({
    queryKey: projectKeys.allProjects(),
    queryFn: async () => {
      const response = await projectApi.getAll()
      return response.data
    },
    staleTime: 5 * 60 * 1000
  })
}
