import axiosInstance from '../axios'
import type {
  CreateSprintRequest,
  UpdateSprintRequest,
  SprintResponse,
  SprintsResponse
} from '@/lib/types'

export const sprintApi = {
  /**
   * Create a new sprint
   * POST /sprints
   */
  create: async (data: CreateSprintRequest): Promise<SprintResponse> => {
    const response = await axiosInstance.post<SprintResponse>('/sprints', data)
    return response.data
  },

  /**
   * Get sprint by id
   * GET /sprints/:id
   */
  getById: async (sprintId: string): Promise<SprintResponse> => {
    const response = await axiosInstance.get<SprintResponse>(`/sprints/${sprintId}`)
    return response.data
  },

  /**
   * Get all sprints by project id
   * GET /sprints/project/:projectId
   */
  getAllByProjectId: async (projectId: string): Promise<SprintsResponse> => {
    const response = await axiosInstance.get<SprintsResponse>(
      `/sprints/project/${projectId}`
    )
    return response.data
  },

  /**
   * Update sprint
   * PUT /sprints/:id
   */
  update: async (
    sprintId: string,
    data: UpdateSprintRequest
  ): Promise<SprintResponse> => {
    const response = await axiosInstance.put<SprintResponse>(
      `/sprints/${sprintId}`,
      data
    )
    return response.data
  },

  /**
   * Delete sprint by id
   * DELETE /sprints/:id
   */
  delete: async (sprintId: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete<{ success: boolean }>(
      `/sprints/${sprintId}`
    )
    return response.data
  }
} as const