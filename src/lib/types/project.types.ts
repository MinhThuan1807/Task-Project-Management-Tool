/**
 * Member in Project
 */
export type ProjectMember = {
  memberId: string;
  email: string;
  role: 'owner' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'left';
  joinAt?: Date | null;
  inviteToken?: string;
  invitedAt?: Date;
};

/**
 * Base Project entity (from backend)
 */
export type Project = {
  _id: string;
  ownerId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  members: ProjectMember[];
  // status: 'active' | 'archived';
  createdAt: string | Date;
  updatedAt?: string | Date | null;
};

/**
 * API Request types
 */
export type CreateProjectRequest = {
  name: string;
  description?: string;
  members?: Array<{
    email: string;
    role: 'member' | 'viewer';
  }>;
  imageUrl?: File;
};

export type UpdateProjectRequest = Partial<Pick<Project,
  | 'name'
  | 'description'
  // | 'status'
>> & {
  imageUrl?: File | string;
};

export type InviteMemberRequest = {
  email: string;
  role: 'owner' | 'member' | 'viewer';
  projectId: string;
};

export type AcceptInviteRequest = {
  email: string;
  token: string;
  projectId: string;
};

export type RemoveMemberRequest = {
  projectId: string;
  memberId: string;
};

export type UpdateMemberRoleRequest = {
  projectId: string;
  memberId: string;
  role: 'owner' | 'member' | 'viewer';
};

/**
 * API Response types
 */
export type ProjectResponse = {
  success: boolean;
  data: Project;
  message?: string;
};

export type ProjectsResponse = {
  success: boolean;
  data: Project[];
  message?: string;
};

/**
 * Form data types (for UI)
 */
export type ProjectFormData = {
  name: string;
  description: string;
  status: 'active' | 'archived';
  imageFile?: File | null;
};

/**
 * Query/Filter types
 */
export type ProjectFilters = {
  // status?: Project['status'];
  search?: string;
  ownedOnly?: boolean;
  joinedOnly?: boolean;
};

/**
 * Computed/Derived types (for UI display)
 */
export type ProjectWithStats = Project & {
  totalSprints: number;
  activeSprints: number;
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type TeamMember = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'member' | 'viewer';
  joinedAt: string | Date ;
};