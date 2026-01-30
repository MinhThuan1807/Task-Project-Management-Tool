import axiosInstance from '../axios'
import type {
  LoginCredentials,
  RegisterCredentials,
  VerifyEmailPayload,
  AuthResponse,
  UserResponse
} from '../types'

export const authApi = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<{ success: boolean }> => {
    const response = await axiosInstance.post('/auth/logout')
    return response.data
  },

  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  verifyEmail: async (data: VerifyEmailPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/verify', data)
    return response.data
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>('/users/')
    return response.data
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh-token')
    return response.data
  }
  /**
   * Update user profile
   * PUT /users/me
   */
  // updateProfile: async (data: UpdateUserProfileRequest): Promise<UserResponse> => {
  //   const formData = new FormData();

  //   if (data.displayName) formData.append('displayName', data.displayName);
  //   if (data.gender) formData.append('gender', data.gender);
  //   if (data.dob) formData.append('dob', data.dob.toString());
  //   if (data.address) formData.append('address', data.address);
  //   if (data.avatar && data.avatar instanceof File) {
  //     formData.append('avatar', data.avatar);
  //   }

  //   const response = await axiosInstance.put<UserResponse>('/users/me', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  //   return response.data;
  // },
} as const