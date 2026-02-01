'use client'
import { useMemo, useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject, useUpdateSprint } from '@/lib/hooks/useSprints'
import { useTasksBySprint, useMoveTask } from '@/lib/hooks/useTasks'
import { useBoardColumnsBySprint } from '@/lib/hooks/useBoardColumns'
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'
import { Progress } from '../../ui/progress'
import { LayoutGrid, List, CalendarDays } from 'lucide-react'
import { FilterSortPanel } from '../FilterSortPanel'
import SprintTitle from './SprintTitle'
import SprintSearch from './SprintSearch'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const CreateTaskModal = dynamic(
  () => import('@/components/modal/CreateTaskModal'),
  {
    ssr: false
  }
)
import { toast } from 'sonner'
import { Task } from '@/lib/types'
import BoardViewSkeleton from './BoardView/BoardViewSkeleton'
import SprintHeaderSkeleton from './SprintHeaderSkeleton'
import SprintListViewSkeleton from './CalendarView/SprintCalendarViewSkeleton'
import SprintCalendarViewSkeleton from './CalendarView/SprintCalendarViewSkeleton'
import { selectCurrentUser } from '@/lib/features/auth/authSlice'
import { useSelector } from 'react-redux'

const BoardView = dynamic(() => import('./BoardView/BoardView'), {
  ssr: false,
  loading: () => <BoardViewSkeleton />
})
const SprintCalendarView = dynamic(
  () => import('./CalendarView/SprintCalendarView'),
  { ssr: false,
    loading: () => <SprintCalendarViewSkeleton />
  }
)
const SprintListView = dynamic(
  () => import('./ListView/SprintListView'),
  { ssr: false,
    loading: () => <SprintListViewSkeleton />
   }
)

