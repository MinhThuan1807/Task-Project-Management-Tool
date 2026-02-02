import { Column } from '@/components/projects/sprint/BoardView/Comlumn/Column'
import { TaskCard } from '@/components/projects/sprint/BoardView/Comlumn/TaskCard/TaskCard'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Sprint, Project, BoardColumn, Task } from '@/lib/types'
import { getColumnColor } from '@/lib/utils'
import { useMoveTask } from '@/lib/hooks/index'
import { toast } from 'sonner'
import { useState } from 'react'

interface BoardViewProps {
  sprint: Sprint
  project: Project
  boardColumns: BoardColumn[]
  canEditTasks: boolean
  filteredTasks: Task[]
}

function BoardView({
  sprint,
  boardColumns,
  canEditTasks,
  filteredTasks
}: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeTask = filteredTasks.find((t) => t._id === activeId)
  const moveTaskMutation = useMoveTask()

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
  const disabledSensors = useSensors()
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
    const activeTask = filteredTasks.find((t) => t._id === activeTaskId)

    if (!activeTask) return
    
    const targetColumn = boardColumns.find((col) => col._id === overId)
    
    if (targetColumn && activeTask.boardColumnId !== targetColumn._id) {
      moveTaskMutation.mutate({
        taskId: activeTask._id,
        data: { boardColumnId: targetColumn._id }
      })
    } else {
      const targetTask = filteredTasks.find((t) => t._id === overId)
      
      if (targetTask && activeTask.boardColumnId !== targetTask.boardColumnId) {
        moveTaskMutation.mutate({
          taskId: activeTask._id,
          data: { boardColumnId: targetTask.boardColumnId }
        })
      }
    }
  }
  return (
    <div className="flex-1 p-3 overflow-auto">
      <DndContext
        sensors={canEditTasks ? sensors : disabledSensors} // Disable drag if no permission
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
                <Column
                  key={column._id}
                  column={{
                    id: column._id,
                    title: column.title,
                    color: getColumnColor(column.title)
                  }}
                  canEdit={canEditTasks}
                  boardColumn={column}
                  tasks={columnTasks}
                  sprint={sprint}
                />
              )
            })}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default BoardView
