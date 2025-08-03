import {
  userService,
  tokenService,
  authService,
  categoryService,
  roadmapService,
  enrollmentService,
  progressService
} from '../services'

// Base classes and types
export { BaseController, ControllerConfig } from './base.controller'

// Controllers
export { UserController } from './user.controller'
export { TokenController } from './token.controller'
export { AuthController } from './auth.controller'
export { HealthController } from './health.controller'
export { CategoryController } from './category.controller'
export { RoadmapController } from './roadmap.controller'
export { EnrollmentController } from './enrollment.controller'
export { ProgressController } from './progress.controller'

// Controller instances with dependency injection
import { UserController } from './user.controller'
import { TokenController } from './token.controller'
import { AuthController } from './auth.controller'
import { HealthController } from './health.controller'
import { CategoryController } from './category.controller'
import { RoadmapController } from './roadmap.controller'
import { EnrollmentController } from './enrollment.controller'
import { ProgressController } from './progress.controller'

export const userController = new UserController(userService)
export const tokenController = new TokenController(tokenService)
export const authController = new AuthController(authService)
export const healthController = new HealthController()
export const categoryController = new CategoryController(categoryService)
export const roadmapController = new RoadmapController(roadmapService)
export const enrollmentController = new EnrollmentController(enrollmentService)
export const progressController = new ProgressController(progressService)
