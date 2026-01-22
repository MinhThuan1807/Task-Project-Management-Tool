import axiosInstance from '@/lib/axios'

export const notificationApi = {
  /**
   * Get notifications for a specific user
   * @param userId The ID of the user
   * @returns A list of notifications for the user
   */
  getUserNotifications: async () => {
    const response = await axiosInstance.get(`/notifications/`)
    return response.data
  }
}