'use strict'

import { Request, Response, NextFunction } from 'express'
import logger from '../configs/logger.config'
import crypto from 'crypto'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const requestId = crypto.randomBytes(8).toString('hex')

  // Set requestId for the request
  req.requestId = (req.headers['x-request-id'] as string) || requestId

  res.setHeader('X-Request-ID', req.requestId)

  logger.info('Request started', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('user-agent'),
    ip: req.ip
  })

  // Monitor for slow requests
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      context: 'HttpRequest',
      userId: req.user?.id,
      query: Object.keys(req.query).length ? req.query : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined
    }

    if (res.statusCode >= 400) {
      return
    } else {
      logger.info('Request completed', logData)
    }
  })

  next()
}
