'use client'
import { useState } from 'react'
import { Task, BoardColumn, UpdateTaskRequest } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { X, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AssignToMemberModal } from './AssignToMemberModal'
import { useProjectDetail } from '@/lib/hooks/useProjects'
import { useParams } from 'next/navigation'
import { useBoardColumnsBySprint } from '@/lib/hooks/useBoardColumns'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type EditTaskModalProps = {
  open?: boolean
  task: Task
  boardColumns?: BoardColumn[]
  onClose: () => void
  onSave?: (updatedTask: UpdateTaskRequest) => void
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-500 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-orange-500 text-orange-700' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500 text-red-700' }
]

// Mock comments
const mockComments = [
  {
    id: 'comment-1',
    userId: 'user-1',
    userName: 'Alice Johnson',
    content: 'This looks great! Can we add more test coverage?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment-2',
    userId: 'user-2',
    userName: 'Bob Smith',
    content: 'I\'ve started working on this. Should be done by tomorrow.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
]

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  boardColumnId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  storyPoint: z.number().min(0).optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assigneeIds: z.array(z.string()).optional()
})

type UpdateTaskForm = {
  title?: string
  description?: string
  boardColumnId?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  storyPoint?: number
  dueDate?: string
  labels?: string[]
  assigneeIds?: string[]
}

export function EditTaskModal({
  open,
  task,
  boardColumns,
  onClose,
  onSave
}: EditTaskModalProps) {
  const [labelInput, setLabelInput] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false)

  const param = useParams()
  const projectId = param?.id as string
  const { data: project } = useProjectDetail(projectId)

  const formatDateForInput = (date?: Date | string | null) => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    if (!(d instanceof Date) || isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  }

  const { control, handleSubmit, getValues, setValue, watch } =
    useForm<UpdateTaskForm>({
      resolver: zodResolver(updateTaskSchema),
      defaultValues: {
        title: task?.title,
        description: task?.description,
        priority: task?.priority as UpdateTaskForm['priority'],
        boardColumnId: task?.boardColumnId,
        storyPoint: task?.storyPoint,
        dueDate: task?.dueDate ? formatDateForInput(task.dueDate) : undefined,
        labels: task?.labels,
        assigneeIds: task?.assigneeIds
      }
    })

  const watchLabels = watch('labels')

  const onSubmit = (data: UpdateTaskForm) => {
    const payload: UpdateTaskRequest = {
      title: data.title,
      description: data.description ?? '',
      priority: data.priority,
      boardColumnId: data.boardColumnId || '',
      storyPoint: data.storyPoint,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      labels: data.labels,
      assigneeIds: data.assigneeIds
    }
    if (onSave) {
      onSave(payload)
    }
  }

  const handleAddLabel = () => {
    const trimmed = labelInput.trim()
    if (!trimmed) return
    const current = getValues('labels') || []
    if (!current.includes(trimmed)) {
      setValue('labels', [...current, trimmed])
    }
    setLabelInput('')
  }

  const handleRemoveLabel = (label: string) => {
    const current = getValues('labels') || []
    setValue(
      'labels',
      current.filter((l) => l !== label)
    )
  }
  const handleAssigneesChange = (newAssigneeIds: string[]) => {
    setValue('assigneeIds', newAssigneeIds)
  }

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const { data: fetchedColumns } = useBoardColumnsBySprint(task?.sprintId ?? '')
  const columns = boardColumns ?? fetchedColumns ?? []

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Update task details and track progress
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({mockComments.length})
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Task Title <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => <Input id="title" {...field} />}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea id="description" {...field} rows={4} />
                    )}
                  />
                </div>

                {/* Priority & Story Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${option.color}`}
                                  />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {/* Story Points */}
                  <div className="space-y-2">
                    <Label htmlFor="storyPoint">Story Points</Label>
                    <Controller
                      control={control}
                      name="storyPoint"
                      render={({ field }) => (
                        <Input
                          id="storyPoint"
                          type="number"
                          min={0}
                          max={100}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value || '0', 10))
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Status & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boardColumnId">Status</Label>
                    <Controller
                      control={control}
                      name="boardColumnId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="boardColumnId">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {columns.length > 0 ? (
                              columns.map((column) => (
                                <SelectItem key={column._id} value={column._id}>
                                  {column.title}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value={`${task.boardColumnId}`}>
                                {task.title}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Controller
                      control={control}
                      name="dueDate"
                      render={({ field }) => (
                        <Input
                          id="dueDate"
                          type="date"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Labels */}
                <div className="space-y-2">
                  <Label htmlFor="labels">Labels</Label>
                  <div className="flex gap-2">
                    <Input
                      id="labels"
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddLabel()
                        }
                      }}
                      placeholder="Add label..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddLabel}
                    >
                      Add
                    </Button>
                  </div>
                  {Array.isArray(watchLabels) &&
                    watchLabels.map((label) => (
                      <Badge key={label} variant="outline" className="gap-1">
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                </div>

                {/* Assignees */}
                <div className="space-y-2">
                  <Label>Assignees</Label>
                  <div className="flex -space-x-2">
                    {task?.assigneeIds?.map((assigneeId) => (
                      <Avatar
                        key={assigneeId}
                        className="w-8 h-8 border-2 border-white"
                      >
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeId}`}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsAssignMemberOpen(true)
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Metadata */}
                <Separator />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDate(task?.createdAt)}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {/* Comment Input */}
              <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=current" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        // Handle comment submission
                        setCommentInput('')
                      }
                    }}
                  />
                  <Button variant="outline">Post</Button>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-4">
                {[
                  { action: 'created this task', time: task?.createdAt },
                  {
                    action: 'moved to In Progress',
                    time: new Date(
                      Date.now() - 3 * 60 * 60 * 1000
                    ).toISOString()
                  },
                  {
                    action: 'changed priority to High',
                    time: new Date(
                      Date.now() - 6 * 60 * 60 * 1000
                    ).toISOString()
                  }
                ].map((activity, index) => {
                  const timeStr = typeof activity.time === 'string' ? activity.time : activity.time?.toISOString?.() ?? ''
                  return (
                    <div key={index} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">You</span>{' '}
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getRelativeTime(timeStr)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Assign to Member Modal (for Edit Task) */}
      {project && task && (
        <AssignToMemberModal
          open={isAssignMemberOpen}
          onOpenChange={setIsAssignMemberOpen}
          taskId={task._id || task._id}
          taskTitle={task.title}
          project={project}
          currentAssignees={task.assigneeIds || []}
          onChangeAssignees={handleAssigneesChange}
        />
      )}
    </>
  )
}
