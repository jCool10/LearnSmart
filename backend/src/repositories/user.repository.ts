import { User, Prisma } from '../../generated/prisma'
import { prisma } from '../configs/database.config'
import { BaseRepository, PaginationOptions, PaginationResult, RepositoryError } from './base.repository'

export class UserRepository
  implements BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput, Prisma.UserWhereInput, string>
{
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({
        data,
        include: {
          tokens: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to create user: ${error}`)
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          tokens: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find user by id: ${error}`)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          tokens: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find user by email: ${error}`)
    }
  }

  async findMany(where?: Prisma.UserWhereInput, take?: number, skip?: number): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        where,
        take,
        skip,
        include: {
          tokens: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find users: ${error}`)
    }
  }

  async findFirst(where: Prisma.UserWhereInput): Promise<User | null> {
    try {
      return await prisma.user.findFirst({
        where,
        include: {
          tokens: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to find first user: ${error}`)
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        include: {
          tokens: true
        }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to update user: ${error}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id }
      })
    } catch (error) {
      throw new RepositoryError(`Failed to delete user: ${error}`)
    }
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    try {
      return await prisma.user.count({ where })
    } catch (error) {
      throw new RepositoryError(`Failed to count users: ${error}`)
    }
  }

  async findWithPagination(
    where?: Prisma.UserWhereInput,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<User>> {
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
      throw new RepositoryError(`Failed to find users with pagination: ${error}`)
    }
  }
}
