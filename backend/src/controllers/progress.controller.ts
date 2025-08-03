import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseController } from './base.controller'
import { ProgressService } from '@/services/progress.service'
import { ProgressCreateDto } from '@/repositories/progress.repository'
import { LessonProgressUpdateDto } from '@/types/roadmap.types'
import { ResponseHandler } from '@/cores/response.handler'
import { BadRequestError } from '@/cores/error.handler'
import catchAsync from '@/utils/catchAsync'

export class ProgressController extends BaseController<any, ProgressCreateDto, LessonProgressUpdateDto> {
  private progressService: ProgressService

  constructor() {
    const progressService = new ProgressService()
    super(progressService)
    this.progressService = progressService
  }

  /**
   * Update lesson progress for user
   * PUT /api/lessons/:lessonId/progress
   */
  updateLessonProgress = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id
    const progressData: LessonProgressUpdateDto = req.body

    if (typeof progressData.isCompleted !== 'boolean') {
      throw new BadRequestError('Completion status is required')
    }

    if (
      progressData.score !== undefined &&
      (typeof progressData.score !== 'number' || progressData.score < 0 || progressData.score > 100)
    ) {
      throw new BadRequestError('Score must be a number between 0 and 100')
    }

    const progress = await this.progressService.updateLessonProgress(userId, lessonId, progressData)