const SprintBoardContainer = () => {
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>(
    'board'
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    priority: Task['priority'][]
    assigneeIds: string[]
  }>({
    priority: [],
    assigneeIds: []
  })

  const router = useRouter()
  const params = useParams<{ id: string; sprintId: string }>()
  const projectId = params.id
  const sprintId = params.sprintId

  // Fetch data
  const allProjectsQuery = useAllProjects()
  const sprintsQuery = useSprintsByProject(projectId)
  const tasksQuery = useTasksBySprint(sprintId!)
  const columnsQuery = useBoardColumnsBySprint(sprintId!)

  const currentUser = useSelector(selectCurrentUser)

  const allProjects = useMemo(
    () => allProjectsQuery.data ?? [],
    [allProjectsQuery.data]
  )
  const sprints = useMemo(() => sprintsQuery.data ?? [], [sprintsQuery.data])
  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])
  const boardColumns = useMemo(
    () => columnsQuery.data ?? [],
    [columnsQuery.data]
  )

  const project = useMemo(
    () => allProjects.find((p) => p._id === projectId),
    [allProjects, projectId]
  )
  const sprint = useMemo(
    () => sprints.find((s) => s._id === sprintId),
    [sprints, sprintId]
  )

  useEffect(() => {
    setIsCreateTaskOpen(false)
    setIsFilterOpen(false)
    setSearchQuery('')
    setFilters({ priority: [], assigneeIds: [] })
  }, [projectId, sprintId])

  useEffect(() => {
    if (!projectId) return
    if (
      !sprintsQuery.isLoading &&
      sprintId &&
      sprints.length > 0 &&
      !sprints.some((s) => s._id === sprintId)
    ) {
      router.replace(`/projects/${projectId}/backlog`)
    }
  }, [sprints, sprintId, projectId, sprintsQuery.isLoading, router])

  // Mutations
  const moveTaskMutation = useMoveTask()
  const updateSprintMutation = useUpdateSprint({
    sprintId: sprintId,
    projectId: projectId
  })

  // Loading state
  if (
    !projectId ||
    !sprintId ||
    allProjectsQuery.isLoading ||
    sprintsQuery.isLoading
  ) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
        <SprintHeaderSkeleton />
    </div>
  )
  }

  // Not found state
  if (!project) return <div className="p-6">Project not found</div>
  if (!sprint) return <div className="p-6">Sprint not found</div>

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesPriority =
      filters.priority.length === 0 ||
      (task.priority && filters.priority.includes(task.priority))
    const matchesAssignee =
      filters.assigneeIds.length === 0 ||
      task.assigneeIds?.some((id) => filters.assigneeIds.includes(id))
    return matchesSearch && matchesPriority && matchesAssignee
  })

  const canEditTasks =
    project?.ownerId === currentUser?._id ||
    project?.members?.some(
      (member) =>
        member.memberId === currentUser?._id && member.role === 'member'
    )

  // Stats
  const totalTasks = filteredTasks.length
  const doneColumn = boardColumns.find(
    (col) => col.title.toLowerCase() === 'done'
  )

  const completedTasks = doneColumn
    ? filteredTasks.filter((t) => t.boardColumnId === doneColumn._id).length
    : 0

  const storyPointsCompleted = doneColumn
    ? filteredTasks.filter((t) => t.boardColumnId === doneColumn._id)
    : []
  const getStoryPoints = (t: Task) => t.storyPoint

  const totalStoryPoints = storyPointsCompleted.reduce(
    (sum, t) => sum + Number(getStoryPoints(t)),
    0
  )
  const progress = (totalStoryPoints / (sprint?.maxStoryPoint || 1)) * 100

  const daysLeft = sprint?.endDate
    ? Math.ceil(
        (new Date(sprint.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }
  function handleDragOver(event: DragOverEvent) {
    const { over } = event
    if (!over || !canEditTasks) {
      if (!canEditTasks) toast.error('You do not have permission to edit tasks')
      return
    }
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || !canEditTasks) {
      if (!canEditTasks) toast.error('You do not have permission to edit tasks')
      return
    }
    const activeTaskId = active.id as string
    const overId = over.id as string
    const activeTask = tasks.find((t) => t._id === activeTaskId)
    if (!activeTask) return
    const targetColumn = boardColumns.find((col) => col._id === overId)
    if (targetColumn && activeTask.boardColumnId !== targetColumn._id) {
      moveTaskMutation.mutate({
        taskId: activeTask._id,
        data: { boardColumnId: targetColumn._id }
      })
    } else {
      const targetTask = tasks.find((t) => t._id === overId)
      if (targetTask && activeTask.boardColumnId !== targetTask.boardColumnId) {
        moveTaskMutation.mutate({
          taskId: activeTask._id,
          data: { boardColumnId: targetTask.boardColumnId }
        })
      }
    }
  }

  const handleTaskClick = () => true

  const activeTask = tasks.find((t) => t._id === activeId)
  const isActiveSprint = sprint?.status === 'active'

  const handleUpdateStatusSprint = () => {
    if (!sprintId || !projectId) return
    if (!updateSprintMutation) return
    if (sprint?.status === 'planned') {
      updateSprintMutation.mutate({ status: 'active' })
      toast.success('Sprint activated successfully!')
      return
    }
    updateSprintMutation.mutate({ status: 'completed' })
    router.push(`/projects/${projectId}`)
    toast.success('Sprint completed successfully!')
  }

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <SprintTitle
            sprint={sprint}
            onDirectToBacklog={() =>
              router.push(`/projects/${projectId}/backlog`)
            }
            isActiveSprint={isActiveSprint}
            setIsFilterOpen={setIsFilterOpen}
            isFilterOpen={isFilterOpen}
            setIsCreateTaskOpen={setIsCreateTaskOpen}
            handleUpdateStatusSprint={handleUpdateStatusSprint}
            canEditTask={canEditTasks}
          />
          <SprintSearch
            sprint={sprint}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            isActiveSprint={isActiveSprint}
            daysLeft={daysLeft}
            totalStoryPoints={totalStoryPoints}
            // searchQuery={searchQuery}
            // setSearchQuery={setSearchQuery}
          />
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sprint Progress</span>
              <span className="text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) =>
                v && setViewMode(v as 'board' | 'list' | 'calendar')
              }
            >
              <ToggleGroupItem value="board" aria-label="Board view">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Board
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="w-4 h-4 mr-2" />
                List
              </ToggleGroupItem>
              <ToggleGroupItem value="calendar" aria-label="Calendar view">
                <CalendarDays className="w-4 h-4 mr-2" />
                Calendar
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {isFilterOpen && (
          <FilterSortPanel
            filters={filters}
            onFiltersChange={setFilters}
            projectMembers={project?.members}
          />
        )}
        {viewMode === 'board' && (
          <BoardView
            sprint={sprint}
            project={project}
            boardColumns={boardColumns}
            canEditTasks={canEditTasks}
            handleTaskClick={handleTaskClick}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            activeTask={activeTask}
            filteredTasks={filteredTasks}
          />
        )}
        {viewMode === 'list' && (
          <SprintListView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            canEdit={canEditTasks}
          />
        )}
        {viewMode === 'calendar' && (
          <SprintCalendarView
            tasks={filteredTasks}
            sprint={sprint}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>
      {canEditTasks && isCreateTaskOpen && (
        <CreateTaskModal
          open={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          sprintId={sprint._id}
          boardColumns={boardColumns}
        />
      )}
    </>
  )
}

export default SprintBoardContainer
