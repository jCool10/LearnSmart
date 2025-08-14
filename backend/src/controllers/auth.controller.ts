import { ResponseHandler } from '@/cores/response.handler'
import { BaseController } from '@/controllers/base.controller'
import { AuthService } from '@/services/auth.service'
import catchAsync from '@/utils/catchAsync'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RegisterDto, UserDto } from '@/types/dto.types'

export class AuthController extends BaseController<UserDto, RegisterDto, any> {
  constructor(private authService: AuthService) {
    super(authService as any) // Temporary until AuthService extends BaseService
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.register(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'User registered successfully',
      data: result,
      statusCode: StatusCodes.CREATED
    })
  })

  login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.login(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Login successful',
      data: result
    })
  })

  logout = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.logout(req)

    ResponseHandler.success(res, {
      message: 'Logout successful',
      data: result
    })
  })

  refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.refreshTokens(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Tokens refreshed successfully',
      data: result
    })
  })

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.forgotPassword(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Password reset email sent successfully',
      data: result
    })
  })

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.resetPassword(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Password reset successful',
      data: result
    })
  })

  sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.sendVerificationEmail(req)

    ResponseHandler.success(res, {
      message: 'Verification email sent successfully',
      data: result
    })
  })

  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    // const verifyEmailData: VerifyEmailDto = req.body
    const result = await this.authService.verifyEmail(req) // Using legacy method during migration

    ResponseHandler.success(res, {
      message: 'Email verified successfully',
      data: result
    })
  })

  // Get current user
  getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.getCurrentUser(req)

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
