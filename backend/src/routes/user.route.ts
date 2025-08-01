import { Router } from 'express'
import { userController } from '../controllers'
import { auth, validate } from '@/middlewares'
import { userValidations } from '@/validations/auth.validation'

const userRouter = Router()

// User CRUD operations (protected routes)
userRouter.post('/', auth('manageUsers'), validate(userValidations.createUser), userController.createUser)

userRouter.get('/', auth('getUsers'), validate(userValidations.getAllUsers), userController.getAllUsers)

userRouter.get('/search', auth('getUsers'), validate(userValidations.searchUsers), userController.searchUsers)

userRouter.get('/stats', auth('getUsers'), userController.getUserStats)

userRouter.get('/:id', auth('getUsers'), validate(userValidations.getUserById), userController.getUserById)

userRouter.get(
  '/email/:email',
  auth('getUsers'),
  validate(userValidations.getUserByEmail),
  userController.getUserByEmail
)

userRouter.put('/:id', auth('manageUsers'), validate(userValidations.updateUser), userController.updateUser)

userRouter.delete('/:id', auth('manageUsers'), validate(userValidations.deleteUser), userController.deleteUser)

export { userRouter }
