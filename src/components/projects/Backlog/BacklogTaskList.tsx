import { Sprint, Task } from '@/lib/types'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  MoreVertical,
  GripVertical,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn, getPriorityColor } from '@/lib/utils'
interface BacklogTaskListProps {
  tasks: Task[];
  searchQuery: string;
  sprints: Sprint[];
  handleCreateTask: () => void;
  handleEditTaskOpen: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
}
function BacklogTaskList({ tasks, searchQuery, sprints, handleCreateTask, handleEditTaskOpen, handleDeleteTask }: BacklogTaskListProps) {
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
          <Card
            key={task._id}
            className="border-0 shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
            onClick={() => handleEditTaskOpen(task)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                      {task.title}
                      <Badge
                        className={cn(getPriorityColor(task.priority), 'ml-2')}
                      >
                        {sprints.map((s) =>
                          s._id === task.sprintId ? s.name : ''
                        )}
                      </Badge>
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {handleEditTaskOpen(task)}}
                        >
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            handleDeleteTask(task)
                          }}
                        >
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task?.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {task.storyPoint} SP
                    </Badge>
                    {Array.isArray(task.labels) &&
                      task.labels.map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="text-xs"
                        >
                          {label}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default BacklogTaskList
