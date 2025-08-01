import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError, ForbiddenError } from '@/cores/error.handler'
import { roleRights, Permission } from '@/configs/roles'
import { User } from 'generated/prisma'

const verifyCallback = (
  req: Request,
  resolve: () => void,
  reject: (error: Error) => void,
  requiredRights: Permission[]
) => {
  return (err: any, user: User | false, info: any) => {
    if (err || info || !user) {
      return reject(new UnauthorizedError('Please authenticate'))
    }

    req.user = user

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role as any) || []
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight))

      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ForbiddenError('Forbidden'))
      }
    }

    resolve()
  }
}

/**
 * Auth middleware with role-based authorization
 * @param requiredRights - Array of required rights for the route
 * @returns Express middleware function
 */
export const auth = (...requiredRights: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      )
    })
      .then(() => next())
      .catch((err) => next(err))
  }
}

export default auth
