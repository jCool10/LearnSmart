import { Token, Prisma, TokenType } from '../../generated/prisma'
import { TokenRepository } from '../repositories/token.repository'
import { UserRepository } from '../repositories/user.repository'
import { PaginationOptions, PaginationResult } from '../repositories/base.repository'
import { BadRequestError, NotFoundError } from '@/cores/error.handler'
import { BaseService } from './base.service'
import jwt from 'jsonwebtoken'
import { configs } from '@/configs'
import { prisma } from '@/configs/database.config'
import { TOKEN_TYPES } from '@/constants'

export interface CreateTokenDto {
  token: string
  userId: string
  type: TokenType
  expires: Date
  blacklisted?: boolean
}

export interface UpdateTokenDto {
  token?: string
  expires?: Date
  blacklisted?: boolean
}

export class TokenService extends BaseService<Token, CreateTokenDto, UpdateTokenDto, Prisma.TokenWhereInput> {
  constructor(
    private tokenRepository: TokenRepository,
    private userRepository: UserRepository
  ) {
    super(tokenRepository as any) // Type assertion for compatibility
  }

  // Override create method to handle Prisma relation properly
  async create(data: CreateTokenDto): Promise<Token> {
    await this.validateCreate(data)

    const prismaData = {
      token: data.token,
      type: data.type,
      expires: data.expires,
      blacklisted: data.blacklisted || false,
      user: {
        connect: { id: data.userId }
      }
    }

    const result = await this.tokenRepository.create(prismaData)
    this.logger.info('Token created successfully', { id: result.id })
    return result
  }

  // Hook implementations
  protected async validateCreate(data: CreateTokenDto): Promise<void> {
    this.validateRequired(data.token, 'token')
    this.validateRequired(data.userId, 'userId')
    this.validateRequired(data.type, 'type')
    this.validateRequired(data.expires, 'expires')

    // Validate token type
    const validTypes = Object.values(TOKEN_TYPES)
    if (!validTypes.includes(data.type)) {
      throw new BadRequestError(`Invalid token type. Must be one of: ${validTypes.join(', ')}`)
    }

    // Validate expires date is in the future
    if (data.expires <= new Date()) {
      throw new BadRequestError('Token expiration date must be in the future')
    }

    // Check if user exists
    const user = await this.userRepository.findById(data.userId)
    this.throwIfNotExists(!!user, 'User not found')

    // Check for duplicate token
    const existingToken = await this.tokenRepository.findByToken(data.token)
    this.throwIfExists(!!existingToken, 'Token already exists')
  }

  protected async validateUpdate(id: string, data: UpdateTokenDto): Promise<void> {
    // Validate expires date if provided
    if (data.expires && data.expires <= new Date()) {
      throw new BadRequestError('Token expiration date must be in the future')
    }

    // Validate token uniqueness if being updated
    if (data.token) {
      const existingToken = await this.tokenRepository.findByToken(data.token)
      if (existingToken && existingToken.id !== id) {
        throw new BadRequestError('Token already exists')
      }
    }
  }

  protected async transformCreateData(data: CreateTokenDto): Promise<any> {
    // Transform data for Prisma relation
    return {
      token: data.token,
      type: data.type,
      expires: data.expires,
      blacklisted: data.blacklisted || false,
      user: {
        connect: { id: data.userId }
      }
    }
  }

  // Custom token-specific methods
  async getTokenByToken(token: string): Promise<Token | null> {
    return await this.tokenRepository.findByToken(token)
  }

  async getTokensByUserId(userId: string, options: PaginationOptions = {}): Promise<PaginationResult<Token>> {
    // Check if user exists
    const user = await this.userRepository.findById(userId)
    this.throwIfNotExists(!!user, 'User not found')

    const where: Prisma.TokenWhereInput = { userId }
    return await this.findWithPagination(where, options)
  }

  async getTokensByType(type: TokenType, options: PaginationOptions = {}): Promise<PaginationResult<Token>> {
    const where: Prisma.TokenWhereInput = { type }
    return await this.findWithPagination(where, options)
  }

  async getActiveTokens(options: PaginationOptions = {}): Promise<PaginationResult<Token>> {
    const where: Prisma.TokenWhereInput = {
      blacklisted: false,
      expires: {
        gt: new Date()
      }
    }
    return await this.findWithPagination(where, options)
  }

  async blacklistToken(id: string): Promise<Token> {
    return await this.update(id, { blacklisted: true })
  }

  async blacklistTokenByValue(token: string): Promise<Token> {
    const existingToken = await this.tokenRepository.findByToken(token)
    this.throwIfNotExists(!!existingToken, 'Token not found')

    return await this.update(existingToken!.id, { blacklisted: true })
  }

  async deleteExpiredTokens(): Promise<number> {
    return await this.tokenRepository.deleteExpiredTokens()
  }

  async deleteTokensByUserId(userId: string): Promise<number> {
    const tokens = await this.tokenRepository.findByUserId(userId)
    let deletedCount = 0

    for (const token of tokens) {
      await this.delete(token.id)
      deletedCount++
    }

    return deletedCount
  }

  async getTokenStats(): Promise<{
    totalTokens: number
    activeTokens: number
    expiredTokens: number
    blacklistedTokens: number
    tokensByType: Record<TokenType, number>
  }> {
    const now = new Date()

    const [totalTokens, activeTokens, expiredTokens, blacklistedTokens] = await Promise.all([
      this.count(),
      this.count({
        blacklisted: false,
        expires: { gt: now }
      }),
      this.count({
        expires: { lt: now }
      }),
      this.count({
        blacklisted: true
      })
    ])

    // Count tokens by type
    const tokensByType: Record<TokenType, number> = {} as Record<TokenType, number>
    const types: TokenType[] = ['refresh', 'resetPassword', 'verifyEmail']

    const typeCountPromises = types.map(async (type) => {
      const count = await this.count({ type })
      return { type, count }
    })

    const typeCounts = await Promise.all(typeCountPromises)
    typeCounts.forEach(({ type, count }) => {
      tokensByType[type] = count
    })

    return {
      totalTokens,
      activeTokens,
      expiredTokens,
      blacklistedTokens,
      tokensByType
    }
  }

  async verifyToken(token: string, type?: TokenType) {
    try {
      const payload = jwt.verify(token, configs.jwt.secret) as any

      const where: Prisma.TokenWhereInput = {
        token,
        userId: payload.sub,
        blacklisted: false,
        expires: {
          gt: new Date()
        }
      }

      if (type) {
        where.type = type
      }

      const tokenDoc = await this.tokenRepository.findFirst(where)

      if (!tokenDoc) {
        return {
          valid: false,
          error: 'Token not found or invalid'
        }
      }

      return {
        valid: true,
        token: tokenDoc
      }
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'Invalid token'
      }
    }
  }

  // Legacy methods for backward compatibility
  // TODO: Remove these after full migration
  async createToken(data: CreateTokenDto): Promise<Token> {
    return this.create(data)
  }

  async getTokenById(id: string): Promise<Token | null> {
    try {
      return await this.findById(id)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      throw error
    }
  }

  async getAllTokens(options: PaginationOptions = {}): Promise<PaginationResult<Token>> {
    return await this.findWithPagination(undefined, options)
  }

  async updateToken(id: string, data: UpdateTokenDto): Promise<Token> {
    return this.update(id, data)
  }

  async deleteToken(id: string): Promise<Token> {
    return this.delete(id)
  }
}
