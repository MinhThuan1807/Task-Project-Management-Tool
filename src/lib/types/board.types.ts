import { Task } from './task.types'

/**
 * Board Column Status enum
 */
export type BoardColumnStatus = 'backlog' | 'todo' | 'in_process' | 'review' | 'done';

/**
 * Base BoardColumn entity (from backend)
 */
export type BoardColumn = {
  _id: string;
  sprintId: string;
  title: BoardColumnStatus;
  taskOrderIds: string[];
  position: number;
  createdAt: string | number;
  updatedAt?: string | number | null;
};

/**
 * API Request types
 */
export type CreateBoardColumnRequest = {
  sprintId: string;
  title: string;
  position?: number;
};

export type UpdateBoardColumnRequest = Partial<Pick<BoardColumn,
  | 'title'
  | 'position'
  | 'taskOrderIds'
>>;

export type ReorderColumnsRequest = {
  sprintId: string;
  columnOrders: Array<{
    columnId: string;
    position: number;
  }>;
};

/**
 * API Response types
 */
export type BoardColumnResponse = {
  success: boolean;
  data: BoardColumn;
  message?: string;
};

export type BoardColumnsResponse = {
  success: boolean;
  data: BoardColumn[];
  message?: string;
};

/**
 * Computed/Derived types (for UI display)
 */
export type BoardColumnWithTasks = BoardColumn & {
  tasks: Task[];
  taskCount: number;
  totalStoryPoints: number;
};

export type BoardView = {
  columns: BoardColumnWithTasks[];
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

/**
 * Column configuration for Kanban
 */
export type ColumnConfig = {
  id: BoardColumnStatus;
  title: string;
  color: string;
  icon?: string;
};

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'todo', title: 'Todo', color: 'bg-blue-100' },
  { id: 'in_process', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'review', title: 'Review', color: 'bg-purple-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
]