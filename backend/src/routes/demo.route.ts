import { Router, Request, Response } from 'express'
import { logApp, logPerformance, logDatabase, logSecurity } from '@/utils/logger.utils'

const demoRouter = Router()

// Demo successful request logging
demoRouter.get('/success', (req: Request, res: Response) => {
  res.json({
    message: 'Success demo - check logs!',
    timestamp: new Date().toISOString()
  })
})

// Demo error logging
demoRouter.get('/error', (req: Request, res: Response) => {
  const error = new Error('This is a demo error')

  // Throw error to be caught by error handler
  throw error
})

// Demo slow request
demoRouter.get('/slow', async (req: Request, res: Response) => {
  const startTime = Date.now()

  // Simulate slow operation
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const duration = Date.now() - startTime
  logPerformance.slow('Demo slow operation', req, duration)

  res.json({
    message: 'Slow demo completed',
    duration: `${duration}ms`
  })
})

// Demo database logging
demoRouter.get('/database', (req: Request, res: Response) => {
  // Simulate database query
  const mockQuery = 'SELECT * FROM users WHERE id = ?'
  const duration = Math.random() * 100 + 10 // Random 10-110ms

  logDatabase.query(mockQuery, duration, { userId: 123 })

  res.json({
    message: 'Database demo - check logs!',
    query: mockQuery,
    duration: `${duration}ms`
  })
})

// Demo security logging
demoRouter.post('/auth', (req: Request, res: Response) => {
  const { username, password } = req.body

  // Simulate authentication
  const success = username === 'admin' && password === 'password'

  logSecurity.authAttempt(req, success, success ? 'user-123' : undefined)

  if (!success) {
    logSecurity.suspiciousActivity(req, 'Invalid login attempt', {
      username,
      attemptCount: 1
    })
  }

  res.json({
    success,
    message: success ? 'Login successful' : 'Invalid credentials'
  })
})

// Demo application logging (không liên quan đến request)
demoRouter.get('/app-logs', (req: Request, res: Response) => {
  logApp.info('Application info log', { feature: 'demo', version: '1.0.0' })
  logApp.warn('Application warning log', { warning: 'This is just a demo' })
  logApp.debug('Application debug log', { debug: true, details: 'Debug information' })

  res.json({
    message: 'Application logs demo - check logs!'
  })
})

export default demoRouter
