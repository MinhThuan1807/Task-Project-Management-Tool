/**
 * Sprint entity
 */
export type Sprint = {
  _id: string;
  projectId: string;
  name: string;
  goal: string;
  maxStoryPoint: number;
  startDate: Date | string;
  endDate: Date | string;
  status: 'planned' | 'active' | 'completed';
  createdAt: Date | string;
};

/**
 * Request to create a new sprint
 */
export type CreateSprintRequest = {
  projectId: string;
  name: string;
  goal: string;
  maxStoryPoint?: number;
  startDate: Date | string;
  endDate: Date | string;
};

/**
 * Request to update sprint
 */
export type UpdateSprintRequest = {
  name?: string;
  goal?: string;
  maxStoryPoint?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: 'planned' | 'active' | 'completed';
};

/**
 * Sprint API response
 */
export type SprintResponse = {
  data: Sprint;
  message?: string;
};

/**
 * Multiple sprints API response
 */
export type SprintsResponse = {
  data: Sprint[];
  message?: string;
};

/**
 * Sprint form data for UI
 */
export type SprintFormData = {
  name: string;
  goal: string;
  maxStoryPoint: number;
  startDate: Date | string;
  endDate: Date | string;
  status: 'planned' | 'active' | 'completed';
};

/**
 * Sprint filters for queries
 */
export type SprintFilters = {
  projectId?: string;
  status?: 'planned' | 'active' | 'completed';
  startDate?: Date | string;
  endDate?: Date | string;
};

/**
 * Sprint with additional statistics
 */
export type SprintWithStats = Sprint & {
  totalTasks?: number;
  completedTasks?: number;
  storyPoint?: number;
  progress?: number;
};