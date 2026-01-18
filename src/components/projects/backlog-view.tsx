import { use, useState } from 'react';
import { Project, Sprint, Task, User } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Plus,
  Calendar,
  TrendingUp,
  Play,
  MoreVertical,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { cn, formatDate, getPriorityColor } from '../../lib/utils';
import { CreateTaskModal } from './create-task-modal';
import { useTasksBySprint } from '@/lib/hooks/useTasks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AssignToSprintModal } from './assign-to-sprint-modal';
import { EditTaskModal } from './edit-task-modal';
import { AssignToMemberModal } from './assign-to-member-modal';

type BacklogViewProps = {
  project: Project;
  sprints: Sprint[];
  onCreateSprint: () => void;
  onStartSprint: (sprint: Sprint) => void;
};

export function BacklogView({
  project,
  sprints,
  onCreateSprint,
  onStartSprint,
}: BacklogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const activeSprints = sprints.map((s) => s.status === 'active' ? s : null).filter(Boolean) as Sprint[];
  const upcomingSprints = sprints.map((s) => s.status === 'planned' ? s : null).filter(Boolean) as Sprint[];
  const sprintIdUpcomming = sprints.filter((s) => s.status === 'planned').map((s) => s._id);
  
  const { data: tasks, isLoading, isError } =  useTasksBySprint(upcomingSprints[0]?._id || '')
  const [isAssignSprintOpen, setIsAssignSprintOpen] = useState(false);
  const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);


  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load tasks</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateTask = (task: any) => {
    console.log('Creating task:', task);
    // TODO: Implement actual task creation
  };

  const handleEditTask = () => {
    // setSelectedTask(task);
    // setIsEditTaskOpen(true);
  };

  const handleAssignToSprint = () => {
    // setSelectedTask(task);
    // setIsAssignSprintOpen(true);
  };

  const handleDeleteTask = () => {
    // setSelectedTask(task);
    // setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement actual task deletion
    // setIsDeleteAlertOpen(false);
    // setSelectedTask(null);
  };

  const handleAssignConfirm = (sprintId: string) => {
    // TODO: Implement actual assignment
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Main Backlog Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl text-gray-900">Product Backlog</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTasks?.length} tasks • {filteredTasks?.reduce((sum, t) => sum + (t.storyPoint || 0), 0)} story points
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => {
                  if(sprints.length === 0){
                    toast.error('Please create a sprint first!')
                    setTimeout(() => {
                      onCreateSprint()
                    }, 300)
                  }
                  else
                    setIsCreateTaskOpen(true)
                }}
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
          <div className="p-6 space-y-3 max-w-4xl">
            {filteredTasks?.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try a different search term' : 'Create your first task to get started'}
                  </p>
                  {!searchQuery && (
                    <Button  
                      onClick={() => {
                        if(sprints.length === 0){
                          toast.error('Please create a sprint first!')
                          setTimeout(() => {
                            onCreateSprint()
                          },300)
                        }
                        else
                          setIsCreateTaskOpen(true)
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredTasks?.map((task) => (
                <Card key={task._id} className="border-0 shadow-md hover:shadow-lg transition-shadow group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                            {task.title}
                            <Badge className={cn(getPriorityColor(task.priority), 'ml-2')}>{sprints.map((s) => s._id === task.sprintId ? s.name : "")}</Badge>
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedTask(task);
                                setIsEditTaskOpen(true);
                              }}>Edit Task</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task)}>
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task?.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {task.storyPoint} SP
                          </Badge>
                         {Array.isArray(task.labels) && task.labels.map((label) => (
                            <Badge key={label} variant="outline" className="text-xs">
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
        </ScrollArea>
      </div>

      {/* Sprint Planning Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg text-gray-900 mb-1">Sprint Planning</h3>
          <p className="text-sm text-gray-600">Manage and plan sprints</p>
        </div>

        <ScrollArea className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Create Sprint Button */}
            <Button
              onClick={onCreateSprint}
              variant="outline"
              className="w-full border-dashed border-2 h-auto py-4"
              disabled={sprints.some((s) => s.status === 'planned')}
            >
              <Plus className="w-5 h-5 mr-2" />
              {sprints.some((s) => s.status === 'planned') ? 'Sprint in Planning' : 'Create New Sprint'}
            </Button>

            <Separator />

            {/* Active Sprints */}
            {activeSprints.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-green-600" />
                  Active Sprints ({activeSprints.length})
                </h4>
                <div className="space-y-3">
                  {activeSprints.map((sprint) => (
                    <Card
                      key={sprint._id}
                      className="border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onStartSprint(sprint)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm text-gray-900">{sprint.name}</h5>
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{sprint.goal}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(sprint.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{sprint.maxStoryPoint} SP</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sprints */}
            {upcomingSprints.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Upcoming Sprints ({upcomingSprints.length})
                </h4>
                <div className="space-y-3">
                  {upcomingSprints.map((sprint) => (
                    <Card
                      key={sprint._id}
                      className="border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm text-gray-900">{sprint.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            Upcoming
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{sprint.goal}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(sprint.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{sprint.maxStoryPoint} SP</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => onStartSprint(sprint)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start Sprint
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Sprints State */}
            {sprints.length === 0 && (
              <Card className="border-0 bg-gray-50">
                <CardContent className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No sprints yet</p>
                  <p className="text-xs text-gray-500 mt-1">Create your first sprint to start planning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modals */}
      <CreateTaskModal
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        sprintId={sprintIdUpcomming[0] || ''}
        projectId={project._id}
      />
      <EditTaskModal
        open={isEditTaskOpen}
        onClose={() => setIsEditTaskOpen(false)}
        task={selectedTask!}
        onSave={() => setIsEditTaskOpen(false)}
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
      {selectedTask && (
        <AssignToMemberModal
          open={isAssignMemberOpen}
          onOpenChange={setIsAssignMemberOpen}
          taskId={selectedTask._id}
          taskTitle={selectedTask.title}
          project={project}
          currentAssignees={selectedTask.assigneeIds || []}
        />
      )}         
    </div>
  );
}