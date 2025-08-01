'use strict'

import { NotFoundError } from '@/cores/error.handler'
import { Application, NextFunction, Router, Response, Request } from 'express'
import { ErrorHandler } from '@/cores/error.handler'
import { ResponseHandler } from '@/cores/response.handler'
import { logRequest, logApp } from '@/utils/logger.utils'
import { StatusCodes } from 'http-status-codes'
import { healthRouter } from './health.route'
import authRouter from './auth.route'

export const apiRouter = (app: Application, router: Router) => {
  const API_PREFIX = '/api/v1'

  // Health check endpoints
  router.use('/health', healthRouter)

  // API routes
  router.use('/auth', authRouter)

  app.use(API_PREFIX, router)

  // Middleware for handling 404 Not Found errors
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`)
    next(error)
  })

  // error convert
  app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = err.message || 'Something went wrong'
    const errors = err.errors || []

    const error = new ErrorHandler(statusCode, message, err.isOperational, err.stack, errors)

    // Set error message for morgan logging
    res.locals.errorMessage = message

    next(error)
  })

  // Final error handler - only log here to avoid duplicates
  app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = err.message || 'Something went wrong'

    // Use new logging utility
    logRequest.error(message, req, err, {
      statusCode: statusCode
    })

    // Return standardized error response
    return ResponseHandler.error(res, {
      message,
      statusCode,
      errors: err.errors || [],
      data: process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
    })
  })
}
