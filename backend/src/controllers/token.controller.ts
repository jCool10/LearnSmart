import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TokenService, CreateTokenDto, UpdateTokenDto } from '../services/token.service'
import { PaginationOptions } from '../repositories/base.repository'
import catchAsync from '../utils/catchAsync'
import { ResponseHandler } from '../cores/response.handler'
import { BaseController } from './base.controller'
import { TokenDto } from '@/types/dto.types'

export class TokenController extends BaseController<TokenDto, CreateTokenDto, UpdateTokenDto> {
  constructor(private tokenService: TokenService) {
    super(tokenService as any) // Temporary until TokenService extends BaseService
  }

  createToken = catchAsync(async (req: Request, res: Response) => {
    const tokenData: CreateTokenDto = req.body
    const token = await this.tokenService.createToken(tokenData)

    ResponseHandler.success(res, {
      message: 'Token created successfully',
      data: token,
      statusCode: StatusCodes.CREATED
    })
  })

  getTokenById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const token = await this.tokenService.getTokenById(id)

    ResponseHandler.success(res, {
      message: 'Token retrieved successfully',
      data: token
    })
  })

  getTokenByValue = catchAsync(async (req: Request, res: Response) => {
    const { token: tokenValue } = req.params
    const token = await this.tokenService.getTokenByToken(tokenValue)

    ResponseHandler.success(res, {
      message: 'Token retrieved successfully',
      data: token
    })
  })

  getAllTokens = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query
    const options: PaginationOptions = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100) // Max 100 items per page
    }

    const result = await this.tokenService.getAllTokens(options)

    ResponseHandler.paginated(res, {
      message: 'Tokens retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  getTokensByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query
    const options: PaginationOptions = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100)
    }

    const result = await this.tokenService.getTokensByUserId(userId, options)

    ResponseHandler.paginated(res, {
      message: 'User tokens retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  getTokensByType = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params
    const { page = 1, limit = 10 } = req.query
    const options: PaginationOptions = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100)
    }

    const result = await this.tokenService.getTokensByType(type as any, options)

    ResponseHandler.paginated(res, {
      message: 'Tokens by type retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  getActiveTokens = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query
    const options: PaginationOptions = {
      page: parseInt(page as string),
      limit: Math.min(parseInt(limit as string), 100)
    }

    const result = await this.tokenService.getActiveTokens(options)

    ResponseHandler.paginated(res, {
      message: 'Active tokens retrieved successfully',
      data: result.data,
      pagination: result.meta
    })
  })

  updateToken = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const tokenData: UpdateTokenDto = req.body

    const token = await this.tokenService.updateToken(id, tokenData)

    ResponseHandler.success(res, {
      message: 'Token updated successfully',
      data: token
    })
  })

  blacklistToken = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const token = await this.tokenService.blacklistToken(id)

    ResponseHandler.success(res, {
      message: 'Token blacklisted successfully',
      data: token
    })
  })

  blacklistTokenByValue = catchAsync(async (req: Request, res: Response) => {
    const { token: tokenValue } = req.params
    const token = await this.tokenService.blacklistTokenByValue(tokenValue)

    ResponseHandler.success(res, {
      message: 'Token blacklisted successfully',
      data: token
    })
  })

  deleteToken = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const token = await this.tokenService.deleteToken(id)

    ResponseHandler.success(res, {
      message: 'Token deleted successfully',
      data: token
    })
  })

  deleteExpiredTokens = catchAsync(async (req: Request, res: Response) => {
    const deletedCount = await this.tokenService.deleteExpiredTokens()

    ResponseHandler.success(res, {
      message: 'Expired tokens deleted successfully',
      data: { deletedCount }
    })
  })

  deleteTokensByUserId = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params
    const deletedCount = await this.tokenService.deleteTokensByUserId(userId)

    ResponseHandler.success(res, {
      message: 'User tokens deleted successfully',
      data: { deletedCount }
    })
  })

  verifyToken = catchAsync(async (req: Request, res: Response) => {
    const { token: tokenValue } = req.params
    const result = await this.tokenService.verifyToken(tokenValue)

    ResponseHandler.success(res, {
      message: result.valid ? 'Token is valid' : 'Token is invalid',
      data: result
    })
  })

  getTokenStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await this.tokenService.getTokenStats()

    ResponseHandler.success(res, {
      message: 'Token statistics retrieved successfully',
      data: stats
    })
  })

  // Override message methods for more specific token messages
  protected getCreateSuccessMessage(): string {
    return 'Token created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'Token retrieved successfully'
  }

  protected getListSuccessMessage(): string {
    return 'Tokens retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Token updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Token deleted successfully'
  }
}
