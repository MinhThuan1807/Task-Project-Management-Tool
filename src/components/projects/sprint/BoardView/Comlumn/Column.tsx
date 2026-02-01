import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BoardColumn, Sprint, Task } from '../../../../../lib/types'
import { ScrollArea } from '../../../../ui/scroll-area'
import { Button } from '../../../../ui/button'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard/TaskCard'
import { useState } from 'react'
import dynamic from 'next/dynamic'
const CreateTaskModal = dynamic(
  () => import('@/components/modal/CreateTaskModal'),
  { ssr: false }
)

type ColumnProps = {
  boardColumn: BoardColumn
  column: {
    id: string
    title: string
    color: string
  }
  tasks: Task[]
  onTaskClick: (task: Task) => void
  canEdit?: boolean
  sprint: Sprint
  // project: Project
}

export function Column({
  boardColumn,
  column,
  tasks,
  onTaskClick,
  canEdit,
  sprint
  // project
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    disabled: !canEdit // Disable drop if no permission
  })
  const [isColumnSelected, setColumnIsSelected] = useState(false)

  return (
    <div className="pt-5 flex-shrink-0 w-68 flex flex-col">
      <div
        className={`${column.color} px-4 py-3 rounded-t-lg shadow-sm border-b-2 border-gray-300 sticky top-0 z-10`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-900">
            {column.title}{' '}
            <span className="text-gray-600">({tasks.length})</span>
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-white/50"
            onClick={() => {
              setColumnIsSelected(true)
            }}
            disabled={!canEdit}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 bg-white border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-lg min-h-[500px] shadow-sm"
      >
        <ScrollArea className="h-full overflow-auto">
          <SortableContext
            items={tasks.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-3 space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  Click={() => onTaskClick(task)}
                  canEdit={canEdit} // Pass permission down
                />
              ))}
              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Button
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 cursor-pointer"
                    variant="ghost"
                    onClick={() => {
                      setColumnIsSelected(true)
                    }}
                    disabled={!canEdit}
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </Button>
                  <p className="text-sm text-gray-400">No tasks</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Drag tasks here or click + to add
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
      <CreateTaskModal
        open={isColumnSelected}
        onClose={() => setColumnIsSelected(false)}
        // projectId={project._id}
        sprintId={sprint._id}
        boardColumn={boardColumn}
      />
    </div>
  )
}
