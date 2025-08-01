import { userService, tokenService, authService } from '../services'

// Base classes and types
export { BaseController, ControllerConfig } from './base.controller'

// Controllers
export { UserController } from './user.controller'
export { TokenController } from './token.controller'
export { AuthController } from './auth.controller'
export { HealthController } from './health.controller'

// Controller instances with dependency injection
import { UserController } from './user.controller'
import { TokenController } from './token.controller'
import { AuthController } from './auth.controller'
import { HealthController } from './health.controller'

export const userController = new UserController(userService)
export const tokenController = new TokenController(tokenService)
export const authController = new AuthController(authService)
export const healthController = new HealthController()
