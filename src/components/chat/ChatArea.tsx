import {
  ArrowDown,
  Info,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video
} from 'lucide-react'
import Image from 'next/image'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Project, User } from '@/lib/types'
import { TypingUser } from '../ChatView'
import { useEffect, useRef, useState } from 'react'
import { Message } from '@/lib/types'
import { useSocket } from '@/app/providers/SocketProvider'
import dynamic from 'next/dynamic'
import { SendMessage } from '@/lib/types/chat.types'
const ChatMessages = dynamic(() => import('./ChatMessages'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

interface ChatAreaProps {
  currentUser: User
  selectedProject: Project
  selectedProjectId: string
  typingUsers: TypingUser[]
  messages: Message[]
}

function ChatArea({
  currentUser,
  selectedProject,
  selectedProjectId,
  typingUsers,
  messages
}: ChatAreaProps) {
  const { socket, isConnected } = useSocket()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const [messageInput, setMessageInput] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // ==== Derived Data ===-
  const currentTypingUsers = typingUsers.filter(
    (user) =>
      user.projectId === selectedProjectId && user.userId !== currentUser._id
  )

  // ==== Effects ===-
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100

    if (isNearBottom) {
      scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // ==== Functions ===-
  const getTypingText = () => {
    if (currentTypingUsers.length === 0) return ''
    if (currentTypingUsers.length === 1) {
      return `${currentTypingUsers[0].userName} is typing...`
    }
    if (currentTypingUsers.length === 2) {
      return `${currentTypingUsers[0].userName} and ${currentTypingUsers[1].userName} are typing...`
    }
    return `${currentTypingUsers[0].userName} and ${currentTypingUsers.length - 1} others are typing...`
  }

  const handleStopTyping = () => {
    if (!selectedProjectId) return
    socket?.emit('stop_typing', {
      projectId: selectedProjectId,
      userId: currentUser._id
    })

    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedProjectId) return
    const newMessage: SendMessage = {
      roomId: selectedProjectId, // Sử dụng projectId làm roomId nếu không có roomId
      senderId: currentUser._id,
      senderName: currentUser.displayName,
      senderRole: currentUser.role,
      senderAvatarUrl: currentUser.avatar || '',
      message: messageInput
    }

    socket?.emit('send_message', newMessage)
    setMessageInput('')
    handleStopTyping()
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedProjectId) return
    socket?.emit('delete_message', {
      projectId: selectedProjectId,
      messageId
    })
  }

  const handleTyping = () => {
    if (!selectedProjectId) return
    socket?.emit('typing', {
      projectId: selectedProjectId,
      userId: currentUser._id,
      userName: currentUser.displayName
    })

    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    const timeout = setTimeout(() => {
      handleStopTyping()
    }, 3000)

    setTypingTimeout(timeout)
  }

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100
    setShowScrollButton(!isNearBottom)
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ==== Render ===-
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Image
            src={selectedProject.imageUrl || '/image01.webp'}
            alt={selectedProject.name}
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
            unoptimized
          />
          <div>
            <h2 className="text-lg text-gray-900">{selectedProject.name}</h2>
            <p className="text-sm text-gray-500">
              {currentTypingUsers.length > 0
                ? getTypingText()
                : `${selectedProject.members?.length || 0} members`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 bg-gray-50 relative"
      >
        <div className="space-y-4">
          <ChatMessages
            currentUser={currentUser}
            messages={messages}
            handleDeleteMessage={handleDeleteMessage}
          />

          {/* Typing Indicator */}
          {currentTypingUsers.length > 0 && (
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 italic">
                  {getTypingText()}
                </p>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value)
                handleTyping()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              onBlur={handleStopTyping}
              placeholder={`Message ${selectedProject.name}`}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
            <div className="absolute right-2 bottom-2" ref={emojiPickerRef}>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 z-50">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    width={350}
                    height={400}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatArea
