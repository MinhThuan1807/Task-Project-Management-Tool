import { Suspense } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Edit, MoreVertical, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/components/../lib/utils'
import { Project, User } from '@/lib/types'
interface ProjectHeaderProps {
  project: Project;
  onEdit?: () => void;
  user: User;
}

function ProjectHeader({ project, onEdit, user }: ProjectHeaderProps) {

  const isOwner = project.ownerId === user._id
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Avatar className="w-20 h-20 rounded-xl shadow-lg">
          <AvatarImage src={project.imageUrl} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl rounded-xl">
            {project.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl text-gray-900">{project.name}</h1>
            {isOwner && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-300"
              >
                  Owner
              </Badge>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl">
            {project?.description || 'No description'}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.members?.length || 0} members</span>
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwner && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                  Edit Details
              </DropdownMenuItem>
            </>
          )}
          {!isOwner && (
            <DropdownMenuItem className="text-red-600">
                Leave Project
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProjectHeader
