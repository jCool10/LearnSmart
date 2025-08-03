import { Roadmap, DifficultyLevel } from 'generated/prisma'
import { BaseService } from './base.service'
import { RoadmapRepository } from '@/repositories/roadmap.repository'
import { CategoryRepository } from '@/repositories/category.repository'
import { TagRepository } from '@/repositories/tag.repository'
import {
  RoadmapCreateDto,
  RoadmapUpdateDto,
  RoadmapQueryDto,
  RoadmapResponseDto,
  RoadmapStatsDto
} from '@/types/roadmap.types'
import { PaginationOptions, PaginationResult } from '@/repositories/base.repository'
import { NotFoundError, BadRequestError } from '@/cores/error.handler'

export class RoadmapService extends BaseService<Roadmap, RoadmapCreateDto, RoadmapUpdateDto, any> {
  private roadmapRepository: RoadmapRepository
  private categoryRepository: CategoryRepository
  private tagRepository: TagRepository

  constructor() {
    const roadmapRepository = new RoadmapRepository()
    super(roadmapRepository)
    this.roadmapRepository = roadmapRepository
    this.categoryRepository = new CategoryRepository()
    this.tagRepository = new TagRepository()
  }

  /**
   * Get roadmaps with filtering and user enrollment data
   */
  async findWithFiltersAndUserData(
    filters: RoadmapQueryDto,
    pagination: PaginationOptions,
    userId?: string
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    try {
      this.logger.info('Fetching roadmaps with filters', { filters, pagination, userId })

      return await this.roadmapRepository.findWithFiltersAndUserData(filters, pagination, userId)
    } catch (error: any) {
      this.logger.error('Failed to fetch roadmaps with filters', { error: error.message, filters })
      throw error
    }
  }

  /**
   * Get roadmap by ID with comprehensive details
   */
  async findByIdWithDetails(id: string, userId?: string): Promise<RoadmapResponseDto> {
    try {
      this.logger.info('Fetching roadmap details', { id, userId })

      const roadmap = await this.roadmapRepository.findByIdWithDetails(id, userId)
      if (!roadmap) {
        throw new NotFoundError(`Roadmap with ID '${id}' not found`)
      }

      return roadmap
    } catch (error: any) {
      this.logger.error('Failed to fetch roadmap details', { error: error.message, id })
      throw error
    }
  }

  /**
   * Create roadmap with lessons and tags
   */
  async createRoadmapWithContent(data: RoadmapCreateDto, creatorId: string): Promise<Roadmap> {
    try {
      this.logger.info('Creating roadmap with content', { data, creatorId })

      // Validate category exists
      await this.categoryRepository.findById(data.categoryId)

      // Validate lessons order if provided
      if (data.lessons && data.lessons.length > 0) {
        this.validateLessonsOrder(data.lessons)
      }

      const roadmapData = { ...data, creatorId }
      return await this.roadmapRepository.createWithLessonsAndTags(roadmapData)
    } catch (error: any) {
      this.logger.error('Failed to create roadmap with content', { error: error.message, data })
      throw error
    }
  }

  /**
   * Update roadmap
   */
  async update(id: string, data: RoadmapUpdateDto): Promise<Roadmap> {
    try {
      this.logger.info('Updating roadmap', { id, data })

      // Validate category exists if being updated
      if (data.categoryId) {
        await this.categoryRepository.findById(data.categoryId)
      }

      return await super.update(id, data)
    } catch (error: any) {
      this.logger.error('Failed to update roadmap', { error: error.message, id, data })
      throw error
    }
  }

