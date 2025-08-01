// Base interfaces
export interface BaseDto {
  id?: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginationDto {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponseDto<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Auth DTOs
export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
}

export interface VerifyEmailDto {
  token: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface AuthResponseDto {
  user: UserDto
  tokens: TokensDto
}

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

// User DTOs
export interface UserDto extends BaseDto {
  name: string
  email: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: 'user' | 'admin'
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export interface GetUsersQueryDto extends PaginationDto {
  role?: 'user' | 'admin'
  isEmailVerified?: boolean
  search?: string
}

// Token DTOs
export interface TokenDto extends BaseDto {
  token: string
  type: 'refresh' | 'resetPassword' | 'verifyEmail'
  expires: string
  blacklisted: boolean
  userId: string
}

export interface CreateTokenDto {
  token: string
  userId: string
  type: 'refresh' | 'resetPassword' | 'verifyEmail'
  expires: Date
  blacklisted?: boolean
}

export interface GetTokensQueryDto extends PaginationDto {
  type?: 'refresh' | 'resetPassword' | 'verifyEmail'
  blacklisted?: boolean
  userId?: string
}

// Common parameter DTOs
export interface IdParamDto {
  id: string
}

export interface UserIdParamDto {
  userId: string
}

export interface TokenParamDto {
  token: string
}

// Health check DTOs
export interface HealthCheckDto {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  version: string
  environment: string
  database?: {
    status: 'connected' | 'disconnected'
    responseTime?: number
  }
  memory?: {
    used: number
    total: number
    percentage: number
  }
}

// Error DTOs
export interface ErrorDto {
  field: string
  message: string
  value?: any
}

export interface ValidationErrorDto {
  message: string
  errors: ErrorDto[]
}

// File upload DTOs (for future use)
export interface FileUploadDto {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

// Generic query DTOs
export interface SearchQueryDto extends PaginationDto {
  q?: string // search query
  fields?: string[] // fields to search in
}

export interface DateRangeDto {
  startDate?: string
  endDate?: string
}

export interface GetByDateRangeQueryDto extends PaginationDto, DateRangeDto {}

// Response wrapper DTOs
export interface SuccessResponseDto<T = any> {
  success: true
  message: string
  data: T
  meta: {
    timestamp: string
    requestId?: string
    pagination?: PaginatedResponseDto<any>['pagination']
  }
}

export interface ErrorResponseDto {
  success: false
  message: string
  errors?: ErrorDto[]
  data?: any
  meta: {
    timestamp: string
    requestId?: string
  }
}

// Utility types for partial updates
export type PartialDto<T> = Partial<T>
export type RequiredDto<T, K extends keyof T> = T & Required<Pick<T, K>>
export type OmitDto<T, K extends keyof T> = Omit<T, K>

// Transform utilities
export type CreateDtoFromEntity<T extends BaseDto> = OmitDto<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateDtoFromEntity<T extends BaseDto> = PartialDto<OmitDto<T, 'id' | 'createdAt' | 'updatedAt'>>
