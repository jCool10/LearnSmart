// Base interfaces
export interface BaseDto {
  id?: string
  createdAt?: string
  updatedAt?: string
}

// Auth DTOs - Matching backend types exactly
export interface RegisterDto {
  email: string
  password: string
  username: string // Backend uses 'username' not 'name'
}

export interface LoginDto {
  email: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  resetPasswordToken: string
  newPassword: string
}

export interface VerifyEmailDto {
  verifyEmailToken: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

// Response types
export interface TokensDto {
  access: {
    token: string
    expires: string
  }
  refresh: {
    token: string
    expires: string
  }
}

export interface UserDto extends BaseDto {
  username: string // Backend uses username
  email: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
}

export interface AuthResponseDto {
  user: UserDto
  tokens: TokensDto
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta: {
    timestamp: string
    requestId?: string
  }
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Array<{
    field: string
    message: string
    value?: any
  }>
  data?: any
  meta: {
    timestamp: string
    requestId?: string
  }
}

// Auth context types
export interface AuthContextType {
  user: UserDto | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginDto) => Promise<void>
  register: (userData: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (data: ResetPasswordDto) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

// Form validation types for Zod schemas
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export interface VerifyEmailFormData {
  token: string
}

// Auth hook return types
export interface UseAuthReturn extends AuthContextType {}

export interface UseLoginReturn {
  login: (data: LoginDto) => Promise<void>
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface UseRegisterReturn {
  register: (data: RegisterDto) => Promise<void>
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface UseForgotPasswordReturn {
  forgotPassword: (email: string) => Promise<void>
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

export interface UseResetPasswordReturn {
  resetPassword: (data: ResetPasswordDto) => Promise<void>
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

// Storage keys constants - Keep consistent with axios interceptor
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken', 
  USER: 'user',
} as const