import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { boardColumnApi } from '../services/boardColumn.service'
import { toast } from 'sonner'
import { getErrorMessage } from '../utils'
import type {
  BoardColumn,
  UpdateBoardColumnRequest
} from '../types'
import {
  boardColumnKeys,
  boardColumnsBySprintOptions,
  boardColumnDetailOptions
} from '../queries/boardColumn.queries'

// Hooks
export function useBoardColumnsBySprint(sprintId: string) {
  return useQuery(boardColumnsBySprintOptions(sprintId))
}

export function useBoardColumnDetail(columnId: string) {
  return useQuery(boardColumnDetailOptions(columnId))
}

export function useCreateBoardColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: boardColumnApi.create,
    onMutate: async (newColumn) => {
      await queryClient.cancelQueries({
        queryKey: boardColumnKeys.bySprint(newColumn.sprintId)
      })

      const previousColumns = queryClient.getQueryData<BoardColumn[]>(
        boardColumnKeys.bySprint(newColumn.sprintId)
      )

      if (previousColumns) {
        queryClient.setQueryData<BoardColumn[]>(
          boardColumnKeys.bySprint(newColumn.sprintId),
          [
            ...previousColumns,
            {
              ...newColumn,
              _id: 'temp-' + Date.now(),
              taskOrderIds: [],
              position: previousColumns.length,
              createdAt: Date.now()
            } as BoardColumn
          ]
        )
      }

      return { previousColumns }
    },
    onError: (error, variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          boardColumnKeys.bySprint(variables.sprintId),
          context.previousColumns
        )
      }
      toast.error(getErrorMessage(error) || 'Failed to create column')
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: boardColumnKeys.bySprint(variables.sprintId)
      })
      toast.success('Column created successfully!')
    }
  })
}

export function useUpdateBoardColumn(columnId: string, sprintId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBoardColumnRequest) => boardColumnApi.update(columnId, data),
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: boardColumnKeys.detail(columnId) })

      const previousColumn = queryClient.getQueryData<BoardColumn>(
        boardColumnKeys.detail(columnId)
      )

      if (previousColumn) {
        queryClient.setQueryData<BoardColumn>(boardColumnKeys.detail(columnId), {
          ...previousColumn,
          ...updatedData
        })
      }

      return { previousColumn }
    },
    onError: (error, variables, context) => {
      if (context?.previousColumn) {
        queryClient.setQueryData(boardColumnKeys.detail(columnId), context.previousColumn)
      }
      toast.error(getErrorMessage(error) || 'Failed to update column')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardColumnKeys.detail(columnId) })
      queryClient.invalidateQueries({ queryKey: boardColumnKeys.bySprint(sprintId) })
      toast.success('Column updated successfully!')
    }
  })
}

export function useReorderBoardColumns() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: boardColumnApi.reorder,
    onMutate: async (reorderData) => {
      await queryClient.cancelQueries({
        queryKey: boardColumnKeys.bySprint(reorderData.sprintId)
      })

      const previousColumns = queryClient.getQueryData<BoardColumn[]>(
        boardColumnKeys.bySprint(reorderData.sprintId)
      )

      if (previousColumns) {
        const reorderedColumns = [...previousColumns].sort((a, b) => {
          const posA = reorderData.columnOrders.find((co) => co.columnId === a._id)?.position ?? 0
          const posB = reorderData.columnOrders.find((co) => co.columnId === b._id)?.position ?? 0
          return posA - posB
        })

        queryClient.setQueryData<BoardColumn[]>(
          boardColumnKeys.bySprint(reorderData.sprintId),
          reorderedColumns
        )
      }

      return { previousColumns }
    },
    onError: (error, variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          boardColumnKeys.bySprint(variables.sprintId),
          context.previousColumns
        )
      }
      toast.error(getErrorMessage(error) || 'Failed to reorder columns')
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: boardColumnKeys.bySprint(variables.sprintId)
      })
    }
  })
}

export function useDeleteBoardColumn(sprintId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: boardColumnApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardColumnKeys.bySprint(sprintId) })
      toast.success('Column deleted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete column')
    }
  })
}