import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ValidationError } from '@/cores/error.handler'

// Joi validation schema interface
export interface JoiValidationSchema {
  body?: Joi.ObjectSchema
  query?: Joi.ObjectSchema
  params?: Joi.ObjectSchema
  headers?: Joi.ObjectSchema
}

// Joi validation middleware factory
export const validateJoi = (schema: JoiValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ field: string; message: string; value?: any }> = []

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false })
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `body.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          })
        })
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false })
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `query.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          })
        })
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false })
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `params.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          })
        })
      }
    }

    // Validate headers
    if (schema.headers) {
      const { error } = schema.headers.validate(req.headers, { abortEarly: false })
      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `headers.${detail.path.join('.')}`,
            message: detail.message,
            value: detail.context?.value
          })
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Request validation failed', errors)
    }

    next()
  }
}

// Helper function to create schema for different parts
export const createJoiSchema = {
  params: (schema: Record<string, Joi.Schema>) => Joi.object(schema),
  query: (schema: Record<string, Joi.Schema>) => Joi.object(schema),
  body: (schema: Record<string, Joi.Schema>) => Joi.object(schema),
  headers: (schema: Record<string, Joi.Schema>) => Joi.object(schema)
}

// Export commonly used Joi schemas
export const commonJoiSchemas = {
  // ID parameter validation
  idParam: createJoiSchema.params({
    id: Joi.string().required().messages({
      'any.required': 'ID is required',
      'string.base': 'ID must be a string'
    })
  }),

  // User ID parameter validation
  userIdParam: createJoiSchema.params({
    userId: Joi.string().required().messages({
      'any.required': 'User ID is required',
      'string.base': 'User ID must be a string'
    })
  }),

  // Roadmap ID parameter validation
  roadmapIdParam: createJoiSchema.params({
    roadmapId: Joi.string().required().messages({
      'any.required': 'Roadmap ID is required',
      'string.base': 'Roadmap ID must be a string'
    })
  }),

  // Lesson ID parameter validation
  lessonIdParam: createJoiSchema.params({
    lessonId: Joi.string().required().messages({
      'any.required': 'Lesson ID is required',
      'string.base': 'Lesson ID must be a string'
    })
  }),

  // Pagination query validation
  paginationQuery: createJoiSchema.query({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
  })
}

export default validateJoi
