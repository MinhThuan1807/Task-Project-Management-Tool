import axiosInstance from '@/lib/axios'
import { MessagesResponse } from '../types'

export const projectChatApi = {
  /**
   * 
   * Get all chats by project id 
   */
  getAllProjectById: async (projectId: string): Promise<MessagesResponse> => {
    const response = await axiosInstance.get<MessagesResponse>(
      `/project-chats/project/${projectId}`
    )
    return response.data
  },
  /**
   * 
   * Get all messages by room id 
   */
  getAllMessagesByRoomId: async (roomId: string): Promise<MessagesResponse> => {
    const response = await axiosInstance.get<MessagesResponse>(
      `/project-chats/${roomId}/messages`
    )
    return response.data
  }
}