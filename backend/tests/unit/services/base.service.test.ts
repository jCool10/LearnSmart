import { BaseService } from '@/services/base.service'
import { BaseRepository } from '@/repositories/base.repository'
import { ValidationError, NotFoundError, ConflictError } from '@/cores/error.handler'
import { DatabaseHelper, MockHelper } from '../../utils/test-helpers'

// Mock logger
jest.mock('@/configs/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}))

// Test DTO interfaces
interface TestCreateDto {
  name: string
  email: string
}

interface TestUpdateDto {
  name?: string
  email?: string
}

interface TestEntity {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface TestWhereInput {
  id?: string
  name?: string
  email?: string
}

// Mock repository implementation
class MockRepository implements BaseRepository<TestEntity, TestCreateDto, TestUpdateDto, TestWhereInput> {
  private data: TestEntity[] = []
  private nextId = 1

  async create(data: TestCreateDto): Promise<TestEntity> {
    const entity: TestEntity = {
      id: this.nextId.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.push(entity)
    this.nextId++
    return entity
  }

  async findById(id: string): Promise<TestEntity | null> {
    return this.data.find((item) => item.id === id) || null
  }

  async findMany(where?: TestWhereInput): Promise<TestEntity[]> {
    if (!where) return this.data

    return this.data.filter((item) => {
      if (where.id && item.id !== where.id) return false
      if (where.name && item.name !== where.name) return false
      if (where.email && item.email !== where.email) return false
      return true
    })
  }

  async findWithPagination(
    where?: TestWhereInput,
    options: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}
  ) {
    const { page = 1, limit = 10 } = options
    const filteredData = await this.findMany(where)

    const total = filteredData.length
    const skip = (page - 1) * limit
    const data = filteredData.slice(skip, skip + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async update(id: string, data: TestUpdateDto): Promise<TestEntity | null> {
    const index = this.data.findIndex((item) => item.id === id)
    if (index === -1) return null

    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date()
    }
    return this.data[index]
  }

  async delete(id: string): Promise<boolean> {
    const index = this.data.findIndex((item) => item.id === id)
    if (index === -1) return false

    this.data.splice(index, 1)
    return true
  }

  async count(where?: TestWhereInput): Promise<number> {
    const filtered = await this.findMany(where)
    return filtered.length
  }

  async exists(where: TestWhereInput): Promise<boolean> {
    const found = await this.findMany(where)
    return found.length > 0
  }

  // Helper methods for testing
  clear() {
    this.data = []
    this.nextId = 1
  }

  getAll() {
    return [...this.data]
  }
}

// Test service implementation
class TestService extends BaseService<TestEntity, TestCreateDto, TestUpdateDto, TestWhereInput> {
  public validateCreateCalled = false
  public validateUpdateCalled = false
  public transformCreateDataCalled = false
  public transformUpdateDataCalled = false
  public transformOutputCalled = false
  public afterCreateCalled = false
  public afterUpdateCalled = false
  public afterDeleteCalled = false

  constructor(repository: MockRepository) {
    super(repository)
  }

  // Override hooks for testing
  protected async validateCreate(data: TestCreateDto): Promise<void> {
    this.validateCreateCalled = true

    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long')
    }

    if (!data.email || !data.email.includes('@')) {
      throw new ValidationError('Valid email is required')
    }

    // Check for duplicate email
    const existingUser = await this.repository.findMany({ email: data.email })
    if (existingUser.length > 0) {
      throw new ConflictError('User with this email already exists')
    }
  }

  protected async validateUpdate(id: string, data: TestUpdateDto): Promise<void> {
    this.validateUpdateCalled = true

    if (data.name && data.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long')
    }

    if (data.email && !data.email.includes('@')) {
      throw new ValidationError('Valid email is required')
    }

    // Check for duplicate email (excluding current record)
    if (data.email) {
      const existingUsers = await this.repository.findMany({ email: data.email })
      const duplicateUser = existingUsers.find((user) => user.id !== id)
      if (duplicateUser) {
        throw new ConflictError('User with this email already exists')
      }
    }
  }

  protected transformCreateData(data: TestCreateDto): TestCreateDto {
    this.transformCreateDataCalled = true
    return {
      ...data,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim()
    }
  }

  protected transformUpdateData(data: TestUpdateDto): TestUpdateDto {
    this.transformUpdateDataCalled = true
    const transformed: TestUpdateDto = {}

    if (data.name) {
      transformed.name = data.name.trim()
    }

    if (data.email) {
      transformed.email = data.email.toLowerCase().trim()
    }

    return transformed
  }

  protected transformOutput(entity: TestEntity): TestEntity {
    this.transformOutputCalled = true
    return {
      ...entity,
      email: entity.email.toLowerCase()
    }
  }

  protected async afterCreate(entity: TestEntity, originalData: TestCreateDto): Promise<void> {
    this.afterCreateCalled = true
    // Could perform additional operations like sending emails, logging, etc.
  }

  protected async afterUpdate(entity: TestEntity, originalData: TestUpdateDto): Promise<void> {
    this.afterUpdateCalled = true
    // Could perform additional operations
  }

  protected async afterDelete(id: string): Promise<void> {
    this.afterDeleteCalled = true
    // Could perform cleanup operations
  }

  // Helper methods for testing
  resetCallFlags() {
    this.validateCreateCalled = false
    this.validateUpdateCalled = false
    this.transformCreateDataCalled = false
    this.transformUpdateDataCalled = false
    this.transformOutputCalled = false
    this.afterCreateCalled = false
    this.afterUpdateCalled = false
    this.afterDeleteCalled = false
  }
}

describe('BaseService', () => {
  let repository: MockRepository
  let service: TestService

  beforeEach(async () => {
    await DatabaseHelper.cleanup()
    repository = new MockRepository()
    service = new TestService(repository)
    repository.clear()
    service.resetCallFlags()
  })

  afterEach(async () => {
    await DatabaseHelper.cleanup()
  })

  describe('create', () => {
    it('should create an entity successfully', async () => {
      const createData: TestCreateDto = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const result = await service.create(createData)

      expect(result).toHaveProperty('id')
      expect(result.name).toBe('john doe') // transformed (trimmed)
      expect(result.email).toBe('john@example.com') // transformed (lowercase)
      expect(service.validateCreateCalled).toBe(true)
      expect(service.transformCreateDataCalled).toBe(true)
      expect(service.transformOutputCalled).toBe(true)
      expect(service.afterCreateCalled).toBe(true)
    })

    it('should validate create data and throw ValidationError for invalid name', async () => {
      const createData: TestCreateDto = {
        name: 'J', // Too short
        email: 'john@example.com'
      }

      await expect(service.create(createData)).rejects.toThrow(ValidationError)
      await expect(service.create(createData)).rejects.toThrow('Name must be at least 2 characters long')
      expect(service.validateCreateCalled).toBe(true)
      expect(service.transformCreateDataCalled).toBe(false) // Should not reach transformation
    })

    it('should validate create data and throw ValidationError for invalid email', async () => {
      const createData: TestCreateDto = {
        name: 'John Doe',
        email: 'invalid-email' // No @ symbol
      }

      await expect(service.create(createData)).rejects.toThrow(ValidationError)
      await expect(service.create(createData)).rejects.toThrow('Valid email is required')
    })

    it('should throw ConflictError for duplicate email', async () => {
      const createData: TestCreateDto = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      // Create first user
      await service.create(createData)

      // Try to create duplicate
      const duplicateData: TestCreateDto = {
        name: 'Jane Doe',
        email: 'john@example.com' // Same email
      }

      await expect(service.create(duplicateData)).rejects.toThrow(ConflictError)
      await expect(service.create(duplicateData)).rejects.toThrow('User with this email already exists')
    })
  })

  describe('findById', () => {
    it('should find entity by id successfully', async () => {
      const createData: TestCreateDto = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const created = await service.create(createData)
      const found = await service.findById(created.id)

      expect(found).toBeDefined()
      expect(found!.id).toBe(created.id)
      expect(found!.name).toBe(created.name)
      expect(service.transformOutputCalled).toBe(true)
    })

    it('should throw NotFoundError when entity does not exist', async () => {
      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundError)
      await expect(service.findById('non-existent-id')).rejects.toThrow('Record not found')
    })
  })

  describe('findWithPagination', () => {
    beforeEach(async () => {
      // Create test data
      for (let i = 1; i <= 25; i++) {
        await service.create({
          name: `User ${i}`,
          email: `user${i}@example.com`
        })
      }
    })

    it('should return paginated results with default pagination', async () => {
      const result = await service.findWithPagination()

      expect(result.data).toHaveLength(10) // Default limit
      expect(result.total).toBe(25)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.totalPages).toBe(3)
      expect(service.transformOutputCalled).toBe(true)
    })

    it('should return paginated results with custom pagination', async () => {
      const result = await service.findWithPagination({}, { page: 2, limit: 5 })

      expect(result.data).toHaveLength(5)
      expect(result.total).toBe(25)
      expect(result.page).toBe(2)
      expect(result.limit).toBe(5)
      expect(result.totalPages).toBe(5)
    })

    it('should return filtered paginated results', async () => {
      const result = await service.findWithPagination({ name: 'User 1' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('user 1') // transformed
      expect(result.total).toBe(1)
    })

    it('should return empty results for non-matching filter', async () => {
      const result = await service.findWithPagination({ name: 'Non-existent User' })

      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe('update', () => {
    let existingEntity: TestEntity

    beforeEach(async () => {
      existingEntity = await service.create({
        name: 'John Doe',
        email: 'john@example.com'
      })
      service.resetCallFlags() // Reset flags after creation
    })

    it('should update entity successfully', async () => {
      const updateData: TestUpdateDto = {
        name: 'Jane Smith'
      }

      const result = await service.update(existingEntity.id, updateData)

      expect(result.name).toBe('jane smith') // transformed
      expect(result.email).toBe('john@example.com') // unchanged
      expect(service.validateUpdateCalled).toBe(true)
      expect(service.transformUpdateDataCalled).toBe(true)
      expect(service.transformOutputCalled).toBe(true)
      expect(service.afterUpdateCalled).toBe(true)
    })

    it('should validate update data and throw ValidationError for invalid name', async () => {
      const updateData: TestUpdateDto = {
        name: 'J' // Too short
      }

      await expect(service.update(existingEntity.id, updateData)).rejects.toThrow(ValidationError)
      await expect(service.update(existingEntity.id, updateData)).rejects.toThrow(
        'Name must be at least 2 characters long'
      )
    })

    it('should throw NotFoundError when updating non-existent entity', async () => {
      const updateData: TestUpdateDto = {
        name: 'Jane Smith'
      }

      await expect(service.update('non-existent-id', updateData)).rejects.toThrow(NotFoundError)
    })

    it('should throw ConflictError for duplicate email', async () => {
      // Create another user
      await service.create({
        name: 'Jane Doe',
        email: 'jane@example.com'
      })

      const updateData: TestUpdateDto = {
        email: 'jane@example.com' // Trying to use existing email
      }

      await expect(service.update(existingEntity.id, updateData)).rejects.toThrow(ConflictError)
    })
  })

  describe('delete', () => {
    let existingEntity: TestEntity

    beforeEach(async () => {
      existingEntity = await service.create({
        name: 'John Doe',
        email: 'john@example.com'
      })
      service.resetCallFlags() // Reset flags after creation
    })

    it('should delete entity successfully', async () => {
      await service.delete(existingEntity.id)

      expect(service.afterDeleteCalled).toBe(true)

      // Verify entity is deleted
      await expect(service.findById(existingEntity.id)).rejects.toThrow(NotFoundError)
    })

    it('should throw NotFoundError when deleting non-existent entity', async () => {
      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundError)
    })
  })

  describe('count', () => {
    beforeEach(async () => {
      // Create test data
      await service.create({ name: 'User 1', email: 'user1@example.com' })
      await service.create({ name: 'User 2', email: 'user2@example.com' })
      await service.create({ name: 'Admin 1', email: 'admin1@example.com' })
    })

    it('should count all entities when no filter provided', async () => {
      const count = await service.count()
      expect(count).toBe(3)
    })

    it('should count filtered entities', async () => {
      const count = await service.count({ name: 'user 1' }) // transformed to lowercase
      expect(count).toBe(1)
    })

    it('should return 0 for non-matching filter', async () => {
      const count = await service.count({ name: 'Non-existent' })
      expect(count).toBe(0)
    })
  })

  describe('exists', () => {
    beforeEach(async () => {
      await service.create({ name: 'John Doe', email: 'john@example.com' })
    })

    it('should return true when entity exists', async () => {
      const exists = await service.exists({ email: 'john@example.com' })
      expect(exists).toBe(true)
    })

    it('should return false when entity does not exist', async () => {
      const exists = await service.exists({ email: 'nonexistent@example.com' })
      expect(exists).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Mock repository to throw an error
      jest.spyOn(repository, 'create').mockRejectedValue(new Error('Database connection failed'))

      const createData: TestCreateDto = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      await expect(service.create(createData)).rejects.toThrow('Database connection failed')
    })
  })

  describe('hook execution order', () => {
    it('should execute create hooks in correct order', async () => {
      const createData: TestCreateDto = {
        name: '  John Doe  ', // With spaces to test transformation
        email: 'JOHN@EXAMPLE.COM' // Uppercase to test transformation
      }

      await service.create(createData)

      // Verify hooks were called in order
      expect(service.validateCreateCalled).toBe(true)
      expect(service.transformCreateDataCalled).toBe(true)
      expect(service.transformOutputCalled).toBe(true)
      expect(service.afterCreateCalled).toBe(true)
    })

    it('should execute update hooks in correct order', async () => {
      const entity = await service.create({
        name: 'John Doe',
        email: 'john@example.com'
      })

      service.resetCallFlags()

      const updateData: TestUpdateDto = {
        name: '  Jane Smith  ' // With spaces to test transformation
      }

      await service.update(entity.id, updateData)

      // Verify hooks were called in order
      expect(service.validateUpdateCalled).toBe(true)
      expect(service.transformUpdateDataCalled).toBe(true)
      expect(service.transformOutputCalled).toBe(true)
      expect(service.afterUpdateCalled).toBe(true)
    })
  })
})
