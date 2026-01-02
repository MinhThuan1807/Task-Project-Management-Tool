import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { TaskCard } from './task-card';

type KanbanColumnProps = {
  column: {
    id: string;
    title: string;
    color: string;
  };
  tasks: Task[];
  onTaskClick: (task: Task) => void;
};

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-80 flex flex-col">
      <div className={`${column.color} px-4 py-3 rounded-t-lg shadow-sm border-b-2 border-gray-300`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-900">
            {column.title} <span className="text-gray-600">({tasks.length})</span>
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 bg-white border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-lg min-h-[500px] shadow-sm"
      >
        <ScrollArea className="h-full">
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="p-3 space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">No tasks</p>
                  <p className="text-xs text-gray-400 mt-1">Drag tasks here or click + to add</p>
                </div>
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}