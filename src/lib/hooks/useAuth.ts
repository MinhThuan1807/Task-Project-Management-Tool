import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/services/auth.service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '../utils'

export const authKeys = {
  user: ['auth', 'user'] as const
}

// Hook lấy current user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const response = await authApi.getCurrentUser()
      return response.data || response
    },
    retry: false
  })
}

// Hook login
export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.data.user)
      toast.success('Login successful!')
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || 'Login failed')
    }
  })
}

// Hook logout
export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    }
  })
}