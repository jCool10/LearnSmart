import express from 'express'
import { authController } from '@/controllers'
import { auth, validate } from '@/middlewares'
import { authValidations } from '@/validations/auth.validation'

const router = express.Router()

// Public authentication routes
router.post('/register', validate(authValidations.register), authController.register)
router.post('/login', validate(authValidations.login), authController.login)
router.post('/logout', validate(authValidations.logout), authController.logout)
router.post('/refresh-tokens', validate(authValidations.refreshTokens), authController.refreshTokens)
router.post('/forgot-password', validate(authValidations.forgotPassword), authController.forgotPassword)
router.post('/reset-password', validate(authValidations.resetPassword), authController.resetPassword)
router.post('/verify-email', validate(authValidations.verifyEmail), authController.verifyEmail)

// Protected authentication routes (require authentication)
router.post(
  '/send-verification-email',
  auth(),
  validate(authValidations.sendVerificationEmail),
  authController.sendVerificationEmail
)

// Get current user
router.get('/me', auth(), authController.getCurrentUser)

export default router
