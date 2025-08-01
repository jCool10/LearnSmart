import { User, Prisma } from '../../generated/prisma'
import { UserRepository } from '../repositories/user.repository'
import { TokenRepository } from '../repositories/token.repository'
import { PaginationOptions, PaginationResult } from '../repositories/base.repository'
import { BadRequestError, NotFoundError, ConflictError } from '@/cores/error.handler'
import { BaseService } from './base.service'
import { Request } from 'express'
import bcrypt from 'bcrypt'
import { AUTH } from '@/constants'

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  role?: 'user' | 'admin'
  isEmailVerified?: boolean
}

export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto, Prisma.UserWhereInput> {
  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository
  ) {
    super(userRepository)
  }

  // Method overrides from BaseService with enhanced functionality
  async create(data: CreateUserDto): Promise<User> {
    // Hash password before creating
    const hashedPassword = await bcrypt.hash(data.password, AUTH.PASSWORD.BCRYPT_ROUNDS)
    const userData = {
      ...data,
      password: hashedPassword,
      role: data.role || 'user'
    }

    return super.create(userData)
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    // Hash password if being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, AUTH.PASSWORD.BCRYPT_ROUNDS)
    }

    return super.update(id, data)
  }

  // Hook implementations
  protected async validateCreate(data: CreateUserDto): Promise<void> {
    this.validateRequired(data.name, 'name')
    this.validateRequired(data.email, 'email')
    this.validateRequired(data.password, 'password')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new BadRequestError('Invalid email format')
    }

    // Validate password strength
    if (data.password.length < AUTH.PASSWORD.MIN_LENGTH) {
      throw new BadRequestError(`Password must be at least ${AUTH.PASSWORD.MIN_LENGTH} characters long`)
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email)
    this.throwIfExists(!!existingUser, 'User with this email already exists')
  }

  protected async validateUpdate(id: string, data: UpdateUserDto): Promise<void> {
    // Validate password if provided
    if (data.password && data.password.length < AUTH.PASSWORD.MIN_LENGTH) {
      throw new BadRequestError(`Password must be at least ${AUTH.PASSWORD.MIN_LENGTH} characters long`)
    }

    // Check if email is being updated and already exists
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new BadRequestError('Invalid email format')
      }

      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError('User with this email already exists')
      }
    }
  }

  protected transformOutput(user: User): User {
    // Remove password from output
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  // Custom methods specific to UserService
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email)
    return user ? this.transformOutput(user) : null
  }

  // Method to get user with password for authentication purposes
  async getUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }

  async searchUsers(searchTerm: string, options: PaginationOptions = {}): Promise<PaginationResult<User>> {
    const where: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    const result = await this.findWithPagination(where, options)
    return {
      ...result,
      data: result.data.map((user) => this.transformOutput(user))
    }
  }

  async getUserStats(): Promise<{
    totalUsers: number
    verifiedUsers: number
    adminUsers: number
    usersWithTokens: number
  }> {
    const [totalUsers, verifiedUsers, adminUsers, usersWithTokens] = await Promise.all([
      this.count(),
      this.count({ isEmailVerified: true }),
      this.count({ role: 'admin' }),
      this.count({ tokens: { some: {} } })
    ])

    return {
      totalUsers,
      verifiedUsers,
      adminUsers,
      usersWithTokens
    }
  }

  // Legacy methods for backward compatibility during migration
  // TODO: Remove these after controllers are fully migrated
  async createUser(req: Request): Promise<User> {
    const { name, email, password, role } = req.body
    return this.create({ name, email, password, role })
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.findById(id)
      return this.transformOutput(user)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      throw error
    }
  }

  async getAllUsers(options: PaginationOptions = {}): Promise<PaginationResult<User>> {
    const result = await this.findWithPagination(undefined, options)
    return {
      ...result,
      data: result.data.map((user) => this.transformOutput(user))
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return this.update(id, data)
  }

  async deleteUser(id: string): Promise<User> {
    return this.delete(id)
  }
}
