import axiosInstance from '../axios'
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
  AddCommentRequest,
  AddAttachmentRequest,
  TaskResponse,
  TasksResponse,
  TaskFilters
} from '../types'

export const taskApi = {
  /**
   * Create a new task
   * POST /tasks
   */
  create: async (data: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await axiosInstance.post<TaskResponse>('/tasks/', data)
    return response.data
  },

  /**
   * Get task by id
   * GET /tasks/:id
   */
  getById: async (taskId: string): Promise<TaskResponse> => {
    const response = await axiosInstance.get<TaskResponse>(`/tasks/${taskId}`)
    return response.data
  },

  /**
   * Get all tasks by sprint id
   * GET /tasks/sprint/:sprintId
   */
  getAllBySprintId: async (sprintId: string): Promise<TasksResponse> => {
    const response = await axiosInstance.get<TasksResponse>(
      `/tasks/sprint/${sprintId}`
    )
    return response.data
  },

  /**
   * Get all tasks by board column id
   * GET /tasks/column/:columnId
   */
  getAllByColumnId: async (columnId: string): Promise<TasksResponse> => {
    const response = await axiosInstance.get<TasksResponse>(
      `/tasks/column/${columnId}`
    )
    return response.data
  },

  /**
   * Get tasks with filters
   * GET /tasks
   */
  getWithFilters: async (filters: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams()

    if (filters.sprintId) params.append('sprintId', filters.sprintId)
    if (filters.boardColumnId)
      params.append('boardColumnId', filters.boardColumnId)
    if (filters.priority)
      filters.priority
        .filter((p): p is string => typeof p === 'string')
        .forEach((p) => params.append('priority[]', p))
    if (filters.labels)
      filters.labels
        .filter((l): l is string => typeof l === 'string')
        .forEach((l) => params.append('labels[]', l))
    if (filters.assigneeIds)
      filters.assigneeIds
        .filter((id): id is string => typeof id === 'string')
        .forEach((id) => params.append('assigneeIds[]', id))
    if (filters.search) params.append('search', filters.search)
    if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom)
    if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo)

    const response = await axiosInstance.get<TasksResponse>(
      `/tasks?${params.toString()}`
    )
    return response.data
  },

  /**
   * Update task
   * PUT /tasks/:id
   */
  update: async (
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<TaskResponse> => {
    const response = await axiosInstance.put<TaskResponse>(
      `/tasks/${taskId}`,
      data
    )
    return response.data
  },

  /**
   * Move task to another column
   * PUT /tasks/:id/move
   */
  move: async (data: MoveTaskRequest): Promise<TaskResponse> => {
    const response = await axiosInstance.put<TaskResponse>(
      `/tasks/${data.taskId}/move`,
      {
        sourceBoardColumnId: data.sourceBoardColumnId,
        destinationBoardColumnId: data.destinationBoardColumnId,
        newPosition: data.newPosition
      }
    )
    return response.data
  },

  /**
   * Add comment to task
   * POST /tasks/:id/comments
   */
  addComment: async (data: AddCommentRequest): Promise<TaskResponse> => {
    const response = await axiosInstance.post<TaskResponse>(
      `/tasks/${data.taskId}/comments`,
      { content: data.content }
    )
    return response.data
  },

  /**
   * Add attachment to task
   * POST /tasks/:id/attachments
   */
  addAttachment: async (data: AddAttachmentRequest): Promise<TaskResponse> => {
    const formData = new FormData()
    formData.append('file', data.file)

    const response = await axiosInstance.post<TaskResponse>(
      `/tasks/${data.taskId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  /**
   * Delete attachment from task
   * DELETE /tasks/:taskId/attachments/:attachmentId
   */
  deleteAttachment: async (
    taskId: string,
    attachmentId: string
  ): Promise<TaskResponse> => {
    const response = await axiosInstance.delete<TaskResponse>(
      `/tasks/${taskId}/attachments/${attachmentId}`
    )
    return response.data
  },

  /**
   * Delete task by id
   * DELETE /tasks/:id
   */
  delete: async (taskId: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete<{ success: boolean }>(
      `/tasks/${taskId}`
    )
    return response.data
  }
} as const
