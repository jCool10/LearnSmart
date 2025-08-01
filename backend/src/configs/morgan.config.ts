import morgan from 'morgan'
import logger from './logger.config'

// Custom morgan format that works with our logging system
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms - requestId: :requestId - message: :message'

// Add custom tokens
morgan.token('requestId', (req: any) => req.requestId || 'unknown')
morgan.token('message', (req: any, res: any) => res.locals.errorMessage || '')

// Create morgan middleware that integrates with winston
export const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      // Only log if it's an error (contains status >= 400) to avoid duplicates
      if (message.includes(' 4') || message.includes(' 5')) {
        logger.error(message.trim())
      }
    }
  },
  skip: (req, res) => {
    // Skip successful requests as they're handled by our request logger
    return res.statusCode < 400
  }
})