    return ResponseHandler.success(res, {
      message: 'Lesson progress updated successfully',
      data: progress
    })
  })

  /**
   * Get lesson progress for user
   * GET /api/lessons/:lessonId/progress
   */
  getLessonProgress = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id

    const progress = await this.progressService.getLessonProgress(userId, lessonId)

    return ResponseHandler.success(res, {
      message: 'Lesson progress retrieved successfully',
      data: progress
    })
  })

  /**
   * Get all lesson progress for user in a roadmap
   * GET /api/roadmaps/:roadmapId/progress
   */
  getUserProgressInRoadmap = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const progress = await this.progressService.getUserProgressInRoadmap(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'User progress in roadmap retrieved successfully',
      data: progress
    })
  })

  /**
   * Mark lesson as completed
   * POST /api/lessons/:lessonId/complete
   */
  markLessonCompleted = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id
    const { score } = req.body

    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      throw new BadRequestError('Score must be a number between 0 and 100')
    }

    const progress = await this.progressService.markLessonCompleted(userId, lessonId, score)

    return ResponseHandler.success(res, {
      message: 'Lesson marked as completed successfully',
      data: progress
    })
  })

  /**
   * Mark lesson as incomplete (reset progress)
   * POST /api/lessons/:lessonId/incomplete
   */
  markLessonIncomplete = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id

    const progress = await this.progressService.markLessonIncomplete(userId, lessonId)

    return ResponseHandler.success(res, {
      message: 'Lesson marked as incomplete successfully',
      data: progress
    })
  })

  /**
   * Get user's overall learning statistics
   * GET /api/users/:userId/learning-stats
   */
  getUserOverallStats = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params

    // Check if user is accessing their own stats or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own statistics')
    }

    const stats = await this.progressService.getUserOverallStats(userId)

    return ResponseHandler.success(res, {
      message: 'User overall statistics retrieved successfully',
      data: stats
    })
  })

  /**
   * Get recent learning activity for user
   * GET /api/users/:userId/recent-activity
   */
  getRecentActivity = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50)

    // Check if user is accessing their own activity or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own activity')
    }

    const activity = await this.progressService.getRecentActivity(userId, limit)

    return ResponseHandler.success(res, {
      message: 'Recent learning activity retrieved successfully',
      data: activity
    })
  })

  /**
   * Get lesson completion rates for a roadmap
   * GET /api/roadmaps/:roadmapId/lesson-completion-rates
   */
  getRoadmapLessonCompletionRates = catchAsync(async (req: Request, res: Response) => {
    const { roadmapId } = req.params
    const rates = await this.progressService.getRoadmapLessonCompletionRates(roadmapId)

    return ResponseHandler.success(res, {
      message: 'Roadmap lesson completion rates retrieved successfully',
      data: rates
    })
  })

  /**
   * Get user's learning streak
   * GET /api/users/:userId/learning-streak
   */
  getUserLearningStreak = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params

    // Check if user is accessing their own streak or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own streak')
    }

    const streak = await this.progressService.getUserLearningStreak(userId)

    return ResponseHandler.success(res, {
      message: 'User learning streak retrieved successfully',
      data: { streak }
    })
  })

  /**
   * Reset user progress in roadmap
   * DELETE /api/roadmaps/:roadmapId/progress
   */
  resetUserProgressInRoadmap = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    await this.progressService.resetUserProgressInRoadmap(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'User progress in roadmap reset successfully',
      data: { success: true }
    })
  })

  /**
   * Get next lesson for user in roadmap
   * GET /api/lessons/:lessonId/next
   */
  getNextLesson = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id

    const nextLesson = await this.progressService.getNextLesson(userId, lessonId)

    return ResponseHandler.success(res, {
      message: nextLesson ? 'Next lesson retrieved successfully' : 'No next lesson found',
      data: nextLesson
    })
  })

  /**
   * Get previous lesson for user in roadmap
   * GET /api/lessons/:lessonId/previous
   */
  getPreviousLesson = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { lessonId } = req.params
    const userId = req.user.id

    const previousLesson = await this.progressService.getPreviousLesson(userId, lessonId)

    return ResponseHandler.success(res, {
      message: previousLesson ? 'Previous lesson retrieved successfully' : 'No previous lesson found',
      data: previousLesson
    })
  })

  /**
   * Bulk update lesson progress (for admin/import features)
   * POST /api/progress/bulk-update
   */
  bulkUpdateProgress = catchAsync(async (req: Request, res: Response) => {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Admin access required')
    }

    const { updates } = req.body

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new BadRequestError('Updates array is required')
    }

    if (updates.length > 100) {
      throw new BadRequestError('Cannot update more than 100 progress records at once')
    }

    // Validate each update
    for (const update of updates) {
      if (!update.userId || !update.lessonId || !update.progressData) {
        throw new BadRequestError('Each update must have userId, lessonId, and progressData')
      }

      if (typeof update.progressData.isCompleted !== 'boolean') {
        throw new BadRequestError('Completion status is required for each update')
      }

      if (
        update.progressData.score !== undefined &&
        (typeof update.progressData.score !== 'number' ||
          update.progressData.score < 0 ||
          update.progressData.score > 100)
      ) {
        throw new BadRequestError('Score must be a number between 0 and 100')
      }
    }

    const result = await this.progressService.bulkUpdateProgress(updates)

    return ResponseHandler.success(res, {
      message: 'Bulk progress update completed',
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })

  // Override base controller methods
  protected extractCreateData(req: Request): ProgressCreateDto {
    return {
      userId: req.user?.id || '',
      lessonId: req.params.lessonId || req.body.lessonId,
      score: req.body.score,
      isCompleted: req.body.isCompleted
    }
  }

  protected extractUpdateData(req: Request): LessonProgressUpdateDto {
    const data: LessonProgressUpdateDto = {
      isCompleted: req.body.isCompleted
    }

    if (req.body.score !== undefined) {
      data.score = req.body.score
    }

    return data
  }

  protected extractId(req: Request): string {
    return req.params.id
  }

  protected extractQueryParams(req: Request) {
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const where: any = {}

    if (req.query.isCompleted !== undefined) {
      where.isCompleted = req.query.isCompleted === 'true'
    }

    if (req.user?.id) {
      where.userId = req.user.id
    }

    return {
      where,
      pagination: {
        skip: (page - 1) * limit,
        take: limit
      }
    }
  }

  protected getCreateSuccessMessage(): string {
    return 'Progress record created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'Progress retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Progress updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Progress deleted successfully'
  }
}
