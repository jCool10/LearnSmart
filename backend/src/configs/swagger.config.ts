'use strict'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import { configs } from './index'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnSmart Backend API',
      version: '1.0.0',
      description: 'API documentation for LearnSmart learning management system',
      contact: {
        name: 'API Support',
        email: 'support@learnsmart.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${configs.app.port}/api/v1`,
        description: 'Development server'
      },
      {
        url: 'https://api.learnsmart.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            statusCode: {
              type: 'integer',
              example: 400
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            data: {
              type: 'object',
              nullable: true
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            statusCode: {
              type: 'integer',
              example: 200
            },
            data: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'user-id-123'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'STUDENT', 'INSTRUCTOR'],
              example: 'STUDENT'
            },
            isEmailVerified: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'category-id-123'
            },
            name: {
              type: 'string',
              example: 'Programming'
            },
            description: {
              type: 'string',
              example: 'Programming and software development courses'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Roadmap: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'roadmap-id-123'
            },
            title: {
              type: 'string',
              example: 'Full Stack Web Development'
            },
            description: {
              type: 'string',
              example: 'Complete roadmap for becoming a full stack developer'
            },
            categoryId: {
              type: 'string',
              example: 'category-id-123'
            },
            difficulty: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
              example: 'INTERMEDIATE'
            },
            estimatedDuration: {
              type: 'integer',
              example: 120,
              description: 'Duration in hours'
            },
            published: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RoadmapDetails: {
          allOf: [
            { $ref: '#/components/schemas/Roadmap' },
            {
              type: 'object',
              properties: {
                category: {
                  $ref: '#/components/schemas/Category'
                },
                lessons: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Lesson'
                  }
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                creator: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          ]
        },
        CreateRoadmapRequest: {
          type: 'object',
          required: ['title', 'description', 'categoryId', 'difficulty', 'estimatedTime'],
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 200,
              example: 'Full Stack Web Development'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 2000,
              example: 'Complete roadmap for becoming a full stack developer'
            },
            categoryId: {
              type: 'string',
              example: 'category-id-123'
            },
            difficulty: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
              example: 'INTERMEDIATE'
            },
            estimatedTime: {
              type: 'string',
              pattern: '^\\d+\\s+(weeks?|months?|days?)$',
              example: '8 weeks'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 50
              },
              maxItems: 10,
              example: ['javascript', 'react', 'nodejs']
            },
            lessons: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CreateLessonRequest'
              },
              maxItems: 100
            }
          }
        },
        UpdateRoadmapRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 200
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 2000
            },
            categoryId: {
              type: 'string'
            },
            difficulty: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
            },
            estimatedTime: {
              type: 'string',
              pattern: '^\\d+\\s+(weeks?|months?|days?)$'
            },
            isActive: {
              type: 'boolean'
            }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'lesson-id-123'
            },
            title: {
              type: 'string',
              example: 'Introduction to React'
            },
            description: {
              type: 'string',
              example: 'Learn the basics of React library'
            },
            content: {
              type: 'string',
              example: 'React is a JavaScript library...'
            },
            orderIndex: {
              type: 'integer',
              example: 1
            },
            estimatedMinutes: {
              type: 'integer',
              example: 30
            },
            roadmapId: {
              type: 'string',
              example: 'roadmap-id-123'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreateLessonRequest: {
          type: 'object',
          required: ['title', 'description', 'orderIndex'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 200,
              example: 'Introduction to React'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              example: 'Learn the basics of React library'
            },
            content: {
              type: 'string',
              maxLength: 50000,
              example: 'React is a JavaScript library...'
            },
            orderIndex: {
              type: 'integer',
              minimum: 1,
              maximum: 1000,
              example: 1
            },
            estimatedMinutes: {
              type: 'integer',
              minimum: 1,
              maximum: 1440,
              default: 30,
              example: 30
            }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'enrollment-id-123'
            },
            userId: {
              type: 'string',
              example: 'user-id-123'
            },
            roadmapId: {
              type: 'string',
              example: 'roadmap-id-123'
            },
            enrolledAt: {
              type: 'string',
              format: 'date-time'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true
            },
            progress: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 100,
              example: 45.5
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        LessonProgress: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'progress-id-123'
            },
            userId: {
              type: 'string',
              example: 'user-id-123'
            },
            lessonId: {
              type: 'string',
              example: 'lesson-id-123'
            },
            completed: {
              type: 'boolean',
              example: true
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true
            },
            timeSpent: {
              type: 'integer',
              example: 25,
              description: 'Time spent in minutes'
            },
            lastAccessedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Token: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'token-id-123'
            },
            token: {
              type: 'string',
              example: 'jwt-token-string'
            },
            type: {
              type: 'string',
              enum: ['ACCESS', 'REFRESH', 'EMAIL_VERIFICATION', 'PASSWORD_RESET'],
              example: 'ACCESS'
            },
            userId: {
              type: 'string',
              example: 'user-id-123'
            },
            expires: {
              type: 'string',
              format: 'date-time'
            },
            blacklisted: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/validations/*.ts']
}

export const specs = swaggerJSDoc(options)

export const setupSwagger = (app: Application): void => {
  // Swagger UI setup
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'LearnSmart API Documentation',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true
      }
    })
  )

  // JSON endpoint for API specs
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(specs)
  })
}
