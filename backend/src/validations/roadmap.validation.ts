import Joi from 'joi'
import { $Enums } from 'generated/prisma'

// Category validations
export const createCategorySchema = Joi.object({
  value: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base':
        'Category value must be in kebab-case format (lowercase letters, numbers, and hyphens only)',
      'string.min': 'Category value must be at least 2 characters long',
      'string.max': 'Category value must not exceed 50 characters'
    }),
  label: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Category label must be at least 2 characters long',
    'string.max': 'Category label must not exceed 100 characters'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Category description must not exceed 500 characters'
  })
})

export const updateCategorySchema = Joi.object({
  value: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.pattern.base':
        'Category value must be in kebab-case format (lowercase letters, numbers, and hyphens only)',
      'string.min': 'Category value must be at least 2 characters long',
      'string.max': 'Category value must not exceed 50 characters'
    }),
  label: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Category label must be at least 2 characters long',
    'string.max': 'Category label must not exceed 100 characters'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Category description must not exceed 500 characters'
  }),
  isActive: Joi.boolean().optional()
})

// Lesson validations
export const createLessonSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Lesson title must be at least 3 characters long',
    'string.max': 'Lesson title must not exceed 200 characters'
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Lesson description must be at least 10 characters long',
    'string.max': 'Lesson description must not exceed 1000 characters'
  }),
  content: Joi.string().max(50000).optional().messages({
    'string.max': 'Lesson content must not exceed 50000 characters'
  }),
  orderIndex: Joi.number().integer().min(1).max(1000).required().messages({
    'number.min': 'Order index must be at least 1',
    'number.max': 'Order index must not exceed 1000'
  }),
  estimatedMinutes: Joi.number().integer().min(1).max(1440).default(30).messages({
    'number.min': 'Estimated minutes must be at least 1',
    'number.max': 'Estimated minutes must not exceed 1440 (24 hours)'
  })
})

export const updateLessonSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional().messages({
    'string.min': 'Lesson title must be at least 3 characters long',
    'string.max': 'Lesson title must not exceed 200 characters'
  }),
  description: Joi.string().min(10).max(1000).optional().messages({
    'string.min': 'Lesson description must be at least 10 characters long',
    'string.max': 'Lesson description must not exceed 1000 characters'
  }),
  content: Joi.string().max(50000).optional().messages({
    'string.max': 'Lesson content must not exceed 50000 characters'
  }),
  orderIndex: Joi.number().integer().min(1).max(1000).optional().messages({
    'number.min': 'Order index must be at least 1',
    'number.max': 'Order index must not exceed 1000'
  }),
  estimatedMinutes: Joi.number().integer().min(1).max(1440).optional().messages({
    'number.min': 'Estimated minutes must be at least 1',
    'number.max': 'Estimated minutes must not exceed 1440 (24 hours)'
  }),
  isActive: Joi.boolean().optional()
})

// Roadmap validations
export const createRoadmapSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Roadmap title must be at least 5 characters long',
    'string.max': 'Roadmap title must not exceed 200 characters'
  }),
  description: Joi.string().min(10).max(2000).required().messages({
    'string.min': 'Roadmap description must be at least 10 characters long',
    'string.max': 'Roadmap description must not exceed 2000 characters'
  }),
  categoryId: Joi.string().required().messages({
    'any.required': 'Category ID is required'
  }),
  difficulty: Joi.string()
    .valid(...Object.values($Enums.DifficultyLevel))
    .required()
    .messages({
      'any.only': `Difficulty must be one of: ${Object.values($Enums.DifficultyLevel).join(', ')}`,
      'any.required': 'Difficulty is required'
    }),
  estimatedTime: Joi.string()
    .pattern(/^\d+\s+(weeks?|months?|days?)$/i)
    .required()
    .messages({
      'string.pattern.base': 'Estimated time must be in format like "8 weeks", "3 months", "30 days"',
      'any.required': 'Estimated time is required'
    }),
  tags: Joi.array().items(Joi.string().min(1).max(50)).max(10).optional().messages({
    'array.max': 'Maximum 10 tags allowed',
    'string.min': 'Tag must be at least 1 character long',
    'string.max': 'Tag must not exceed 50 characters'
  }),
  lessons: Joi.array().items(createLessonSchema).max(100).optional().messages({
    'array.max': 'Maximum 100 lessons allowed per roadmap'
  })
})

