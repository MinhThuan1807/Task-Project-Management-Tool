'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { Sprint, Task } from '@/lib/types'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'
import { Progress } from '../../ui/progress'
import { LayoutGrid, List, CalendarDays } from 'lucide-react'

import { SprintListView } from './ListView/SprintListView'
import { SprintCalendarView } from './CalendarView/SprintCalendarView'
import { CreateTaskModal } from '../../modal/CreateTaskModal'
import { FilterSortPanel } from '../filter-sort-panel'
import { useTasksBySprint } from '@/lib/hooks/useTasks'
import { useBoardColumnsBySprint } from '@/lib/hooks/useBoardColumns'
import { useMoveTask } from '@/lib/hooks/useTasks'
import { toast } from 'sonner'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { useUpdateSprint } from '@/lib/hooks/useSprints'
import { useRouter } from 'next/navigation'
import SprintTitle from './SprintTitle'
import SprintSearch from './SprintSearch'
import BoardView from './BoardView/BoardView'
import { getColumnColor } from '@/lib/utils'

const SprintBoardContainer = () => {
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>(
    'board'
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const sprintId = params.sprintId as string

  const { data: allProjects = [] } = useAllProjects()
  const { data: sprints = [] } = useSprintsByProject(projectId)

  const project = allProjects.find((p) => p._id === projectId)
  const sprint = sprints.find((s: Sprint) => s._id === sprintId)

  // Fetch data from API
  const { data: tasks = [], isLoading: tasksLoading } = useTasksBySprint(
    sprint?._id
  )
  const { data: boardColumns = [], isLoading: columnsLoading } =
    useBoardColumnsBySprint(sprint?._id)
  const { data: currentUser } = useCurrentUser()

  // Filter state
  const [filters, setFilters] = useState<{
    priority: Task['priority'][]
    assigneeIds: Task['assigneeIds'][]
  }>({
    priority: [],
    assigneeIds: []
  })

  // Mutations
  const moveTaskMutation = useMoveTask()
  const updateSprintMutation = useUpdateSprint(sprint?._id)
  // Check user permission
  const currentMember = project?.members.find(
    (m) => m.memberId === currentUser?._id
  )
  const canEditTasks = currentMember?.role === 'owner'

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

  // Calculate stats
  const totalTasks = filteredTasks.length
  const doneColumn = boardColumns.find(
    (col) => col.title.toLowerCase() === 'done'
  )
  const completedTasks = doneColumn
    ? filteredTasks.filter((t) => t.boardColumnId === doneColumn._id).length
    : 0
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

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
    // Optimistic UI update is handled by react-query
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || !canEditTasks) {
      if (!canEditTasks) {
        toast.error('You do not have permission to edit tasks')
      }
      return
    }

    const activeTaskId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t._id === activeTaskId)
    if (!activeTask) return

    const targetColumn = boardColumns.find((col) => col._id === overId)

    if (targetColumn && activeTask.boardColumnId !== targetColumn._id) {
      // Chỉ gửi boardColumnId, không gửi source/destination
      moveTaskMutation.mutate({
        taskId: activeTask._id,
        data: {
          boardColumnId: targetColumn._id
        }
      })
    } else {
      const targetTask = tasks.find((t) => t._id === overId)
      if (targetTask && activeTask.boardColumnId !== targetTask.boardColumnId) {
        // Chỉ gửi boardColumnId, không gửi source/destination
        moveTaskMutation.mutate({
          taskId: activeTask._id,
          data: {
            boardColumnId: targetTask.boardColumnId
          }
        })
      }
    }
  }

  const handleTaskClick = () => {
    true
  }

  const activeTask = tasks.find((t) => t._id === activeId)

  // Check sprint status
  const sprintStatus = sprint?.status
  const isActiveSprint = sprintStatus === 'active'

  if (tasksLoading || columnsLoading || !project || !sprint || !currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sprint board...</p>
        </div>
      </div>
    )
  }

  const handleUpdateStatusSprint = () => {
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
          {/* Title & Actions */}

          <SprintTitle
            sprint={sprint}
            projectId={projectId}
            onDirectToBacklog={() =>
              router.push(`/projects/${projectId}/backlog`)
            }
            isActiveSprint={isActiveSprint}
            setIsFilterOpen={setIsFilterOpen}
            isFilterOpen={isFilterOpen}
            setIsCreateTaskOpen={setIsCreateTaskOpen}
            handleUpdateStatusSprint={handleUpdateStatusSprint}
          />

          {/* Search & Stats */}
          <SprintSearch
            sprint={sprint}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            isActiveSprint={isActiveSprint}
            daysLeft={daysLeft}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sprint Progress</span>
              <span className="text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as any)}
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

        {/* Filter Panel */}
        {isFilterOpen && (
          <FilterSortPanel
            filters={filters}
            onFiltersChange={setFilters}
            projectMembers={project?.members}
          />
        )}

        {/* Board View */}
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

        {/* List View */}
        {viewMode === 'list' && (
          <SprintListView
            tasks={filteredTasks}
            columns={boardColumns.map((col) => ({
              id: col._id,
              title: col.title,
              color: getColumnColor(col.title)
            }))}
            onTaskClick={handleTaskClick}
            canEdit={canEditTasks}
          />
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <SprintCalendarView
            tasks={filteredTasks}
            sprint={sprint}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      {/* Modals - Only allow if has permission */}
      {canEditTasks && isCreateTaskOpen && (
        <CreateTaskModal
          open={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          projectId={project._id}
          sprintId={sprint._id}
          boardColumns={boardColumns}
        />
      )}
    </>
  )
}
export default SprintBoardContainer
