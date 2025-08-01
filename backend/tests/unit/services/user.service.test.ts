import { UserService } from '@/services/user.service'
import { UserRepository } from '@/repositories/user.repository'
import { User, Role, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { ValidationError, ConflictError, NotFoundError } from '@/cores/error.handler'
import { CreateUserDto, UpdateUserDto } from '@/types/dto.types'
import { AUTH } from '@/constants'
import { UserFactory, DatabaseHelper, TestDataGenerator } from '../../utils/test-helpers'

// Mock logger
jest.mock('@/configs/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}))

// Mock UserRepository
jest.mock('@/repositories/user.repository')

describe('UserService', () => {
  let userService: UserService
  let mockUserRepository: jest.Mocked<UserRepository>

  beforeEach(async () => {
    await DatabaseHelper.cleanup()

    // Create mock repository
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>

    // Mock repository methods
    mockUserRepository.create = jest.fn()
    mockUserRepository.findById = jest.fn()
    mockUserRepository.findMany = jest.fn()
    mockUserRepository.findWithPagination = jest.fn()
    mockUserRepository.update = jest.fn()
    mockUserRepository.delete = jest.fn()
    mockUserRepository.count = jest.fn()
    mockUserRepository.exists = jest.fn()

    userService = new UserService(mockUserRepository)
  })

  afterEach(async () => {
    await DatabaseHelper.cleanup()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create user with hashed password', async () => {
      const createUserData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        role: 'user'
      }

      const expectedUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Mock repository methods
      mockUserRepository.findMany.mockResolvedValue([]) // No existing user
      mockUserRepository.create.mockResolvedValue(expectedUser)

      const result = await userService.create(createUserData)

      // Verify password was hashed
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          password: expect.any(String) // Should be hashed
        })
      )

      // Verify the hashed password is different from original
      const createCall = mockUserRepository.create.mock.calls[0][0]
      expect(createCall.password).not.toBe(createUserData.password)
      expect(createCall.password).toMatch(/^\$2[ab]\$/) // bcrypt hash pattern

      // Verify result has password removed
      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        })
      )
      expect(result).not.toHaveProperty('password')
    })

    it('should create user with default role when not specified', async () => {
      const createUserData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
        // role not specified
      }

      const expectedUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockUserRepository.findMany.mockResolvedValue([])
      mockUserRepository.create.mockResolvedValue(expectedUser)

      await userService.create(createUserData)

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user' // Should default to 'user'
        })
      )
    })

    it('should validate required fields', async () => {
      const invalidData: Partial<CreateUserDto> = {
        name: '', // Empty name
        email: 'john@example.com',
        password: 'SecurePassword123!'
      }

      await expect(userService.create(invalidData as CreateUserDto)).rejects.toThrow(ValidationError)
    })

    it('should validate email format', async () => {
      const invalidData: CreateUserDto = {
        name: 'John Doe',
        email: 'invalid-email', // Invalid email format
        password: 'SecurePassword123!'
      }

      await expect(userService.create(invalidData)).rejects.toThrow(ValidationError)
    })

    it('should validate password strength', async () => {
      const invalidData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak' // Too weak password
      }

      await expect(userService.create(invalidData)).rejects.toThrow(ValidationError)
    })

    it('should check for duplicate email', async () => {
      const createUserData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
      }

      const existingUser: User = {
        id: '1',
        name: 'Existing User',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Mock existing user found
      mockUserRepository.findMany.mockResolvedValue([existingUser])

      await expect(userService.create(createUserData)).rejects.toThrow(ConflictError)
      await expect(userService.create(createUserData)).rejects.toThrow('User with this email already exists')
    })
  })

  describe('update', () => {
    const existingUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
      role: 'user' as Role,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      mockUserRepository.findById.mockResolvedValue(existingUser)
    })

    it('should update user successfully', async () => {
      const updateData: UpdateUserDto = {
        name: 'Jane Smith'
      }

      const updatedUser: User = {
        ...existingUser,
        name: 'Jane Smith',
        updatedAt: new Date()
      }

      mockUserRepository.update.mockResolvedValue(updatedUser)

      const result = await userService.update('1', updateData)

      expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateData)
      expect(result).not.toHaveProperty('password') // Password should be removed from output
    })

    it('should hash new password when updating', async () => {
      const updateData: UpdateUserDto = {
        password: 'NewSecurePassword123!'
      }

      const updatedUser: User = {
        ...existingUser,
        password: 'new_hashed_password',
        updatedAt: new Date()
      }

      mockUserRepository.update.mockResolvedValue(updatedUser)

      await userService.update('1', updateData)

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          password: expect.stringMatching(/^\$2[ab]\$/) // Should be hashed
        })
      )

      const updateCall = mockUserRepository.update.mock.calls[0][1]
      expect(updateCall.password).not.toBe(updateData.password) // Should not be plain text
    })

    it('should validate password strength when updating', async () => {
      const updateData: UpdateUserDto = {
        password: 'weak' // Too weak password
      }

      await expect(userService.update('1', updateData)).rejects.toThrow(ValidationError)
    })

    it('should check for duplicate email when updating', async () => {
      const updateData: UpdateUserDto = {
        email: 'existing@example.com'
      }

      const otherUser: User = {
        id: '2',
        name: 'Other User',
        email: 'existing@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Mock finding existing user with same email (but different ID)
      mockUserRepository.findMany.mockResolvedValue([otherUser])

      await expect(userService.update('1', updateData)).rejects.toThrow(ConflictError)
    })

    it('should allow updating to same email (no duplicate check for same user)', async () => {
      const updateData: UpdateUserDto = {
        email: 'john@example.com' // Same email as current user
      }

      const updatedUser: User = {
        ...existingUser,
        updatedAt: new Date()
      }

      // Mock finding only the current user with this email
      mockUserRepository.findMany.mockResolvedValue([existingUser])
      mockUserRepository.update.mockResolvedValue(updatedUser)

      const result = await userService.update('1', updateData)

      expect(result).toBeDefined()
      expect(mockUserRepository.update).toHaveBeenCalled()
    })
  })

  describe('transformOutput', () => {
    it('should remove password from user object', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockUserRepository.findById.mockResolvedValue(user)

      const result = await userService.findById('1')

      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          isEmailVerified: false
        })
      )
      expect(result).not.toHaveProperty('password')
    })
  })

  describe('getUserByEmail', () => {
    it('should find user by email', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockUserRepository.findMany.mockResolvedValue([user])

      const result = await userService.getUserByEmail('john@example.com')

      expect(mockUserRepository.findMany).toHaveBeenCalledWith({
        email: 'john@example.com'
      })
      expect(result).toBeDefined()
      expect(result!.email).toBe('john@example.com')
      expect(result).not.toHaveProperty('password')
    })

    it('should return null when user not found', async () => {
      mockUserRepository.findMany.mockResolvedValue([])

      const result = await userService.getUserByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          password: 'hashed_password',
          role: 'user' as Role,
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          password: 'hashed_password',
          role: 'admin' as Role,
          isEmailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const paginationResult = {
        data: users,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      mockUserRepository.findWithPagination.mockResolvedValue(paginationResult)

      const result = await userService.getAllUsers({}, { page: 1, limit: 10 })

      expect(mockUserRepository.findWithPagination).toHaveBeenCalledWith({}, { page: 1, limit: 10 })
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).not.toHaveProperty('password')
      expect(result.data[1]).not.toHaveProperty('password')
      expect(result.total).toBe(2)
    })
  })

  describe('searchUsers', () => {
    it('should search users by query', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashed_password',
          role: 'user' as Role,
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const paginationResult = {
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }

      mockUserRepository.findWithPagination.mockResolvedValue(paginationResult)

      const result = await userService.searchUsers('John', { page: 1, limit: 10 })

      expect(mockUserRepository.findWithPagination).toHaveBeenCalledWith(
        {
          OR: [
            { name: { contains: 'John', mode: 'insensitive' } },
            { email: { contains: 'John', mode: 'insensitive' } }
          ]
        },
        { page: 1, limit: 10 }
      )
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).not.toHaveProperty('password')
    })

    it('should handle empty search query', async () => {
      const paginationResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }

      mockUserRepository.findWithPagination.mockResolvedValue(paginationResult)

      const result = await userService.searchUsers('', { page: 1, limit: 10 })

      // Should search for all users when query is empty
      expect(mockUserRepository.findWithPagination).toHaveBeenCalledWith({}, { page: 1, limit: 10 })
    })
  })

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      // Mock counts
      mockUserRepository.count
        .mockResolvedValueOnce(100) // Total users
        .mockResolvedValueOnce(75) // Verified users
        .mockResolvedValueOnce(25) // Unverified users
        .mockResolvedValueOnce(5) // Admin users

      const stats = await userService.getUserStats()

      expect(stats).toEqual({
        total: 100,
        verified: 75,
        unverified: 25,
        admins: 5
      })

      expect(mockUserRepository.count).toHaveBeenCalledTimes(4)
      expect(mockUserRepository.count).toHaveBeenNthCalledWith(1, {}) // Total
      expect(mockUserRepository.count).toHaveBeenNthCalledWith(2, { isEmailVerified: true }) // Verified
      expect(mockUserRepository.count).toHaveBeenNthCalledWith(3, { isEmailVerified: false }) // Unverified
      expect(mockUserRepository.count).toHaveBeenNthCalledWith(4, { role: 'admin' }) // Admins
    })
  })

  describe('Legacy methods (backward compatibility)', () => {
    describe('createUser', () => {
      it('should work with Request object', async () => {
        const req = {
          body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePassword123!',
            role: 'user'
          }
        }

        const expectedUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashed_password',
          role: 'user' as Role,
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        mockUserRepository.findMany.mockResolvedValue([])
        mockUserRepository.create.mockResolvedValue(expectedUser)

        const result = await userService.createUser(req as any)

        expect(result).toBeDefined()
        expect(result).not.toHaveProperty('password')
      })
    })

    describe('getUserById', () => {
      it('should work as legacy method', async () => {
        const user: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashed_password',
          role: 'user' as Role,
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        mockUserRepository.findById.mockResolvedValue(user)

        const result = await userService.getUserById('1')

        expect(result).toBeDefined()
        expect(result).not.toHaveProperty('password')
      })
    })

    describe('updateUser', () => {
      it('should work with Request object', async () => {
        const req = {
          body: {
            name: 'Jane Smith'
          }
        }

        const existingUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashed_password',
          role: 'user' as Role,
          isEmailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const updatedUser: User = {
          ...existingUser,
          name: 'Jane Smith',
          updatedAt: new Date()
        }

        mockUserRepository.findById.mockResolvedValue(existingUser)
        mockUserRepository.update.mockResolvedValue(updatedUser)

        const result = await userService.updateUser('1', req as any)

        expect(result).toBeDefined()
        expect(result).not.toHaveProperty('password')
      })
    })

    describe('deleteUser', () => {
      it('should work as legacy method', async () => {
        mockUserRepository.findById.mockResolvedValue({} as User)
        mockUserRepository.delete.mockResolvedValue(true)

        await userService.deleteUser('1')

        expect(mockUserRepository.delete).toHaveBeenCalledWith('1')
      })
    })
  })

  describe('password hashing', () => {
    it('should use correct bcrypt rounds', async () => {
      const createUserData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
      }

      const bcryptSpy = jest.spyOn(bcrypt, 'hash')

      const expectedUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user' as Role,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockUserRepository.findMany.mockResolvedValue([])
      mockUserRepository.create.mockResolvedValue(expectedUser)

      await userService.create(createUserData)

      expect(bcryptSpy).toHaveBeenCalledWith('SecurePassword123!', AUTH.PASSWORD.BCRYPT_ROUNDS)

      bcryptSpy.mockRestore()
    })
  })

  describe('error handling', () => {
    it('should handle repository errors gracefully', async () => {
      const createUserData: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
      }

      mockUserRepository.findMany.mockRejectedValue(new Error('Database connection failed'))

      await expect(userService.create(createUserData)).rejects.toThrow('Database connection failed')
    })
  })
})
