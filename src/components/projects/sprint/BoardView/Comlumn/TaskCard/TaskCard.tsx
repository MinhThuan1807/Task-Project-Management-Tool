'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sprint, Task, UpdateTaskRequest } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  MoreVertical,
  MessageSquare,
  Paperclip,
  Calendar,
  GripVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { cn, formatDate, getPriorityColor } from '@/lib/utils'
import { useState } from 'react'
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/useTasks'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
const EditTaskModal = dynamic(() => import('@/components/modal/EditTaskModal'), { ssr: false })

type TaskCardProps = {
  task: Task
  onClick?: () => boolean
  sprints?: Sprint[]
  isDragging?: boolean
  onDuplicate?: (task: Task) => void
  canEdit?: boolean // Add permission prop
}

export function TaskCard({
  task,
  onClick,
  isDragging = false,
  onDuplicate,
  canEdit,
  sprints
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: task._id,
    disabled: !canEdit // Disable drag if no permission
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1
  }

  const sprint = sprints?.find((s) => s._id === task.sprintId)

  // Get real counts from task data
  const commentCount = task.comments?.length || 0
  const attachmentCount = task.attachments?.length || 0

  // Check if task is overdue
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [isSelectedTask, setIsSelectedTask] = useState<Task | null>(null)
  const deleteTaskMutation = useDeleteTask()
  const updateTaskMutation = useUpdateTask(task._id)

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        setShowDeleteDialog(false)
      }
    })
  }

  const handleEditTask = ( taskData: UpdateTaskRequest) => {
    updateTaskMutation.mutate(
      taskData,
      {
        onSuccess: () => {
          setIsEditTaskOpen(false)
          setIsSelectedTask(null)
          toast.success('Task updated successfully!')
        }
      }
    )
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          'select-none pt-1 pb-1 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white',
          isDragging && 'shadow-2xl rotate-3 scale-105 ring-2 ring-blue-500',
          isOverdue && 'border-red-200 bg-red-50/30',
          !canEdit && 'opacity-75'
        )}
        onClick={() => {
          onClick?.()
          setIsSelectedTask(task)
        }}
      >
        <CardContent className="p-4">
          {/* Header with drag handle */}
          <div className="flex items-start gap-2 mb-3">
            {canEdit && ( // Only show drag handle if can edit
              <div
                {...attributes}
                {...listeners}
                className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <h4 className="text-sm font-medium text-gray-900 flex-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {task.title}
              {sprint && (
                <Badge
                  className={
                    sprint.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200 ml-2'
                      : 'bg-gray-50 text-gray-700 border-gray-200 ml-2'
                  }
                >
                  {sprint.name}
                </Badge>
              )}
            </h4>

            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem onClick={() => setIsEditTaskOpen(true)}>
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate?.(task)}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Description (if exists) */}
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Priority & Labels */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {/* Priority Badge */}
            {task.priority && (
              <Badge
                className={getPriorityColor(task.priority)}
                style={{ fontSize: '0.65rem' }}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            )}

            {/* Story Points */}
            {task.storyPoint && task.storyPoint > 0 && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                style={{ fontSize: '0.65rem' }}
              >
                {task.storyPoint} SP
              </Badge>
            )}
            {Array.isArray(task.labels) &&
              task.labels.slice(0, 2).map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="bg-gray-50 text-gray-700"
                  style={{ fontSize: '0.65rem' }}
                >
                  {label}
                </Badge>
              ))}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs mb-3',
                isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
              )}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}

          {/* Footer: Assignees & Metadata */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {/* Assignees */}
            <div className="flex -space-x-2">
              {task.assigneeIds && task.assigneeIds.length > 0 ? (
                <>
                  {task.assigneeIds.slice(0, 3).map((assigneeId) => (
                    <Avatar
                      key={assigneeId}
                      className="w-6 h-6 border-2 border-white ring-1 ring-gray-200"
                    >
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeId}`}
                      />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {assigneeId.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assigneeIds.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600 font-medium">
                        +{task.assigneeIds.length - 3}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="text-xs bg-gray-100 text-gray-400">
                    ?
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Comments & Attachments Count */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {commentCount > 0 && (
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{commentCount}</span>
                </div>
              )}
              {attachmentCount > 0 && (
                <div className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{attachmentCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteTask(task._id)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Edit task modal */}
      {(isSelectedTask || isEditTaskOpen) && canEdit && (
        <EditTaskModal
          open={isEditTaskOpen || Boolean(onClick)}
          task={task}
          // boardColumns={task?.boardColumnId}
          onClose={() => {
            setIsEditTaskOpen(false)
            setIsSelectedTask(null)
          }}
          onSave={(taskData) => handleEditTask(taskData)}
        />
      )}
    </>
  )
}
