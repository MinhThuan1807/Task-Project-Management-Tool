import { queryOptions } from '@tanstack/react-query'
import { taskApi } from '../services/task.service'
import type {
  TaskFilters
} from '../types'


// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  bySprint: (sprintId: string) => [...taskKeys.lists(), 'sprint', sprintId] as const,
  byColumn: (columnId: string) => [...taskKeys.lists(), 'column', columnId] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (taskId: string) => [...taskKeys.details(), taskId] as const
}

// Query Options
export function tasksBySprintOptions(sprintId: string) {
  return queryOptions({
    queryKey: taskKeys.bySprint(sprintId),
    queryFn: async () => {
      const response = await taskApi.getAllBySprintId(sprintId)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!sprintId
  })
}

export function tasksByColumnOptions(columnId: string) {
  return queryOptions({
    queryKey: taskKeys.byColumn(columnId),
    queryFn: async () => {
      const response = await taskApi.getAllByColumnId(columnId)
      return response.data
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!columnId
  })
}

export function taskDetailOptions(taskId: string) {
  return queryOptions({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const response = await taskApi.getById(taskId)
      return response.data
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!taskId
  })
}

export function tasksWithFiltersOptions(filters: TaskFilters) {
  return queryOptions({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const response = await taskApi.getWithFilters(filters)
      return response.data
    },
    staleTime: 2 * 60 * 1000
  })
}
