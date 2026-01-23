import axiosInstance from '@/lib/axios'

export const notificationApi = {
  /**
   * Get notifications for a specific user
   * @param userId The ID of the user
   * @returns A list of notifications for the user
   */
  getUserNotifications: async () => {
    const response = await axiosInstance.get('/notifications/')
    return response.data
  },

  /**
   * Get notifications for a specific project
   * @param projectId The ID of the project
   * @returns A list of notifications for the project
   */

  getProjectNotifications: async (projectId: string) => {
    const response = await axiosInstance.get(`/notifications/project/${projectId}`)
    return response.data
  }
}