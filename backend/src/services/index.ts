import { userRepository, tokenRepository } from '../repositories'

// Base classes and types
export { BaseService, ServiceConfig } from './base.service'

// Services
export { UserService, CreateUserDto, UpdateUserDto } from './user.service'
export { TokenService, CreateTokenDto, UpdateTokenDto } from './token.service'
export { AuthService, AuthTokens } from './auth.service'
export { EmailService } from './email.service'

// Service instances with dependency injection
import { UserService } from './user.service'
import { TokenService } from './token.service'
import { AuthService } from './auth.service'
import { EmailService } from './email.service'

export const userService = new UserService(userRepository, tokenRepository)
export const tokenService = new TokenService(tokenRepository, userRepository)
export const authService = new AuthService()
export const emailService = new EmailService()

// Note: Legacy interfaces like LoginCredentials, RegisterData have been replaced with DTOs in types/dto.types.ts
