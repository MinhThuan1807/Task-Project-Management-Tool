// /**
//  * Chat Message
//  */
export type Message = {
  _id: string;
  projectId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments?: string[];
  timestamp: string | number;
  createdAt: string | number;
};

// /**
//  * Chat Channel
//  */
// export type Channel = {
//   _id: string;
//   name: string;
//   projectId: string;
//   description?: string;
//   isPrivate?: boolean;
//   members?: string[];
//   createdAt: string | number;
// };

// /**
//  * API Request types
//  */
// export type SendMessageRequest = {
//   projectId: string;
//   channelId: string;
//   content: string;
//   attachments?: File[];
// };

// export type CreateChannelRequest = {
//   projectId: string;
//   name: string;
//   description?: string;
//   isPrivate?: boolean;
//   memberIds?: string[];
// };

// /**
//  * API Response types
//  */
// export type MessageResponse = {
//   success: boolean;
//   data: Message;
//   message?: string;
// };

export type MessagesResponse = {
  success: boolean;
  data: Message[];
  message?: string;
};

// export type ChannelResponse = {
//   success: boolean;
//   data: Channel;
//   message?: string;
// };

// export type ChannelsResponse = {
//   success: boolean;
//   data: Channel[];
//   message?: string;
// };

// /**
//  * WebSocket event types
//  */
// export type ChatEvent =
//   | { type: 'message:new'; payload: Message }
//   | { type: 'message:edit'; payload: Message }
//   | { type: 'message:delete'; payload: { messageId: string } }
//   | { type: 'user:typing'; payload: { userId: string; channelId: string } }
//   | { type: 'user:online'; payload: { userId: string } }
//   | { type: 'user:offline'; payload: { userId: string } };