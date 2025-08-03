import {
  userRepository,
  tokenRepository,
  categoryRepository,
  roadmapRepository,
  enrollmentRepository,
  progressRepository
} from '../repositories'

// Base classes and types
export { BaseService, ServiceConfig } from './base.service'

// Services
export { UserService, CreateUserDto, UpdateUserDto } from './user.service'
export { TokenService, CreateTokenDto, UpdateTokenDto } from './token.service'
export { AuthService, AuthTokens } from './auth.service'
export { EmailService } from './email.service'
export { CategoryService } from './category.service'
export { RoadmapService } from './roadmap.service'
export { EnrollmentService } from './enrollment.service'
export { ProgressService } from './progress.service'

// Service instances with dependency injection
import { UserService } from './user.service'
import { TokenService } from './token.service'
import { AuthService } from './auth.service'
import { EmailService } from './email.service'
import { CategoryService } from './category.service'
import { RoadmapService } from './roadmap.service'
import { EnrollmentService } from './enrollment.service'
import { ProgressService } from './progress.service'

export const userService = new UserService(userRepository, tokenRepository)
export const tokenService = new TokenService(tokenRepository, userRepository)
export const authService = new AuthService()
export const emailService = new EmailService()
export const categoryService = new CategoryService()
export const roadmapService = new RoadmapService()
export const enrollmentService = new EnrollmentService()
export const progressService = new ProgressService()

// Note: Legacy interfaces like LoginCredentials, RegisterData have been replaced with DTOs in types/dto.types.ts
