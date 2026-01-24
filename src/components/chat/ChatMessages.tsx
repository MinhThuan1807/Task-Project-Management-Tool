import { Message, User } from "@/lib/types";
import { formatDateChat } from "@/lib/utils";
import { MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
interface ChatMessagesProps {
  currentUser: User;
  messages: Message[];
  handleDeleteMessage: (messageId: string) => void;
}

const ChatMessages =({ currentUser, messages, handleDeleteMessage }: ChatMessagesProps) => {
  
  return (
    <>
      {messages.length > 0 ? (
        messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser._id

          return (
            <div
              key={message._id}
              className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}
            >
              {!isOwnMessage && (
                <Image
                  src={
                    message.senderAvatarUrl ? message.senderAvatarUrl :
                    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(message.senderName)}`
                  }
                  alt={message.senderName}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  width={40}
                  height={40}
                />
              )}
              <div
                className={`flex-1 min-w-0 max-w-[70%] ${isOwnMessage ? 'flex flex-col items-end' : ''}`}
              >
                {!isOwnMessage && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-gray-900">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateChat(new Date(message.timestamp))}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-start gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    {isOwnMessage && (
                      <span className="text-xs text-blue-100 mt-1 block">
                        {formatDateChat(new Date(message.timestamp))}
                      </span>
                    )}
                  </div>
                  {isOwnMessage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No messages in this project yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to send a message!
          </p>
        </div>
      )}
    </>
  )
}

export default ChatMessages
