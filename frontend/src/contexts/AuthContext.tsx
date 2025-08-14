'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/axios'
import { 
  AuthContextType, 
  UserDto, 
  LoginDto, 
  RegisterDto, 
  ResetPasswordDto,
  AUTH_STORAGE_KEYS,
  ApiResponse,
  AuthResponseDto
} from '@/types/auth.types'
import { authKeys } from '@/hooks/useAuthQueries'

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const queryClient = useQueryClient()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      
      try {
        const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER)
        
        if (accessToken && storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
          
          // Verify token is still valid by fetching current user
          try {
            const response: ApiResponse<UserDto> = await authAPI.getCurrentUser()
            if (response.success) {
              setUser(response.data)
              localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(response.data))
            }
          } catch (error) {
            // Token might be expired, clear auth state
            await handleLogout()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        await handleLogout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Helper function to handle logout
  const handleLogout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    setUser(null)
    setIsAuthenticated(false)
    // Clear all React Query cache on logout
    queryClient.clear()
  }

  // Login function
  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      const response: ApiResponse<AuthResponseDto> = await authAPI.login(credentials)
      
      if (response.success) {
        const { user: userData, tokens } = response.data
        
        // Store tokens and user data
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.access.token)
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh.token)
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({ queryKey: authKeys.user() })
        // Invalidate all queries that might depend on auth state
        queryClient.invalidateQueries()
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Register function
  const register = async (userData: RegisterDto): Promise<void> => {
    try {
      const response: ApiResponse<AuthResponseDto> = await authAPI.register(userData)
      
      if (response.success) {
        const { user: newUser, tokens } = response.data
        
        // Store tokens and user data
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.access.token)
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh.token)
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser))
        
        // Update state
        setUser(newUser)
        setIsAuthenticated(true)
        
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({ queryKey: authKeys.user() })
        // Invalidate all queries that might depend on auth state
        queryClient.invalidateQueries()
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Register error:', error)
      throw error
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
      
      if (refreshToken) {
        // Call backend logout API
        await authAPI.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API call fails
    } finally {
      await handleLogout()
    }
  }

  // Refresh tokens function
  const refreshTokens = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response: ApiResponse<AuthResponseDto> = await authAPI.refreshTokens(refreshToken)
      
      if (response.success) {
        const { tokens } = response.data
        
        // Update stored tokens
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.access.token)
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh.token)
      } else {
        throw new Error(response.message || 'Token refresh failed')
      }
    } catch (error: any) {
      console.error('Token refresh error:', error)
      await handleLogout()
      throw error
    }
  }

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const response: ApiResponse<any> = await authAPI.forgotPassword(email)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send password reset email')
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  // Reset password function
  const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
    try {
      const response: ApiResponse<any> = await authAPI.resetPassword(data)
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed')
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Verify email function
  const verifyEmail = async (token: string): Promise<void> => {
    try {
      const response: ApiResponse<any> = await authAPI.verifyEmail(token)
      
      if (response.success && user) {
        // Update user's email verification status
        const updatedUser = { ...user, isEmailVerified: true }
        setUser(updatedUser)
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
        
        // Invalidate current user query to reflect updated verification status
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      } else if (!response.success) {
        throw new Error(response.message || 'Email verification failed')
      }
    } catch (error: any) {
      console.error('Verify email error:', error)
      throw error
    }
  }

  // Send verification email function
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      const response: ApiResponse<any> = await authAPI.sendVerificationEmail()
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send verification email')
      }
    } catch (error: any) {
      console.error('Send verification email error:', error)
      throw error
    }
  }

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerificationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext