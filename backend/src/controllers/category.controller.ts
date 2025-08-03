import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BaseController } from './base.controller'
import { CategoryService } from '@/services/category.service'
import { CategoryCreateDto, CategoryUpdateDto } from '@/types/roadmap.types'
import { ResponseHandler } from '@/cores/response.handler'
import catchAsync from '@/utils/catchAsync'
import { PaginationDto } from '@/types/dto.types'
import { Category } from 'generated/prisma'

export class CategoryController extends BaseController<Category, CategoryCreateDto, CategoryUpdateDto> {
  constructor(private categoryService: CategoryService) {
    super(categoryService)
  }

  /**
   * Get all categories with roadmap count
   * GET /api/categories
   */
  getAllWithCount = catchAsync(async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAllWithCount()

    return ResponseHandler.success(res, {
      message: 'Categories retrieved successfully',
      data: categories
    })
  })

  /**
   * Get categories with statistics
   * GET /api/categories/stats
   */
  getCategoriesWithStatistics = catchAsync(async (req: Request, res: Response) => {
    const categoriesWithStats = await this.categoryService.getCategoriesWithStatistics()

    return ResponseHandler.success(res, {
      message: 'Categories with statistics retrieved successfully',
      data: categoriesWithStats
    })
  })

  /**
   * Get category by value
   * GET /api/categories/value/:value
   */
  getByValue = catchAsync(async (req: Request, res: Response) => {
    const { value } = req.params
    const category = await this.categoryService.findByValue(value)

    return ResponseHandler.success(res, {
      message: 'Category retrieved successfully',
      data: category
    })
  })

  /**
   * Create new category
   * POST /api/categories
   */
  create = catchAsync(async (req: Request, res: Response) => {
    const createData: CategoryCreateDto = req.body
    const category = await this.categoryService.create(createData)

    return ResponseHandler.success(res, {
      message: 'Category created successfully',
      data: category,
      statusCode: StatusCodes.CREATED
    })
  })

  /**
   * Update category by ID
   * PUT /api/categories/:id
   */
  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData: CategoryUpdateDto = req.body

    const category = await this.categoryService.update(id, updateData)

    return ResponseHandler.success(res, {
      message: 'Category updated successfully',
      data: category
    })
  })

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await this.categoryService.findById(id)

    return ResponseHandler.success(res, {
      message: 'Category retrieved successfully',
      data: category
    })
  })

  /**
   * Get all categories (paginated)
   * GET /api/categories
   */
  getMany = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const pagination = {
      take: limit,
      skip: (page - 1) * limit
    }

    const result = await this.categoryService.findWithPagination({}, pagination)

    return ResponseHandler.success(res, {
      message: 'Categories retrieved successfully',
      data: result
    })
  })

  /**
   * Soft delete category
   * DELETE /api/categories/:id
   */
  softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await this.categoryService.softDelete(id)

    return ResponseHandler.success(res, {
      message: 'Category deleted successfully',
      data: category
    })
  })

  /**
   * Restore soft deleted category
   * POST /api/categories/:id/restore
   */
  restore = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await this.categoryService.restore(id)

    return ResponseHandler.success(res, {
      message: 'Category restored successfully',
      data: category
    })
  })

  // Override base controller methods for custom behavior
  protected extractCreateData(req: Request): CategoryCreateDto {
    return {
      value: req.body.value,
      label: req.body.label,
      description: req.body.description
    }
  }

  protected extractUpdateData(req: Request): CategoryUpdateDto {
    const data: CategoryUpdateDto = {}

    if (req.body.value !== undefined) data.value = req.body.value
    if (req.body.label !== undefined) data.label = req.body.label
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive

    return data
  }

  protected extractId(req: Request): string {
    return req.params.id
  }

  protected extractQueryParams(req: Request): { where: any; pagination: PaginationDto } {
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)

    const where: any = {}

    // Add filters if needed
    if (req.query.isActive !== undefined) {
      where.isActive = req.query.isActive === 'true'
    }

    if (req.query.search) {
      where.OR = [
        { label: { contains: req.query.search as string, mode: 'insensitive' } },
        { description: { contains: req.query.search as string, mode: 'insensitive' } }
      ]
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
    return 'Category created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'Category retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Category updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Category deleted successfully'
  }
}
