import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../lib/types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  MoreVertical,
  MessageSquare,
  Paperclip,
  Calendar,
  GripVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getPriorityColor, formatDate } from '../../lib/utils';

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
};

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // Mock comment and attachment counts based on task id
  const commentCount = Math.floor(Math.random() * 10);
  const attachmentCount = Math.floor(Math.random() * 5);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white ${
        isDragging ? 'shadow-2xl rotate-3 scale-105 ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <h4 className="text-sm text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Move to...</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority & Story Points */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className={getPriorityColor(task.priority)} style={{ fontSize: '0.65rem' }}>
            {task.priority}
          </Badge>
          {task.storyPoint && task.storyPoint > 0 && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
              style={{ fontSize: '0.65rem' }}
            >
              {task.storyPoint} SP
            </Badge>
          )}
          {task.labels?.slice(0, 2).map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="bg-gray-50 text-gray-700"
              style={{ fontSize: '0.65rem' }}
            >
              {label}
            </Badge>
          ))}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <Calendar className="w-3 h-3" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees?.map((assignee) => (
              <Avatar key={assignee} className="w-6 h-6 border-2 border-white ring-1 ring-gray-200">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`} />
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
            ))}
            {(!task.assignees || task.assignees.length === 0) && (
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-200">?</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{commentCount}</span>
              </div>
            )}
            {attachmentCount > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{attachmentCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}