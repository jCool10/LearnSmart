'use strict'

import { StatusCodes } from 'http-status-codes'

export class ErrorHandler extends Error {
  status: number
  isOperational: boolean
  errors?: any[]

  constructor(statusCode: number, message: string, isOperational = true, stack = '', errors: any[] = []) {
    super(message)
    this.status = statusCode
    this.isOperational = isOperational
    this.errors = errors
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

class NotFoundError extends ErrorHandler {
  constructor(message: string = 'Resource not found') {
    super(StatusCodes.NOT_FOUND, message, true)
  }
}

class BadRequestError extends ErrorHandler {
  constructor(message: string = 'Bad request', errors: any[] = []) {
    super(StatusCodes.BAD_REQUEST, message, true, '', errors)
  }
}

class UnauthorizedError extends ErrorHandler {
  constructor(message: string = 'Unauthorized access') {
    super(StatusCodes.UNAUTHORIZED, message, true)
  }
}

class ForbiddenError extends ErrorHandler {
  constructor(message: string = 'Access forbidden') {
    super(StatusCodes.FORBIDDEN, message, true)
  }
}

class InternalServerError extends ErrorHandler {
  constructor(message: string = 'Internal server error') {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message, true)
  }
}

class ValidationError extends ErrorHandler {
  constructor(message: string = 'Validation failed', errors: any[] = []) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message, true, '', errors)
  }
}

class ConflictError extends ErrorHandler {
  constructor(message: string = 'Resource conflict') {
    super(StatusCodes.CONFLICT, message, true)
  }
}

class TooManyRequestsError extends ErrorHandler {
  constructor(message: string = 'Too many requests') {
    super(StatusCodes.TOO_MANY_REQUESTS, message, true)
  }
}

export {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  ValidationError,
  ConflictError,
  TooManyRequestsError
}
