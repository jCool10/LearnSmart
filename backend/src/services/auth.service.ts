import { prisma } from '@/configs/database.config'
import { BadRequestError, NotFoundError, UnauthorizedError, ConflictError } from '@/cores/error.handler'
import { Request } from 'express'
import bcrypt from 'bcrypt'
import moment from 'moment'
import { configs } from '@/configs'
import jwt from 'jsonwebtoken'
import { TokenType, User } from 'generated/prisma'
import { TokenService } from './token.service'
import { UserService } from './user.service'
import { EmailService } from './email.service'
import { tokenRepository, userRepository } from '@/repositories'
import logger from '@/configs/logger.config'
import { AUTH, TOKEN_TYPES } from '@/constants'
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  AuthResponseDto,
  TokensDto,
  UserDto
} from '@/types/dto.types'

export interface AuthTokens {
  access: {
    token: string
    expires: Date
  }
  refresh: {
    token: string
    expires: Date
  }
}

export class AuthService {
  private tokenService: TokenService
  private userService: UserService
  private emailService: EmailService

  constructor() {
    this.tokenService = new TokenService(tokenRepository, userRepository)
    this.userService = new UserService(userRepository, tokenRepository)
    this.emailService = new EmailService()
  }

  // Private utility methods
  private async saveToken(token: string, userId: string, expires: moment.Moment, type: TokenType, blacklisted = false) {
    return this.tokenService.create({
      token,
      userId,
      expires: expires.toDate(),
      type,
      blacklisted
    })
  }