export const updateRoadmapSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional().messages({
    'string.min': 'Roadmap title must be at least 5 characters long',
    'string.max': 'Roadmap title must not exceed 200 characters'
  }),
  description: Joi.string().min(10).max(2000).optional().messages({
    'string.min': 'Roadmap description must be at least 10 characters long',
    'string.max': 'Roadmap description must not exceed 2000 characters'
  }),
  categoryId: Joi.string().optional(),
  difficulty: Joi.string()
    .valid(...Object.values($Enums.DifficultyLevel))
    .optional()
    .messages({
      'any.only': `Difficulty must be one of: ${Object.values($Enums.DifficultyLevel).join(', ')}`
    }),
  estimatedTime: Joi.string()
    .pattern(/^\d+\s+(weeks?|months?|days?)$/i)
    .optional()
    .messages({
      'string.pattern.base': 'Estimated time must be in format like "8 weeks", "3 months", "30 days"'
    }),
  isActive: Joi.boolean().optional()
})

// Query validations
export const roadmapQuerySchema = Joi.object({
  category: Joi.string().optional(),
  difficulty: Joi.string()
    .valid(...Object.values($Enums.DifficultyLevel))
    .optional(),
  search: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Search query must be at least 1 character long',
    'string.max': 'Search query must not exceed 100 characters'
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100'
  }),
  userId: Joi.string().optional()
})

// Enrollment validations
export const enrollmentQuerySchema = Joi.object({
  status: Joi.string().valid('enrolled', 'completed', 'all').default('all').messages({
    'any.only': 'Status must be one of: enrolled, completed, all'
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100'
  })
})

export const updateProgressSchema = Joi.object({
  progress: Joi.number().min(0).max(100).required().messages({
    'number.min': 'Progress must be at least 0',
    'number.max': 'Progress must not exceed 100',
    'any.required': 'Progress is required'
  }),
  averageScore: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Average score must be at least 0',
    'number.max': 'Average score must not exceed 100'
  })
})

// Lesson progress validations
export const updateLessonProgressSchema = Joi.object({
  score: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Score must be at least 0',
    'number.max': 'Score must not exceed 100'
  }),
  isCompleted: Joi.boolean().required().messages({
    'any.required': 'Completion status is required'
  })
})

// Tag validations
export const createTagSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Tag name must be at least 1 character long',
    'string.max': 'Tag name must not exceed 50 characters',
    'any.required': 'Tag name is required'
  }),
  color: Joi.string()
    .pattern(/^#[0-9A-F]{6}$/i)
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color (e.g., #FF0000)'
    })
})

export const updateTagSchema = Joi.object({
  name: Joi.string().min(1).max(50).optional().messages({
    'string.min': 'Tag name must be at least 1 character long',
    'string.max': 'Tag name must not exceed 50 characters'
  }),
  color: Joi.string()
    .pattern(/^#[0-9A-F]{6}$/i)
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color (e.g., #FF0000)'
    })
})

// Bulk operations validations
export const bulkEnrollmentSchema = Joi.object({
  userIds: Joi.array().items(Joi.string().required()).min(1).max(100).required().messages({
    'array.min': 'At least one user ID is required',
    'array.max': 'Maximum 100 users can be enrolled at once',
    'any.required': 'User IDs are required'
  }),
  roadmapId: Joi.string().required().messages({
    'any.required': 'Roadmap ID is required'
  })
})

export const bulkProgressUpdateSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        lessonId: Joi.string().required(),
        progressData: updateLessonProgressSchema.required()
      })
    )
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one progress update is required',
      'array.max': 'Maximum 100 progress updates can be processed at once',
      'any.required': 'Progress updates are required'
    })
})

// Common validations
export const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'ID is required',
    'string.base': 'ID must be a string'
  })
})

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100'
  })
})
