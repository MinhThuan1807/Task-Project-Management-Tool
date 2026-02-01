import axiosInstance from '../axios'
import type {
  CreateBoardColumnRequest,
  UpdateBoardColumnRequest,
  ReorderColumnsRequest,
  BoardColumnResponse,
  BoardColumnsResponse
} from '../types'

export const boardColumnApi = {
  /**
   * Create a new board column
   * POST /board-columns
   */
  create: async (data: CreateBoardColumnRequest): Promise<BoardColumnResponse> => {
    const response = await axiosInstance.post<BoardColumnResponse>('/board-columns', data)
    return response.data
  },

  /**
   * Get board column by id
   * GET /board-columns/:id
   */
  getById: async (boardColumnId: string): Promise<BoardColumnResponse> => {
    const response = await axiosInstance.get<BoardColumnResponse>(
      `/board-columns/${boardColumnId}`
    )
    return response.data
  },

  /**
   * Get all board columns by sprint id
   * GET /board-columns/sprint/:sprintId
   */
  getAllBySprintId: async (sprintId: string): Promise<BoardColumnsResponse> => {
    const response = await axiosInstance.get<BoardColumnsResponse>(
      `/board-columns/sprint/${sprintId}`
    )
    return response.data
  },

  /**
   * Update board column
   * PUT /board-columns/:id
   */
  update: async (
    boardColumnId: string,
    data: UpdateBoardColumnRequest
  ): Promise<BoardColumnResponse> => {
    const response = await axiosInstance.put<BoardColumnResponse>(
      `/board-columns/${boardColumnId}`,
      data
    )
    return response.data
  },

  /**
   * Reorder columns in a sprint
   * PUT /board-columns/reorder
   */
  reorder: async (data: ReorderColumnsRequest): Promise<BoardColumnsResponse> => {
    const response = await axiosInstance.put<BoardColumnsResponse>(
      '/board-columns/reorder',
      data
    )
    return response.data
  },

  /**
   * Delete board column by id
   * DELETE /board-columns/:id
   */
  delete: async (boardColumnId: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete<{ success: boolean }>(
      `/board-columns/${boardColumnId}`
    )
    return response.data
  }
}