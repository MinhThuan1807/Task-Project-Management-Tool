import { Sprint, Task } from '@/lib/types'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  AlertCircle
} from 'lucide-react'
import { TaskCard } from '../sprint/BoardView/Comlumn/TaskCard/TaskCard'
interface BacklogTaskListProps {
  tasks: Task[];
  searchQuery: string;
  sprints: Sprint[];
  handleCreateTask: () => void;
  // handleEditTaskOpen: (task: Task) => void;
  canEdit: boolean;
  // handleDeleteTask: (task: Task) => void;
}
function BacklogTaskList({ tasks, searchQuery, sprints, handleCreateTask, canEdit }: BacklogTaskListProps) {
  return (
    <div className="p-6 space-y-3 max-w-4xl">
      {tasks?.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first task to get started'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        tasks?.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => true}
            sprints={sprints}
            canEdit={canEdit}
          />
        ))
      )}
    </div>
  )
}

export default BacklogTaskList
