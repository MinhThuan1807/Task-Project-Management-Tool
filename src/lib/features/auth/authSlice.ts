import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'
import { UpdateUserProfileRequest, User } from '@/lib/types'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  currentUser: User | null
}

interface SignInFormData {
  email: string
  password: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'users/login',
  async (data: SignInFormData) => {
    try {
      const response = await axiosInstance.post('/auth/login', data)
      return response.data
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
)

export const logoutUserAPI = createAsyncThunk(
  'users/logout',
  async (_) => {
    try {
      const response = await axiosInstance.post('/auth/logout')
      toast.success('Logged out successfully')
      return response.data
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
)

export const getCurrentUserAPI = createAsyncThunk(
  'users/getCurrentUser',
  async (_) => {
    try {
      const response = await axiosInstance.get('/users/')
      return response.data
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,

  // Synchronous reducers
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    // Manual logout (khi token expire)
    resetAuth: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    // Check auth
    checkAuth: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.currentUser = action.payload
        state.isAuthenticated = true
      } else {
        state.currentUser = null
        state.isAuthenticated = false
      }
    },
    // ✅ Thêm action để update user profile
    updateUserProfile: (state, action: PayloadAction<UpdateUserProfileRequest>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        }
      }
    },
    // ✅ Thêm action để update avatar
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.avatar = action.payload
      }
    }
  },

  // Asynchronous reducers
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.isLoading = false

        const userData = action.payload.data
        state.currentUser = {
          _id: userData._id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          avatar: userData.avatar,
          gender: userData.gender,
          isActive: userData.isActive,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        }
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutUserAPI.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.isLoading = false
        state.currentUser = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUserAPI.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
        state.isAuthenticated = false
      })
      // Get Current User
      .addCase(getCurrentUserAPI.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUserAPI.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.data
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUserAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.currentUser = null
      })
  }
})

export const {
  resetAuth,
  clearError,
  checkAuth,
  updateUserProfile,
  updateUserAvatar
} = userSlice.actions
export const selectCurrentUser = (state: { user: AuthState }) =>
  state.user.currentUser
export const selectIsAuthenticated = (state: { user: AuthState }) =>
  state.user.isAuthenticated
export const selectIsLoading = (state: { user: AuthState }) =>
  state.user.isLoading

export default userSlice.reducer