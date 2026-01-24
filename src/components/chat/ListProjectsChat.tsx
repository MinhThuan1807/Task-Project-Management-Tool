import { Button } from '../ui/button'
import Image from 'next/image'
import { Project, User } from '@/lib/types'
import { IProjectChat, TypingUser } from '../ChatView'
import { formatDateChat } from '@/lib/utils'

interface ListProjectsChatProps {
  currentUser: User
  filteredProjects: Project[]
  selectedProjectId: string
  typingUsers: TypingUser[]
  projectChats: Record<string, IProjectChat>
  setSelectedProjectId: (projectId: string) => void
}

const ListProjectsChat = ({
  currentUser,
  filteredProjects,
  selectedProjectId,
  typingUsers,
  projectChats,
  setSelectedProjectId
}: ListProjectsChatProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {filteredProjects.map((project) => {
        const isSelected = selectedProjectId === project._id
        const unreadCount = 0
        const projectTypingUsers = typingUsers.filter(
          (user) => user.projectId === project._id
        )
        const currentProjectChat = projectChats[project._id]

        return (
          <Button
            key={project._id}
            onClick={() => setSelectedProjectId(project._id)}
            variant="ghost"
            className={`
              w-full px-6 py-4 flex items-center gap-3 rounded-none border-b border-gray-100
              transition-colors duration-150
              text-left justify-start
              hover:bg-blue-50/60
              ${isSelected ? 'bg-blue-50' : 'bg-white'}
              focus-visible:ring-0 focus-visible:ring-offset-0
            `}
            tabIndex={0}
          >
            <div className="flex-shrink-0">
              <Image
                src={
                  typeof project.imageUrl === 'string' &&
                  project.imageUrl.trim() !== ''
                    ? project.imageUrl
                    : '/image01.webp'
                }
                alt={project.name}
                className="rounded-full object-cover bg-gray-100"
                width={48}
                height={48}
                style={{ width: 48, height: 48 }}
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-[15px] font-medium text-gray-900 truncate max-w-[160px]">
                  {project.name}
                </h3>
                {currentProjectChat?.lastMessage && (
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0 whitespace-nowrap">
                    {formatDateChat(
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
            {unreadCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}

export default ListProjectsChat
