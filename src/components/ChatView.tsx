import { useState, useEffect, useRef } from 'react'
import {
  Send,
  Search,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  MessageSquare,
  Trash2,
  MoreVertical,
  ArrowDown,
  File,
  Download,
  X,
  Image as ImageIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Project, User } from '@/lib/types'
import { projectChatApi } from '@/lib/services/chat.service'
import { useSocket } from '@/app/providers/SocketProvider'
import { EmojiClickData } from 'emoji-picker-react'
import dynamic from 'next/dynamic'
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })
import { toast } from 'sonner'
import { fileToBase64, formatFileSize, getErrorMessage } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { isPending } from '@reduxjs/toolkit'

type ChatViewProps = {
  currentUser: User
  allProjects: Project[]
}

type Message = {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  senderAvatarUrl?: string
  message: string
  timestamp: Date | number
  isDeleted: boolean
  isPending?: boolean
  attachment?: {
    fileName: string
    fileType: string
    fileUrl: string
    fileSize: number
    publicId: string
  }
}
type NewMessage = {
  roomId: string
  senderId: string
  senderName: string
  senderRole: string
  senderAvatarUrl?: string
  message: string
  file?: {
    base64: string
    fileName: string
    fileType: string
    fileSize: number
  }
}

// Thêm type cho message tạm thời (pending)
type PendingMessage = {
  _id: string
  senderId: string
  senderName: string
  senderRole: string
  senderAvatarUrl?: string
  message: string
  timestamp: Date | number
  isDeleted: boolean
  isPending: boolean
  attachment?: {
    fileName: string
    fileType: string
    fileSize: number
    // Không có fileUrl vì chưa upload xong
  }
}

export interface IProjectChat {
  _id: string
  projectId: string
  roomId: string
  messages: Array<Message>
  lastMessage: string
  lastMessageTime?: Date | number | null
  createdAt: Date | number
  updatedAt: Date | number | null
}

type TypingUser = {
  userId: string
  userName: string
  projectId: string
}

