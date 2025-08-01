'use strict'

import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: PaginationMeta
  }
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    {
      message,
      data,
      statusCode = StatusCodes.OK,
      meta = {}
    }: {
      message: string
      data?: T
      statusCode?: number
      meta?: Partial<ApiResponse['meta']>
    }
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.req.requestId,
        ...meta
      }
    }

    return res.status(statusCode).json(response)
  }

  static error(
    res: Response,
    {
      message,
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
      errors = [],
      data = null
    }: {
      message: string
      statusCode?: number
      errors?: any[]
      data?: any
    }
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      data,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.req.requestId
      }
    }

    return res.status(statusCode).json(response)
  }

  static paginated<T>(
    res: Response,
    {
      message,
      data,
      pagination
    }: {
      message: string
      data: T[]
      pagination: PaginationMeta
    }
  ) {
    return ResponseHandler.success(res, {
      message,
      data,
      meta: { pagination }
    })
  }
}

// Legacy support - will be deprecated
export class SuccessResponse<T> extends ResponseHandler {
  message: string
  status: number
  data: any
  timestamp: string

  constructor({ message, data, timestamp }: { message: string; data: T; timestamp: string }) {
    super()
    this.message = message
    this.status = StatusCodes.OK
    this.data = data
    this.timestamp = timestamp
  }

  send(res: Response, headers = {}) {
    return ResponseHandler.success(res, {
      message: this.message,
      data: this.data
    })
  }
}
