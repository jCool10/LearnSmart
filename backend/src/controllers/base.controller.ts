import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseHandler } from '@/cores/response.handler'
import { BaseService } from '@/services/base.service'
import catchAsync from '@/utils/catchAsync'
import { PaginationDto } from '@/types/dto.types'

export interface ControllerConfig {
  defaultPageSize?: number
  maxPageSize?: number
}

export abstract class BaseController<T, CreateDto, UpdateDto, WhereDto = any, IdType = string> {
  protected service: BaseService<T, CreateDto, UpdateDto, WhereDto, IdType>
  protected config: ControllerConfig

  constructor(service: BaseService<T, CreateDto, UpdateDto, WhereDto, IdType>, config: ControllerConfig = {}) {
    this.service = service
    this.config = {
      defaultPageSize: 10,
      maxPageSize: 100,
      ...config
    }
  }

  // Standard CRUD endpoints
  create = catchAsync(async (req: Request, res: Response) => {
    const createData = this.extractCreateData(req)
    const result = await this.service.create(createData)

    return ResponseHandler.success(res, {
      message: this.getCreateSuccessMessage(),
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })

  getById = catchAsync(async (req: Request, res: Response) => {
    const id = this.extractId(req)
    const result = await this.service.findById(id)

    return ResponseHandler.success(res, {
      message: this.getFindSuccessMessage(),
      data: result
    })
  })

  getMany = catchAsync(async (req: Request, res: Response) => {
    const { where, pagination } = this.extractQueryParams(req)
    const result = await this.service.findWithPagination(where, pagination)

    return ResponseHandler.paginated(res, {
      message: this.getListSuccessMessage(),
      data: result.data,
      pagination: result.meta
    })
  })

  update = catchAsync(async (req: Request, res: Response) => {
    const id = this.extractId(req)
    const updateData = this.extractUpdateData(req)
    const result = await this.service.update(id, updateData)

    return ResponseHandler.success(res, {
      message: this.getUpdateSuccessMessage(),
      data: result
    })
  })

  delete = catchAsync(async (req: Request, res: Response) => {
    const id = this.extractId(req)
    const result = await this.service.delete(id)

    return ResponseHandler.success(res, {
      message: this.getDeleteSuccessMessage(),
      data: result
    })
  })

  count = catchAsync(async (req: Request, res: Response) => {
    const where = this.extractWhereParams(req)
    const result = await this.service.count(where)

    return ResponseHandler.success(res, {
      message: 'Count retrieved successfully',
      data: { count: result }
    })
  })

  exists = catchAsync(async (req: Request, res: Response) => {
    const where = this.extractWhereParams(req)
    const result = await this.service.exists(where)

    return ResponseHandler.success(res, {
      message: 'Existence check completed',
      data: { exists: result }
    })
  })

  // Batch operations
  createMany = catchAsync(async (req: Request, res: Response) => {
    const createDataArray = this.extractCreateManyData(req)
    const results = await this.service.createMany(createDataArray)

    return ResponseHandler.success(res, {
      message: `${results.length} records created successfully`,
      data: results,
      statusCode: StatusCodes.CREATED
    })
  })

  updateMany = catchAsync(async (req: Request, res: Response) => {
    const updateDataArray = this.extractUpdateManyData(req)
    const results = await this.service.updateMany(updateDataArray)

    return ResponseHandler.success(res, {
      message: `${results.length} records updated successfully`,
      data: results
    })
  })

  // Data extraction methods - can be overridden by child classes
  protected extractId(req: Request): IdType {
    return req.params.id as IdType
  }

  protected extractCreateData(req: Request): CreateDto {
    return req.body as CreateDto
  }

  protected extractUpdateData(req: Request): UpdateDto {
    return req.body as UpdateDto
  }

  protected extractCreateManyData(req: Request): CreateDto[] {
    return req.body.data || (req.body as CreateDto[])
  }

  protected extractUpdateManyData(req: Request): Array<{ id: IdType; data: UpdateDto }> {
    return req.body.updates || (req.body as Array<{ id: IdType; data: UpdateDto }>)
  }

  protected extractWhereParams(req: Request): WhereDto {
    const { page, limit, sortBy, sortOrder, ...where } = req.query
    return where as WhereDto
  }

  protected extractQueryParams(req: Request): { where: WhereDto; pagination: PaginationDto } {
    const { page, limit, sortBy, sortOrder, ...where } = req.query

    const pagination: PaginationDto = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: Math.min(limit ? parseInt(limit as string, 10) : this.config.defaultPageSize!, this.config.maxPageSize!),
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
    }

    return {
      where: where as WhereDto,
      pagination
    }
  }

  // Message methods - can be overridden by child classes
  protected getCreateSuccessMessage(): string {
    return 'Record created successfully'
  }

  protected getFindSuccessMessage(): string {
    return 'Record retrieved successfully'
  }

  protected getListSuccessMessage(): string {
    return 'Records retrieved successfully'
  }

  protected getUpdateSuccessMessage(): string {
    return 'Record updated successfully'
  }

  protected getDeleteSuccessMessage(): string {
    return 'Record deleted successfully'
  }

  // Utility methods
  protected sendSuccess<TData = any>(
    res: Response,
    message: string,
    data?: TData,
    statusCode: number = StatusCodes.OK
  ) {
    return ResponseHandler.success(res, {
      message,
      data,
      statusCode
    })
  }

  protected sendPaginated<TData = any>(res: Response, message: string, data: TData[], pagination: any) {
    return ResponseHandler.paginated(res, {
      message,
      data,
      pagination
    })
  }

  // Helper for custom endpoints
  protected createEndpoint = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return catchAsync(handler)
  }

  // Validation helpers
  protected validatePagination(page?: number, limit?: number): { page: number; limit: number } {
    const validatedPage = Math.max(1, page || 1)
    const validatedLimit = Math.min(Math.max(1, limit || this.config.defaultPageSize!), this.config.maxPageSize!)

    return {
      page: validatedPage,
      limit: validatedLimit
    }
  }

  protected validateSort(sortBy?: string, allowedFields: string[] = []): string | undefined {
    if (!sortBy) return undefined

    if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
      return undefined
    }

    return sortBy
  }

  // Additional helper methods
  protected getUserFromRequest(req: Request): any {
    return req.user
  }

  protected getRequestId(req: Request): string | undefined {
    return req.requestId
  }

  protected getIpAddress(req: Request): string {
    return req.ip || req.connection.remoteAddress || 'unknown'
  }

  protected getUserAgent(req: Request): string {
    return req.get('User-Agent') || 'unknown'
  }
}

export default BaseController
