// API Constants
export const API = {
  VERSION: 'v1',
  PREFIX: '/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    MESSAGE: 'Too many requests from this IP, please try again later.'
  }
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
} as const

// Authentication Constants
export const AUTH = {
  JWT: {
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256',
    ISSUER: 'learnsmart-api',
    AUDIENCE: 'learnsmart-client'
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    BCRYPT_ROUNDS: 12,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  SESSION: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME_MINUTES: 30,
    TIMEOUT_MS: 15 * 60 * 1000 // 15 minutes
  }
} as const

// HTTP Status Messages
export const HTTP_MESSAGES = {
  SUCCESS: {
    OK: 'Success',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    RETRIEVED: 'Retrieved successfully'
  },
  ERROR: {
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    CONFLICT: 'Conflict',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    TOO_MANY_REQUESTS: 'Too many requests'
  }
} as const

// Database Constants
export const DATABASE = {
  CONNECTION: {
    POOL_SIZE: 10,
    TIMEOUT_MS: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000
  },
  TRANSACTION: {
    TIMEOUT_MS: 30000,
    ISOLATION_LEVEL: 'READ_COMMITTED'
  }
} as const

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  UPLOAD_PATH: 'uploads/',
  TEMP_PATH: 'tmp/'
} as const

// Email Constants
export const EMAIL = {
  TEMPLATES: {
    WELCOME: 'welcome',
    EMAIL_VERIFICATION: 'email-verification',
    PASSWORD_RESET: 'password-reset',
    PASSWORD_CHANGED: 'password-changed'
  },
  SUBJECTS: {
    WELCOME: 'Welcome to LearnSmart!',
    EMAIL_VERIFICATION: 'Verify your email address',
    PASSWORD_RESET: 'Reset your password',
    PASSWORD_CHANGED: 'Your password has been changed'
  }
} as const

// Cache Constants
export const CACHE = {
  TTL: {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400 // 24 hours
  },
  KEYS: {
    USER_PREFIX: 'user:',
    TOKEN_PREFIX: 'token:',
    SESSION_PREFIX: 'session:',
    RATE_LIMIT_PREFIX: 'rate_limit:'
  }
} as const

// Validation Constants
export const VALIDATION = {
  USER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100
  },
  TOKEN: {
    LENGTH: 32,
    EXPIRES_IN_HOURS: 24
  }
} as const

// User Roles and Permissions
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const

export const PERMISSIONS = {
  USERS: {
    READ: 'users:read',
    WRITE: 'users:write',
    DELETE: 'users:delete'
  },
  TOKENS: {
    READ: 'tokens:read',
    WRITE: 'tokens:write',
    DELETE: 'tokens:delete'
  }
} as const

// Token Types
export const TOKEN_TYPES = {
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail'
} as const

// Environment Constants
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
} as const

// Request Constants
export const REQUEST = {
  TIMEOUT_MS: 30000,
  MAX_BODY_SIZE: '10mb',
  MAX_PARAM_LENGTH: 100
} as const

// Response Constants
export const RESPONSE = {
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    CACHE_CONTROL: 'no-cache',
    X_POWERED_BY: 'LearnSmart API'
  }
} as const

// Logging Constants
export const LOGGING = {
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  },
  MAX_FILE_SIZE: '20m',
  MAX_FILES: '14d',
  DATE_PATTERN: 'YYYY-MM-DD'
} as const

// Security Constants
export const SECURITY = {
  CSRF: {
    ENABLED: false // Set to true in production
  },
  CORS: {
    CREDENTIALS: true,
    ORIGIN: ['http://localhost:3000', 'http://localhost:3001']
  },
  HELMET: {
    CONTENT_SECURITY_POLICY: false // Configure as needed
  }
} as const

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  CUID: /^c[a-z0-9]{24}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/.+/
} as const

// Default Values
export const DEFAULTS = {
  USER: {
    ROLE: ROLES.USER,
    IS_EMAIL_VERIFIED: false
  },
  TOKEN: {
    BLACKLISTED: false
  },
  PAGINATION: {
    PAGE: PAGINATION.DEFAULT_PAGE,
    LIMIT: PAGINATION.DEFAULT_LIMIT
  }
} as const

// Error Codes (for API documentation and client handling)
export const ERROR_CODES = {
  // Authentication errors (1000-1999)
  AUTH_TOKEN_MISSING: 1001,
  AUTH_TOKEN_INVALID: 1002,
  AUTH_TOKEN_EXPIRED: 1003,
  AUTH_INVALID_CREDENTIALS: 1004,
  AUTH_ACCOUNT_LOCKED: 1005,
  AUTH_EMAIL_NOT_VERIFIED: 1006,

  // Validation errors (2000-2999)
  VALIDATION_REQUIRED_FIELD: 2001,
  VALIDATION_INVALID_FORMAT: 2002,
  VALIDATION_OUT_OF_RANGE: 2003,
  VALIDATION_DUPLICATE_VALUE: 2004,

  // Resource errors (3000-3999)
  RESOURCE_NOT_FOUND: 3001,
  RESOURCE_ALREADY_EXISTS: 3002,
  RESOURCE_ACCESS_DENIED: 3003,

  // System errors (4000-4999)
  SYSTEM_DATABASE_ERROR: 4001,
  SYSTEM_EXTERNAL_SERVICE_ERROR: 4002,
  SYSTEM_CONFIGURATION_ERROR: 4003,

  // Rate limiting (5000-5999)
  RATE_LIMIT_EXCEEDED: 5001
} as const

export default {
  API,
  PAGINATION,
  AUTH,
  HTTP_MESSAGES,
  DATABASE,
  FILE_UPLOAD,
  EMAIL,
  CACHE,
  VALIDATION,
  ROLES,
  PERMISSIONS,
  TOKEN_TYPES,
  ENVIRONMENTS,
  REQUEST,
  RESPONSE,
  LOGGING,
  SECURITY,
  REGEX,
  DEFAULTS,
  ERROR_CODES
}
