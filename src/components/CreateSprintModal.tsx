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
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Calendar, Target, TrendingUp, Loader2 } from 'lucide-react'
import { useCreateSprint } from '@/lib/hooks/useSprints'
import type { CreateSprintRequest } from '@/lib/types'
import { toast } from 'sonner'

// Validation schema
const createSprintSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Sprint name is required')
      .min(3, 'Sprint name must be at least 3 characters')
      .max(100, 'Sprint name must be less than 100 characters'),
    goal: z
      .string()
      .max(500, 'Goal must be less than 500 characters')
      .optional(),
    maxStoryPoint: z
      .number()
      .min(0, 'Story points must be positive')
      .optional(),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today
      }, 'Start date cannot be in the past'),
    endDate: z.string().min(1, 'End date is required')
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate)
      }
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate']
    }
  )

type CreateSprintFormData = z.infer<typeof createSprintSchema>

type CreateSprintModalProps = {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSprintModal({
  projectId,
  open,
  onOpenChange
}: CreateSprintModalProps) {
  // Get default dates (today and 2 weeks from now)
  const today = new Date().toISOString().split('T')[0]
  const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateSprintFormData>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      name: '',
      goal: '',
      maxStoryPoint: 0,
      startDate: today,
      endDate: twoWeeksLater
    }
  })

  // Use TanStack Query mutation
  const createSprintMutation = useCreateSprint()

  // Handle form submission
  const onSubmit = async (data: CreateSprintFormData) => {
    const payload: CreateSprintRequest = {
      projectId,
      name: data.name,
      goal: data.goal || '',
      maxStoryPoint: data.maxStoryPoint,
      startDate: new Date(data.startDate),
      endDate: new Date(data.startDate)
    }

   console.log('📤 Sending payload:', payload);
    createSprintMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Sprint created successfully!')
        reset()
        onOpenChange(false)
      }
    })
  }

  // Handle modal close
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !createSprintMutation.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Create New Sprint
          </DialogTitle>
          <DialogDescription>
            Set up a new sprint for your project. Define goals, timeline, and
            capacity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Sprint Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 1, November Sprint"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                disabled={createSprintMutation.isPending}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Sprint Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Sprint Goal
              </Label>
              <Textarea
                id="goal"
                placeholder="What do you want to achieve in this sprint?"
                rows={3}
                {...register('goal')}
                className={errors.goal ? 'border-red-500' : ''}
                disabled={createSprintMutation.isPending}
              />
              {errors.goal && (
                <p className="text-xs text-red-500">{errors.goal.message}</p>
              )}
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <Label
                htmlFor="maxStoryPoint"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Maximum Story Points
              </Label>
              <Input
                id="maxStoryPoint"
                type="number"
                placeholder="40"
                min="0"
                {...register('maxStoryPoint', {
                  setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10))
                })}
                className={errors.maxStoryPoint ? 'border-red-500' : ''}
                disabled={createSprintMutation.isPending}
              />
              {errors.maxStoryPoint && (
                <p className="text-xs text-red-500">
                  {errors.maxStoryPoint.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Optional: Set a story point limit for this sprint
              </p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className={errors.startDate ? 'border-red-500' : ''}
                  disabled={createSprintMutation.isPending}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className={errors.endDate ? 'border-red-500' : ''}
                  disabled={createSprintMutation.isPending}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createSprintMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSprintMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createSprintMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Sprint
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
