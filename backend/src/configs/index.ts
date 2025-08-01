import dotenv from 'dotenv'
import { AUTH, API, PAGINATION } from '@/constants'

// Load environment variables first
dotenv.config()

export const configs = {
  app: {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'LearnSmart API',
    version: process.env.APP_VERSION || '1.0.0'
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database',
    ssl: process.env.NODE_ENV === 'production'
  },
  jwt: {
    // Single secret key for symmetric encryption
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    algorithm: AUTH.JWT.ALGORITHM,

    // Token expiration times
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || AUTH.JWT.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || AUTH.JWT.REFRESH_TOKEN_EXPIRES_IN,

    // Token issuers and audience for additional security
    issuer: process.env.JWT_ISSUER || AUTH.JWT.ISSUER,
    audience: process.env.JWT_AUDIENCE || AUTH.JWT.AUDIENCE,

    // Numeric values for internal use
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || '15'),
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || '30')
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:8080${API.PREFIX}/auth/google/callback`
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  },
  rate_limit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || API.RATE_LIMIT.WINDOW_MS.toString()),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || API.RATE_LIMIT.MAX_REQUESTS.toString()),
    message: process.env.RATE_LIMIT_MESSAGE || API.RATE_LIMIT.MESSAGE,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'true' || true
  },
  security: {
    bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS || AUTH.PASSWORD.BCRYPT_ROUNDS.toString()),
    max_login_attempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || AUTH.SESSION.MAX_LOGIN_ATTEMPTS.toString()),
    lockout_time: parseInt(process.env.LOCKOUT_TIME || AUTH.SESSION.LOCKOUT_TIME_MINUTES.toString()),

    // Session security
    session_timeout: parseInt(process.env.SESSION_TIMEOUT || AUTH.SESSION.TIMEOUT_MS.toString()),

    // CSRF protection
    csrf_enabled: process.env.CSRF_ENABLED === 'true' || false,
    csrf_secret: process.env.CSRF_SECRET || 'csrf-secret-key'
  },
  validation: {
    max_file_size: '10mb',
    max_body_size: '10mb',
    allowed_file_types: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },
  pagination: {
    default_page_size: PAGINATION.DEFAULT_LIMIT,
    max_page_size: PAGINATION.MAX_LIMIT
  }
}
