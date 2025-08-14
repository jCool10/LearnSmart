import { api } from './axios'

// Base API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Base types for entities
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// User types
export interface User extends BaseEntity {
  username: string
  email: string
  role: 'user' | 'admin'
  isEmailVerified: boolean
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

// Roadmap types
export interface Tag extends BaseEntity {
  name: string
  value: string
  isActive: boolean
}

export interface Lesson extends BaseEntity {
  title: string
  content: string
  order: number
  estimatedTime: number
  roadmapId: string
  isActive: boolean
  progress?: LessonProgress
}

export interface Roadmap extends BaseEntity {
  title: string
  description: string
  categoryId: string
  creatorId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  isActive: boolean
  category?: Category
  creator?: User
  tags?: Tag[]
  lessons?: Lesson[]
  enrollment?: UserRoadmapEnrollment
  enrollmentCount?: number
  averageRating?: number
}

export interface RoadmapCreateDto {
  title: string
  description: string
  categoryId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  tags?: string[]
  lessons?: {
    title: string
    content: string
    order: number
    estimatedTime: number
  }[]
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

// API Services
export const categoryAPI = {
  // Get all categories with roadmap count
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories')
    return response.data
  },

  // Get categories with statistics
  getWithStats: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories/stats')
    return response.data
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  // Get category by value
  getByValue: async (value: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/value/${value}`)
    return response.data
  },

  // Create category
  create: async (data: CategoryCreateDto): Promise<ApiResponse<Category>> => {
    const response = await api.post('/categories', data)
    return response.data
  },

  // Update category
  update: async (id: string, data: CategoryUpdateDto): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },

  // Restore category
  restore: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.post(`/categories/${id}/restore`)
    return response.data
  }
}

export const roadmapAPI = {
  // Get roadmaps with filters - Backend returns { data: [], meta: {} }
  getAll: async (params?: RoadmapQueryDto & PaginationParams): Promise<ApiResponse<{ data: Roadmap[], meta: any }>> => {
    const response = await api.get('/roadmaps', { params })
    return response.data
  },

  // Get roadmap by ID with details
  getById: async (id: string): Promise<ApiResponse<Roadmap>> => {
    const response = await api.get(`/roadmaps/${id}`)
    return response.data
  },

  // Get popular roadmaps
  getPopular: async (limit?: number): Promise<ApiResponse<Roadmap[]>> => {
    const response = await api.get('/roadmaps/popular', { params: { limit } })
    return response.data
  },

  // Get recommended roadmaps
  getRecommended: async (limit?: number): Promise<ApiResponse<Roadmap[]>> => {
    const response = await api.get('/roadmaps/recommended', { params: { limit } })
    return response.data
  },

  // Search roadmaps - Backend returns { data: [], meta: {} }
  search: async (query: string, filters?: { category?: string; difficulty?: string } & PaginationParams): Promise<ApiResponse<{ data: Roadmap[], meta: any }>> => {
    const response = await api.get('/roadmaps/search', { params: { q: query, ...filters } })
    return response.data
  },

  // Get roadmaps by creator - Backend returns { data: [], meta: {} }
  getByCreator: async (creatorId: string, params?: PaginationParams): Promise<ApiResponse<{ data: Roadmap[], meta: any }>> => {
    const response = await api.get(`/roadmaps/creator/${creatorId}`, { params })
    return response.data
  },

  // Get user enrolled roadmaps - Moved to userAPI to avoid route conflicts

  // Get roadmap statistics
  getStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/roadmaps/${id}/stats`)
    return response.data
  },

  // Create roadmap
  create: async (data: RoadmapCreateDto): Promise<ApiResponse<Roadmap>> => {
    const response = await api.post('/roadmaps', data)
    return response.data
  },

  // Update roadmap
  update: async (id: string, data: RoadmapUpdateDto): Promise<ApiResponse<Roadmap>> => {
    const response = await api.put(`/roadmaps/${id}`, data)
    return response.data
  },

  // Delete roadmap
  delete: async (id: string): Promise<ApiResponse<Roadmap>> => {
    const response = await api.delete(`/roadmaps/${id}`)
    return response.data
  }
}

