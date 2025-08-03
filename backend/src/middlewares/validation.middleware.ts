import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '@/cores/error.handler'

// Generic validation interface
export interface ValidationSchema {
  body?: any
  query?: any
  params?: any
  headers?: any
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: Array<{
    field: string
    message: string
    value?: any
  }>
}

// Base validator interface
export interface Validator {
  validate(data: any, schema: any): ValidationResult
}

// Simple built-in validator (you can replace with Joi, Yup, Zod, etc.)
class SimpleValidator implements Validator {
  validate(data: any, schema: any): ValidationResult {
    const errors: Array<{ field: string; message: string; value?: any }> = []

    // Basic validation rules
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      const ruleSet = rules as any

      // Required validation
      if (ruleSet.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: `${field} is required`,
          value
        })
        continue
      }

      // Skip other validations if field is not provided and not required
      if (value === undefined || value === null) continue

      // Type validation
      if (ruleSet.type) {
        const expectedType = ruleSet.type
        const actualType = typeof value

        if (expectedType === 'email' && !this.isValidEmail(value)) {
          errors.push({
            field,
            message: `${field} must be a valid email`,
            value
          })
        } else if (expectedType !== actualType && expectedType !== 'email') {
          errors.push({
            field,
            message: `${field} must be of type ${expectedType}`,
            value
          })
        }
      }

      // Min length validation
      if (ruleSet.minLength && value.length < ruleSet.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${ruleSet.minLength} characters long`,
          value
        })
      }

      // Max length validation
      if (ruleSet.maxLength && value.length > ruleSet.maxLength) {
        errors.push({
          field,
          message: `${field} must be at most ${ruleSet.maxLength} characters long`,
          value
        })
      }

      // Min value validation
      if (ruleSet.min && value < ruleSet.min) {
        errors.push({
          field,
          message: `${field} must be at least ${ruleSet.min}`,
          value
        })
      }

      // Max value validation
      if (ruleSet.max && value > ruleSet.max) {
        errors.push({
          field,
          message: `${field} must be at most ${ruleSet.max}`,
          value
        })
      }

      // Enum validation
      if (ruleSet.enum && !ruleSet.enum.includes(value)) {
        errors.push({
          field,
          message: `${field} must be one of: ${ruleSet.enum.join(', ')}`,
          value
        })
      }

      // Pattern validation
      if (ruleSet.pattern && !new RegExp(ruleSet.pattern).test(value)) {
        errors.push({
          field,
          message: ruleSet.patternMessage || `${field} format is invalid`,
          value
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Validation middleware factory
export const validate = (schema: ValidationSchema, validator: Validator = new SimpleValidator()) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ field: string; message: string; value?: any }> = []

    // Validate body
    if (schema.body) {
      const bodyResult = validator.validate(req.body, schema.body)
      if (!bodyResult.isValid) {
        errors.push(...bodyResult.errors.map((err) => ({ ...err, field: `body.${err.field}` })))
      }
    }

    // Validate query
    if (schema.query) {
      const queryResult = validator.validate(req.query, schema.query)
      if (!queryResult.isValid) {
        errors.push(...queryResult.errors.map((err) => ({ ...err, field: `query.${err.field}` })))
      }
    }

    // Validate params
    if (schema.params) {
      const paramsResult = validator.validate(req.params, schema.params)
      if (!paramsResult.isValid) {
        errors.push(...paramsResult.errors.map((err) => ({ ...err, field: `params.${err.field}` })))
      }
    }

    // Validate headers
    if (schema.headers) {
      const headersResult = validator.validate(req.headers, schema.headers)
      if (!headersResult.isValid) {
        errors.push(...headersResult.errors.map((err) => ({ ...err, field: `headers.${err.field}` })))
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Request validation failed', errors)
    }

    next()
  }
}

// Common validation schemas
export const commonValidations = {
  // Pagination
  pagination: {
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  },

  // MongoDB ObjectId
  objectId: {
    pattern: '^[0-9a-fA-F]{24}$',
    patternMessage: 'Must be a valid ObjectId'
  },

  // CUID (for Prisma)
  cuid: {
    pattern: '^c[a-z0-9]{24}$',
    patternMessage: 'Must be a valid CUID'
  },

  // Email
  email: {
    type: 'email',
    required: true
  },

  // Password
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
    patternMessage:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }
}

export default validate
