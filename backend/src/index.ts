'use strict'

import { createServer } from 'http'
import express from 'express'

import expressConfig from './configs/express.config'
import logger from './configs/logger.config'
import { configs } from './configs'
import { apiRouter } from './routes'
import { connectDatabase, disconnectDatabase } from './configs/database.config'

const PORT = configs.app.port
const app = express()
const router = express.Router()
const server = createServer(app)

// Apply express configuration
expressConfig(app)

// Setup API routes
apiRouter(app, router)

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Close server & exit process
  server.close(async () => {
    await disconnectDatabase()
    process.exit(1)
  })
})

// Global error handling for uncaught exceptions
process.on('uncaughtException', async (error: Error) => {
  logger.error('Uncaught Exception thrown:', error)
  await disconnectDatabase()
  process.exit(1)
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully`)

  server.close(async () => {
    try {
      await disconnectDatabase()
      logger.info('Database disconnected successfully')
      logger.info('Process terminated')
      process.exit(0)
    } catch (error) {
      logger.error('Error during shutdown:', error)
      process.exit(1)
    }
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase()

    server.listen(PORT, () => {
      logger.info(`Server listening on port: ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
