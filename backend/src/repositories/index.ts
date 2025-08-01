import { UserRepository } from './user.repository'
import { TokenRepository } from './token.repository'

export { BaseRepository, PaginationOptions, PaginationResult, RepositoryError } from './base.repository'
export { UserRepository } from './user.repository'
export { TokenRepository } from './token.repository'

// Repository instances (can be used as singletons)
export const userRepository = new UserRepository()
export const tokenRepository = new TokenRepository()
