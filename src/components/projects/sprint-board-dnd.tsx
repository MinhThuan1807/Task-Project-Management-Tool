'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { FolderKanban, Loader2 } from 'lucide-react'
import { useAllProjects } from '@/lib/hooks/useProjects'
import { useSprintsByProject } from '@/lib/hooks/useSprints'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Project, Sprint, Task, User } from '@/lib/types'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { Progress } from '../ui/progress'
import {
  ArrowLeft,
  Plus,
  Calendar,
  LayoutGrid,
  List,
  CalendarDays,
  CheckCircle2,
  Search,
  SlidersHorizontal
} from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { SprintListView } from './sprint-list-view'
import { SprintCalendarView } from './sprint-calendar-view'
import { CreateTaskModal } from './create-task-modal'
import { FilterSortPanel } from './filter-sort-panel'
import { Input } from '../ui/input'
import { useTasksBySprint } from '@/lib/hooks/useTasks'
import { useBoardColumnsBySprint } from '@/lib/hooks/useBoardColumns'
import { useMoveTask } from '@/lib/hooks/useTasks'
import { toast } from 'sonner'
import { useCurrentUser } from '@/lib/hooks/useAuth'
import { useUpdateSprint } from '@/lib/hooks/useSprints'
import { useRouter } from 'next/navigation'

const SprintBoardDnd = () => {
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
  
  const { data: allProjects = [] } = useAllProjects();
  const { data: sprints = [] } = useSprintsByProject(projectId);

  const project = allProjects.find((p) => p._id === projectId);
  const sprint = sprints.find((s: Sprint) => s._id === sprintId);

  // Fetch data from API
  const { data: tasks = [], isLoading: tasksLoading } = useTasksBySprint(sprint?._id);
  const { data: boardColumns = [], isLoading: columnsLoading } = useBoardColumnsBySprint(sprint?._id);
  const { data: currentUser } = useCurrentUser();

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
  const updateSprintMutation = useUpdateSprint(sprint?._id);
  // Check user permission
  const currentMember = project?.members.find(m => m.memberId === currentUser?._id);
  const canEditTasks = currentMember?.role === 'owner' || currentMember?.role === 'member';

  // Disable sensors if user doesn't have permission
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

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
  const doneColumn = boardColumns.find((col) => col.title.toLowerCase() === 'done')
  const completedTasks = doneColumn
    ? filteredTasks.filter((t) => t.boardColumnId === doneColumn._id).length
    : 0
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const daysLeft = Math.ceil(
    (new Date(sprint?.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  )

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
        toast.error('You do not have permission to edit tasks');
      }
      return;
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

  const handleTaskClick = () => { true }

  const activeTask = tasks.find((t) => t._id === activeId)

  // Check sprint status
  const sprintStatus = sprint?.status
  const isActiveSprint = sprintStatus === 'active'

 if (
  tasksLoading ||
  columnsLoading ||
  !project ||
  !sprint ||
  !currentUser
) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading sprint board...</p>
      </div>
    </div>
  );
}

  const handleUpdateStatusSprint = () => {
    if (sprint?.status === 'planned') {
      updateSprintMutation.mutate({ status: 'active' });
      toast.success('Sprint activated successfully!');
      return;
    }
    updateSprintMutation.mutate({ status: 'completed' });
    router.push(`/projects/${projectId}`);
    toast.success('Sprint completed successfully!');
  }

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${projectId}/backlog`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl text-gray-900">{sprint?.name}</h2>
                <Badge
                  variant={isActiveSprint ? 'default' : 'outline'}
                  className={isActiveSprint ? 'bg-green-600' : ''}
                >
                  {sprint?.status.charAt(0).toUpperCase() +
                    sprint?.status.slice(1)}
                </Badge>
              </div>
              {sprint?.goal && (
                <p className="text-sm text-gray-600">{sprint?.goal}</p>
              )}
            </div>
            <div className="flex items-center flex-col gap-2">
             <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="ml-3 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
             </div>
             <div>
               <Button
                  onClick={handleUpdateStatusSprint}
                  className="bg-gradient-to-r"
                  variant='outline'
                >
                {sprint?.status === 'planned' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Active Sprint
                  </>
                ): (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Sprint
                  </>
                )}
                
              </Button>
             </div>

            </div>
          </div>

          {/* Search & Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(sprint?.startDate)} - {formatDate(sprint?.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedTasks} / {totalTasks} tasks
                </span>
              </div>
              {isActiveSprint && (
                <div className="flex items-center gap-2">
                  <span
                    className={daysLeft < 3 ? 'text-red-600 font-medium' : ''}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Sprint ended'}
                  </span>
                </div>
              )}
            </div>
          </div>

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
          <div className="flex-1 overflow-hidden">
            <DndContext
              sensors={canEditTasks ? sensors : useSensors()} // Disable drag if no permission
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4 h-full min-w-max overflow-auto">
                {boardColumns
                  .sort((a, b) => a.position - b.position)
                  .map((column) => {
                    const columnTasks = filteredTasks.filter(
                      (t) => t.boardColumnId === column._id
                    )
                    return (
                      <KanbanColumn
                        key={column._id}
                        column={{
                          id: column._id,
                          title: column.title,
                          color: getColumnColor(column.title)
                        }}
                        boardColumn={column}
                        tasks={columnTasks}
                        onTaskClick={(handleTaskClick)}
                        sprint={sprint}
                        project={project}
                      />
                    )
                  })}
              </div>
              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
              </DragOverlay>
            </DndContext>
          </div>
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
export default SprintBoardDnd;

// Helper function to get column color based on status
function getColumnColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'backlog':
      return 'bg-gray-100'
    case 'todo':
      return 'bg-blue-100'
    case 'in_process':
    case 'in-progress':
      return 'bg-yellow-100'
    case 'review':
      return 'bg-purple-100'
    case 'done':
      return 'bg-green-100'
    default:
      return 'bg-gray-100'
  }
}
