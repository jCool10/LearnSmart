'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/axios'
import { useAuth } from '@/contexts/AuthContext'
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  ApiResponse,
  AuthResponseDto,
  UserDto,
} from '@/types/auth.types'

// Query keys for consistent caching
export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
  profile: ['auth', 'profile'] as const,
} as const

// Hook for current user query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: async (): Promise<UserDto> => {
      const response: ApiResponse<UserDto> = await authAPI.getCurrentUser()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user data')
      }
      return response.data
    },
    enabled: isAuthenticated, // Only run if user is authenticated
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Hook for login mutation
export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { login: authLogin } = useAuth()
  
  return useMutation({
    mutationFn: async (credentials: LoginDto): Promise<AuthResponseDto> => {
      // Use auth context login function
      await authLogin(credentials)
      
      // Return data for consistency (auth context handles storage)
      const response: ApiResponse<UserDto> = await authAPI.getCurrentUser()
      return {
        user: response.data,
        tokens: {
          access: { token: '', expires: '' },
          refresh: { token: '', expires: '' }
        }
      }
    },
    onSuccess: (data) => {
      // Update cache with user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data.user)
      
      // Redirect to dashboard or intended page
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
      sessionStorage.removeItem('redirectAfterLogin')
      router.push(redirectTo)
    },
    onError: (error: any) => {
      console.error('Login mutation error:', error)
    },
  })
}

// Hook for register mutation
export const useRegister = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { register: authRegister } = useAuth()
  
  return useMutation({
    mutationFn: async (userData: RegisterDto): Promise<AuthResponseDto> => {
      // Use auth context register function
      await authRegister(userData)
      
      // Return data for consistency
      const response: ApiResponse<UserDto> = await authAPI.getCurrentUser()
      return {
        user: response.data,
        tokens: {
          access: { token: '', expires: '' },
          refresh: { token: '', expires: '' }
        }
      }
    },
    onSuccess: (data) => {
      // Update cache with user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data.user)
      
      // Redirect to dashboard or email verification prompt
      if (!data.user.isEmailVerified) {
        router.push('/verify-email')
      } else {
        router.push('/dashboard')
      }
    },
    onError: (error: any) => {
      console.error('Register mutation error:', error)
    },
  })
}

// Hook for logout mutation
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout: authLogout } = useAuth()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await authLogout()
    },
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: ['auth'] })
      queryClient.clear() // Optionally clear all cache
      
      // Redirect to login page
      router.push('/login')
    },
    onError: (error: any) => {
      console.error('Logout mutation error:', error)
      // Still redirect even if logout API fails
      queryClient.removeQueries({ queryKey: ['auth'] })
      router.push('/login')
    },
  })
}

// Hook for forgot password mutation
export const useForgotPassword = () => {
  const { forgotPassword } = useAuth()
  
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      await forgotPassword(email)
    },
    onError: (error: any) => {
      console.error('Forgot password mutation error:', error)
    },
  })
}

// Hook for reset password mutation
export const useResetPassword = () => {
  const router = useRouter()
  const { resetPassword } = useAuth()
  
  return useMutation({
    mutationFn: async (data: ResetPasswordDto): Promise<void> => {
      await resetPassword(data)
    },
    onSuccess: () => {
      // Redirect to login page after successful password reset
      router.push('/login?message=password-reset-success')
    },
    onError: (error: any) => {
      console.error('Reset password mutation error:', error)
    },
  })
}

// Hook for verify email mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient()
  const { verifyEmail, user } = useAuth()
  
  return useMutation({
    mutationFn: async (token: string): Promise<void> => {
      await verifyEmail(token)
    },
    onSuccess: () => {
      // Update user cache to reflect email verification
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true }
        queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, updatedUser)
      }
    },
    onError: (error: any) => {
      console.error('Verify email mutation error:', error)
    },
  })
}

// Hook for send verification email mutation
export const useSendVerificationEmail = () => {
  const { sendVerificationEmail } = useAuth()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await sendVerificationEmail()
    },
    onError: (error: any) => {
      console.error('Send verification email mutation error:', error)
    },
  })
}

// Hook for refresh tokens mutation
export const useRefreshTokens = () => {
  const { refreshTokens } = useAuth()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await refreshTokens()
    },
    onError: (error: any) => {
      console.error('Refresh tokens mutation error:', error)
    },
  })
}

// Combined hook for common auth operations
export const useAuthOperations = () => {
  const login = useLogin()
  const register = useRegister()
  const logout = useLogout()
  const forgotPassword = useForgotPassword()
  const resetPassword = useResetPassword()
  const verifyEmail = useVerifyEmail()
  const sendVerificationEmail = useSendVerificationEmail()
  const currentUser = useCurrentUser()
  
  return {
    // Queries
    currentUser,
    
    // Mutations
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerificationEmail,
    
    // Loading states
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending,
    isSendingForgotPassword: forgotPassword.isPending,
    isResettingPassword: resetPassword.isPending,
    isVerifyingEmail: verifyEmail.isPending,
    isSendingVerificationEmail: sendVerificationEmail.isPending,
    
    // Error states
    loginError: login.error,
    registerError: register.error,
    logoutError: logout.error,
    forgotPasswordError: forgotPassword.error,
    resetPasswordError: resetPassword.error,
    verifyEmailError: verifyEmail.error,
    sendVerificationEmailError: sendVerificationEmail.error,
    
    // Success states
    isLoginSuccess: login.isSuccess,
    isRegisterSuccess: register.isSuccess,
    isLogoutSuccess: logout.isSuccess,
    isForgotPasswordSuccess: forgotPassword.isSuccess,
    isResetPasswordSuccess: resetPassword.isSuccess,
    isVerifyEmailSuccess: verifyEmail.isSuccess,
    isSendVerificationEmailSuccess: sendVerificationEmail.isSuccess,
  }
}