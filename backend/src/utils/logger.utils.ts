import logger from '@/configs/logger.config'
import { Request } from 'express'

// Helper function to extract request context
export const getRequestContext = (req: Request) => ({
  requestId: req.requestId,
  method: req.method,
  url: req.originalUrl,
  ip: req.ip,
  userAgent: req.get('user-agent')
})

// Centralized logging functions with consistent context
export const logRequest = {
  info: (message: string, req: Request, additionalData?: any) => {
    logger.info(message, {
      ...getRequestContext(req),
      ...additionalData
    })
  },

  warn: (message: string, req: Request, additionalData?: any) => {
    logger.warn(message, {
      ...getRequestContext(req),
      ...additionalData
    })
  },

  error: (message: string, req: Request, error?: Error, additionalData?: any) => {
    logger.error(message, {
      ...getRequestContext(req),
      ...(error && { stack: error.stack }),
      ...additionalData
    })
  }
}

// General logging functions without request context
export const logApp = {
  info: (message: string, data?: any) => {
    logger.info(message, data)
  },

  warn: (message: string, data?: any) => {
    logger.warn(message, data)
  },

  error: (message: string, error?: Error, data?: any) => {
    logger.error(message, {
      ...(error && { stack: error.stack }),
      ...data
    })
  },

  debug: (message: string, data?: any) => {
    logger.debug(message, data)
  }
}

// Performance logging
export const logPerformance = {
  slow: (message: string, req: Request, duration: number, threshold = 1000) => {
    if (duration > threshold) {
      // Mark that slow operation was logged to avoid duplicate in request logger
      req.slowOperationLogged = true

      logger.warn(`Slow operation: ${message}`, {
        ...getRequestContext(req),
        duration: `${duration}ms`,
        threshold: `${threshold}ms`,
        performance: { slow_operation: true }
      })
    }
  },

  timing: (operation: string, startTime: number, additionalData?: any) => {
    const duration = Date.now() - startTime
    logger.debug(`Operation completed: ${operation}`, {
      duration: `${duration}ms`,
      ...additionalData
    })
    return duration
  }
}

// Database logging
export const logDatabase = {
  query: (query: string, duration?: number, params?: any) => {
    logger.debug('Database query executed', {
      query: query.substring(0, 200), // Limit query length
      ...(duration && { duration: `${duration}ms` }),
      ...(params && { params }),
      context: 'Database'
    })
  },

  error: (message: string, error: Error, query?: string) => {
    logger.error(`Database error: ${message}`, {
      stack: error.stack,
      ...(query && { query: query.substring(0, 200) }),
      context: 'Database'
    })
  }
}

// Security logging
export const logSecurity = {
  authAttempt: (req: Request, success: boolean, userId?: string) => {
    const level = success ? 'info' : 'warn'
    logger[level](`Authentication attempt ${success ? 'successful' : 'failed'}`, {
      ...getRequestContext(req),
      ...(userId && { userId }),
      context: 'Authentication'
    })
  },

  suspiciousActivity: (req: Request, activity: string, details?: any) => {
    logger.warn(`Suspicious activity detected: ${activity}`, {
      ...getRequestContext(req),
      ...details,
      context: 'Security'
    })
  }
}

export default logger
