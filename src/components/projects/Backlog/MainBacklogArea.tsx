import { useTasksBySprint } from '@/lib/hooks/useTasks'
import { useState } from 'react'
import { Sprint, Task } from '@/lib/types'
import { AlertCircle, Filter, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import BacklogTaskList from './BacklogTaskList'
import { toast } from 'sonner'
import { CreateTaskModal } from '../../modal/CreateTaskModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface MainBacklogAreaProps {
  sprints: Sprint[]
  onCreateSprint: () => void
  // project: Project
}
function MainBacklogArea({
  sprints,
  onCreateSprint
  // project
}: MainBacklogAreaProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task>()
  // const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const upcomingSprints = sprints
    .map((s) => (s.status === 'planned' ? s : null))
    .filter(Boolean) as Sprint[]
  const sprintIdUpcomming = sprints
    .filter((s) => s.status === 'planned')
    .map((s) => s._id)

  const validUpcomingSprint = upcomingSprints.find((s) =>
    /^[a-f\d]{24}$/i.test(s._id)
  )
  const sprintId = validUpcomingSprint?._id

  const { data: tasks, isError } = useTasksBySprint(sprintId || '')
  const filteredTasks =
    tasks?.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load tasks</p>
        </div>
      </div>
    )
  }
  const handleCreateTask = () => {
    if (sprints.length === 0) {
      toast.error('Please create a sprint first!')
      setTimeout(() => {
        onCreateSprint()
      }, 300)
    } else if (sprintIdUpcomming.length === 0) {
      toast.error('Please create a sprint in planning first!')
      onCreateSprint()
    } else setIsCreateTaskOpen(true)
  }
  const handleEditTaskOpen = (task: Task) => {
    setSelectedTask(task)
    // setIsEditTaskOpen(true)
  }

  // const handleDeleteTask = (task: Task) => {
  //   setSelectedTask(task)
  //   setIsDeleteAlertOpen(true)
  // }
  const confirmDelete = () => {
    setIsDeleteAlertOpen(false)
    setSelectedTask(undefined)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-gray-900">Product Backlog</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredTasks?.length} tasks •{' '}
              {filteredTasks?.reduce((sum, t) => sum + (t.storyPoint || 0), 0)}{' '}
              story points
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleCreateTask}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Backlog Tasks */}
      <ScrollArea className="flex-1 overflow-auto">
        <BacklogTaskList
          tasks={filteredTasks}
          searchQuery={searchQuery}
          sprints={sprints}
          handleCreateTask={handleCreateTask}
          handleEditTaskOpen={handleEditTaskOpen}
          // handleDeleteTask={handleDeleteTask}
        />
      </ScrollArea>
      <CreateTaskModal
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        sprintId={sprintIdUpcomming[0] || ''}
        // projectId={project._id}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {selectedTask?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Assign to Member Modal */}
    </div>
  )
}

export default MainBacklogArea
