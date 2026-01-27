import {
  useQuery,
  queryOptions
} from '@tanstack/react-query'
import { Sprint } from '../types'
import { sprintApi } from '../services/sprint.service'
//Query key
export const sprintKeys = {
  all: ['sprints'] as const,
  lists: () => [...sprintKeys.all, 'list'] as const,
  list: (filters: string) => [...sprintKeys.lists(), { filters }] as const,
  byProject: (projectId: string) =>
    [...sprintKeys.all, 'project', projectId] as const,
  details: () => [...sprintKeys.all, 'detail'] as const,
  detail: (sprintId: string) => [...sprintKeys.details(), sprintId] as const
}

export function sprintsByProjectOptions(projectId?: string) {
  return queryOptions<Sprint[]>({
    queryKey: projectId ? sprintKeys.byProject(projectId) : sprintKeys.lists(),
    queryFn: async () => {
      if (!projectId) return []
      const res = await sprintApi.getAllByProjectId(projectId)
      return res.data ?? []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    placeholderData: []
  })
}

export function sprintDetailOptions(sprintId?: string) {
  return queryOptions<Sprint | null>({
    queryKey: sprintId ? sprintKeys.detail(sprintId) : sprintKeys.details(),
    queryFn: async () => {
      if (!sprintId) return null
      const res = await sprintApi.getById(sprintId)
      return res.data ?? null
    },
    enabled: !!sprintId,
    staleTime: 5 * 60 * 1000,
    placeholderData: null
  })
}