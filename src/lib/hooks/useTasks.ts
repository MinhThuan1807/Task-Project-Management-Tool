import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { taskApi } from '../services/task.service'
import { toast } from 'sonner'
import { getErrorMessage } from '../utils'
import type {
  Task,
  UpdateTaskRequest,
  TaskFilters
} from '../types'
import {
  taskKeys,
  tasksBySprintOptions,
  tasksByColumnOptions,
  taskDetailOptions,
  tasksWithFiltersOptions
} from '../queries/task.queries'

// Hooks
export function useTasksBySprint(sprintId: string) {
  return useQuery(tasksBySprintOptions(sprintId))
}

export function useTasksByColumn(columnId: string) {
  return useQuery(tasksByColumnOptions(columnId))
}

export function useTaskDetail(taskId: string) {
  return useQuery(taskDetailOptions(taskId))
}

export function useTasksWithFilters(filters: TaskFilters) {
  return useQuery(tasksWithFiltersOptions(filters))
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.create,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: taskKeys.bySprint(newTask.sprintId)
      })

      const previousTasks = queryClient.getQueryData<Task[]>(
        taskKeys.bySprint(newTask.sprintId)
      )

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(taskKeys.bySprint(newTask.sprintId), [
          ...previousTasks,
          {
            ...newTask,
            _id: 'temp-' + Date.now(),
            createdAt: Date.now()
          } as unknown as Task
        ])
      }

      return { previousTasks }
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.bySprint(variables.sprintId), context.previousTasks)
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.bySprint(variables.sprintId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byColumn(variables.boardColumnId || '') })
    }
  })
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTaskRequest) => taskApi.update(taskId, data),
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(taskId) })

      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(taskId))

      if (previousTask) {
        queryClient.setQueryData<Task>(taskKeys.detail(taskId), {
          ...previousTask,
          ...updatedData
        })
      }

      return { previousTask }
    },
    onError: (error, variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), context.previousTask)
      }
      toast.error(getErrorMessage(error) || 'Failed to update task')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    }
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      taskApi.update(taskId, data),
    onSuccess: () => {
      // Chỉ invalidate các queries liên quan đến sprint và task detail
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task moved successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to move task')
    }
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.addComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) })
      toast.success('Comment added successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to add comment')
    }
  })
}

export function useAddAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.addAttachment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) })
      toast.success('Attachment added successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to add attachment')
    }
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task deleted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Failed to delete task')
    }
  })
}