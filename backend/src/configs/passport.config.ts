import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { configs } from './index'
import { BadRequestError } from '@/cores/error.handler'
import { prisma } from '@/configs/database.config'

const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail'
}

const jwtOptions = {
  secretOrKey: configs.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: configs.jwt.issuer,
  audience: configs.jwt.audience,
  algorithms: [configs.jwt.algorithm]
}

// JWT strategy for authenticating users
const jwtVerify = async (payload: any, done: any) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new BadRequestError('Invalid token type')
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)

export default jwtStrategy
