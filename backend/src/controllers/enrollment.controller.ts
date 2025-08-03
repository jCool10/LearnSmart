import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseController } from './base.controller'
import { EnrollmentService } from '@/services/enrollment.service'
import { EnrollmentCreateDto } from '@/types/roadmap.types'
import { ResponseHandler } from '@/cores/response.handler'
import { BadRequestError } from '@/cores/error.handler'
import catchAsync from '@/utils/catchAsync'
import { PaginationDto } from '@/types/dto.types'
import { UserRoadmapEnrollment } from 'generated/prisma'

export class EnrollmentController extends BaseController<UserRoadmapEnrollment, EnrollmentCreateDto, any> {
  constructor(private enrollmentService: EnrollmentService) {
    super(enrollmentService)
  }

  /**
   * Enroll user in roadmap
   * POST /api/roadmaps/:roadmapId/enroll
   */
  enrollUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const enrollment = await this.enrollmentService.enrollUser(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'Successfully enrolled in roadmap',
      data: enrollment,
      statusCode: StatusCodes.CREATED
    })
  })

  /**
   * Unenroll user from roadmap
   * DELETE /api/roadmaps/:roadmapId/enroll
   */
  unenrollUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const success = await this.enrollmentService.unenrollUser(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: success ? 'Successfully unenrolled from roadmap' : 'User was not enrolled in this roadmap',
      data: { success }
    })
  })

  /**
   * Check if user is enrolled in roadmap
   * GET /api/roadmaps/:roadmapId/enrollment-status
   */
  checkEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const isEnrolled = await this.enrollmentService.isUserEnrolled(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'Enrollment status retrieved successfully',
      data: { isEnrolled }
    })
  })

  /**
   * Get user's enrollment details for a roadmap
   * GET /api/roadmaps/:roadmapId/enrollment
   */
  getEnrollmentDetails = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const enrollment = await this.enrollmentService.getUserEnrollmentDetails(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'Enrollment details retrieved successfully',
      data: enrollment
    })
  })

  /**
   * Get user's all enrollments
   * GET /api/users/:userId/enrollments
   */
  getUserEnrollments = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    const status = req.query.status as 'enrolled' | 'completed' | 'all'

    // Check if user is accessing their own enrollments or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own enrollments')
    }

    const enrollments = await this.enrollmentService.getUserEnrollments(userId, status)

    return ResponseHandler.success(res, {
      message: 'User enrollments retrieved successfully',
      data: enrollments
    })
  })

  /**
   * Update enrollment progress manually
   * PUT /api/roadmaps/:roadmapId/progress
   */
  updateEnrollmentProgress = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id
    const { progress, averageScore } = req.body

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      throw new BadRequestError('Progress must be a number between 0 and 100')
    }

    if (averageScore !== undefined && (typeof averageScore !== 'number' || averageScore < 0 || averageScore > 100)) {
      throw new BadRequestError('Average score must be a number between 0 and 100')
    }

    const enrollment = await this.enrollmentService.updateEnrollmentProgress(userId, roadmapId, progress, averageScore)

    return ResponseHandler.success(res, {
      message: 'Enrollment progress updated successfully',
      data: enrollment
    })
  })

  /**
   * Recalculate enrollment progress based on lesson completions
   * POST /api/roadmaps/:roadmapId/recalculate-progress
   */
  recalculateProgress = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const { roadmapId } = req.params
    const userId = req.user.id

    const enrollment = await this.enrollmentService.recalculateEnrollmentProgress(userId, roadmapId)

    return ResponseHandler.success(res, {
      message: 'Enrollment progress recalculated successfully',
      data: enrollment
    })
  })

  /**
   * Get user's learning statistics
   * GET /api/users/:userId/stats
   */
  getUserStats = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params

    // Check if user is accessing their own stats or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own statistics')
    }

    const stats = await this.enrollmentService.getUserStats(userId)

    return ResponseHandler.success(res, {
      message: 'User statistics retrieved successfully',
      data: stats
    })
  })

  /**
   * Get recent enrollments (admin/analytics)
   * GET /api/enrollments/recent
   */
  getRecentEnrollments = catchAsync(async (req: Request, res: Response) => {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Admin access required')
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)
    const enrollments = await this.enrollmentService.getRecentEnrollments(limit)

    return ResponseHandler.success(res, {
      message: 'Recent enrollments retrieved successfully',
      data: enrollments
    })
  })

  /**
   * Get enrollment completion rate for roadmap
   * GET /api/roadmaps/:roadmapId/completion-rate
   */
  getRoadmapCompletionRate = catchAsync(async (req: Request, res: Response) => {
    const { roadmapId } = req.params
    const completionRate = await this.enrollmentService.getRoadmapCompletionRate(roadmapId)

    return ResponseHandler.success(res, {
      message: 'Roadmap completion rate retrieved successfully',
      data: { completionRate }
    })
  })

  /**
   * Get user's learning streak
   * GET /api/users/:userId/streak
   */
  getUserLearningStreak = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params

    // Check if user is accessing their own streak or if admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Can only view your own streak')
    }

    const streak = await this.enrollmentService.getUserLearningStreak(userId)

    return ResponseHandler.success(res, {
      message: 'User learning streak retrieved successfully',
      data: { streak }
    })
  })

  /**
   * Bulk enroll users in roadmap (admin feature)
   * POST /api/roadmaps/:roadmapId/bulk-enroll
   */
  bulkEnrollUsers = catchAsync(async (req: Request, res: Response) => {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Access denied: Admin access required')
    }

    const { roadmapId } = req.params
    const { userIds } = req.body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new BadRequestError('User IDs array is required')
    }

    if (userIds.length > 100) {
      throw new BadRequestError('Cannot enroll more than 100 users at once')
    }

    const result = await this.enrollmentService.bulkEnrollUsers(userIds, roadmapId)

    return ResponseHandler.success(res, {
      message: 'Bulk enrollment completed',
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })

  // Override base controller methods
  protected extractCreateData(req: Request): EnrollmentCreateDto {
    return {
      userId: req.user?.id || '',
      roadmapId: req.params.roadmapId || req.body.roadmapId
    }
  }

  protected extractId(req: Request): string {
    return req.params.id
  }

  protected extractQueryParams(req: Request): { where: any; pagination: PaginationDto } {
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const where: any = {}

    if (req.query.status) {
      if (req.query.status === 'completed') {
        where.isCompleted = true
      } else if (req.query.status === 'enrolled') {
        where.isCompleted = false
      }
    }

    return {
      where,
      pagination: {
        page,
        limit
      }
    }
  }

  protected getCreateSuccessMessage(): string {
    return 'Successfully enrolled in roadmap'
  }

  protected getFindSuccessMessage(): string {
    return 'Enrollment retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Enrollment updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Successfully unenrolled from roadmap'
  }
}
