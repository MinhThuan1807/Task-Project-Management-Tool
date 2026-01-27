import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { sprintApi } from '../services/sprint.service'
import { toast } from 'sonner'
import { getErrorMessage } from '../utils'
import { Sprint, UpdateSprintRequest } from '../types'
import {
  sprintKeys,
  sprintDetailOptions,
  sprintsByProjectOptions
} from '../queries/sprint.queries'

export function useSprintsByProject(projectId?: string) {
  return useQuery(sprintsByProjectOptions(projectId))
}

export function useSprintDetail(sprintId: string) {
  return useQuery(sprintDetailOptions(sprintId))
}

export function useCreateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sprintApi.create,
    onMutate: async (newSprint) => {
      // Optimistic update
      /* cancelQueries is used to cancel any outgoing refetches so they don't overwrite our optimistic update */
      await queryClient.cancelQueries({
        queryKey: sprintKeys.byProject(newSprint.projectId)
      })

      /* getQueryData is used to get the current cached data for the query */
      const previousSprints = queryClient.getQueryData<Sprint[]>(
        sprintKeys.byProject(newSprint.projectId)
      )

      // Temporarily add new sprint
      if (previousSprints) {
        queryClient.setQueryData<Sprint[]>(
          sprintKeys.byProject(newSprint.projectId),
          [
            ...previousSprints,
            {
              ...newSprint,
              _id: 'temp-' + Date.now(),
              status: 'planned' as const,
              createdAt: Date.now()
            } as unknown as Sprint
          ]
        )
      }
      return { previousSprints }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSprints) {
        queryClient.setQueryData<Sprint[]>(
          sprintKeys.byProject(variables.projectId),
          context.previousSprints
        )
      }
      toast.error(getErrorMessage(error) || 'Failed to create sprint')
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: sprintKeys.byProject(variables.projectId)
      })
    }
  })
}

export function useUpdateSprint(params: { sprintId?: string; projectId?: string }) {
  const { sprintId, projectId } = params
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSprintRequest) => {
      if (!sprintId) return Promise.reject(new Error('Missing sprintId'))
      return sprintApi.update(sprintId, data)
    },
    onSuccess: async () => {
      if (!sprintId || !projectId) return
      await queryClient.invalidateQueries({ queryKey: sprintKeys.detail(sprintId) })
      await queryClient.invalidateQueries({ queryKey: sprintKeys.byProject(projectId) })
      await queryClient.invalidateQueries({ queryKey: sprintKeys.all })
    }
  })
}

export function useDeleteSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sprintApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.all })
      toast.success('Sprint deleted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete sprint')
    }
  })
}

