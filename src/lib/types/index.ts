// User types
export type {
  User,
  UserResponse,
  UsersResponse,
  LoginCredentials,
  RegisterCredentials,
  VerifyEmailPayload,
  AuthResponse,
  UpdateUserProfileRequest,
  UserStats
} from './user.types'

// Project types
export type {
  ProjectMember,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  InviteMemberRequest,
  AcceptInviteRequest,
  RemoveMemberRequest,
  UpdateMemberRoleRequest,
  ProjectResponse,
  ProjectsResponse,
  ProjectFormData,
  ProjectFilters,
  ProjectWithStats,
  TeamMember
} from './project.types'

// Sprint types
export type {
  Sprint,
  CreateSprintRequest,
  UpdateSprintRequest,
  SprintResponse,
  SprintsResponse,
  SprintFormData,
  SprintFilters,
  SprintWithStats
} from './sprint.types'

// Task types
export type {
  Comment,
  Attachment,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
  AddCommentRequest,
  AddAttachmentRequest,
  TaskResponse,
  TasksResponse,
  TaskFormData,
  TaskFilters,
  TaskWithRelations,
  DraggedTask
} from './task.types'

// Board types
export type {
  BoardColumnStatus,
  BoardColumn,
  CreateBoardColumnRequest,
  UpdateBoardColumnRequest,
  ReorderColumnsRequest,
  BoardColumnResponse,
  BoardColumnsResponse,
  BoardColumnWithTasks,
  BoardView,
  ColumnConfig
} from './board.types'

export { DEFAULT_COLUMNS } from './board.types'

// Chat types
export type {
  Message,
  // Channel,
  // SendMessageRequest,
  // CreateChannelRequest,
  // MessageResponse,
  MessagesResponse,
  // ChannelResponse,
  // ChannelsResponse,
  // ChatEvent
} from './chat.types'