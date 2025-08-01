import { PrismaClient, User, Token, Role, TokenType } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configs } from '@/configs'
import { AUTH } from '@/constants'

// Test database instance
export const testDb = global.testPrisma as PrismaClient

// User factory for creating test users
export class UserFactory {
  static async create(overrides: Partial<User> = {}): Promise<User> {
    const defaultUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: await bcrypt.hash('TestPassword123!', AUTH.PASSWORD.BCRYPT_ROUNDS),
      role: 'user' as Role,
      isEmailVerified: false
    }

    return await testDb.user.create({
      data: {
        ...defaultUser,
        ...overrides
      }
    })
  }

  static async createAdmin(overrides: Partial<User> = {}): Promise<User> {
    return await this.create({
      role: 'admin' as Role,
      ...overrides
    })
  }

  static async createVerified(overrides: Partial<User> = {}): Promise<User> {
    return await this.create({
      isEmailVerified: true,
      ...overrides
    })
  }

  static async createMultiple(count: number, overrides: Partial<User> = {}): Promise<User[]> {
    const users: User[] = []
    for (let i = 0; i < count; i++) {
      const user = await this.create({
        name: `Test User ${i + 1}`,
        email: `test-user-${i + 1}-${Date.now()}@example.com`,
        ...overrides
      })
      users.push(user)
    }
    return users
  }
}

// Token factory for creating test tokens
export class TokenFactory {
  static async create(userId: string, overrides: Partial<Token> = {}): Promise<Token> {
    const defaultToken = {
      token: jwt.sign({ sub: userId }, configs.jwt.secret),
      userId,
      type: 'refresh' as TokenType,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      blacklisted: false
    }

    return await testDb.token.create({
      data: {
        ...defaultToken,
        ...overrides
      }
    })
  }

  static async createRefreshToken(userId: string): Promise<Token> {
    return await this.create(userId, {
      type: 'refresh' as TokenType,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
  }

  static async createResetPasswordToken(userId: string): Promise<Token> {
    return await this.create(userId, {
      type: 'resetPassword' as TokenType,
      expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })
  }

  static async createVerifyEmailToken(userId: string): Promise<Token> {
    return await this.create(userId, {
      type: 'verifyEmail' as TokenType,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })
  }
}

// Authentication helpers
export class AuthHelper {
  static generateAccessToken(userId: string): string {
    return jwt.sign({ sub: userId, type: 'access' }, configs.jwt.secret, {
      expiresIn: configs.jwt.accessTokenExpiresIn
    })
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ sub: userId, type: 'refresh' }, configs.jwt.secret, {
      expiresIn: configs.jwt.refreshTokenExpiresIn
    })
  }

  static async createAuthenticatedUser(): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await UserFactory.createVerified()
    const accessToken = this.generateAccessToken(user.id)
    const refreshToken = this.generateRefreshToken(user.id)

    // Save refresh token to database
    await TokenFactory.createRefreshToken(user.id)

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  static async createAuthenticatedAdmin(): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await UserFactory.createAdmin({ isEmailVerified: true })
    const accessToken = this.generateAccessToken(user.id)
    const refreshToken = this.generateRefreshToken(user.id)

    await TokenFactory.createRefreshToken(user.id)

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  static getAuthHeader(token: string): string {
    return `Bearer ${token}`
  }
}

// Database cleanup helpers
export class DatabaseHelper {
  static async cleanup(): Promise<void> {
    // Clean in correct order to avoid foreign key constraints
    await testDb.token.deleteMany()
    await testDb.user.deleteMany()
  }

  static async reset(): Promise<void> {
    await this.cleanup()
  }

  static async getUserCount(): Promise<number> {
    return await testDb.user.count()
  }

  static async getTokenCount(): Promise<number> {
    return await testDb.token.count()
  }
}

// Test data generators
export class TestDataGenerator {
  static generateValidUserData() {
    return {
      name: 'John Doe',
      email: `john.doe.${Date.now()}@example.com`,
      password: 'SecurePassword123!'
    }
  }