export const enrollmentAPI = {
  // Enroll user in roadmap
  enroll: async (roadmapId: string): Promise<ApiResponse<UserRoadmapEnrollment>> => {
    const response = await api.post(`/roadmaps/${roadmapId}/enroll`)
    return response.data
  },

  // Unenroll user from roadmap
  unenroll: async (roadmapId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete(`/roadmaps/${roadmapId}/enroll`)
    return response.data
  },

  // Check enrollment status
  checkStatus: async (roadmapId: string): Promise<ApiResponse<{ isEnrolled: boolean }>> => {
    const response = await api.get(`/roadmaps/${roadmapId}/enrollment-status`)
    return response.data
  },

  // Get enrollment details
  getDetails: async (roadmapId: string): Promise<ApiResponse<UserRoadmapEnrollment>> => {
    const response = await api.get(`/roadmaps/${roadmapId}/enrollment`)
    return response.data
  },

  // Get user enrollments
  getUserEnrollments: async (userId: string, status?: 'enrolled' | 'completed' | 'all'): Promise<ApiResponse<UserRoadmapEnrollment[]>> => {
    const response = await api.get(`/users/${userId}/enrollments`, { params: { status } })
    return response.data
  },

  // Update enrollment progress
  updateProgress: async (roadmapId: string, progress: number, averageScore?: number): Promise<ApiResponse<UserRoadmapEnrollment>> => {
    const response = await api.put(`/roadmaps/${roadmapId}/progress`, { progress, averageScore })
    return response.data
  },

  // Recalculate progress
  recalculateProgress: async (roadmapId: string): Promise<ApiResponse<UserRoadmapEnrollment>> => {
    const response = await api.post(`/roadmaps/${roadmapId}/recalculate-progress`)
    return response.data
  },

  // Get user stats
  getUserStats: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/users/${userId}/stats`)
    return response.data
  },

  // Get user learning streak
  getUserStreak: async (userId: string): Promise<ApiResponse<{ streak: number }>> => {
    const response = await api.get(`/users/${userId}/streak`)
    return response.data
  },

  // Get roadmap completion rate
  getCompletionRate: async (roadmapId: string): Promise<ApiResponse<{ completionRate: number }>> => {
    const response = await api.get(`/roadmaps/${roadmapId}/completion-rate`)
    return response.data
  }
}

// User API
export const userAPI = {
  // Get user enrolled roadmaps - Backend returns { data: [], meta: {} }
  getUserEnrolledRoadmaps: async (userId: string, status?: 'enrolled' | 'completed' | 'all', params?: PaginationParams): Promise<ApiResponse<{ data: Roadmap[], meta: any }>> => {
    const response = await api.get(`/users/${userId}/roadmaps`, { params: { status, ...params } })
    return response.data
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Search users - Backend returns { data: [], meta: {} }
  searchUsers: async (query: string, params?: PaginationParams): Promise<ApiResponse<{ data: User[], meta: any }>> => {
    const response = await api.get('/users/search', { params: { q: query, ...params } })
    return response.data
  },

  // Get user stats
  getUserStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/users/stats')
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: any): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export const progressAPI = {
  // Update lesson progress
  updateLessonProgress: async (lessonId: string, data: LessonProgressUpdateDto): Promise<ApiResponse<LessonProgress>> => {
    const response = await api.put(`/lessons/${lessonId}/progress`, data)
    return response.data
  },

  // Get lesson progress
  getLessonProgress: async (lessonId: string): Promise<ApiResponse<LessonProgress>> => {
    const response = await api.get(`/lessons/${lessonId}/progress`)
    return response.data
  },

  // Get user progress in roadmap
  getUserProgressInRoadmap: async (roadmapId: string): Promise<ApiResponse<LessonProgress[]>> => {
    const response = await api.get(`/roadmaps/${roadmapId}/progress`)
    return response.data
  },

  // Mark lesson as completed
  markCompleted: async (lessonId: string, score?: number): Promise<ApiResponse<LessonProgress>> => {
    const response = await api.post(`/lessons/${lessonId}/complete`, { score })
    return response.data
  },

  // Mark lesson as incomplete
  markIncomplete: async (lessonId: string): Promise<ApiResponse<LessonProgress>> => {
    const response = await api.post(`/lessons/${lessonId}/incomplete`)
    return response.data
  },

  // Get user overall stats
  getUserOverallStats: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/users/${userId}/learning-stats`)
    return response.data
  },

  // Get recent activity
  getRecentActivity: async (userId: string, limit?: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/users/${userId}/recent-activity`, { params: { limit } })
    return response.data
  },

  // Get roadmap lesson completion rates
  getRoadmapCompletionRates: async (roadmapId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/roadmaps/${roadmapId}/lesson-completion-rates`)
    return response.data
  },

  // Get user learning streak
  getUserStreak: async (userId: string): Promise<ApiResponse<{ streak: number }>> => {
    const response = await api.get(`/users/${userId}/learning-streak`)
    return response.data
  },

  // Reset user progress in roadmap
  resetProgress: async (roadmapId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete(`/roadmaps/${roadmapId}/progress`)
    return response.data
  },

  // Get next lesson
  getNextLesson: async (lessonId: string): Promise<ApiResponse<Lesson | null>> => {
    const response = await api.get(`/lessons/${lessonId}/next`)
    return response.data
  },

  // Get previous lesson
  getPreviousLesson: async (lessonId: string): Promise<ApiResponse<Lesson | null>> => {
    const response = await api.get(`/lessons/${lessonId}/previous`)
    return response.data
  }
}
