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

interface BoardViewProps {
  sprint: Sprint
  project: Project
  boardColumns: BoardColumn[]
  canEditTasks: boolean
  handleTaskClick: (task: Task) => void
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  activeTask: Task | undefined
  filteredTasks: Task[]
}

function BoardView({
  sprint,
  project,
  boardColumns,
  canEditTasks,
  handleTaskClick,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  activeTask,
  filteredTasks
}: BoardViewProps) {
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
  return (
    <div className="flex-1 p-3 overflow-auto">
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
                  onTaskClick={handleTaskClick}
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
  )
}

export default BoardView
