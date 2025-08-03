import { BaseService } from './base.service'
import { CategoryRepository } from '@/repositories/category.repository'
import { CategoryCreateDto, CategoryUpdateDto, CategoryWithCountDto } from '@/types/roadmap.types'
import { ConflictError, NotFoundError } from '@/cores/error.handler'
import { Category } from 'generated/prisma'

export class CategoryService extends BaseService<Category, CategoryCreateDto, CategoryUpdateDto, any> {
  private categoryRepository: CategoryRepository

  constructor() {
    const categoryRepository = new CategoryRepository()
    super(categoryRepository)
    this.categoryRepository = categoryRepository
  }

  /**
   * Get all categories with roadmap count
   */
  async getAllWithCount(): Promise<CategoryWithCountDto[]> {
    try {
      this.logger.info('Fetching all categories with roadmap count')
      return await this.categoryRepository.findAllWithCount()
    } catch (error: any) {
      this.logger.error('Failed to fetch categories with count', { error: error.message })
      throw error
    }
  }

  /**
   * Create new category
   */
  async create(data: CategoryCreateDto) {
    try {
      this.logger.info('Creating new category', { data })

      // Check if category with same value already exists
      const existingCategory = await this.categoryRepository.findByValue(data.value)
      if (existingCategory) {
        throw new ConflictError(`Category with value '${data.value}' already exists`)
      }

      return await super.create(data)
    } catch (error: any) {
      this.logger.error('Failed to create category', { error: error.message, data })
      throw error
    }
  }

  /**
   * Update category
   */
  async update(id: string, data: CategoryUpdateDto) {
    try {
      this.logger.info('Updating category', { id, data })

      // If updating value, check for conflicts
      if (data.value) {
        const existsByValue = await this.categoryRepository.existsByValue(data.value, id)
        if (existsByValue) {
          throw new ConflictError(`Category with value '${data.value}' already exists`)
        }
      }

      return await super.update(id, data)
    } catch (error: any) {
      this.logger.error('Failed to update category', { error: error.message, id, data })
      throw error
    }
  }

  /**
   * Get category by value
   */
  async findByValue(value: string) {
    try {
      this.logger.debug('Finding category by value', { value })

      const category = await this.categoryRepository.findByValue(value)
      if (!category) {
        throw new NotFoundError(`Category with value '${value}' not found`)
      }

      return category
    } catch (error: any) {
      this.logger.error('Failed to find category by value', { error: error.message, value })
      throw error
    }
  }

  /**
   * Get categories with statistics
   */
  async getCategoriesWithStatistics() {
    try {
      this.logger.info('Fetching categories with statistics')

      const categoriesWithStats = await this.categoryRepository.findWithStatistics()

      return categoriesWithStats.map((category) => {
        const roadmaps = category.roadmaps
        const totalEnrollments = roadmaps.reduce((sum, roadmap) => sum + roadmap.enrolledUsers, 0)
        const totalCompletions = roadmaps.reduce((sum, roadmap) => sum + roadmap.enrollments.length, 0)
        const averageRating =
          roadmaps.length > 0 ? roadmaps.reduce((sum, roadmap) => sum + roadmap.rating, 0) / roadmaps.length : 0

        return {
          id: category.id,
          value: category.value,
          label: category.label,
          description: category.description,
          roadmapCount: category._count.roadmaps,
          totalEnrollments,
          totalCompletions,
          averageRating: Math.round(averageRating * 100) / 100,
          isActive: category.isActive,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString()
        }
      })
    } catch (error: any) {
      this.logger.error('Failed to fetch categories with statistics', { error: error.message })
      throw error
    }
  }

  /**
   * Soft delete category
   */
  async softDelete(id: string) {
    try {
      this.logger.info('Soft deleting category', { id })

      // Check if category exists
      const category = await this.findById(id)

      // Check if category has active roadmaps
      const categoriesWithCount = await this.categoryRepository.findAllWithCount()
      const categoryWithCount = categoriesWithCount.find((c) => c.id === id)

      if (categoryWithCount && categoryWithCount.roadmapCount > 0) {
        throw new ConflictError('Cannot delete category that has active roadmaps')
      }

      return await this.categoryRepository.softDelete(id)
    } catch (error: any) {
      this.logger.error('Failed to soft delete category', { error: error.message, id })
      throw error
    }
  }

  /**
   * Restore soft deleted category
   */
  async restore(id: string) {
    try {
      this.logger.info('Restoring category', { id })
      return await this.categoryRepository.restore(id)
    } catch (error: any) {
      this.logger.error('Failed to restore category', { error: error.message, id })
      throw error
    }
  }

  /**
   * Validate category data
   */
  protected async validateCreate(data: CategoryCreateDto) {
    // Validate value format (should be kebab-case)
    const valueRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!valueRegex.test(data.value)) {
      throw new Error('Category value must be in kebab-case format (lowercase letters, numbers, and hyphens only)')
    }

    // Validate length
    if (data.value.length < 2 || data.value.length > 50) {
      throw new Error('Category value must be between 2 and 50 characters')
    }

    if (data.label.length < 2 || data.label.length > 100) {
      throw new Error('Category label must be between 2 and 100 characters')
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Category description must not exceed 500 characters')
    }
  }

  /**
   * Transform create data
   */
  protected async transformCreateData(data: CategoryCreateDto) {
    return {
      ...data,
      value: data.value.toLowerCase().trim(),
      label: data.label.trim()
    }
  }

  /**
   * Transform output
   */
  protected transformOutput(data: Category) {
    return data
  }

  /**
   * Get entity ID
   */
  protected getId(entity: Category) {
    return entity.id
  }

  /**
   * Post-create hook
   */
  protected async afterCreate(result: Category, originalData: CategoryCreateDto) {
    this.logger.info('Category created successfully', {
      id: result.id,
      value: result.value,
      label: result.label
    })
  }
}
