/**
 * Base User entity (from backend)
 */
export type User = {
  _id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  avatarPublicId?: string;
  gender?: 'male' | 'female' | 'other' | string;
  dob?: Date | string;
  address?: string | null;
  createdAt: string | number;
  updatedAt?: string | number | null;
};

/**
 * API Response types
 */
export type UserResponse = {
  success: boolean;
  data: User;
  message?: string;
};

export type UsersResponse = {
  success: boolean;
  data: User[];
  message?: string;
};

/**
 * Auth-related types
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  displayName?: string;
};

export type VerifyEmailPayload = {
  email: string;
  token: string;
};

export type AuthResponse = {
  success: boolean;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
  message?: string;
};

/**
 * User profile update types
 */
export type UpdateUserProfileRequest = Partial<Pick<User,
  | 'displayName'
  | 'avatar'
  | 'gender'
  | 'dob'
  | 'address'
>>;

/**
 * User statistics (for UI)
 */
export type UserStats = {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalTeams: number;
};