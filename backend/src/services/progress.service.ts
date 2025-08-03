import { UserLessonProgress } from '@prisma/client'
import { BaseService } from './base.service'
import { ProgressRepository, ProgressCreateDto } from '@/repositories/progress.repository'
import { LessonRepository } from '@/repositories/lesson.repository'
import { EnrollmentRepository } from '@/repositories/enrollment.repository'
import { UserRepository } from '@/repositories/user.repository'
import { LessonProgressUpdateDto, LessonProgressResponseDto } from '@/types/roadmap.types'
import { NotFoundError, BadRequestError } from '@/cores/error.handler'

export class ProgressService extends BaseService<UserLessonProgress, ProgressCreateDto, LessonProgressUpdateDto, any> {
  private progressRepository: ProgressRepository
  private lessonRepository: LessonRepository
  private enrollmentRepository: EnrollmentRepository
  private userRepository: UserRepository

  constructor() {
    const progressRepository = new ProgressRepository()
    super(progressRepository)
    this.progressRepository = progressRepository
    this.lessonRepository = new LessonRepository()
    this.enrollmentRepository = new EnrollmentRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Update lesson progress for user
   */
  async updateLessonProgress(
    userId: string,
    lessonId: string,
    progressData: LessonProgressUpdateDto
  ): Promise<LessonProgressResponseDto> {
    try {
      this.logger.info('Updating lesson progress', { userId, lessonId, progressData })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Validate lesson exists and get roadmap info
      const lesson = await this.lessonRepository.findByIdWithProgress(lessonId, userId)
      if (!lesson) {
        throw new NotFoundError(`Lesson with ID '${lessonId}' not found`)
      }

      // Get roadmap ID from lesson
      const lessonData = await this.lessonRepository.findById(lessonId)
      if (!lessonData) {
        throw new NotFoundError(`Lesson with ID '${lessonId}' not found`)
      }

      // Check if user is enrolled in the roadmap
      const isEnrolled = await this.enrollmentRepository.isUserEnrolled(userId, lessonData.roadmapId)
      if (!isEnrolled) {
        throw new BadRequestError('User must be enrolled in the roadmap to update lesson progress')
      }

      // Validate score if provided
      if (progressData.score !== undefined && (progressData.score < 0 || progressData.score > 100)) {
        throw new BadRequestError('Score must be between 0 and 100')
      }

      return await this.progressRepository.updateLessonProgress(userId, lessonId, progressData)
    } catch (error: any) {
      this.logger.error('Failed to update lesson progress', {
        error: error.message,
        userId,
        lessonId,
        progressData
      })
      throw error
    }
  }

  /**
   * Get lesson progress for user
   */
  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgressResponseDto> {
    try {
      this.logger.debug('Getting lesson progress', { userId, lessonId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Validate lesson exists
      await this.lessonRepository.findById(lessonId)

      const progress = await this.progressRepository.findByUserAndLesson(userId, lessonId)
      if (!progress) {
        throw new NotFoundError('No progress found for this lesson')
      }

      return progress
    } catch (error: any) {
      this.logger.error('Failed to get lesson progress', { error: error.message, userId, lessonId })
      throw error
    }
  }

  /**
   * Get all lesson progress for user in a roadmap
   */
  async getUserProgressInRoadmap(userId: string, roadmapId: string): Promise<LessonProgressResponseDto[]> {
    try {
      this.logger.info('Getting user progress in roadmap', { userId, roadmapId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Check if user is enrolled in roadmap
      const isEnrolled = await this.enrollmentRepository.isUserEnrolled(userId, roadmapId)
      if (!isEnrolled) {
        throw new BadRequestError('User is not enrolled in this roadmap')
      }

      return await this.progressRepository.findUserProgressInRoadmap(userId, roadmapId)
    } catch (error: any) {
      this.logger.error('Failed to get user progress in roadmap', {
        error: error.message,
        userId,
        roadmapId
      })
      throw error
    }
  }

  /**
   * Mark lesson as completed
   */
  async markLessonCompleted(userId: string, lessonId: string, score?: number): Promise<LessonProgressResponseDto> {
    try {
      this.logger.info('Marking lesson as completed', { userId, lessonId, score })

      const progressData: LessonProgressUpdateDto = {
        isCompleted: true,
        ...(score !== undefined && { score })
      }

      return await this.updateLessonProgress(userId, lessonId, progressData)
    } catch (error: any) {
      this.logger.error('Failed to mark lesson as completed', {
        error: error.message,
        userId,
        lessonId,
        score
      })
      throw error
    }
  }

  /**
   * Mark lesson as incomplete (reset progress)
   */
  async markLessonIncomplete(userId: string, lessonId: string): Promise<LessonProgressResponseDto> {
    try {
      this.logger.info('Marking lesson as incomplete', { userId, lessonId })

      const progressData: LessonProgressUpdateDto = {
        isCompleted: false,
        score: undefined
      }

      return await this.updateLessonProgress(userId, lessonId, progressData)
    } catch (error: any) {
      this.logger.error('Failed to mark lesson as incomplete', {
        error: error.message,
        userId,
        lessonId
      })
      throw error
    }
  }

  /**
   * Get user's overall learning statistics
   */
  async getUserOverallStats(userId: string) {
    try {
      this.logger.info('Getting user overall statistics', { userId })

      // Validate user exists
      await this.userRepository.findById(userId)

      return await this.progressRepository.getUserOverallStats(userId)
    } catch (error: any) {
      this.logger.error('Failed to get user overall statistics', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Get recent learning activity for user
   */
  async getRecentActivity(userId: string, limit: number = 10) {
    try {
      this.logger.info('Getting recent learning activity', { userId, limit })

      // Validate user exists
      await this.userRepository.findById(userId)

      if (limit > 50) {
        throw new BadRequestError('Limit cannot exceed 50')
      }

      return await this.progressRepository.getRecentActivity(userId, limit)
    } catch (error: any) {
      this.logger.error('Failed to get recent activity', { error: error.message, userId, limit })
      throw error
    }
  }

  /**
   * Get lesson completion rates for a roadmap
   */
  async getRoadmapLessonCompletionRates(roadmapId: string) {
    try {
      this.logger.info('Getting roadmap lesson completion rates', { roadmapId })

      return await this.progressRepository.getRoadmapLessonCompletionRates(roadmapId)
    } catch (error: any) {
      this.logger.error('Failed to get roadmap lesson completion rates', {
        error: error.message,
        roadmapId
      })
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

      return await this.progressRepository.getUserLearningStreak(userId)
    } catch (error: any) {
      this.logger.error('Failed to get user learning streak', { error: error.message, userId })
      throw error
    }
  }

  /**
   * Reset user progress in roadmap
   */
  async resetUserProgressInRoadmap(userId: string, roadmapId: string): Promise<void> {
    try {
      this.logger.info('Resetting user progress in roadmap', { userId, roadmapId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Check if user is enrolled in roadmap
      const isEnrolled = await this.enrollmentRepository.isUserEnrolled(userId, roadmapId)
      if (!isEnrolled) {
        throw new BadRequestError('User is not enrolled in this roadmap')
      }

      // Delete all progress
      await this.progressRepository.deleteUserProgressInRoadmap(userId, roadmapId)

      // Reset enrollment progress to 0
      await this.enrollmentRepository.updateProgress(userId, roadmapId, 0, 0)
    } catch (error: any) {
      this.logger.error('Failed to reset user progress in roadmap', {
        error: error.message,
        userId,
        roadmapId
      })
      throw error
    }
  }

  /**
   * Get next lesson for user in roadmap
   */
  async getNextLesson(userId: string, currentLessonId: string) {
    try {
      this.logger.debug('Getting next lesson for user', { userId, currentLessonId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Validate current lesson exists
      await this.lessonRepository.findById(currentLessonId)

      return await this.lessonRepository.findNextLesson(currentLessonId)
    } catch (error: any) {
      this.logger.error('Failed to get next lesson', {
        error: error.message,
        userId,
        currentLessonId
      })
      throw error
    }
  }

  /**
   * Get previous lesson for user in roadmap
   */
  async getPreviousLesson(userId: string, currentLessonId: string) {
    try {
      this.logger.debug('Getting previous lesson for user', { userId, currentLessonId })

      // Validate user exists
      await this.userRepository.findById(userId)

      // Validate current lesson exists
      await this.lessonRepository.findById(currentLessonId)

      return await this.lessonRepository.findPreviousLesson(currentLessonId)
    } catch (error: any) {
      this.logger.error('Failed to get previous lesson', {
        error: error.message,
        userId,
        currentLessonId
      })
      throw error
    }
  }

  /**
   * Bulk update lesson progress (for admin/import features)
   */
  async bulkUpdateProgress(
    updates: Array<{
      userId: string
      lessonId: string
      progressData: LessonProgressUpdateDto
    }>
  ): Promise<{
    successful: number
    failed: Array<{ userId: string; lessonId: string; error: string }>
  }> {
    try {
      this.logger.info('Bulk updating lesson progress', { updateCount: updates.length })

      if (updates.length > 100) {
        throw new BadRequestError('Cannot update more than 100 progress records at once')
      }

      let successful = 0
      const failed: Array<{ userId: string; lessonId: string; error: string }> = []

      for (const update of updates) {
        try {
          await this.updateLessonProgress(update.userId, update.lessonId, update.progressData)
          successful++
        } catch (error: any) {
          failed.push({
            userId: update.userId,
            lessonId: update.lessonId,
            error: error.message
          })
        }
      }

      return { successful, failed }
    } catch (error: any) {
      this.logger.error('Failed to bulk update progress', { error: error.message, updateCount: updates.length })
      throw error
    }
  }

  /**
   * Validate progress data
   */
  protected async validateCreate(data: ProgressCreateDto): Promise<void> {
    // Basic validation handled in updateLessonProgress method
  }

  /**
   * Transform create data
   */
  protected async transformCreateData(data: ProgressCreateDto): Promise<ProgressCreateDto> {
    return data
  }

  /**
   * Transform output
   */
  protected transformOutput(data: UserLessonProgress): UserLessonProgress {
    return data
  }

  /**
   * Get entity ID
   */
  protected getId(entity: UserLessonProgress): string {
    return entity.id
  }

  /**
   * Post-create hook
   */
  protected async afterCreate(result: UserLessonProgress, originalData: ProgressCreateDto): Promise<void> {
    this.logger.info('Progress record created successfully', {
      id: result.id,
      userId: result.userId,
      lessonId: result.lessonId,
      isCompleted: result.isCompleted
    })
  }
}
