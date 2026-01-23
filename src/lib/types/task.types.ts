/**
 * Comment in Task
 */
export type Comment = {
  memberId: string;
  memberDisplayName: string;
  memberAvatar?: string;
  content: string;
  createdAt: string | number;
};

/**
 * Attachment in Task
 */
export type Attachment = {
  fileName: string;
  fileType: string;
  fileUrl: string;
  publicId?: string;
  createdAt: string | number;
};

/**
 * Base Task entity (from backend)
 */
export type Task = {
  _id: string;
  sprintId: string;
  boardColumnId: string;
  title: string;
  description?: string;
  labels?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical' | string ;
  storyPoint?: number;
  dueDate?: string | Date;
  assigneeIds?: string[];
  comments?: Comment[];
  attachments?: Attachment[];
  createdAt: string | Date;
  updatedAt?: string | Date;
};

/**
 * API Request types
 */
export type CreateTaskRequest = {
  sprintId: string;
  boardColumnId?: string;
  title: string;
  description?: string;
  labels?: Task['labels'];
  priority?: Task['priority'];
  storyPoint?: number;
  dueDate?: Date;
  assigneeIds?: string[];
};

export type UpdateTaskRequest = Partial<Omit<CreateTaskRequest, 'sprintId'>>;

export type MoveTaskRequest = {
  taskId: string;
  sourceBoardColumnId: string;
  destinationBoardColumnId: string;
  newPosition: number;
};

export type AddCommentRequest = {
  taskId: string;
  content: string;
};

export type AddAttachmentRequest = {
  taskId: string;
  file: File;
};

/**
 * API Response types
 */
export type TaskResponse = {
  success: boolean;
  data: Task;
  message?: string;
};

export type TasksResponse = {
  success: boolean;
  data: Task[];
  message?: string;
};

/**
 * Form data types (for UI)
 */
export type TaskFormData = {
  title: string;
  description: string;
  priority: Task['priority'];
  storyPoint: number;
  dueDate: Date;
  labels: string[];
  assigneeIds: string[];
};

/**
 * Query/Filter types
 */
export type TaskFilters = {
  sprintId?: string;
  boardColumnId?: string;
  priority?: Task['priority'][];
  labels?: Task['labels'];
  assigneeIds?: string[];
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
};

/**
 * Computed/Derived types (for UI display)
 */
export type TaskWithRelations = Task & {
  assignees?: Array<{
    _id: string;
    displayName: string;
    avatar?: string;
  }>;
  commentCount: number;
  attachmentCount: number;
  isOverdue: boolean;
};

/**
 * Drag & Drop types
 */
export type DraggedTask = {
  task: Task;
  sourceColumnId: string;
};