import { UserRepository } from './user.repository'
import { TokenRepository } from './token.repository'
import { CategoryRepository } from './category.repository'
import { RoadmapRepository } from './roadmap.repository'
import { LessonRepository } from './lesson.repository'
import { EnrollmentRepository } from './enrollment.repository'
import { ProgressRepository } from './progress.repository'
import { TagRepository } from './tag.repository'

export { BaseRepository, PaginationOptions, PaginationResult, RepositoryError } from './base.repository'
export { UserRepository } from './user.repository'
export { TokenRepository } from './token.repository'
export { CategoryRepository } from './category.repository'
export { RoadmapRepository } from './roadmap.repository'
export { LessonRepository } from './lesson.repository'
export { EnrollmentRepository } from './enrollment.repository'
export { ProgressRepository } from './progress.repository'
export { TagRepository } from './tag.repository'

// Repository instances (can be used as singletons)
export const userRepository = new UserRepository()
export const tokenRepository = new TokenRepository()
export const categoryRepository = new CategoryRepository()
export const roadmapRepository = new RoadmapRepository()
export const lessonRepository = new LessonRepository()
export const enrollmentRepository = new EnrollmentRepository()
export const progressRepository = new ProgressRepository()
export const tagRepository = new TagRepository()
