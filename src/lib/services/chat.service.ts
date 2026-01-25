// import axiosInstance from '../axios'
// import type {
//   SendMessageRequest,
//   CreateChannelRequest,
//   MessageResponse,
//   MessagesResponse,
//   ChannelResponse,
//   ChannelsResponse
// } from '../types'

// export const chatApi = {
//   /**
//    * Send a message
//    * POST /messages
//    */
//   sendMessage: async (data: SendMessageRequest): Promise<MessageResponse> => {
//     const formData = new FormData()

//     formData.append('projectId', data.projectId)
//     formData.append('channelId', data.channelId)
//     formData.append('content', data.content)

//     if (data.attachments && data.attachments.length > 0) {
//       data.attachments.forEach((file) => {
//         formData.append('attachments', file)
//       })
//     }

//     const response = await axiosInstance.post<MessageResponse>('/messages', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     return response.data
//   },

//   /**
//    * Get messages by channel id
//    * GET /messages/channel/:channelId
//    */
//   getMessagesByChannelId: async (channelId: string): Promise<MessagesResponse> => {
//     const response = await axiosInstance.get<MessagesResponse>(
//       `/messages/channel/${channelId}`
//     )
//     return response.data
//   },

//   /**
//    * Get messages by project id
//    * GET /messages/project/:projectId
//    */
//   getMessagesByProjectId: async (projectId: string): Promise<MessagesResponse> => {
//     const response = await axiosInstance.get<MessagesResponse>(
//       `/messages/project/${projectId}`
//     )
//     return response.data
//   },

//   /**
//    * Edit a message
//    * PUT /messages/:id
//    */
//   editMessage: async (messageId: string, content: string): Promise<MessageResponse> => {
//     const response = await axiosInstance.put<MessageResponse>(`/messages/${messageId}`, {
//       content
//     })
//     return response.data
//   },

//   /**
//    * Delete a message
//    * DELETE /messages/:id
//    */
//   deleteMessage: async (messageId: string): Promise<{ success: boolean }> => {
//     const response = await axiosInstance.delete<{ success: boolean }>(
//       `/messages/${messageId}`
//     )
//     return response.data
//   },

//   /**
//    * Create a new channel
//    * POST /channels
//    */
//   createChannel: async (data: CreateChannelRequest): Promise<ChannelResponse> => {
//     const response = await axiosInstance.post<ChannelResponse>('/channels', data)
//     return response.data
//   },

//   /**
//    * Get channel by id
//    * GET /channels/:id
//    */
//   getChannelById: async (channelId: string): Promise<ChannelResponse> => {
//     const response = await axiosInstance.get<ChannelResponse>(`/channels/${channelId}`)
//     return response.data
//   },

//   /**
//    * Get all channels by project id
//    * GET /channels/project/:projectId
//    */
//   getChannelsByProjectId: async (projectId: string): Promise<ChannelsResponse> => {
//     const response = await axiosInstance.get<ChannelsResponse>(
//       `/channels/project/${projectId}`
//     )
//     return response.data
//   },

//   /**
//    * Update channel
//    * PUT /channels/:id
//    */
//   updateChannel: async (
//     channelId: string,
//     data: Partial<CreateChannelRequest>
//   ): Promise<ChannelResponse> => {
//     const response = await axiosInstance.put<ChannelResponse>(
//       `/channels/${channelId}`,
//       data
//     )
//     return response.data
//   },

//   /**
//    * Delete channel
//    * DELETE /channels/:id
//    */
//   deleteChannel: async (channelId: string): Promise<{ success: boolean }> => {
//     const response = await axiosInstance.delete<{ success: boolean }>(
//       `/channels/${channelId}`
//     )
//     return response.data
//   }
// } as const

import axiosInstance from '@/lib/axios'
import { MessagesResponse } from '../types'

export const projectChatApi = {
  /**
   * 
   * Get all chats by project id 
   */
  getAllProjectById: async (projectId: string): Promise<any> => {
    const response = await axiosInstance.get(
      `/project-chats/project/${projectId}`
    )
    return response.data
  },
  /**
   * 
   * Get all messages by room id 
   */
  getAllMessagesByRoomId: async (roomId: string): Promise<any> => {
    const response = await axiosInstance.get(
      `/project-chats/${roomId}/messages`
    )
    return response.data
  }
}