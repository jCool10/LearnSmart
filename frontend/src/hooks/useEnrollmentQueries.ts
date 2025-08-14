import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentAPI } from '@/lib/api'

// Query keys
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  status: (roadmapId: string) => [...enrollmentKeys.all, 'status', roadmapId] as const,
  details: (roadmapId: string) => [...enrollmentKeys.all, 'details', roadmapId] as const,
  userEnrollments: (userId: string, status?: string) => [...enrollmentKeys.all, 'user', userId, { status }] as const,
  userStats: (userId: string) => [...enrollmentKeys.all, 'user-stats', userId] as const,
  userStreak: (userId: string) => [...enrollmentKeys.all, 'user-streak', userId] as const,
  completionRate: (roadmapId: string) => [...enrollmentKeys.all, 'completion-rate', roadmapId] as const,
}

// Queries
export const useEnrollmentStatus = (roadmapId: string) => {
  return useQuery({
    queryKey: enrollmentKeys.status(roadmapId),
    queryFn: () => enrollmentAPI.checkStatus(roadmapId),
    enabled: !!roadmapId,
    staleTime: 30 * 1000, // 30 seconds - enrollment status can change frequently
  })
}

export const useEnrollmentDetails = (roadmapId: string) => {
  return useQuery({
    queryKey: enrollmentKeys.details(roadmapId),
    queryFn: () => enrollmentAPI.getDetails(roadmapId),
    enabled: !!roadmapId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUserEnrollments = (userId: string, status?: 'enrolled' | 'completed' | 'all') => {
  return useQuery({
    queryKey: enrollmentKeys.userEnrollments(userId, status),
    queryFn: () => enrollmentAPI.getUserEnrollments(userId, status),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: enrollmentKeys.userStats(userId),
    queryFn: () => enrollmentAPI.getUserStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserStreak = (userId: string) => {
  return useQuery({
    queryKey: enrollmentKeys.userStreak(userId),
    queryFn: () => enrollmentAPI.getUserStreak(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useRoadmapCompletionRate = (roadmapId: string) => {
  return useQuery({
    queryKey: enrollmentKeys.completionRate(roadmapId),
    queryFn: () => enrollmentAPI.getCompletionRate(roadmapId),
    enabled: !!roadmapId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutations
export const useEnrollInRoadmap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmapId: string) => enrollmentAPI.enroll(roadmapId),
    onSuccess: (_, roadmapId) => {
      // Invalidate enrollment status and details
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.status(roadmapId) })
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.details(roadmapId) })
      // Invalidate user enrollments for current user
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
      // Invalidate roadmap queries to update enrollment count
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
    },
  })
}

export const useUnenrollFromRoadmap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmapId: string) => enrollmentAPI.unenroll(roadmapId),
    onSuccess: (_, roadmapId) => {
      // Invalidate enrollment status and details
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.status(roadmapId) })
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.details(roadmapId) })
      // Invalidate user enrollments for current user
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
      // Invalidate roadmap queries to update enrollment count
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
    },
  })
}

export const useUpdateEnrollmentProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roadmapId, progress, averageScore }: { roadmapId: string; progress: number; averageScore?: number }) =>
      enrollmentAPI.updateProgress(roadmapId, progress, averageScore),
    onSuccess: (_, { roadmapId }) => {
      // Invalidate enrollment details and user enrollments
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.details(roadmapId) })
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
      // Invalidate user stats
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.userStats('') })
    },
  })
}

export const useRecalculateProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmapId: string) => enrollmentAPI.recalculateProgress(roadmapId),
    onSuccess: (_, roadmapId) => {
      // Invalidate enrollment details and user enrollments
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.details(roadmapId) })
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
