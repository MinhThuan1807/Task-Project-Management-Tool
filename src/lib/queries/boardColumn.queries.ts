import { queryOptions } from '@tanstack/react-query'
import { boardColumnApi } from '../services/boardColumn.service'

// Query keys

export const boardColumnKeys = {
  all: ['board-columns'] as const,
  lists: () => [...boardColumnKeys.all, 'list'] as const,
  bySprint: (sprintId: string) => [...boardColumnKeys.lists(), 'sprint', sprintId] as const,
  details: () => [...boardColumnKeys.all, 'detail'] as const,
  detail: (columnId: string) => [...boardColumnKeys.details(), columnId] as const
}

// Query Options
export function boardColumnsBySprintOptions(sprintId: string) {
  return queryOptions({
    queryKey: boardColumnKeys.bySprint(sprintId),
    queryFn: async () => {
      const response = await boardColumnApi.getAllBySprintId(sprintId)
      return response.data
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!sprintId
  })
}

export function boardColumnDetailOptions(columnId: string) {
  return queryOptions({
    queryKey: boardColumnKeys.detail(columnId),
    queryFn: async () => {
      const response = await boardColumnApi.getById(columnId)
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    enabled: !!columnId
  })
}