  static generateInvalidUserData() {
    return {
      name: '', // Invalid: empty name
      email: 'invalid-email', // Invalid: bad email format
      password: '123' // Invalid: too short password
    }
  }

  static generateUpdateUserData() {
    return {
      name: 'Jane Smith',
      email: `jane.smith.${Date.now()}@example.com`
    }
  }

  static generateLoginData(email: string = `test.${Date.now()}@example.com`) {
    return {
      email,
      password: 'TestPassword123!'
    }
  }

  static generateInvalidLoginData() {
    return {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    }
  }
}

// API response validators
export class ResponseValidator {
  static validateSuccessResponse(response: any, expectedData?: any) {
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('meta')
    expect(response.body.meta).toHaveProperty('timestamp')

    if (expectedData) {
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toMatchObject(expectedData)
    }
  }

  static validateErrorResponse(response: any, expectedMessage?: string, expectedErrors?: any[]) {
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('message')

    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage)
    }

    if (expectedErrors) {
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors).toEqual(expectedErrors)
    }
  }

  static validatePaginatedResponse(response: any, expectedCount?: number) {
    this.validateSuccessResponse(response)
    expect(response.body).toHaveProperty('meta.pagination')
    expect(response.body.meta.pagination).toHaveProperty('total')
    expect(response.body.meta.pagination).toHaveProperty('page')
    expect(response.body.meta.pagination).toHaveProperty('limit')

    if (expectedCount !== undefined) {
      expect(response.body.data).toHaveLength(expectedCount)
    }
  }

  static validateUserResponse(response: any, user?: User) {
    this.validateSuccessResponse(response)
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data).toHaveProperty('name')
    expect(response.body.data).toHaveProperty('email')
    expect(response.body.data).toHaveProperty('role')
    expect(response.body.data).toHaveProperty('isEmailVerified')
    expect(response.body.data).not.toHaveProperty('password') // Password should never be returned

    if (user) {
      expect(response.body.data.id).toBe(user.id)
      expect(response.body.data.name).toBe(user.name)
      expect(response.body.data.email).toBe(user.email)
    }
  }

  static validateAuthResponse(response: any) {
    this.validateSuccessResponse(response)
    expect(response.body.data).toHaveProperty('user')
    expect(response.body.data).toHaveProperty('tokens')
    expect(response.body.data.tokens).toHaveProperty('access')
    expect(response.body.data.tokens).toHaveProperty('refresh')
    expect(response.body.data.tokens.access).toHaveProperty('token')
    expect(response.body.data.tokens.access).toHaveProperty('expires')
    expect(response.body.data.tokens.refresh).toHaveProperty('token')
    expect(response.body.data.tokens.refresh).toHaveProperty('expires')
  }
}

// Time helpers for testing
export class TimeHelper {
  static getExpiredDate(): Date {
    return new Date(Date.now() - 1000) // 1 second ago
  }

  static getFutureDate(milliseconds: number = 60000): Date {
    return new Date(Date.now() + milliseconds)
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date)
    result.setMinutes(result.getMinutes() + minutes)
    return result
  }
}

// Mock helpers
export class MockHelper {
  static mockConsole() {
    return {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    }
  }

  static mockDate(date: Date) {
    const originalDate = Date
    const mockDate = jest.fn(() => date)
    mockDate.now = jest.fn(() => date.getTime())
    global.Date = mockDate as any
    return () => {
      global.Date = originalDate
    }
  }

  static mockEnvironment(env: Record<string, string>) {
    const originalEnv = process.env
    process.env = { ...originalEnv, ...env }
    return () => {
      process.env = originalEnv
    }
  }
}

// Export all helpers
export {
  UserFactory,
  TokenFactory,
  AuthHelper,
  DatabaseHelper,
  TestDataGenerator,
  ResponseValidator,
  TimeHelper,
  MockHelper
}
