import { useState } from 'react';
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
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Project, Sprint, User, Task } from '../../lib/types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  Plus,
  Calendar,
  LayoutGrid,
  List,
  CalendarDays,
  Filter,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { SprintListView } from './sprint-list-view';
import { SprintCalendarView } from './sprint-calendar-view';
import { CreateTaskModal } from './create-task-modal';
import { EditTaskModal } from './edit-task-modal';
import { FilterSortPanel } from './filter-sort-panel';
import { Input } from '../ui/input';

type SprintBoardDndProps = {
  project: Project;
  sprint: Sprint;
  currentUser: User;
  onBack: () => void;
};

// Column configuration
const columnConfig = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'todo', title: 'Todo', color: 'bg-blue-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'review', title: 'Review', color: 'bg-purple-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

export function SprintBoardDnd({ project, sprint, currentUser, onBack }: SprintBoardDndProps) {
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board');
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks(sprint.id, project.id));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignees: [] as string[],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate stats
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesAssignee =
      filters.assignees.length === 0 ||
      task.assignees?.some((a) => filters.assignees.includes(a));
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => t.columnId === 'done').length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const daysLeft = Math.ceil(
    (new Date(sprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Dropping over another task
    if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overTask.columnId } : task
        )
      );
    }

    // Dropping over a column
    const overColumn = columnConfig.find((c) => c.id === overId);
    if (overColumn && activeTask.columnId !== overColumn.id) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId ? { ...task, columnId: overColumn.id } : task
        )
      );
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
  }

  // Task handlers
  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: project.id,
      sprintId: sprint.id,
      columnId: taskData.columnId || 'backlog',
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      labels: taskData.labels || [],
      assignees: taskData.assignees || [],
      priority: taskData.priority || 'medium',
      status: taskData.status || 'backlog',
      storyPoint: taskData.storyPoint || 0,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setIsCreateTaskOpen(false);
  };

  const handleEditTask = (taskData: Partial<Task>) => {
    if (!selectedTask) return;
    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      )
    );
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl text-gray-900">{sprint.name}</h2>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{sprint.goal}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
              <Button onClick={() => setIsCreateTaskOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
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
                  {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedTasks} / {totalTasks} tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={daysLeft < 3 ? 'text-red-600 font-medium' : ''}>
                  {daysLeft} days left
                </span>
              </div>
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
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
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
            projectMembers={project.members}
          />
        )}

        {/* Board View */}
        {viewMode === 'board' && (
          <div className="flex-1 overflow-x-auto p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4 h-full min-w-max">
                {columnConfig.map((column) => {
                  const columnTasks = filteredTasks.filter((t) => t.columnId === column.id);
                  return (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                      onTaskClick={handleTaskClick}
                    />
                  );
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
            columns={columnConfig}
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

      {/* Modals */}
      {isCreateTaskOpen && (
        <CreateTaskModal
          projectId={project.id}
          sprintId={sprint.id}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={handleCreateTask}
        />
      )}

      {isEditTaskOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setIsEditTaskOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
}

// Generate mock tasks
function generateMockTasks(sprintId: string, projectId: string): Task[] {
  const mockData = [
    {
      columnId: 'backlog',
      title: 'Design user profile page',
      description: 'Create mockups and designs for the user profile page with settings',
      priority: 'medium' as const,
      assignees: ['user-1'],
      storyPoint: 5,
      labels: ['design', 'ui/ux'],
    },
    {
      columnId: 'backlog',
      title: 'API rate limiting',
      description: 'Implement rate limiting for API endpoints to prevent abuse',
      priority: 'low' as const,
      assignees: ['user-2'],
      storyPoint: 3,
      labels: ['backend', 'security'],
    },
    {
      columnId: 'backlog',
      title: 'Documentation updates',
      description: 'Update API documentation with new endpoints',
      priority: 'low' as const,
      assignees: ['user-3'],
      storyPoint: 2,
      labels: ['documentation'],
    },
    {
      columnId: 'todo',
      title: 'User authentication system',
      description: 'Implement JWT-based authentication with login, register, and password reset',
      priority: 'high' as const,
      assignees: ['user-1', 'user-2'],
      storyPoint: 8,
      labels: ['backend', 'security', 'critical'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      columnId: 'todo',
      title: 'Database schema migration',
      description: 'Migrate database from MongoDB to PostgreSQL with proper indexing',
      priority: 'critical' as const,
      assignees: ['user-3'],
      storyPoint: 13,
      labels: ['backend', 'database'],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      columnId: 'todo',
      title: 'Notification system',
      description: 'Build real-time notification system with WebSocket',
      priority: 'medium' as const,
      assignees: ['user-2'],
      storyPoint: 5,
      labels: ['backend', 'real-time'],
    },
    {
      columnId: 'in-progress',
      title: 'Dashboard analytics',
      description: 'Build analytics dashboard with charts, metrics, and real-time data',
      priority: 'high' as const,
      assignees: ['user-1'],
      storyPoint: 8,
      labels: ['frontend', 'analytics'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      columnId: 'in-progress',
      title: 'Profile page improvements',
      description: 'Add new features to user profile page including social links',
      priority: 'medium' as const,
      assignees: ['user-1', 'user-3'],
      storyPoint: 5,
      labels: ['frontend', 'ui/ux'],
    },
    {
      columnId: 'review',
      title: 'Payment integration',
      description: 'Integrate Stripe payment gateway with subscription management',
      priority: 'critical' as const,
      assignees: ['user-2'],
      storyPoint: 13,
      labels: ['backend', 'payment', 'critical'],
    },
    {
      columnId: 'review',
      title: 'Search functionality',
      description: 'Implement full-text search with filters and sorting',
      priority: 'high' as const,
      assignees: ['user-3'],
      storyPoint: 8,
      labels: ['backend', 'search'],
    },
    {
      columnId: 'done',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      priority: 'medium' as const,
      assignees: ['user-3'],
      storyPoint: 5,
      labels: ['devops', 'automation'],
    },
    {
      columnId: 'done',
      title: 'Email notification service',
      description: 'Send email notifications for important events using SendGrid',
      priority: 'low' as const,
      assignees: ['user-1'],
      storyPoint: 3,
      labels: ['backend', 'notifications'],
    },
    {
      columnId: 'done',
      title: 'Landing page redesign',
      description: 'Complete redesign of landing page with new branding',
      priority: 'medium' as const,
      assignees: ['user-1', 'user-2'],
      storyPoint: 8,
      labels: ['frontend', 'design'],
    },
  ];

  return mockData.map((data, index) => ({
    id: `task-${sprintId}-${index + 1}`,
    projectId,
    sprintId,
    ...data,
    status: data.columnId,
    createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  }));
}