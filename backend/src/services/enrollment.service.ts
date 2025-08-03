import { UserRoadmapEnrollment } from '@prisma/client'
import { BaseService } from './base.service'
import { EnrollmentRepository } from '@/repositories/enrollment.repository'
import { RoadmapRepository } from '@/repositories/roadmap.repository'
import { UserRepository } from '@/repositories/user.repository'
import { EnrollmentCreateDto, EnrollmentResponseDto, UserStatsDto } from '@/types/roadmap.types'
import { PaginationOptions } from '@/repositories/base.repository'
import { ConflictError, NotFoundError, BadRequestError } from '@/cores/error.handler'

export class EnrollmentService extends BaseService<
  UserRoadmapEnrollment,
  EnrollmentCreateDto,
  Partial<UserRoadmapEnrollment>,
  any
> {
  private enrollmentRepository: EnrollmentRepository
  private roadmapRepository: RoadmapRepository
  private userRepository: UserRepository

  constructor() {
    const enrollmentRepository = new EnrollmentRepository()
    super(enrollmentRepository)
    this.enrollmentRepository = enrollmentRepository
    this.roadmapRepository = new RoadmapRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Enroll user in roadmap
   */
  async enrollUser(userId: string, roadmapId: string): Promise<EnrollmentResponseDto> {
    try {
      this.logger.info('Enrolling user in roadmap', { userId, roadmapId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Validate roadmap exists and is active
      const roadmap = await this.roadmapRepository.findByIdWithDetails(roadmapId)
      if (!roadmap) {
        throw new NotFoundError(`Roadmap with ID '${roadmapId}' not found`)
      }

      // Check if user is already enrolled
      const existingEnrollment = await this.enrollmentRepository.findByUserAndRoadmap(userId, roadmapId)
      if (existingEnrollment) {
        throw new ConflictError('User is already enrolled in this roadmap')
      }

      const enrollment = await this.enrollmentRepository.enrollUser(userId, roadmapId)

      return {
        id: enrollment.id,
        roadmapId: enrollment.roadmapId,
        userId: enrollment.userId,
        progress: enrollment.progress,
        averageScore: enrollment.averageScore,
        lastAccessedAt: enrollment.lastAccessedAt?.toISOString(),
        completedAt: enrollment.completedAt?.toISOString(),
        isCompleted: enrollment.isCompleted,
        enrolledAt: enrollment.enrolledAt.toISOString()
      }
    } catch (error: any) {
      this.logger.error('Failed to enroll user in roadmap', { error: error.message, userId, roadmapId })
      throw error
    }
  }

  /**
   * Unenroll user from roadmap
   */
  async unenrollUser(userId: string, roadmapId: string): Promise<boolean> {
    try {
      this.logger.info('Unenrolling user from roadmap', { userId, roadmapId })

      // Validate user exists
      await this.userRepository.findById(userId)

      const success = await this.enrollmentRepository.unenrollUser(userId, roadmapId)
      if (!success) {
        throw new NotFoundError('User is not enrolled in this roadmap')
      }

      return success
    } catch (error: any) {
      this.logger.error('Failed to unenroll user from roadmap', { error: error.message, userId, roadmapId })
      throw error
    }
  }

  /**
   * Check if user is enrolled in roadmap
   */
  async isUserEnrolled(userId: string, roadmapId: string): Promise<boolean> {
    try {
      this.logger.debug('Checking if user is enrolled in roadmap', { userId, roadmapId })
      return await this.enrollmentRepository.isUserEnrolled(userId, roadmapId)
    } catch (error: any) {
      this.logger.error('Failed to check enrollment status', { error: error.message, userId, roadmapId })
      throw error
    }
  }

  /**
   * Get user's enrollment details for a roadmap
   */
  async getUserEnrollmentDetails(userId: string, roadmapId: string): Promise<EnrollmentResponseDto> {
    try {
      this.logger.debug('Getting user enrollment details', { userId, roadmapId })

      const enrollment = await this.enrollmentRepository.findUserEnrollmentWithDetails(userId, roadmapId)
      if (!enrollment) {
        throw new NotFoundError('User is not enrolled in this roadmap')
      }

      return enrollment
    } catch (error: any) {
      this.logger.error('Failed to get user enrollment details', { error: error.message, userId, roadmapId })
      throw error
    }
  }

  /**
   * Get user's all enrollments
   */
  async getUserEnrollments(userId: string, status?: 'enrolled' | 'completed' | 'all') {
    try {
      this.logger.info('Getting user enrollments', { userId, status })

      return await this.enrollmentRepository.findUserEnrollments(userId, status)
    } catch (error: any) {
      this.logger.error('Failed to get user enrollments', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Update enrollment progress manually
   */
  async updateEnrollmentProgress(
    userId: string,
    roadmapId: string,
    progress: number,
    averageScore?: number
  ): Promise<UserRoadmapEnrollment> {
    try {
      this.logger.info('Updating enrollment progress', { userId, roadmapId, progress, averageScore })

      // Validate progress value
      if (progress < 0 || progress > 100) {
        throw new BadRequestError('Progress must be between 0 and 100')
      }

      // Validate average score if provided
      if (averageScore !== undefined && (averageScore < 0 || averageScore > 100)) {
        throw new BadRequestError('Average score must be between 0 and 100')
      }

      // Check if user is enrolled
      const enrollment = await this.enrollmentRepository.findByUserAndRoadmap(userId, roadmapId)
      if (!enrollment) {
        throw new NotFoundError('User is not enrolled in this roadmap')
      }

      return await this.enrollmentRepository.updateProgress(userId, roadmapId, progress, averageScore)
    } catch (error: any) {
      this.logger.error('Failed to update enrollment progress', {
        error: error.message,
        userId,
        roadmapId,
        progress
      })
      throw error
    }
  }

  /**
   * Recalculate enrollment progress based on lesson completions
   */
  async recalculateEnrollmentProgress(userId: string, roadmapId: string): Promise<UserRoadmapEnrollment> {
    try {
      this.logger.info('Recalculating enrollment progress', { userId, roadmapId })

      // Check if user is enrolled
      const enrollment = await this.enrollmentRepository.findByUserAndRoadmap(userId, roadmapId)
      if (!enrollment) {
        throw new NotFoundError('User is not enrolled in this roadmap')
      }

      return await this.enrollmentRepository.recalculateProgress(userId, roadmapId)
    } catch (error: any) {
      this.logger.error('Failed to recalculate enrollment progress', {
        error: error.message,
        userId,
        roadmapId
      })
      throw error
    }
  }

  /**
   * Get user's learning statistics
   */
  async getUserStats(userId: string): Promise<UserStatsDto> {
    try {
      this.logger.info('Getting user statistics', { userId })

      // Validate user exists
      await this.userRepository.findById(userId)

      const stats = await this.enrollmentRepository.getUserEnrollmentStats(userId)
      const streak = await this.enrollmentRepository.getUserCompletionStreak(userId)

      return {
        totalEnrollments: stats.totalEnrollments,
        totalCompletions: stats.totalCompletions,
        averageScore: stats.averageScore,
        totalLearningTime: 0, // This would be calculated from lesson progress
        streakDays: streak,
        favoriteCategories: stats.favoriteCategories
      }
    } catch (error: any) {
      this.logger.error('Failed to get user statistics', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Get recent enrollments (admin/analytics)
   */
  async getRecentEnrollments(limit: number = 10) {
    try {
      this.logger.info('Getting recent enrollments', { limit })

      if (limit > 100) {
        throw new BadRequestError('Limit cannot exceed 100')
      }

      return await this.enrollmentRepository.getRecentEnrollments(limit)
    } catch (error: any) {
      this.logger.error('Failed to get recent enrollments', { error: error.message, limit })
      throw error
    }
  }

  /**
   * Get enrollment completion rate for roadmap
   */
  async getRoadmapCompletionRate(roadmapId: string): Promise<number> {
    try {
      this.logger.info('Getting roadmap completion rate', { roadmapId })

      const stats = await this.roadmapRepository.getStatistics(roadmapId)
      if (!stats) {
        throw new NotFoundError(`Roadmap with ID '${roadmapId}' not found`)
      }

      return stats.completionRate
    } catch (error: any) {
      this.logger.error('Failed to get roadmap completion rate', { error: error.message, roadmapId })
      throw error
    }
  }

  /**
   * Get user's learning streak
   */
  async getUserLearningStreak(userId: string): Promise<number> {
    try {
      this.logger.debug('Getting user learning streak', { userId })

      // Validate user exists
      await this.userRepository.findById(userId)

      return await this.enrollmentRepository.getUserCompletionStreak(userId)
    } catch (error: any) {
      this.logger.error('Failed to get user learning streak', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Bulk enroll users in roadmap (admin feature)
   */
  async bulkEnrollUsers(
    userIds: string[],
    roadmapId: string
  ): Promise<{
    successful: string[]
    failed: Array<{ userId: string; error: string }>
  }> {
    try {
      this.logger.info('Bulk enrolling users in roadmap', { userIds, roadmapId })

      if (userIds.length > 100) {
        throw new BadRequestError('Cannot enroll more than 100 users at once')
      }

      // Validate roadmap exists
      await this.roadmapRepository.findByIdWithDetails(roadmapId)

      const successful: string[] = []
      const failed: Array<{ userId: string; error: string }> = []

      for (const userId of userIds) {
        try {
          await this.enrollUser(userId, roadmapId)
          successful.push(userId)
        } catch (error: any) {
          failed.push({ userId, error: error.message })
        }
      }

      return { successful, failed }
    } catch (error: any) {
      this.logger.error('Failed to bulk enroll users', { error: error.message, userIds, roadmapId })
      throw error
    }
  }

  /**
   * Validate enrollment data
   */
  protected async validateCreate(data: EnrollmentCreateDto): Promise<void> {
    // Basic validation is handled in enrollUser method
  }

  /**
   * Transform create data
   */
  protected async transformCreateData(data: EnrollmentCreateDto): Promise<EnrollmentCreateDto> {
    return data
  }

  /**
   * Transform output
   */
  protected transformOutput(data: UserRoadmapEnrollment): UserRoadmapEnrollment {
    return data
  }

  /**
   * Get entity ID
   */
  protected getId(entity: UserRoadmapEnrollment): string {
    return entity.id
  }

  /**
   * Post-create hook
   */
  protected async afterCreate(result: UserRoadmapEnrollment, originalData: EnrollmentCreateDto): Promise<void> {
    this.logger.info('Enrollment created successfully', {
      id: result.id,
      userId: result.userId,
      roadmapId: result.roadmapId
    })
  }
}
