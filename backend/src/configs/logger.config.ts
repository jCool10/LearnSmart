import winston from 'winston'
import os from 'os'
import 'winston-daily-rotate-file'
import { configs } from './index'

const { combine, timestamp, printf, errors, json, colorize, uncolorize } = winston.format

const timestampFormat = timestamp({
  format: 'DD-MM-YYYY HH:mm:ss'
})

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

// Improved structured format for file logging
const structuredFormat = winston.format((info) => {
  const structured: any = {
    timestamp: info.timestamp,
    level: info.level,
    message: info.message,
    service: 'AI Secretary Server',
    environment: configs.app.env || 'development'
  }

  // Add request context if available
  if (info.requestId || info.method || info.url || info.userId) {
    structured.request = {}
    if (info.requestId) structured.request.requestId = info.requestId
    if (info.method) structured.request.method = info.method
    if (info.url) structured.request.url = info.url
    if (info.ip) structured.request.ip = info.ip
    if (info.userId) structured.request.userId = info.userId
  }

  // Add response context for HTTP requests
  if (info.statusCode || info.duration) {
    structured.response = {}
    if (info.statusCode) structured.response.status_code = info.statusCode
    if (info.duration) structured.response.duration_ms = info.duration
  }

  // Add error context if available
  if (info.stack || info.error) {
    structured.error = {}
    if (info.message) structured.error.message = info.message
    if (info.stack) structured.error.stack = info.stack
  }

  // Add specific metadata for certain log types
  if (info.slowRequest) structured.performance = { slow_request: true }
  if (info.userAgent) structured.meta = { userAgent: info.userAgent }

  if (info.query) structured.request.query = info.query
  if (info.body) structured.request.body = info.body

  return structured
})

const fileFormat = combine(timestampFormat, errors({ stack: true }), structuredFormat(), json())

// Enhanced console format with full context
const consoleFormat = combine(
  timestampFormat,
  enumerateErrorFormat(),
  configs.app.env === 'development' ? colorize() : uncolorize(),
  printf(({ level, message, timestamp, requestId, method, url, statusCode, duration, userId }) => {
    let logMessage = `${timestamp} [${level}]: `

    // Add request context if available
    if (requestId || method || url) {
      const requestInfo = []
      if (method && url) requestInfo.push(`${method} ${url}`)
      if (statusCode) requestInfo.push(`${statusCode}`)
      if (duration) requestInfo.push(`${duration}`)
      if (requestId) requestInfo.push(`${requestId}`)
      if (userId) requestInfo.push(`${userId}`)

      if (requestInfo.length > 0) {
        logMessage += `${requestInfo.join(' - ')}`
      }

      logMessage += ` - ${message}`
    } else {
      logMessage += `${message}`
    }

    return logMessage
  })
)

const logger = winston.createLogger({
  level: configs.app.env === 'development' ? 'debug' : 'info',
  defaultMeta: {
    service: 'AI Secretary Server',
    environment: configs.app.env || 'development',
    process: {
      pid: process.pid,
      hostname: os.hostname()
    }
  },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      stderrLevels: ['error']
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      auditFile: 'logs/.error-audit.json',
      format: fileFormat
    }),
    new winston.transports.DailyRotateFile({
      level: 'info',
      filename: `./logs/combined-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      auditFile: 'logs/.combined-audit.json',
      format: fileFormat
    })
  ]
})

export default logger
