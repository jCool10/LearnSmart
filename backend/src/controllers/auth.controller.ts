import { ResponseHandler } from '@/cores/response.handler'
import { BaseController } from '@/controllers/base.controller'
import { AuthService } from '@/services/auth.service'
import catchAsync from '@/utils/catchAsync'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, UserDto } from '@/types/dto.types'

export class AuthController extends BaseController<UserDto, RegisterDto, any> {
  constructor(private authService: AuthService) {
    super(authService as any) // Temporary until AuthService extends BaseService
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const registerData: RegisterDto = this.extractCreateData(req)
    const result = await this.authService.registerLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'User registered successfully',
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })

  login = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body)
    const loginData: LoginDto = req.body
    const result = await this.authService.loginLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Login successful',
      data: result
    })
  })

  logout = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.logoutLegacy(req)

    ResponseHandler.success(res, {
      message: 'Logout successful',
      data: result
    })
  })

  refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const refreshData: RefreshTokenDto = req.body
    const result = await this.authService.refreshTokensLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Tokens refreshed successfully',
      data: result
    })
  })

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const forgotPasswordData: ForgotPasswordDto = req.body
    const result = await this.authService.forgotPasswordLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Password reset email sent successfully',
      data: result
    })
  })

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordData: ResetPasswordDto = req.body
    const result = await this.authService.resetPasswordLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Password reset successful',
      data: result
    })
  })

  sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.sendVerificationEmailLegacy(req)

    ResponseHandler.success(res, {
      message: 'Verification email sent successfully',
      data: result
    })
  })

  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    // const verifyEmailData: VerifyEmailDto = req.body
    const result = await this.authService.verifyEmailLegacy(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Email verified successfully',
      data: result
    })
  })

  // Get current user
  getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id
    if (!userId) {
      ResponseHandler.error(res, {
        message: 'User not authenticated',
        statusCode: StatusCodes.UNAUTHORIZED
      })
    }

    const user = await this.authService.getCurrentUser(userId)

    ResponseHandler.success(res, {
      message: 'User data retrieved successfully',
      data: user
    })
  })

  // Override message methods for more specific auth messages
  protected getCreateSuccessMessage(): string {
    return 'User registered successfully'
  }
}
