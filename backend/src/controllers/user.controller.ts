import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserService, CreateUserDto, UpdateUserDto } from '../services/user.service'
import { PaginationOptions } from '../repositories/base.repository'
import catchAsync from '../utils/catchAsync'
import { ResponseHandler } from '../cores/response.handler'
import { BaseController } from './base.controller'
import { UserDto, GetUsersQueryDto } from '@/types/dto.types'

export class UserController extends BaseController<UserDto, CreateUserDto, UpdateUserDto> {
  constructor(private userService: UserService) {
    super(userService as any) // Temporary until UserService extends BaseService
  }

  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req) // Keep using req until service is migrated

    ResponseHandler.success(res, {
      message: 'User created successfully',
      data: user,
      statusCode: StatusCodes.CREATED
    })
  })

  getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userService.getUserById(id)

    ResponseHandler.success(res, {
      message: 'User retrieved successfully',
      data: user
    })
  })

  getUserByEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params
    const user = await this.userService.getUserByEmail(email)

    ResponseHandler.success(res, {
      message: 'User retrieved successfully',
      data: user
    })
  })

  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, ...where } = req.query
    const options: PaginationOptions = {
      skip: (parseInt(page as string) - 1) * Math.min(parseInt(limit as string), 100),
      take: Math.min(parseInt(limit as string), 100)
    }

    const result = await this.userService.getAllUsers(options)

    ResponseHandler.paginated(res, {
      message: 'Users retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  searchUsers = catchAsync(async (req: Request, res: Response) => {
    const { q: searchTerm, page = 1, limit = 10 } = req.query

    if (!searchTerm) {
      ResponseHandler.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Search term is required'
      })
      return
    }

    const options: PaginationOptions = {
      skip: (parseInt(page as string) - 1) * Math.min(parseInt(limit as string), 100),
      take: Math.min(parseInt(limit as string), 100)
    }

    const result = await this.userService.searchUsers(searchTerm as string, options)

    ResponseHandler.paginated(res, {
      message: 'Users search completed successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const userData: UpdateUserDto = req.body // Keep using req.body until service is migrated

    const user = await this.userService.updateUser(id, userData)

    ResponseHandler.success(res, {
      message: 'User updated successfully',
      data: user
    })
  })

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userService.deleteUser(id)

    ResponseHandler.success(res, {
      message: 'User deleted successfully',
      data: user
    })
  })

  getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await this.userService.getUserStats()

    ResponseHandler.success(res, {
      message: 'User statistics retrieved successfully',
      data: stats
    })
  })

  getUserRoadmaps = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const { status, page = 1, limit = 10 } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = Math.min(parseInt(limit as string), 100)

    const result = await this.userService.getUserRoadmaps(
      id,
      status as 'enrolled' | 'completed' | 'all' | undefined,
      pageNum,
      limitNum
    )

    ResponseHandler.paginated(res, {
      message: 'User roadmaps retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  // Override message methods for more specific user messages
  protected getCreateSuccessMessage(): string {
    return 'User created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'User retrieved successfully'
  }

  protected getListSuccessMessage(): string {
    return 'Users retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'User updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'User deleted successfully'
  }
}
