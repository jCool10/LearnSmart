import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library'
import { BadRequestError, NotFoundError, ConflictError, InternalServerError, ValidationError } from './error.handler'
import logger from '@/configs/logger.config'

/**
 * Prisma Error Handler
 * Transforms Prisma database errors into meaningful custom error responses
 */
export class PrismaErrorHandler {
  /**
   * Transform Prisma error into custom error
   */
  static handleError(error: any): never {
    logger.error('Prisma error occurred', {
      code: error.code,
      message: error.message,
      meta: error.meta
    })

    // Handle known Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(error)
    }

    if (error instanceof PrismaClientUnknownRequestError) {
      return this.handleUnknownRequestError(error)
    }

    if (error instanceof PrismaClientRustPanicError) {
      return this.handleRustPanicError(error)
    }

    if (error instanceof PrismaClientInitializationError) {
      return this.handleInitializationError(error)
    }

    if (error instanceof PrismaClientValidationError) {
      return this.handleValidationError(error)
    }

    // If it's not a Prisma error, re-throw as is
    throw error
  }

  /**
   * Handle known Prisma request errors (P2xxx codes)
   */
  private static handleKnownRequestError(error: PrismaClientKnownRequestError): never {
    const { code, meta } = error

    switch (code) {
      // Unique constraint violation
      case 'P2002': {
        const target = (meta?.target as string[]) || []
        const field = target.length > 0 ? target[0] : 'field'
        throw new ConflictError(`A record with this ${field} already exists`)
      }

      // Foreign key constraint violation
      case 'P2003':
        throw new BadRequestError('Invalid reference to related record')

      // Record not found
      case 'P2025':
        throw new NotFoundError('Record not found')

      // Dependent record exists (cannot delete)
      case 'P2014':
        throw new ConflictError('Cannot delete record because it has dependent records')

      // Required field missing
      case 'P2012': {
        const missingField = (meta?.field as string) || 'required field'
        throw new ValidationError(`Missing required field: ${missingField}`)
      }

      // Invalid value for field type
      case 'P2006': {
        const invalidField = (meta?.field_name as string) || 'field'
        throw new ValidationError(`Invalid value provided for ${invalidField}`)
      }

      // Too many connections
      case 'P1008':
        throw new InternalServerError('Database connection limit reached')

      // Database timeout
      case 'P1017':
        throw new InternalServerError('Database operation timed out')

      // Database unreachable
      case 'P1001':
        throw new InternalServerError('Database server is unreachable')

      // Authentication failed
      case 'P1000':
        throw new InternalServerError('Database authentication failed')

      // Invalid database URL
      case 'P1013':
        throw new InternalServerError('Invalid database configuration')

      // Connection error
      case 'P1002':
        throw new InternalServerError('Database connection failed')

      // Database does not exist
      case 'P1003':
        throw new InternalServerError('Database does not exist')

      // Table does not exist
      case 'P2021':
        throw new InternalServerError('Database table not found')

      // Column does not exist
      case 'P2022':
        throw new InternalServerError('Database column not found')

      // Inconsistent column data
      case 'P2023':
        throw new InternalServerError('Inconsistent database column data')

      // Connection pool timeout
      case 'P2024':
        throw new InternalServerError('Database connection pool timeout')

      // Raw query error
      case 'P2010':
        throw new BadRequestError('Invalid database query')

      // Transaction error
      case 'P2028':
        throw new InternalServerError('Database transaction failed')

      // Query parsing error
      case 'P2009':
        throw new BadRequestError('Invalid query format')

      // Record too large
      case 'P2026':
        throw new BadRequestError('Record size exceeds database limits')

      // Multiple batch operations error
      case 'P2027':
        throw new InternalServerError('Multiple database operations failed')

      default:
        logger.warn('Unhandled Prisma error code', { code, message: error.message })
        throw new InternalServerError(`Database error: ${error.message}`)
    }
  }

  /**
   * Handle unknown Prisma request errors
   */
  private static handleUnknownRequestError(error: PrismaClientUnknownRequestError): never {
    logger.error('Unknown Prisma request error', { error: error.message })
    throw new InternalServerError('An unknown database error occurred')
  }

  /**
   * Handle Prisma Rust panic errors
   */
  private static handleRustPanicError(error: PrismaClientRustPanicError): never {
    logger.error('Prisma Rust panic error', { error: error.message })
    throw new InternalServerError('A critical database error occurred')
  }

  /**
   * Handle Prisma initialization errors
   */
  private static handleInitializationError(error: PrismaClientInitializationError): never {
    logger.error('Prisma initialization error', { error: error.message })
    throw new InternalServerError('Database initialization failed')
  }

  /**
   * Handle Prisma validation errors
   */
  private static handleValidationError(error: PrismaClientValidationError): never {
    logger.error('Prisma validation error', { error: error.message })

    // Extract field information from validation error message
    const fieldMatch = error.message.match(/Argument `(\w+)` is missing/)
    if (fieldMatch) {
      throw new ValidationError(`Missing required field: ${fieldMatch[1]}`)
    }

    const typeMatch = error.message.match(/Invalid value for argument `(\w+)`/)
    if (typeMatch) {
      throw new ValidationError(`Invalid value for field: ${typeMatch[1]}`)
    }

    throw new ValidationError('Invalid data provided')
  }
}

/**
 * Utility function to wrap Prisma operations with error handling
 */
export const withPrismaErrorHandling = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    PrismaErrorHandler.handleError(error)
  }
}

/**
 * Decorator for Prisma error handling
 */
export function HandlePrismaErrors(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value

  descriptor.value = async function (...args: any[]) {
    try {
      return await method.apply(this, args)
    } catch (error) {
      PrismaErrorHandler.handleError(error)
    }
  }

  return descriptor
}

export default PrismaErrorHandler
