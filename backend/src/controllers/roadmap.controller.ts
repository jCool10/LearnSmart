import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseController } from './base.controller'
import { RoadmapService } from '@/services/roadmap.service'
import { RoadmapCreateDto, RoadmapUpdateDto, RoadmapQueryDto } from '@/types/roadmap.types'
import { ResponseHandler } from '@/cores/response.handler'
import { BadRequestError } from '@/cores/error.handler'
import catchAsync from '@/utils/catchAsync'
import { Roadmap } from 'generated/prisma'
import { PaginationDto } from '@/types/dto.types'

export class RoadmapController extends BaseController<Roadmap, RoadmapCreateDto, RoadmapUpdateDto> {
  constructor(private roadmapService: RoadmapService) {
    super(roadmapService)
  }

  /**
   * Get roadmaps with filtering and user enrollment data
   * GET /api/roadmaps
   */
  getRoadmapsWithFilters = catchAsync(async (req: Request, res: Response) => {
    const filters: RoadmapQueryDto = {
      category: req.query.category as string,
      difficulty: req.query.difficulty as any,
      search: req.query.search as string,
      userId: req.query.userId as string
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const pagination = {
      skip: (page - 1) * limit,
      take: limit
    }

    const userId = req.user?.id // From auth middleware
    const result = await this.roadmapService.findWithFiltersAndUserData(filters, pagination, userId)

    return ResponseHandler.success(res, {
      message: 'Roadmaps retrieved successfully',
      data: result
    })
  })

  /**
   * Get roadmap by ID with comprehensive details
   * GET /api/roadmaps/:id
   */
  getRoadmapDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user?.id // From auth middleware

    const roadmap = await this.roadmapService.findByIdWithDetails(id, userId)

    return ResponseHandler.success(res, {
      message: 'Roadmap details retrieved successfully',
      data: roadmap
    })
  })

  /**
   * Create roadmap with lessons and tags
   * POST /api/roadmaps
   */
  createRoadmapWithContent = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User ID is required')
    }

    const createData: RoadmapCreateDto = req.body
    const roadmap = await this.roadmapService.createRoadmapWithContent(createData, req.user.id)

    return ResponseHandler.success(res, {
      message: 'Roadmap created successfully',
      data: roadmap,
      statusCode: StatusCodes.CREATED
    })
  })

  /**
   * Update roadmap by ID
   * PUT /api/roadmaps/:id
   */
  updateRoadmap = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData: RoadmapUpdateDto = req.body

    const roadmap = await this.roadmapService.update(id, updateData)

    return ResponseHandler.success(res, {
      message: 'Roadmap updated successfully',
      data: roadmap
    })
  })

  /**
   * Get user's enrolled roadmaps
   * GET /api/users/:userId/roadmaps
   */
  getUserEnrolledRoadmaps = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    const status = req.query.status as 'enrolled' | 'completed' | 'all'

    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const pagination = {
      skip: (page - 1) * limit,
      take: limit
    }

    const result = await this.roadmapService.getUserEnrolledRoadmaps(userId, status, pagination)

    return ResponseHandler.success(res, {
      message: 'User enrolled roadmaps retrieved successfully',
      data: result
    })
  })

  /**
   * Get roadmap statistics
   * GET /api/roadmaps/:id/stats
   */
  getRoadmapStatistics = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const stats = await this.roadmapService.getRoadmapStatistics(id)

    return ResponseHandler.success(res, {
      message: 'Roadmap statistics retrieved successfully',
      data: stats
    })
  })

  /**
   * Get popular roadmaps
   * GET /api/roadmaps/popular
   */
  getPopularRoadmaps = catchAsync(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50)
    const userId = req.user?.id

    const roadmaps = await this.roadmapService.getPopularRoadmaps(limit, userId)

    return ResponseHandler.success(res, {
      message: 'Popular roadmaps retrieved successfully',
      data: roadmaps
    })
  })

  /**
   * Get recommended roadmaps for user
   * GET /api/roadmaps/recommended
   */
  getRecommendedRoadmaps = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new BadRequestError('User authentication required')
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 5, 20)
    const roadmaps = await this.roadmapService.getRecommendedRoadmaps(req.user.id, limit)

    return ResponseHandler.success(res, {
      message: 'Recommended roadmaps retrieved successfully',
      data: roadmaps
    })
  })

  /**
   * Search roadmaps
   * GET /api/roadmaps/search
   */
  searchRoadmaps = catchAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string
    if (!query) {
      throw new BadRequestError('Search query is required')
    }

    const filters = {
      category: req.query.category as string,
      difficulty: req.query.difficulty as any
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const pagination = {
      skip: (page - 1) * limit,
      take: limit
    }

    const userId = req.user?.id
    const result = await this.roadmapService.searchRoadmaps(query, filters, pagination, userId)

    return ResponseHandler.success(res, {
      message: 'Search results retrieved successfully',
      data: result
    })
  })

  /**
   * Get roadmaps by creator
   * GET /api/roadmaps/creator/:creatorId
   */
  getRoadmapsByCreator = catchAsync(async (req: Request, res: Response) => {
    const { creatorId } = req.params

    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const pagination = {
      skip: (page - 1) * limit,
      take: limit
    }

    const userId = req.user?.id
    const result = await this.roadmapService.getRoadmapsByCreator(creatorId, pagination, userId)

    return ResponseHandler.success(res, {
      message: 'Creator roadmaps retrieved successfully',
      data: result
    })
  })

  /**
   * Delete roadmap (soft delete)
   * DELETE /api/roadmaps/:id
   */
  deleteRoadmap = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params

    // Soft delete by setting isActive to false
    const roadmap = await this.roadmapService.update(id, { isActive: false })

    return ResponseHandler.success(res, {
      message: 'Roadmap deleted successfully',
      data: roadmap
    })
  })

  // Override base controller methods
  protected extractCreateData(req: Request): RoadmapCreateDto {
    return {
      title: req.body.title,
      description: req.body.description,
      categoryId: req.body.categoryId,
      difficulty: req.body.difficulty,
      estimatedTime: req.body.estimatedTime,
      tags: req.body.tags,
      lessons: req.body.lessons
    }
  }

  protected extractUpdateData(req: Request): RoadmapUpdateDto {
    const data: RoadmapUpdateDto = {}

    if (req.body.title !== undefined) data.title = req.body.title
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.categoryId !== undefined) data.categoryId = req.body.categoryId
    if (req.body.difficulty !== undefined) data.difficulty = req.body.difficulty
    if (req.body.estimatedTime !== undefined) data.estimatedTime = req.body.estimatedTime
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive

    return data
  }

  protected extractId(req: Request): string {
    return req.params.id
  }

  protected getCreateSuccessMessage(): string {
    return 'Roadmap created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'Roadmap retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Roadmap updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Roadmap deleted successfully'
  }
}