  /**
   * Get user's enrolled roadmaps
   */
  async getUserEnrolledRoadmaps(
    userId: string,
    status?: 'enrolled' | 'completed' | 'all',
    pagination?: PaginationOptions
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    try {
      this.logger.info('Fetching user enrolled roadmaps', { userId, status })

      return await this.roadmapRepository.findUserEnrolledRoadmaps(userId, status, pagination)
    } catch (error: any) {
      this.logger.error('Failed to fetch user enrolled roadmaps', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Get roadmap statistics
   */
  async getRoadmapStatistics(roadmapId: string): Promise<RoadmapStatsDto> {
    try {
      this.logger.info('Fetching roadmap statistics', { roadmapId })

      const stats = await this.roadmapRepository.getStatistics(roadmapId)
      if (!stats) {
        throw new NotFoundError(`Roadmap with ID '${roadmapId}' not found`)
      }

      // Get difficulty distribution for all roadmaps (for comparison)
      const difficultyDistribution = await this.getDifficultyDistribution()

      return {
        totalEnrollments: stats.totalEnrollments,
        completionRate: stats.completionRate,
        averageRating: stats.averageRating,
        averageCompletionTime: stats.averageCompletionTime,
        difficultyDistribution
      }
    } catch (error: any) {
      this.logger.error('Failed to fetch roadmap statistics', { error: error.message, roadmapId })
      throw error
    }
  }

  /**
   * Get popular roadmaps
   */
  async getPopularRoadmaps(limit: number = 10, userId?: string): Promise<RoadmapResponseDto[]> {
    try {
      this.logger.info('Fetching popular roadmaps', { limit, userId })

      const filters: RoadmapQueryDto = {}
      const pagination: PaginationOptions = { skip: 0, take: limit }

      const result = await this.roadmapRepository.findWithFiltersAndUserData(filters, pagination, userId)

      // Sort by popularity (enrolledUsers * rating)
      return result.items.sort((a: RoadmapResponseDto, b: RoadmapResponseDto) => {
        const popularityA = a.enrolledUsers * a.rating
        const popularityB = b.enrolledUsers * b.rating
        return popularityB - popularityA
      })
    } catch (error: any) {
      this.logger.error('Failed to fetch popular roadmaps', { error: error.message, limit })
      throw error
    }
  }

  /**
   * Get recommended roadmaps for user
   */
  async getRecommendedRoadmaps(userId: string, limit: number = 5): Promise<RoadmapResponseDto[]> {
    try {
      this.logger.info('Fetching recommended roadmaps', { userId, limit })

      // Get user's enrolled roadmaps to understand preferences
      const userRoadmaps = await this.roadmapRepository.findUserEnrolledRoadmaps(userId, 'all')

      if (userRoadmaps.items.length === 0) {
        // For new users, return popular beginner roadmaps
        const filters: RoadmapQueryDto = { difficulty: DifficultyLevel.BEGINNER }
        const pagination: PaginationOptions = { skip: 0, take: limit }

        const result = await this.roadmapRepository.findWithFiltersAndUserData(filters, pagination, userId)

        return result.items.sort((a: RoadmapResponseDto, b: RoadmapResponseDto) => b.enrolledUsers - a.enrolledUsers)
      }

      // Get categories user is interested in
      const userCategories = [...new Set(userRoadmaps.items.map((r: RoadmapResponseDto) => r.category.value))]

      // Find roadmaps in same categories that user hasn't enrolled in
      const recommendations: RoadmapResponseDto[] = []

      for (const category of userCategories) {
        const filters: RoadmapQueryDto = { category: category as string }
        const pagination: PaginationOptions = { skip: 0, take: limit * 2 }

        const result = await this.roadmapRepository.findWithFiltersAndUserData(filters, pagination, userId)

        // Filter out enrolled roadmaps and add to recommendations
        const unEnrolledRoadmaps = result.items.filter(
          (roadmap: RoadmapResponseDto) => !roadmap.userEnrollment?.isEnrolled
        )

        recommendations.push(...unEnrolledRoadmaps)
      }

      // Remove duplicates and sort by popularity
      const uniqueRecommendations = recommendations
        .filter((roadmap, index, self) => self.findIndex((r) => r.id === roadmap.id) === index)
        .sort((a, b) => {
          const scoreA = a.enrolledUsers * a.rating
          const scoreB = b.enrolledUsers * b.rating
          return scoreB - scoreA
        })

      return uniqueRecommendations.slice(0, limit)
    } catch (error: any) {
      this.logger.error('Failed to fetch recommended roadmaps', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Search roadmaps
   */
  async searchRoadmaps(
    query: string,
    filters: Partial<RoadmapQueryDto> = {},
    pagination: PaginationOptions,
    userId?: string
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    try {
      this.logger.info('Searching roadmaps', { query, filters, pagination, userId })

      const searchFilters: RoadmapQueryDto = {
        ...filters,
        search: query
      }

      return await this.roadmapRepository.findWithFiltersAndUserData(searchFilters, pagination, userId)
    } catch (error: any) {
      this.logger.error('Failed to search roadmaps', { error: error.message, query, filters })
      throw error
    }
  }

  /**
   * Get roadmaps by creator
   */
  async getRoadmapsByCreator(
    creatorId: string,
    pagination: PaginationOptions,
    userId?: string
  ): Promise<PaginationResult<RoadmapResponseDto>> {
    try {
      this.logger.info('Fetching roadmaps by creator', { creatorId, pagination })

      // Use the search functionality with creator filter
      // This would need to be implemented in the repository if needed
      const filters: RoadmapQueryDto = {}

      const result = await this.roadmapRepository.findWithFiltersAndUserData(filters, pagination, userId)

      // Filter by creator (this is a simple implementation)
      // In a real scenario, we'd add creator filtering to the repository
      const creatorRoadmaps = result.items.filter((roadmap: RoadmapResponseDto) => roadmap.creator.id === creatorId)

      return {
        items: creatorRoadmaps,
        data: creatorRoadmaps,
        meta: {
          ...result.meta,
          total: creatorRoadmaps.length,
          totalPages: Math.ceil(creatorRoadmaps.length / (pagination.take || 10))
        }
      }
    } catch (error: any) {
      this.logger.error('Failed to fetch roadmaps by creator', { error: error.message, creatorId })
      throw error
    }
  }

  /**
   * Validate lessons order
   */
  private validateLessonsOrder(lessons: any[]) {
    const orderIndices = lessons.map((lesson) => lesson.orderIndex).sort((a, b) => a - b)

    // Check for duplicates
    const uniqueIndices = [...new Set(orderIndices)]
    if (uniqueIndices.length !== orderIndices.length) {
      throw new BadRequestError('Lesson order indices must be unique')
    }

    // Check for gaps (should start from 1 and be consecutive)
    for (let i = 0; i < orderIndices.length; i++) {
      if (orderIndices[i] !== i + 1) {
        throw new BadRequestError('Lesson order indices must be consecutive starting from 1')
      }
    }
  }

  /**
   * Get difficulty distribution
   */
  private async getDifficultyDistribution() {
    // This is a simplified implementation
    // In reality, we'd add this to the repository
    return {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    }
  }

  /**
   * Validate roadmap data
   */
  protected async validateCreate(data: RoadmapCreateDto): Promise<void> {
    // Validate title length
    if (data.title.length < 5 || data.title.length > 200) {
      throw new BadRequestError('Title must be between 5 and 200 characters')
    }

    // Validate description length
    if (data.description.length < 10 || data.description.length > 2000) {
      throw new BadRequestError('Description must be between 10 and 2000 characters')
    }

    // Validate estimated time format
    const timeRegex = /^\d+\s+(weeks?|months?|days?)$/i
    if (!timeRegex.test(data.estimatedTime)) {
      throw new BadRequestError('Estimated time must be in format like "8 weeks", "3 months", etc.')
    }

    // Validate tags
    if (data.tags && data.tags.length > 10) {
      throw new BadRequestError('Maximum 10 tags allowed')
    }

    // Validate lessons
    if (data.lessons && data.lessons.length > 100) {
      throw new BadRequestError('Maximum 100 lessons allowed per roadmap')
    }
  }

  /**
   * Transform create data
   */
  protected async transformCreateData(data: RoadmapCreateDto): Promise<any> {
    return {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      estimatedTime: data.estimatedTime.trim()
    }
  }

  /**
   * Transform output
   */
  protected transformOutput(data: Roadmap): Roadmap {
    return data
  }

  /**
   * Get entity ID
   */
  protected getId(entity: Roadmap): string {
    return entity.id
  }

  /**
   * Post-create hook
   */
  protected async afterCreate(result: Roadmap): Promise<void> {
    this.logger.info('Roadmap created successfully', {
      id: result.id,
      title: result.title,
      totalLessons: result.totalLessons
    })
  }
}
