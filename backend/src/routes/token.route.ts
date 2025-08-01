import { Router } from 'express'
import { tokenController } from '../controllers'
import { auth, validate } from '@/middlewares'
import { tokenValidations } from '@/validations/auth.validation'

const tokenRouter = Router()

// Token CRUD operations (all protected - only admins can manage tokens)
tokenRouter.post('/', auth('manageTokens'), validate(tokenValidations.createToken), tokenController.createToken)

tokenRouter.get('/', auth('getTokens'), validate(tokenValidations.getAllTokens), tokenController.getAllTokens)

tokenRouter.get('/active', auth('getTokens'), validate(tokenValidations.getAllTokens), tokenController.getActiveTokens)

tokenRouter.get('/stats', auth('getTokens'), tokenController.getTokenStats)

tokenRouter.delete('/expired', auth('manageTokens'), tokenController.deleteExpiredTokens)

tokenRouter.get('/user/:userId', auth('getTokens'), tokenController.getTokensByUserId)

tokenRouter.delete('/user/:userId', auth('manageTokens'), tokenController.deleteTokensByUserId)

tokenRouter.get('/type/:type', auth('getTokens'), tokenController.getTokensByType)

tokenRouter.get('/verify/:token', auth('getTokens'), tokenController.verifyToken)

tokenRouter.patch('/blacklist/:token', auth('manageTokens'), tokenController.blacklistTokenByValue)

tokenRouter.get('/:id', auth('getTokens'), validate(tokenValidations.getTokenById), tokenController.getTokenById)

tokenRouter.get('/value/:token', auth('getTokens'), tokenController.getTokenByValue)

tokenRouter.put('/:id', auth('manageTokens'), validate(tokenValidations.updateToken), tokenController.updateToken)

tokenRouter.patch('/:id/blacklist', auth('manageTokens'), tokenController.blacklistToken)

tokenRouter.delete('/:id', auth('manageTokens'), validate(tokenValidations.deleteToken), tokenController.deleteToken)

export { tokenRouter }
