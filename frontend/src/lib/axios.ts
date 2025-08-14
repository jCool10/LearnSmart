import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Use consistent storage keys
    const token = localStorage.getItem('accessToken') // Keep consistent with existing storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken') // Keep consistent with existing storage
        if (refreshToken) {
          const response = await api.post('/auth/refresh-tokens', {
            refreshToken,
          })

          const { data } = response.data
          const { tokens } = data

          // Update tokens in localStorage
          localStorage.setItem('accessToken', tokens.access.token)
          localStorage.setItem('refreshToken', tokens.refresh.token)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${tokens.access.token}`
          return api(originalRequest)
        }
      } catch {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API functions - Updated to match backend endpoints exactly
export const authAPI = {
  // Register new user - Match backend RegisterDto
  register: async (data: {
    email: string
    username: string
    password: string
  }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Login user - Match backend LoginDto
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  // Refresh tokens - Match backend RefreshTokenDto
  refreshTokens: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh-tokens', { refreshToken })
    return response.data
  },

  // Logout user - Match backend validation
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  },

  // Forgot password - Match backend ForgotPasswordDto
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password - Match backend ResetPasswordDto
  resetPassword: async (data: { resetPasswordToken: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  // Verify email - Match backend VerifyEmailDto
  verifyEmail: async (verifyEmailToken: string) => {
    const response = await api.post('/auth/verify-email', { verifyEmailToken })
    return response.data
  },

  // Send verification email (protected route)
  sendVerificationEmail: async () => {
    const response = await api.post('/auth/send-verification-email')
    return response.data
  },

  // Get current user - Match backend endpoint
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export default api 