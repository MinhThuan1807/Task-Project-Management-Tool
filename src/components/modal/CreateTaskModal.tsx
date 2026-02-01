import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Badge } from '../ui/badge'
import { X, Loader2 } from 'lucide-react'
import { BoardColumn } from '@/lib/types'
import { useCreateTask } from '@/lib/hooks/useTasks'
import { toast } from 'sonner'
import { useState } from 'react'
import { getErrorMessage } from '@/lib/utils'
// Validation schema
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .min(3, 'Task title must be at least 3 characters')
    .max(200, 'Task title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  storyPoint: z.number().min(0).max(100),
  boardColumnId: z.string().optional(),
  dueDate: z.string().optional()
  // assigneeIds: z.array(z.string()).optional()
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  sprintId: string
  boardColumns?: BoardColumn[]
  boardColumn?: BoardColumn
}

export default function CreateTaskModal({
  open,
  onClose,
  sprintId,
  boardColumns,
  boardColumn
}: CreateTaskModalProps) {
  const [labels, setLabels] = useState<string[]>([])
  const [labelInput, setLabelInput] = useState('')
  // const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false)

  // Get default column (first column or "To Do")
  const defaultColumn =
    boardColumn ||
    boardColumns?.find((col) => col.title.toLowerCase() === 'todo') ||
    boardColumns?.[0]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'high',
      storyPoint: 5,
      boardColumnId: defaultColumn?._id || undefined,
      dueDate: new Date().toISOString().split('T')[0]
      // assigneeIds: ['']
    }
  })

  const priority = watch('priority')
  const storyPoint = watch('storyPoint')
  const boardColumnId = watch('boardColumnId')
  // const assigneeIds = watch('assigneeIds') || []

  // Use TanStack Query mutation
  const createTaskMutation = useCreateTask()

  // Handle form submission
  const onSubmit = async (data: CreateTaskFormData) => {
    const payload = {
      sprintId,
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      storyPoint: data.storyPoint,
      boardColumnId: data.boardColumnId,
      labels: labels.length > 0 ? labels : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      // assigneeIds: data.assigneeIds || []
    }

    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Task created successfully!')
        handleClose()
      },
      onError: (error) => {
        toast.error(getErrorMessage(error))
      }
    })
  }

  // Handle modal close
  const handleClose = () => {
    if (!createTaskMutation.isPending) {
      reset()
      setLabels([])
      setLabelInput('')
      onClose()
    }
  }

  // Label handlers
  const handleAddLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()])
      setLabelInput('')
    }
  }

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddLabel()
    }
  }
  // const handleAssigneesChange = (newAssigneeIds: string[]) => {
  //   setValue('assigneeIds', newAssigneeIds)
  // }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the sprint with all necessary details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                {...register('title')}
                disabled={createTaskMutation.isPending}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                rows={4}
                {...register('description')}
                disabled={createTaskMutation.isPending}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority & Story Points */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setValue(
                      'priority',
                      value as 'low' | 'medium' | 'high' | 'critical'
                    )
                  }
                  disabled={createTaskMutation.isPending}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Critical
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-xs text-red-500">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storyPoint">Story Points</Label>
                <Select
                  value={storyPoint.toString()}
                  onValueChange={(value) =>
                    setValue('storyPoint', Number(value))
                  }
                  disabled={createTaskMutation.isPending}
                >
                  <SelectTrigger id="storyPoint">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 8, 13, 21].map((point) => (
                      <SelectItem key={point} value={point.toString()}>
                        {point}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storyPoint && (
                  <p className="text-xs text-red-500">
                    {errors.storyPoint.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Board Column */}
              <div className="space-y-2">
                <Label htmlFor="boardColumn">
                  Column <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={boardColumnId}
                  onValueChange={(value) => setValue('boardColumnId', value)}
                  disabled={createTaskMutation.isPending}
                >
                  <SelectTrigger id="boardColumn">
                    <SelectValue placeholder="Select a column " />
                  </SelectTrigger>
                  <SelectContent>
                    {boardColumn ? (
                      <SelectItem key={boardColumn._id} value={boardColumn._id}>
                        {boardColumn.title}
                      </SelectItem>
                    ) : (
                      boardColumns
                        ?.sort((a, b) => a.position - b.position)
                        .map((column) => (
                          <SelectItem key={column._id} value={column._id}>
                            {column.title}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {errors.boardColumnId && (
                  <p className="text-xs text-red-500">
                    {errors.boardColumnId.message}
                  </p>
                )}
              </div>
              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  disabled={createTaskMutation.isPending}
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
                {errors.dueDate && (
                  <p className="text-xs text-red-500">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="labels">Labels</Label>
                <div className="flex gap-2">
                  <Input
                    id="labels"
                    placeholder="Add label..."
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={createTaskMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddLabel}
                    disabled={
                      createTaskMutation.isPending || !labelInput.trim()
                    }
                  >
                    Add
                  </Button>
                </div>
                {labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {labels.map((label, index) => (
                      <Badge
                        key={`${label}-${index}`}
                        variant="outline"
                        className="gap-1"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          disabled={createTaskMutation.isPending}
                          className="ml-1 hover:text-red-600 disabled:cursor-not-allowed"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assignees */}
            {/* <div className="space-y-2">
              <Label>Assignees</Label>
              <div className="flex -space-x-2">
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
            </div> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createTaskMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createTaskMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
