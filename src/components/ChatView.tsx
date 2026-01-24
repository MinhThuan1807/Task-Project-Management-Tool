import { useState, useEffect, useRef } from 'react'
import { Search, MessageSquare } from 'lucide-react'

import { Message, Project, User } from '@/lib/types'
import { projectChatApi } from '@/lib/services/chat.service'
import { useSocket } from '@/app/providers/SocketProvider'
import dynamic from 'next/dynamic'
const ListProjectsChat = dynamic(() => import('./chat/ListProjectsChat'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

const ChatArea = dynamic(() => import('./chat/ChatArea'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})
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

export interface TypingUser {
  userId: string
  userName: string
  projectId: string
}

interface ChatViewProps {
  currentUser: User
  allProjects: Project[]
}

export function ChatView({ currentUser, allProjects }: ChatViewProps) {
  // Socket hook
  const { socket, isConnected } = useSocket()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    allProjects.length > 0 ? allProjects[0]._id : null
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const [projectChats, setProjectChats] = useState<
    Record<string, IProjectChat>
  >({})
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  const selectedProject = allProjects.find((p) => p._id === selectedProjectId)

  // Fetch messages for all projects on mount
  useEffect(() => {
    const fetchAllProjectChats = async () => {
      const chatData: Record<string, IProjectChat> = {}

      for (const project of allProjects) {
        try {
          const data = await projectChatApi.getAllProjectById(project._id)
          chatData[project?._id] = data.data
        } catch (error) {
          console.error(
            `Error fetching chat for project ${project._id}:`,
            error
          )
        }
      }

      setProjectChats(chatData)
    }

    if (allProjects.length > 0) {
      fetchAllProjectChats()
    }
  }, [allProjects])

  useEffect(() => {
    if (!selectedProjectId) {
      setMessages([])
      return
    }

    // Fetch messages from API
    projectChatApi.getAllProjectById(selectedProjectId).then((data) => {
      setMessages(data.data || [])
      setProjectChats((prev) => {
        // If data.data is an IProjectChat, use it directly
        if (
          data.data &&
          typeof data.data === 'object' &&
          'messages' in data.data
        ) {
          return {
            ...prev,
            [selectedProjectId]: data.data
          }
        }
        // If data.data is Message[], merge into existing IProjectChat
        return {
          ...prev,
          [selectedProjectId]: {
            ...prev[selectedProjectId],
            messages: data.data || []
          }
        }
      })
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
      setMessages((prev) => [...prev, message])
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
          prev[selectedProjectId]?.messages.map((m) =>
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

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_stop_typing', handleUserStopTyping)
      socket.off('message_deleted', handleMessageDeleted)
      socket.emit('leave_project_chat', currentRoomId)
    }
  }, [isConnected, socket, selectedProjectId, projectChats])

  // Filter projects by search
  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex bg-white h-full">
      {/* Projects List - Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900 mb-4">Chat</h2>
          {/* Search Bar */}
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

        {/* Projects Chat List */}
        <ListProjectsChat
          currentUser={currentUser}
          filteredProjects={filteredProjects}
          selectedProjectId={selectedProjectId || ''}
          typingUsers={typingUsers}
          projectChats={projectChats}
          setSelectedProjectId={setSelectedProjectId}
        />
      </div>

      {/* Chat Area - Right Side */}
      {selectedProject ? (
        <ChatArea
          currentUser={currentUser}
          selectedProject={selectedProject}
          selectedProjectId={selectedProjectId!}
          typingUsers={typingUsers}
          messages={messages}
        />
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
