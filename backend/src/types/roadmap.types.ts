import { DifficultyLevel } from 'generated/prisma'

// Category Types
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

export interface CategoryWithCountDto {
  id: string
  value: string
  label: string
  description?: string
  roadmapCount: number
}

// Roadmap Types
export interface RoadmapCreateDto {
  title: string
  description: string
  categoryId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' // Match frontend types
  estimatedTime: number // Changed from string to number to match frontend
  tags?: string[]
  lessons?: LessonCreateDto[]
}

export interface RoadmapUpdateDto {
  title?: string
  description?: string
  categoryId?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' // Match frontend types
  estimatedTime?: number // Changed from string to number to match frontend
  isActive?: boolean
}

export interface RoadmapQueryDto {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' // Match frontend types
  search?: string
  userId?: string
  page?: number
  limit?: number
}

export interface RoadmapResponseDto {
  id: string
  title: string
  description: string
  category: {
    id: string
    value: string
    label: string
  }
  difficulty: 'beginner' | 'intermediate' | 'advanced' // Match frontend types
  totalLessons: number
  estimatedTime: number // Changed from string to number to match frontend
  rating: number
  enrolledUsers: number
  tags: string[]
  creator: {
    id: string
    username: string // Changed from 'name' to match frontend
  }
  userEnrollment?: {
    isEnrolled: boolean
    progress: number
    completedLessons: number
    averageScore: number
    lastAccessedAt?: string
    isCompleted: boolean
  }
  createdAt: string
  updatedAt: string
}

// Lesson Types
export interface LessonCreateDto {
  title: string
  description: string
  content?: string
  orderIndex: number
  estimatedMinutes?: number
}

export interface LessonUpdateDto {
  title?: string
  description?: string
  content?: string
  orderIndex?: number
  estimatedMinutes?: number
  isActive?: boolean
}

export interface LessonResponseDto {
  id: string
  title: string
  description: string
  content?: string
  orderIndex: number
  estimatedMinutes: number
  userProgress?: UserProgressResponseDto[]
}

export interface UserProgressResponseDto {
  id: string
  score?: number
  isCompleted: boolean
  completedAt?: string
}

// Enrollment Types
export interface EnrollmentCreateDto {
  roadmapId: string
  userId: string
}

export interface EnrollmentResponseDto {
  id: string
  roadmapId: string
  userId: string
  progress: number
  averageScore: number
  lastAccessedAt?: string
  completedAt?: string
  isCompleted: boolean
  enrolledAt: string
}

// Progress Types
export interface LessonProgressUpdateDto {
  score?: number
  isCompleted: boolean
}

export interface LessonProgressResponseDto {
  id: string
  lessonId: string
  userId: string
  score?: number
  isCompleted: boolean
  completedAt?: string
}

// Statistics Types
export interface RoadmapStatsDto {
  totalEnrollments: number
  completionRate: number
  averageRating: number
  averageCompletionTime: string
  difficultyDistribution: {
    beginner: number
    intermediate: number
    advanced: number
  }
}

export interface UserStatsDto {
  totalEnrollments: number
  totalCompletions: number
  averageScore: number
  totalLearningTime: number
  streakDays: number
  favoriteCategories: Array<{
    category: string
    count: number
  }>
}

// Tag Types
export interface TagCreateDto {
  name: string
  color?: string
}

export interface TagResponseDto {
  id: string
  name: string
  color?: string
  usageCount: number
}

// Filter and Search Types
export interface RoadmapFilters {
  categories: string[]
  difficulties: DifficultyLevel[]
  tags: string[]
  enrollmentStatus?: 'enrolled' | 'completed' | 'available'
  rating?: {
    min: number
    max: number
  }
}

export interface SearchCriteria {
  query: string
  filters: RoadmapFilters
  sortBy: 'rating' | 'enrolledUsers' | 'createdAt' | 'title'
  sortOrder: 'asc' | 'desc'
}
