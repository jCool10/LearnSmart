import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import path from 'path'

// Test environment configuration
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.SMTP_HOST = 'localhost'
process.env.SMTP_PORT = '587'
process.env.SMTP_USER = 'test@example.com'
process.env.SMTP_PASSWORD = 'test-password'

// Disable console.log in tests unless explicitly needed
const originalConsoleLog = console.log
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  // Silence console outputs in tests
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  // Restore console outputs
  console.log = originalConsoleLog
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// Global test database setup
let prisma: PrismaClient

beforeAll(async () => {
  // Initialize Prisma client for testing
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  try {
    // Connect to test database
    await prisma.$connect()

    // Run migrations if needed
    try {
      execSync('npx prisma db push --force-reset', {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      })
    } catch (error) {
      console.warn('Database migration failed, continuing with existing schema')
    }
  } catch (error) {
    console.error('Failed to setup test database:', error)
  }
}, 30000)

afterAll(async () => {
  // Cleanup test database
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Failed to disconnect from test database:', error)
  }
}, 10000)

// Clean database before each test
beforeEach(async () => {
  if (prisma) {
    try {
      // Clean all tables in the correct order to avoid foreign key constraints
      await prisma.token.deleteMany()
      await prisma.user.deleteMany()
    } catch (error) {
      console.warn('Failed to clean test database:', error)
    }
  }
})

// Export test utilities
export { prisma }

// Global test helpers
declare global {
  var testPrisma: PrismaClient
}

global.testPrisma = prisma

// Increase Jest timeout for database operations
jest.setTimeout(30000)