export function ChatView({ currentUser, allProjects }: ChatViewProps) {
  const { socket, isConnected } = useSocket()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [projectChats, setProjectChats] = useState<
    Record<string, IProjectChat>
  >({})
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileUploadStatus, setFileUploadStatus] = useState<{
    loading: boolean
    error: string | null
  }>({ loading: false, error: null })
  const [pendingFileMessageId, setPendingFileMessageId] = useState<
    string | null
  >(null)

  const selectedProject = allProjects.find((p) => p._id === selectedProjectId)

  // Get typing users for current project
  const currentTypingUsers = typingUsers.filter(
    (user) =>
      user.projectId === selectedProjectId && user.userId !== currentUser._id
  )

  // Fetch messages for all projects on mount
  useEffect(() => {
    const fetchAllProjectChats = async () => {
      const chatData: Record<string, IProjectChat> = {}

      for (const project of allProjects) {
        try {
          const data = await projectChatApi.getAllProjectById(project._id)
          chatData[project._id] = data.data
        } catch (error) {
          // console.error(
          //   `Error fetching chat for project ${project._id}:`,
          //   error
          // )
          toast.error(getErrorMessage(error))
        }
      }

      setProjectChats(chatData)
    }

    if (allProjects.length > 0) {
      fetchAllProjectChats()
    }
  }, [allProjects])

  // Fetch messages when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setMessages([])
      return
    }

    // Fetch messages from API
    projectChatApi.getAllProjectById(selectedProjectId).then((data) => {
      setMessages(data.data.messages || [])
      setProjectChats((prev) => ({
        ...prev,
        [selectedProjectId]: data.data
      }))
    })
  }, [selectedProjectId])

  // Listen events via socket
  useEffect(() => {
    if (!isConnected || !socket || !selectedProjectId) return

    const currentRoomId = projectChats[selectedProjectId]?._id
    if (!currentRoomId) return

    // Connect to project chat room
    socket.emit('join_project_chat', currentRoomId)

    // Handle incoming messages
    const handleNewMessage = (message: Message) => {
      // If message is sent by current user and has attachment
      if (message.senderId === currentUser._id && message.attachment) {
        setMessages((prev) => {
          // Delete all pending messages from this user with the same file name
          const filtered = prev.filter(
            (m: Message) =>
              !(
                m.isPending &&
                m.senderId === currentUser._id &&
                m.attachment?.fileName === message.attachment?.fileName
              )
          )
          // Add the real message to the end
          return [...filtered, message]
        })
        setPendingFileMessageId(null)
      } else {
        // Check for duplicates
        setMessages((prev) => {
          const exists = prev.find((m) => m._id === message._id)
          if (exists) return prev
          return [...prev, message]
        })
      }

      // Update last message in projectChats
      setProjectChats((prev) => ({
        ...prev,
        [selectedProjectId]: {
          ...prev[selectedProjectId],
          lastMessage: message.message,
          lastMessageTime: message.timestamp,
          messages: [...(prev[selectedProjectId]?.messages || []), message]
        }
      }))
    }

    // Handle typing indicators
    const handleUserTyping = (data: {
      roomId: string
      userId: string
      userName: string
    }) => {
      if (data.roomId !== currentRoomId) return

      setTypingUsers((prev) => {
        const exists = prev.find(
          (u) => u.userId === data.userId && u.projectId === selectedProjectId
        )
        if (!exists) {
          return [
            ...prev,
            {
              userId: data.userId,
              userName: data.userName,
              projectId: selectedProjectId
            }
          ]
        }
        return prev
      })
    }

    // Handle stop typing indicators
    const handleUserStopTyping = (data: { roomId: string; userId: string }) => {
      if (data.roomId !== currentRoomId) return

      setTypingUsers((prev) =>
        prev.filter(
          (u) =>
            !(u.userId === data.userId && u.projectId === selectedProjectId)
        )
      )
    }

    // Handle message deleted events
    const handleMessageDeleted = (data: {
      roomId: string
      messageId: string
    }) => {
      if (data.roomId !== currentRoomId) return

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? {
                ...msg,
                message: 'This message has been deleted',
                isDeleted: true
              }
            : msg
        )
      )

      setProjectChats((prev) => {
        const updatedMessages =
          prev[selectedProjectId]?.messages.map((m: Message) =>
            m._id === data.messageId
              ? {
                  ...m,
                  message: 'This message has been deleted',
                  isDeleted: true
                }
              : m
          ) || []

        return {
          ...prev,
          [selectedProjectId]: {
            ...prev[selectedProjectId],
            messages: updatedMessages
          }
        }
      })
    }

    // Register socket event listeners
    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleUserTyping)
    socket.on('user_stop_typing', handleUserStopTyping)
    socket.on('message_deleted', handleMessageDeleted)
    socket.on('error', (err) => {
      toast.error(`Socket error: ${err.message || err}`)
    })
    socket.on('warning', (msg) => {
      toast.warning(`Socket warning: ${msg}`)
    })

    // Cleanup on unmount or dependency change
    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_stop_typing', handleUserStopTyping)
      socket.off('message_deleted', handleMessageDeleted)
      socket.off('error')
      socket.off('warning')
      socket.emit('leave_project_chat', currentRoomId)
    }
  }, [isConnected, socket, selectedProjectId, projectChats])

  // Filter projects by search
  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle send message events
  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedFile) return
    if (!selectedProjectId) return

    let fileData = undefined

    if (selectedFile) {
      setFileUploadStatus({ loading: true, error: null })
      try {
        const base64Full = await fileToBase64(selectedFile)
        const base64 = base64Full.split(',')[1]
        fileData = {
          base64,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size
        }
        setFileUploadStatus({ loading: false, error: null })
      } catch (error) {
        setFileUploadStatus({ loading: false, error: 'Failed to process file' })
        toast.error('Failed to process file')
        return
      }
    }

    const newMessage: NewMessage = {
      roomId: projectChats[selectedProjectId]?._id,
      senderId: currentUser._id,
      senderName: currentUser.displayName,
      senderRole: currentUser.role,
      senderAvatarUrl: currentUser.avatar || '',
      message:
        messageInput ||
        (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
      file: fileData
    }

    // If have file, create a pending message with loading state
    if (selectedFile) {
      const tempId = `pending-${Date.now()}`
      setPendingFileMessageId(tempId)
      const pendingMsg: PendingMessage = {
        _id: tempId,
        senderId: currentUser._id,
        senderName: currentUser.displayName,
        senderRole: currentUser.role,
        senderAvatarUrl: currentUser.avatar || '',
        message: `Sent a file: ${selectedFile.name}`,
        timestamp: new Date(),
        isDeleted: false,
        isPending: true,
        attachment: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size
        }
      }
      setMessages((prev) => [...prev, pendingMsg as Message])
    }

    socket?.emit('send_message', newMessage)

    setMessageInput('')
    handleRemoveFile()
    handleStopTyping()
  }

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    if (!selectedProjectId) return
    const roomId = projectChats[selectedProjectId]?._id
    if (!roomId) return

    socket?.emit('delete_message', {
      roomId,
      messageId
    })

    // Optimistically update UI
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              message: 'This message has been deleted',
              attachment: undefined,
              isDeleted: true
            }
          : msg
      )
    )

    setProjectChats((prev) => {
      const updatedMessages =
        prev[selectedProjectId]?.messages.map((m) =>
          m._id === messageId
            ? {
                ...m,
                message: 'This message has been deleted',
                isDeleted: true
              }
            : m
        ) || []

      return {
        ...prev,
        [selectedProjectId]: {
          ...prev[selectedProjectId],
          messages: updatedMessages
        }
      }
    })
  }

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedProjectId) return
    const roomId = projectChats[selectedProjectId]?._id
    if (!roomId) return

    // Emit typing event
    socket?.emit('typing', {
      roomId,
      userId: currentUser._id,
      userName: currentUser.displayName
    })

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing after 3 seconds
    const timeout = setTimeout(() => {
      handleStopTyping()
    }, 3000)

    setTypingTimeout(timeout)
  }

  // Handle stop typing indicator
  const handleStopTyping = () => {
    if (!selectedProjectId) return
    const roomId = projectChats[selectedProjectId]?._id
    if (!roomId) return

    // Emit stop typing event
    socket?.emit('stop_typing', {
      roomId,
      userId: currentUser._id
    })

    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
  }

  // Format date for messages
  const formatDate = (timestamp: Date | number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Format typing indicator text
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

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto scroll to bottom when new messages arrive
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

  // Handle scroll to show/hide button
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100
    setShowScrollButton(!isNearBottom)
  }

  // Handle emoji click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  // Close emoji picker when clicking outside
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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Download file
  const handleDownloadFile = (
    attachment: Message['attachment'],
    fileName: string
  ) => {
    if (!attachment) return

    const link = document.createElement('a')
    link.href = attachment.fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 flex bg-white h-full">
      {/* Projects List - Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900 mb-4">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjectId === project._id
            // const unreadCount = 0
            const projectTypingUsers = typingUsers.filter(
              (user) => user.projectId === project._id
            )
            const currentProjectChat = projectChats[project._id]

            return (
              <button
                key={project._id}
                onClick={() => setSelectedProjectId(project._id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <img
                  src={
                    project.imageUrl ||
                    'https://api.dicebear.com/7.x/shapes/svg?seed=default'
                  }
                  alt={project.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm text-gray-900 truncate">
                      {project.name}
                    </h3>
                    {currentProjectChat?.lastMessage && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDate(
                          new Date(currentProjectChat.lastMessageTime || '')
                        )}
                      </span>
                    )}
                  </div>
                  {projectTypingUsers.length > 0 ? (
                    <p className="text-sm text-blue-600 italic truncate">
                      {projectTypingUsers.length === 1
                        ? `${projectTypingUsers[0].userName} is typing...`
                        : 'Multiple people are typing...'}
                    </p>
                  ) : currentProjectChat?.lastMessage ? (
                    <p className="text-sm text-gray-600 truncate">
                      {currentProjectChat.lastMessage === currentUser._id
                        ? 'You: '
                        : ''}
                      {currentProjectChat.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No messages yet</p>
                  )}
                </div>
                {/* {unreadCount > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {unreadCount}
                  </span>
                )} */}
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area - Right Side */}
      {selectedProject ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedProject.imageUrl ||
                  'https://api.dicebear.com/7.x/shapes/svg?seed=default'
                }
                alt={selectedProject.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-lg text-gray-900">
                  {selectedProject.name}
                </h2>
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
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === currentUser._id
                  // Kiểm tra message pending
                  const isPending = (message as Message).isPending

                  return (
                    <div
                      key={message._id}
                      className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                    >
                      {!isOwnMessage && (
                        <img
                          src={
                            message.senderAvatarUrl ||
                            'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                          }
                          alt={message.senderName}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                      )}
                      <div
                        className={`flex-1 min-w-0 max-w-[70%] ${
                          isOwnMessage ? 'flex flex-col items-end' : ''
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm text-gray-900">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(new Date(message.timestamp))}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex items-start gap-2 ${
                            isOwnMessage ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            {/* File Attachment */}
                            {message.attachment && (
                              <div className="mb-2">
                                {message.attachment.fileType?.startsWith(
                                  'image/'
                                ) ? (
                                  <div className="max-w-xs cursor-pointer">
                                    {isPending ? (
                                      <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg">
                                        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                                      </div>
                                    ) : (
                                      <img
                                        src={message.attachment.fileUrl}
                                        alt={message.attachment.fileName}
                                        className="rounded-lg w-full h-auto max-h-64 object-cover"
                                        onClick={() =>
                                          handleDownloadFile(
                                            message.attachment,
                                            message.attachment!.fileName
                                          )
                                        }
                                      />
                                    )}
                                    <p className="text-xs mt-1 opacity-75">
                                      {message.attachment.fileName}
                                    </p>
                                  </div>
                                ) : (
                                  <div
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                      isOwnMessage
                                        ? 'bg-blue-700 hover:bg-blue-800'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    onClick={() =>
                                      !isPending &&
                                      handleDownloadFile(
                                        message.attachment,
                                        message.attachment!.fileName
                                      )
                                    }
                                  >
                                    <File
                                      className={`w-8 h-8 flex-shrink-0 ${
                                        isOwnMessage
                                          ? 'text-white'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {message.attachment.fileName}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          isOwnMessage
                                            ? 'text-blue-100'
                                            : 'text-gray-500'
                                        }`}
                                      >
                                        {formatFileSize(
                                          message.attachment.fileSize
                                        )}
                                      </p>
                                    </div>
                                    {isPending ? (
                                      <Loader2 className="animate-spin w-5 h-5 text-blue-200" />
                                    ) : (
                                      <Download
                                        className={`w-5 h-5 flex-shrink-0 ${
                                          isOwnMessage
                                            ? 'text-white'
                                            : 'text-gray-600'
                                        }`}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Message Text - Ẩn message mặc định khi có file */}
                            {message.message &&
                              !message.message.startsWith('Sent a file:') && (
                                <p className="text-sm leading-relaxed">
                                  {message.message}
                                </p>
                              )}

                            {/* Loading indicator cho message pending */}
                            {isPending && (
                              <div className="flex items-center gap-2 mt-1 text-blue-100">
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>Đang gửi file...</span>
                              </div>
                            )}

                            {isOwnMessage && (
                              <span className="text-xs text-blue-100 mt-1 block">
                                {formatDate(new Date(message.timestamp))}
                              </span>
                            )}
                          </div>
                          {isOwnMessage && !message.isDeleted && !isPending && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteMessage(message._id)
                                  }
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
                  <p className="text-gray-500">
                    No messages in this project yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Be the first to send a message!
                  </p>
                </div>
              )}

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
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {filePreview ? (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={filePreview}
                        alt={selectedFile.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <File className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* File upload status */}
            {fileUploadStatus.loading && (
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Đang gửi file...</span>
              </div>
            )}
            {fileUploadStatus.error && (
              <div className="text-red-600 mb-2">{fileUploadStatus.error}</div>
            )}

            <div className="flex items-end gap-3">
              {/** File Input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {/** File Input */}

              <div className="flex-1 relative">
                {/** Message Input */}
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

                {/**Emoji picker */}
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
                disabled={!messageInput.trim() && !selectedFile}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">
              Select a project to start chatting
            </h3>
            <p className="text-gray-600">
              Choose from your projects on the left
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
