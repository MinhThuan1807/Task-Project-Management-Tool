import { Task } from '../../../../lib/types'
import { ScrollArea } from '../../../ui/scroll-area'
import { TaskCard } from '../BoardView/Comlumn/TaskCard/TaskCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type SprintListViewProps = {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  canEdit?: boolean
}

const SprintListView = ({
  tasks,
  onTaskClick,
  canEdit
}: SprintListViewProps) => {
  return (
    <ScrollArea className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Button
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 cursor-pointer"
              variant="ghost"
              // onClick={() => {
              //   setColumnIsSelected(true)
              // }}
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </Button>
            <p className="text-sm text-gray-400">No tasks</p>
            <p className="text-xs text-gray-400 mt-1">
                    Drag tasks here or click + to add
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            return (
              <TaskCard
                task={task}
                key={task._id}
                Click={() => onTaskClick(task)}
                canEdit={canEdit}
              />
            )
          })
        )}
      </div>
    </ScrollArea>
  )
}
export default SprintListView
