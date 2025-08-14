// Base interfaces
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Category types
export interface Category extends BaseEntity {
  value: string
  label: string
  description?: string
  isActive: boolean
  roadmapCount?: number
}

export interface CategoryCreateDto {
  value: string
  label: string
  description?: string
}

export interface CategoryUpdateDto {
  value?: string
  label?: string
  description?: string
  isActive?: boolean
}

// User types (simplified for roadmap context)
export interface User extends BaseEntity {
  username: string
  email: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
}

// Tag types
export interface Tag extends BaseEntity {
  name: string
  value: string
  isActive: boolean
}

// Lesson types
export interface Lesson extends BaseEntity {
  title: string
  content: string
  order: number
  estimatedTime: number
  roadmapId: string
  isActive: boolean
  progress?: LessonProgress
}

export interface LessonCreateDto {
  title: string
  content: string
  order: number
  estimatedTime: number
}

// Roadmap types
export interface Roadmap extends BaseEntity {
  title: string
  description: string
  categoryId: string
  creatorId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number | string // Support both for compatibility with backend
  isActive: boolean
  category?: Category
  creator?: User
  tags?: Tag[]
  lessons?: Lesson[]
  enrollment?: UserRoadmapEnrollment
  enrollmentCount?: number
  averageRating?: number
  completionRate?: number
}

export interface RoadmapCreateDto {
  title: string
  description: string
  categoryId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  tags?: string[]
  lessons?: LessonCreateDto[]
}

export interface RoadmapUpdateDto {
  title?: string
  description?: string
  categoryId?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  isActive?: boolean
}

export interface RoadmapQueryDto {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  search?: string
  userId?: string
}

// Enrollment types
export interface UserRoadmapEnrollment extends BaseEntity {
  userId: string
  roadmapId: string
  progress: number
  isCompleted: boolean
  completedAt?: string
  averageScore?: number
  user?: User
  roadmap?: Roadmap
}

export interface EnrollmentCreateDto {
  userId: string
  roadmapId: string
}

export interface EnrollmentStats {
  totalEnrollments: number
  completedEnrollments: number
  averageProgress: number
  averageScore: number
  totalLearningTime: number
}

// Progress types
export interface LessonProgress extends BaseEntity {
  userId: string
  lessonId: string
  isCompleted: boolean
  completedAt?: string
  score?: number
  user?: User
  lesson?: Lesson
}

export interface LessonProgressUpdateDto {
  isCompleted: boolean
  score?: number
}

export interface UserOverallStats {
  totalRoadmapsEnrolled: number
  totalRoadmapsCompleted: number
  totalLessonsCompleted: number
  totalLearningTime: number
  averageScore: number
  currentStreak: number
  longestStreak: number
}

export interface RecentActivity {
  id: string
  type: 'lesson_completed' | 'roadmap_enrolled' | 'roadmap_completed'
  title: string
  description: string
  timestamp: string
  roadmapId?: string
  lessonId?: string
  score?: number
}

// Filter and pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: PaginatedResponse<any>['pagination']
  }
}

// Search and filter types
export interface SearchFilters {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  minEstimatedTime?: number
  maxEstimatedTime?: number
  minCompletionRate?: number
  isActive?: boolean
}

export interface RoadmapSearchParams extends PaginationParams {
  query?: string
  filters?: SearchFilters
}

// Statistics types
export interface RoadmapStatistics {
  totalEnrollments: number
  completionRate: number
  averageRating: number
  averageCompletionTime: number
  lessonCompletionRates: Array<{
    lessonId: string
    lessonTitle: string
    completionRate: number
  }>
}

export interface CategoryStatistics extends Category {
  totalRoadmaps: number
  totalEnrollments: number
  averageCompletionRate: number
}

// Form types for UI components
export interface RoadmapFormData {
  title: string
  description: string
  categoryId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  tags: string[]
  lessons: Array<{
    title: string
    content: string
    estimatedTime: number
  }>
}

export interface CategoryFormData {
  value: string
  label: string
  description?: string
}

// Navigation and routing types
export interface RoadmapNavigation {
  currentLessonId?: string
  nextLessonId?: string
  previousLessonId?: string
  totalLessons: number
  completedLessons: number
  canProceed: boolean
}

// Component prop types
export interface RoadmapCardProps {
  roadmap: Roadmap
  showEnrollButton?: boolean
  showProgress?: boolean
  onEnroll?: (roadmapId: string) => void
  onUnenroll?: (roadmapId: string) => void
}

export interface LessonCardProps {
  lesson: Lesson
  isLocked?: boolean
  onComplete?: (lessonId: string, score?: number) => void
  onStart?: (lessonId: string) => void
}

export interface ProgressBarProps {
  current: number
  total: number
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

// Hook return types
export interface UseRoadmapReturn {
  roadmap: Roadmap | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface UseRoadmapsReturn {
  roadmaps: Roadmap[]
  pagination: PaginatedResponse<Roadmap>['pagination'] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface UseEnrollmentReturn {
  enrollment: UserRoadmapEnrollment | undefined
  isEnrolled: boolean
  isLoading: boolean
  error: Error | null
  enroll: () => Promise<void>
  unenroll: () => Promise<void>
}

export interface UseProgressReturn {
  progress: LessonProgress[]
  isLoading: boolean
  error: Error | null
  updateProgress: (lessonId: string, data: LessonProgressUpdateDto) => Promise<void>
  markCompleted: (lessonId: string, score?: number) => Promise<void>
  markIncomplete: (lessonId: string) => Promise<void>
}
