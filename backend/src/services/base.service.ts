import { BaseRepository, PaginationOptions, PaginationResult } from '@/repositories/base.repository'
import { BadRequestError, NotFoundError, ConflictError } from '@/cores/error.handler'
import logger from '@/configs/logger.config'

export interface ServiceConfig {
  logger?: typeof logger
  enableSoftDelete?: boolean
  enableAuditLog?: boolean
}

export abstract class BaseService<T, CreateInput, UpdateInput, WhereInput = any, IdType = string> {
  protected repository: BaseRepository<T, CreateInput, UpdateInput, WhereInput, IdType>
  protected logger: typeof logger
  protected config: ServiceConfig

  constructor(repository: BaseRepository<T, CreateInput, UpdateInput, WhereInput, IdType>, config: ServiceConfig = {}) {
    this.repository = repository
    this.logger = config.logger || logger
    this.config = {
      enableSoftDelete: false,
      enableAuditLog: true,
      ...config
    }
  }

  // Standard CRUD operations
  async create(data: CreateInput): Promise<T> {
    try {
      this.logger.info('Creating new record', { data })

      await this.validateCreate(data)
      const transformedData = await this.transformCreateData(data)
      const result = await this.repository.create(transformedData)

      this.logger.info('Record created successfully', { id: this.getId(result) })
      await this.afterCreate(result, data)

      return this.transformOutput(result)
    } catch (error: any) {
      this.logger.error('Failed to create record', { error: error.message, data })
      throw error
    }
  }

  async findById(id: IdType): Promise<T> {
    try {
      this.logger.debug('Finding record by ID', { id })

      const result = await this.repository.findById(id)
      if (!result) {
        throw new NotFoundError(`Record with ID ${id} not found`)
      }

      return this.transformOutput(result)
    } catch (error: any) {
      this.logger.error('Failed to find record by ID', { error: error.message, id })
      throw error
    }
  }

  async findMany(where?: WhereInput, pagination?: PaginationOptions): Promise<T[]> {
    try {
      this.logger.debug('Finding multiple records', { where, pagination })

      const { page, limit } = pagination || {}
      const skip = page && limit ? (page - 1) * limit : undefined

      const results = await this.repository.findMany(where, limit, skip)
      return results.map((result) => this.transformOutput(result))
    } catch (error: any) {
      this.logger.error('Failed to find records', { error: error.message, where })
      throw error
    }
  }

  async findWithPagination(where?: WhereInput, pagination: PaginationOptions = {}): Promise<PaginationResult<T>> {
    try {
      this.logger.debug('Finding records with pagination', { where, pagination })

      // If repository has pagination method, use it; otherwise implement here
      if ('findWithPagination' in this.repository) {
        const result = await (this.repository as any).findWithPagination(where, pagination)
        return {
          ...result,
          data: result.data.map((item: T) => this.transformOutput(item))
        }
      }

      // Fallback implementation
      const { page = 1, limit = 10 } = pagination
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
        this.repository.findMany(where, limit, skip),
        this.repository.count(where)
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        data: data.map((item) => this.transformOutput(item)),
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    } catch (error: any) {
      this.logger.error('Failed to find records with pagination', { error: error.message, where })
      throw error
    }
  }

  async update(id: IdType, data: UpdateInput): Promise<T> {
    try {
      this.logger.info('Updating record', { id, data })

      await this.validateUpdate(id, data)
      const transformedData = await this.transformUpdateData(data, id)
      const result = await this.repository.update(id, transformedData)

      this.logger.info('Record updated successfully', { id })
      await this.afterUpdate(result, data, id)

      return this.transformOutput(result)
    } catch (error: any) {
      this.logger.error('Failed to update record', { error: error.message, id, data })
      throw error
    }
  }

  async delete(id: IdType): Promise<T> {
    try {
      this.logger.info('Deleting record', { id })

      await this.validateDelete(id)

      // Check if record exists first
      await this.findById(id)

      const result = await this.repository.delete(id)

      this.logger.info('Record deleted successfully', { id })
      await this.afterDelete(result, id)

      return this.transformOutput(result)
    } catch (error: any) {
      this.logger.error('Failed to delete record', { error: error.message, id })
      throw error
    }
  }

  async exists(where: WhereInput): Promise<boolean> {
    try {
      const result = await this.repository.findFirst(where)
      return !!result
    } catch (error: any) {
      this.logger.error('Failed to check existence', { error: error.message, where })
      throw error
    }
  }

  async count(where?: WhereInput): Promise<number> {
    try {
      return await this.repository.count(where)
    } catch (error: any) {
      this.logger.error('Failed to count records', { error: error.message, where })
      throw error
    }
  }

  // Hook methods - can be overridden by child classes
  protected async validateCreate(data: CreateInput): Promise<void> {
    // Override in child classes for custom validation
  }

  protected async validateUpdate(id: IdType, data: UpdateInput): Promise<void> {
    // Override in child classes for custom validation
  }

  protected async validateDelete(id: IdType): Promise<void> {
    // Override in child classes for custom validation
  }

  protected async transformCreateData(data: CreateInput): Promise<CreateInput> {
    // Override in child classes for data transformation
    return data
  }

  protected async transformUpdateData(data: UpdateInput, id: IdType): Promise<UpdateInput> {
    // Override in child classes for data transformation
    return data
  }

  protected transformOutput(data: T): T {
    // Override in child classes for output transformation
    return data
  }

  protected async afterCreate(result: T, originalData: CreateInput): Promise<void> {
    // Override in child classes for post-creation logic
  }

  protected async afterUpdate(result: T, originalData: UpdateInput, id: IdType): Promise<void> {
    // Override in child classes for post-update logic
  }

  protected async afterDelete(result: T, id: IdType): Promise<void> {
    // Override in child classes for post-deletion logic
  }

  // Utility methods
  protected getId(entity: T): IdType {
    return (entity as any).id
  }

  protected throwIfExists(condition: boolean, message: string = 'Resource already exists'): void {
    if (condition) {
      throw new ConflictError(message)
    }
  }

  protected throwIfNotExists(condition: boolean, message: string = 'Resource not found'): void {
    if (!condition) {
      throw new NotFoundError(message)
    }
  }

  protected validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestError(`${fieldName} is required`)
    }
  }

  // Batch operations
  async createMany(dataArray: CreateInput[]): Promise<T[]> {
    try {
      this.logger.info('Creating multiple records', { count: dataArray.length })

      const results: T[] = []
      for (const data of dataArray) {
        const result = await this.create(data)
        results.push(result)
      }

      this.logger.info('Multiple records created successfully', { count: results.length })
      return results
    } catch (error: any) {
      this.logger.error('Failed to create multiple records', { error: error.message })
      throw error
    }
  }

  async updateMany(updates: Array<{ id: IdType; data: UpdateInput }>): Promise<T[]> {
    try {
      this.logger.info('Updating multiple records', { count: updates.length })

      const results: T[] = []
      for (const { id, data } of updates) {
        const result = await this.update(id, data)
        results.push(result)
      }

      this.logger.info('Multiple records updated successfully', { count: results.length })
      return results
    } catch (error: any) {
      this.logger.error('Failed to update multiple records', { error: error.message })
      throw error
    }
  }
}

export default BaseService
