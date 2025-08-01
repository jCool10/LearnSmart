import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { configs } from './index'
import { requestLogger } from '@/middlewares/requestLogger'
import passport from 'passport'
import jwtStrategy from './passport.config'
import { API } from '@/constants'

const limiter = rateLimit(configs.rate_limit)

const expressConfig = (app: Application): void => {
  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false
    })
  )

  // Request logging middleware
  app.use(requestLogger)

  // CORS configuration
  app.use(cors(configs.cors))

  // Rate limiting for API routes
  // app.use(API.PREFIX, limiter)

  // Body parsing middleware with configurable limits
  app.use(
    express.json({
      limit: configs.validation.max_body_size,
      strict: true,
      type: 'application/json'
    })
  )

  app.use(
    express.urlencoded({
      extended: true,
      limit: configs.validation.max_body_size,
      parameterLimit: 1000
    })
  )

  // Response compression middleware
  app.use(
    compression({
      level: 6,
      threshold: 100 * 1024, // Only compress responses larger than 100KB
      filter: (req, res) => {
        // Don't compress if the client explicitly tells us not to
        if (req.headers['x-no-compression']) return false

        // Use compression filter for other responses
        return compression.filter(req, res)
      }
    })
  )

  // Passport initialization for JWT authentication
  app.use(passport.initialize())
  passport.use('jwt', jwtStrategy)

  // API timeout configuration
  app.use((req, res, next) => {
    req.setTimeout(API.TIMEOUT, () => {
      res.status(408).json({
        success: false,
        message: 'Request timeout',
        error: 'The request took too long to process'
      })
    })
    next()
  })

  // Trust proxy for accurate IP addresses in production
  if (configs.app.env === 'production') {
    app.set('trust proxy', 1)
  }
}

export default expressConfig
