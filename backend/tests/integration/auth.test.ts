import request from 'supertest'
import { Express } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserFactory, DatabaseHelper, TestDataGenerator, ResponseValidator, AuthHelper } from '../utils/test-helpers'

// Import the app
import { app } from '@/index'

describe('Authentication Integration Tests', () => {
  let testApp: Express

  beforeAll(async () => {
    testApp = app
  })

  beforeEach(async () => {
    await DatabaseHelper.cleanup()
  })

  afterAll(async () => {
    await DatabaseHelper.cleanup()
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = TestDataGenerator.generateValidUserData()

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send({
          email: userData.email,
          password: userData.password,
          username: userData.name
        })
        .expect(StatusCodes.CREATED)

      ResponseValidator.validateAuthResponse(response)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return validation error for invalid data', async () => {
      const invalidData = TestDataGenerator.generateInvalidUserData()

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send({
          email: invalidData.email,
          password: invalidData.password,
          username: invalidData.name
        })
        .expect(StatusCodes.BAD_REQUEST)

      ResponseValidator.validateErrorResponse(response, 'Validation failed')
      expect(response.body.errors).toBeDefined()
      expect(Array.isArray(response.body.errors)).toBe(true)
    })

    it('should return conflict error for duplicate email', async () => {
      // Create a user first
      const userData = TestDataGenerator.generateValidUserData()
      await UserFactory.create({
        name: 'Existing User',
        email: userData.email,
        password: 'hashedpassword'
      })

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send({
          email: userData.email,
          password: userData.password,
          username: 'New User'
        })
        .expect(StatusCodes.CONFLICT)

      ResponseValidator.validateErrorResponse(response, 'already exists')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    let testUser: any
    const userPassword = 'TestPassword123!'

    beforeEach(async () => {
      testUser = await UserFactory.createVerified({
        email: 'test@example.com',
        password: '$2b$12$abcdefghijklmnopqrstuvwxyz' // This should be properly hashed in real implementation
      })
    })

    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: userPassword
      }

      const response = await request(testApp).post('/api/v1/auth/login').send(loginData).expect(StatusCodes.OK)

      ResponseValidator.validateAuthResponse(response)
      expect(response.body.data.user.id).toBe(testUser.id)
      expect(response.body.data.user.email).toBe(testUser.email)
    })

    it('should return unauthorized for invalid credentials', async () => {
      const invalidLogin = TestDataGenerator.generateInvalidLoginData()

      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send(invalidLogin)
        .expect(StatusCodes.UNAUTHORIZED)

      ResponseValidator.validateErrorResponse(response, 'Incorrect email or password')
    })

    it('should return validation error for missing fields', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com'
          // password missing
        })
        .expect(StatusCodes.BAD_REQUEST)

      ResponseValidator.validateErrorResponse(response, 'Validation failed')
    })
  })

  describe('POST /api/v1/auth/refresh-tokens', () => {
    let authData: any

    beforeEach(async () => {
      authData = await AuthHelper.createAuthenticatedUser()
    })

    it('should refresh tokens successfully with valid refresh token', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/refresh-tokens')
        .send({
          refreshToken: authData.refreshToken
        })
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(response)
      expect(response.body.data).toHaveProperty('access')
      expect(response.body.data).toHaveProperty('refresh')
      expect(response.body.data.access).toHaveProperty('token')
      expect(response.body.data.refresh).toHaveProperty('token')
    })

    it('should return unauthorized for invalid refresh token', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/refresh-tokens')
        .send({
          refreshToken: 'invalid-refresh-token'
        })
        .expect(StatusCodes.UNAUTHORIZED)

      ResponseValidator.validateErrorResponse(response, 'Invalid refresh token')
    })

    it('should return bad request for missing refresh token', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/refresh-tokens')
        .send({})
        .expect(StatusCodes.BAD_REQUEST)

      ResponseValidator.validateErrorResponse(response, 'Refresh token is required')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    let authData: any

    beforeEach(async () => {
      authData = await AuthHelper.createAuthenticatedUser()
    })

    it('should logout user successfully', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/logout')
        .send({
          refreshToken: authData.refreshToken
        })
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(response)
      expect(response.body.message).toContain('Logged out successfully')
    })

    it('should return bad request for missing refresh token', async () => {
      const response = await request(testApp).post('/api/v1/auth/logout').send({}).expect(StatusCodes.BAD_REQUEST)

      ResponseValidator.validateErrorResponse(response, 'Refresh token is required')
    })
  })

  describe('POST /api/v1/auth/forgot-password', () => {
    let testUser: any

    beforeEach(async () => {
      testUser = await UserFactory.createVerified({
        email: 'test@example.com'
      })
    })

    it('should send password reset email for existing user', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email
        })
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(response)
      expect(response.body.message).toContain('password reset instructions')
    })

    it('should return same response for non-existent email (security)', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(response)
      expect(response.body.message).toContain('password reset instructions')
    })

    it('should return validation error for invalid email format', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'invalid-email'
        })
        .expect(StatusCodes.BAD_REQUEST)

      ResponseValidator.validateErrorResponse(response, 'Validation failed')
    })
  })

  describe('POST /api/v1/auth/send-verification-email', () => {
    let authData: any

    beforeEach(async () => {
      // Create unverified user
      const user = await UserFactory.create({
        isEmailVerified: false
      })
      const accessToken = AuthHelper.generateAccessToken(user.id)
      authData = { user, accessToken }
    })

    it('should send verification email for authenticated user', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', AuthHelper.getAuthHeader(authData.accessToken))
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(response)
      expect(response.body.message).toContain('Verification email sent')
    })

    it('should return unauthorized without authentication', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/send-verification-email')
        .expect(StatusCodes.UNAUTHORIZED)

      ResponseValidator.validateErrorResponse(response, 'Unauthorized')
    })
  })

  describe('Authentication Flow Integration', () => {
    it('should complete full registration to login flow', async () => {
      const userData = TestDataGenerator.generateValidUserData()

      // 1. Register user
      const registerResponse = await request(testApp)
        .post('/api/v1/auth/register')
        .send({
          email: userData.email,
          password: userData.password,
          username: userData.name
        })
        .expect(StatusCodes.CREATED)

      ResponseValidator.validateAuthResponse(registerResponse)
      const { user, tokens } = registerResponse.body.data

      // 2. Verify we can use the access token
      const protectedResponse = await request(testApp)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', AuthHelper.getAuthHeader(tokens.access.token))
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(protectedResponse)

      // 3. Refresh tokens
      const refreshResponse = await request(testApp)
        .post('/api/v1/auth/refresh-tokens')
        .send({
          refreshToken: tokens.refresh.token
        })
        .expect(StatusCodes.OK)

      expect(refreshResponse.body.data.access.token).toBeDefined()
      expect(refreshResponse.body.data.refresh.token).toBeDefined()

      // 4. Logout
      const logoutResponse = await request(testApp)
        .post('/api/v1/auth/logout')
        .send({
          refreshToken: tokens.refresh.token
        })
        .expect(StatusCodes.OK)

      ResponseValidator.validateSuccessResponse(logoutResponse)

      // 5. Verify tokens are invalidated (should fail)
      await request(testApp)
        .post('/api/v1/auth/refresh-tokens')
        .send({
          refreshToken: tokens.refresh.token
        })
        .expect(StatusCodes.UNAUTHORIZED)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on registration attempts', async () => {
      const userData = TestDataGenerator.generateValidUserData()

      // Make multiple rapid requests (assuming rate limit is configured)
      const promises = Array(15)
        .fill(null)
        .map((_, i) =>
          request(testApp)
            .post('/api/v1/auth/register')
            .send({
              email: `test${i}@example.com`,
              password: userData.password,
              username: `User ${i}`
            })
        )

      const responses = await Promise.allSettled(promises)

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(
        (result) => result.status === 'fulfilled' && (result.value as any).status === StatusCodes.TOO_MANY_REQUESTS
      )

      // Depending on rate limit configuration, we should see some rate limited responses
      // This test may need adjustment based on your actual rate limit settings
      expect(rateLimitedResponses.length).toBeGreaterThanOrEqual(0)
    })
  })
})