  private generateToken(userId: string, expires: moment.Moment, type: string, secret = configs.jwt.secret): string {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
      iss: AUTH.JWT.ISSUER,
      aud: AUTH.JWT.AUDIENCE
    }
    return jwt.sign(payload, secret, { algorithm: AUTH.JWT.ALGORITHM })
  }

  private async generateAuthTokens(user: User): Promise<AuthTokens> {
    const accessTokenExpires = moment().add(configs.jwt.accessExpirationMinutes, 'minutes')
    const accessToken = this.generateToken(user.id, accessTokenExpires, 'access')

    const refreshTokenExpires = moment().add(configs.jwt.refreshExpirationDays, 'days')
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH)

    await this.saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH)

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    }
  }

  private async isPasswordMatch(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  private validateEmail(email: string): void {
    if (!email) {
      throw new BadRequestError('Email is required')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new BadRequestError('Invalid email format')
    }
  }

  private validatePassword(password: string): void {
    if (!password) {
      throw new BadRequestError('Password is required')
    }
    if (password.length < AUTH.PASSWORD.MIN_LENGTH) {
      throw new BadRequestError(`Password must be at least ${AUTH.PASSWORD.MIN_LENGTH} characters long`)
    }
    if (!AUTH.PASSWORD.REGEX.test(password)) {
      throw new BadRequestError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
    }
  }

  // Public authentication methods
  async loginUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    this.validateEmail(email)
    this.validatePassword(password)

    const user = await this.userService.getUserByEmailWithPassword(email.toLowerCase().trim())
    if (!user || !(await this.isPasswordMatch(user, password))) {
      throw new UnauthorizedError('Incorrect email or password')
    }

    logger.info('User login successful', { userId: user.id, email: user.email })
    return user
  }

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerData

    this.validateEmail(email)
    this.validatePassword(password)

    if (!name || name.trim().length < 2) {
      throw new BadRequestError('Name must be at least 2 characters long')
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await this.userService.getUserByEmail(normalizedEmail)
    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    // Create user using UserService which handles password hashing
    const newUser = await this.userService.create({
      email: normalizedEmail,
      password,
      name: name.trim()
    })

    logger.info('User registered successfully', { userId: newUser.id, email: newUser.email })

    const tokens = await this.generateAuthTokens(newUser)

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString()
      },
      tokens: {
        access: {
          token: tokens.access.token,
          expires: tokens.access.expires.toISOString()
        },
        refresh: {
          token: tokens.refresh.token,
          expires: tokens.refresh.expires.toISOString()
        }
      }
    }
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginData
    const user = await this.loginUserWithEmailAndPassword(email, password)
    const tokens = await this.generateAuthTokens(user)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      tokens: {
        access: {
          token: tokens.access.token,
          expires: tokens.access.expires.toISOString()
        },
        refresh: {
          token: tokens.refresh.token,
          expires: tokens.refresh.expires.toISOString()
        }
      }
    }
  }

  async logout(refreshTokenData: RefreshTokenDto): Promise<void> {
    const { refreshToken } = refreshTokenData

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required')
    }

    const refreshTokenDoc = await this.tokenService.getTokenByToken(refreshToken)
    if (!refreshTokenDoc || refreshTokenDoc.type !== TOKEN_TYPES.REFRESH || refreshTokenDoc.blacklisted) {
      throw new NotFoundError('Valid refresh token not found')
    }

    await this.tokenService.delete(refreshTokenDoc.id)
    logger.info('User logged out successfully', { userId: refreshTokenDoc.userId })
  }

  async refreshTokens(refreshTokenData: RefreshTokenDto): Promise<TokensDto> {
    const { refreshToken } = refreshTokenData

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required')
    }

    try {
      const verifyResult = await this.tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH)

      if (!verifyResult.valid || !verifyResult.token) {
        throw new UnauthorizedError('Invalid refresh token')
      }

      const user = await this.userService.findById(verifyResult.token.userId)

      // Delete old refresh token
      await this.tokenService.delete(verifyResult.token.id)

      // Generate new tokens
      const tokens = await this.generateAuthTokens(user)

      logger.info('Tokens refreshed successfully', { userId: user.id })

      return {
        access: {
          token: tokens.access.token,
          expires: tokens.access.expires.toISOString()
        },
        refresh: {
          token: tokens.refresh.token,
          expires: tokens.refresh.expires.toISOString()
        }
      }
    } catch (error: any) {
      logger.error('Token refresh failed', { error: error.message })
      throw new UnauthorizedError('Please authenticate')
    }
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordDto) {
    const { email } = forgotPasswordData
    this.validateEmail(email)

    const user = await this.userService.getUserByEmail(email.toLowerCase().trim())
    if (!user) {
      // Don't reveal if email exists or not for security
      return 'If your email is registered, you will receive password reset instructions'
    }

    const resetToken = await this.generateResetPasswordToken(user.id)
    await this.emailService.sendResetPasswordEmail(user.email, resetToken)

    logger.info('Password reset email sent', { userId: user.id, email: user.email })
    return 'If your email is registered, you will receive password reset instructions'
  }

  async resetPassword(resetPasswordData: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordData

    if (!token) {
      throw new BadRequestError('Reset token is required')
    }

    this.validatePassword(password)

    try {
      const verifyResult = await this.tokenService.verifyToken(token, TOKEN_TYPES.RESET_PASSWORD)

      if (!verifyResult.valid || !verifyResult.token) {
        throw new BadRequestError('Invalid or expired reset token')
      }

      const user = await this.userService.findById(verifyResult.token.userId)

      // Update password using UserService (which handles hashing)
      await this.userService.update(user.id, { password })

      // Delete all reset password tokens for this user
      await this.tokenService.deleteTokensByUserId(user.id)

      logger.info('Password reset successful', { userId: user.id })
      return { message: 'Password reset successful' }
    } catch (error: any) {
      logger.error('Password reset failed', { error: error.message })
      throw new BadRequestError('Invalid or expired reset token')
    }
  }

  async sendVerificationEmail(user: User) {
    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified')
    }

    const verifyToken = await this.generateVerifyEmailToken(user.id)
    await this.emailService.sendVerificationEmail(user.email, verifyToken)

    logger.info('Verification email sent', { userId: user.id, email: user.email })
    return 'Verification email sent'
  }

  async verifyEmail(verifyEmailData: VerifyEmailDto) {
    const { token } = verifyEmailData

    if (!token) {
      throw new BadRequestError('Verification token is required')
    }

    try {
      const verifyResult = await this.tokenService.verifyToken(token, TOKEN_TYPES.VERIFY_EMAIL)

      if (!verifyResult.valid || !verifyResult.token) {
        throw new BadRequestError('Invalid or expired verification token')
      }

      const user = await this.userService.findById(verifyResult.token.userId)

      if (user.isEmailVerified) {
        throw new BadRequestError('Email is already verified')
      }

      // Mark email as verified
      await this.userService.update(user.id, { isEmailVerified: true })

      // Delete verification tokens for this user
      await this.tokenService.deleteTokensByUserId(user.id)

      logger.info('Email verified successfully', { userId: user.id })
      return 'Email verified successfully'
    } catch (error: any) {
      logger.error('Email verification failed', { error: error.message })
      throw new BadRequestError('Invalid or expired verification token')
    }
  }

  // Private token generation methods
  private async generateResetPasswordToken(userId: string) {
    const expires = moment().add(10, 'minutes') // 10 minutes expiry
    const resetPasswordToken = this.generateToken(userId, expires, TOKEN_TYPES.RESET_PASSWORD)
    await this.saveToken(resetPasswordToken, userId, expires, TOKEN_TYPES.RESET_PASSWORD)
    return resetPasswordToken
  }

  private async generateVerifyEmailToken(userId: string): Promise<string> {
    const expires = moment().add(24, 'hours') // 24 hours expiry
    const verifyEmailToken = this.generateToken(userId, expires, TOKEN_TYPES.VERIFY_EMAIL)
    await this.saveToken(verifyEmailToken, userId, expires, TOKEN_TYPES.VERIFY_EMAIL)
    return verifyEmailToken
  }

  // Add getCurrentUser method after the existing methods
  async getCurrentUser(userId: string): Promise<UserDto> {
    const user = await this.userService.findById(userId)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    }
  }

  // Legacy methods for backward compatibility - TODO: Remove after migration
  async registerLegacy(req: Request) {
    const { email, password, username } = req.body
    return this.register({ email, password, name: username })
  }

  async loginLegacy(req: Request) {
    const { email, password } = req.body
    return this.login({ email, password })
  }

  async logoutLegacy(req: Request) {
    const { refreshToken } = req.body
    return this.logout({ refreshToken })
  }

  async refreshTokensLegacy(req: Request) {
    const { refreshToken } = req.body
    return this.refreshTokens({ refreshToken })
  }

  async forgotPasswordLegacy(req: Request) {
    const { email } = req.body
    return this.forgotPassword({ email })
  }

  async resetPasswordLegacy(req: Request) {
    const { resetPasswordToken, newPassword } = req.body
    return this.resetPassword({ token: resetPasswordToken, password: newPassword })
  }

  async sendVerificationEmailLegacy(req: Request) {
    const { user } = req.body
    return this.sendVerificationEmail(user)
  }

  async verifyEmailLegacy(req: Request) {
    const { verifyEmailToken } = req.body
    return this.verifyEmail({ token: verifyEmailToken })
  }
}
