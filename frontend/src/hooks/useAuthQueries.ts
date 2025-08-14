import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/axios'
import { 
  LoginDto, 
  RegisterDto, 
  ResetPasswordDto, 
  UserDto, 
  AuthResponseDto,
  ApiResponse 
} from '@/types/auth.types'
import { useAuth } from '@/contexts/AuthContext'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  currentUser: () => [...authKeys.user(), 'current'] as const,
}

// Get current user query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authAPI.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()
  const { login: contextLogin } = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginDto) => {
      // Use context login which handles token storage and state updates
      await contextLogin(credentials)
      return { success: true }
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      // Invalidate all queries that might depend on auth state
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      console.error('Login mutation error:', error)
    },
  })
}

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()
  const { register: contextRegister } = useAuth()

  return useMutation({
    mutationFn: async (userData: RegisterDto) => {
      // Use context register which handles token storage and state updates
      await contextRegister(userData)
      return { success: true }
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      // Invalidate all queries that might depend on auth state
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      console.error('Register mutation error:', error)
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout: contextLogout } = useAuth()

  return useMutation({
    mutationFn: async () => {
      await contextLogout()
      return { success: true }
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout mutation error:', error)
      // Even if logout fails on server, clear local cache
      queryClient.clear()
    },
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  const { forgotPassword: contextForgotPassword } = useAuth()

  return useMutation({
    mutationFn: async (email: string) => {
      await contextForgotPassword(email)
      return { success: true }
    },
    onError: (error) => {
      console.error('Forgot password mutation error:', error)
    },
  })
}

// Reset password mutation
export const useResetPassword = () => {
  const { resetPassword: contextResetPassword } = useAuth()

  return useMutation({
    mutationFn: async (data: ResetPasswordDto) => {
      await contextResetPassword(data)
      return { success: true }
    },
    onError: (error) => {
      console.error('Reset password mutation error:', error)
    },
  })
}

// Verify email mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient()
  const { verifyEmail: contextVerifyEmail } = useAuth()

  return useMutation({
    mutationFn: async (token: string) => {
      await contextVerifyEmail(token)
      return { success: true }
    },
    onSuccess: () => {
      // Refetch current user to get updated verification status
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
    onError: (error) => {
      console.error('Verify email mutation error:', error)
    },
  })
}

// Send verification email mutation
export const useSendVerificationEmail = () => {
  const { sendVerificationEmail: contextSendVerificationEmail } = useAuth()

  return useMutation({
    mutationFn: async () => {
      await contextSendVerificationEmail()
      return { success: true }
    },
    onError: (error) => {
      console.error('Send verification email mutation error:', error)
    },
  })
}

// Refresh tokens mutation (usually handled automatically by interceptor)
export const useRefreshTokens = () => {
  const queryClient = useQueryClient()
  const { refreshTokens: contextRefreshTokens } = useAuth()

  return useMutation({
    mutationFn: async () => {
      await contextRefreshTokens()
      return { success: true }
    },
    onSuccess: () => {
      // Invalidate current user query to refetch with new token
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
    onError: (error) => {
      console.error('Refresh tokens mutation error:', error)
      // On refresh failure, clear all data and redirect to login
      queryClient.clear()
    },
  })
}

// Combined auth status hook
export const useAuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { data: currentUserData, isLoading: isLoadingCurrentUser } = useCurrentUser()

  return {
    user: currentUserData?.data || user,
    isAuthenticated,
    isLoading: isLoading || isLoadingCurrentUser,
    isVerified: user?.isEmailVerified || false,
  }
}