import { Prisma, PrismaClient } from '../../generated/prisma'
import logger from './logger.config'

declare global {
  var __prisma: PrismaClient | undefined
}

// Create Prisma client singleton
const createPrismaClient = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query'
      },
      {
        emit: 'event',
        level: 'error'
      },
      {
        emit: 'event',
        level: 'info'
      },
      {
        emit: 'event',
        level: 'warn'
      }
    ]
  })
}

// Use singleton pattern for database connection
export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Setup logging for Prisma events
;(prisma as any).$on('query', (e: any) => {
  logger.debug('Query: ' + e.query)
  logger.debug('Params: ' + e.params)
  logger.debug('Duration: ' + e.duration + 'ms')
})
;(prisma as any).$on('error', (e: any) => {
  logger.error('Prisma Error:', e)
})
;(prisma as any).$on('info', (e: any) => {
  logger.info('Prisma Info:', e)
})
;(prisma as any).$on('warn', (e: any) => {
  logger.warn('Prisma Warning:', e)
})

// Database connection helper
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Database connection failed:', error)
    process.exit(1)
  }
}

// Database disconnection helper
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect()
    logger.info('Database disconnected successfully')
  } catch (error) {
    logger.error('Database disconnection failed:', error)
  }
}

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error('Database health check failed:', error)
    return false
  }
}
