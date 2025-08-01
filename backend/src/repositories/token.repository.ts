import { Token, Prisma } from '../../generated/prisma'
import { prisma } from '../configs/database.config'
import { BaseRepository, PaginationOptions, PaginationResult, RepositoryError } from './base.repository'

export class TokenRepository
  implements BaseRepository<Token, Prisma.TokenCreateInput, Prisma.TokenUpdateInput, Prisma.TokenWhereInput, string>
{
  async create(data: Prisma.TokenCreateInput): Promise<Token> {
    try {
      return await prisma.token.create({
        data,
        include: {
          user: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to create token: ${error}`)
    }
  }

  async findById(id: string): Promise<Token | null> {
    try {
      return await prisma.token.findUnique({
        where: { id },
        include: {
          user: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find token by id: ${error}`)
    }
  }

  async findByToken(token: string): Promise<Token | null> {
    try {
      return await prisma.token.findUnique({
        where: { token },
        include: {
          user: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find token by token: ${error}`)
    }
  }

  async findMany(where?: Prisma.TokenWhereInput, take?: number, skip?: number): Promise<Token[]> {
    try {
      return await prisma.token.findMany({
        where,
        take,
        skip,
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find tokens: ${error}`)
    }
  }

  async findFirst(where: Prisma.TokenWhereInput): Promise<Token | null> {
    try {
      return await prisma.token.findFirst({
        where,
        include: {
          user: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find first token: ${error}`)
    }
  }

  async update(id: string, data: Prisma.TokenUpdateInput): Promise<Token> {
    try {
      return await prisma.token.update({
        where: { id },
        data,
        include: {
          user: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to update token: ${error}`)
    }
  }

  async delete(id: string): Promise<Token> {
    try {
      return await prisma.token.delete({
        where: { id }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to delete token: ${error}`)
    }
  }

  async count(where?: Prisma.TokenWhereInput): Promise<number> {
    try {
      return await prisma.token.count({ where })
    } catch (error) {
      throw new RepositoryError(`Failed to count tokens: ${error}`)
    }
  }

  async findByUserId(userId: string): Promise<Token[]> {
    try {
      return await this.findMany({ userId })
    } catch (error) {
      throw new RepositoryError(`Failed to find tokens by user: ${error}`)
    }
  }

  async findByType(type: Prisma.EnumTokenTypeFilter): Promise<Token[]> {
    try {
      return await this.findMany({ type })
    } catch (error) {
      throw new RepositoryError(`Failed to find tokens by type: ${error}`)
    }
  }

  async deleteExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.token.deleteMany({
        where: {
          expires: {
            lt: new Date()
          }
        }
      })
      return result.count
    } catch (error) {
      throw new RepositoryError(`Failed to delete expired tokens: ${error}`)
    }
  }

  async findWithPagination(
    where?: Prisma.TokenWhereInput,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<Token>> {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    try {
      const [data, total] = await Promise.all([this.findMany(where, limit, skip), this.count(where)])

      const totalPages = Math.ceil(total / limit)

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    } catch (error) {
      throw new RepositoryError(`Failed to find tokens with pagination: ${error}`)
    }
  }
}
