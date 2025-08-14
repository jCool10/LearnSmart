import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { progressAPI, LessonProgressUpdateDto } from '@/lib/api'

// Query keys
export const progressKeys = {
  all: ['progress'] as const,
  lesson: (lessonId: string) => [...progressKeys.all, 'lesson', lessonId] as const,
  userRoadmap: (roadmapId: string) => [...progressKeys.all, 'user-roadmap', roadmapId] as const,
  userOverallStats: (userId: string) => [...progressKeys.all, 'user-overall-stats', userId] as const,
  recentActivity: (userId: string, limit?: number) => [...progressKeys.all, 'recent-activity', userId, { limit }] as const,
  roadmapCompletionRates: (roadmapId: string) => [...progressKeys.all, 'roadmap-completion-rates', roadmapId] as const,
  userStreak: (userId: string) => [...progressKeys.all, 'user-streak', userId] as const,
  nextLesson: (lessonId: string) => [...progressKeys.all, 'next-lesson', lessonId] as const,
  previousLesson: (lessonId: string) => [...progressKeys.all, 'previous-lesson', lessonId] as const,
}

// Queries
export const useLessonProgress = (lessonId: string) => {
  return useQuery({
    queryKey: progressKeys.lesson(lessonId),
    queryFn: () => progressAPI.getLessonProgress(lessonId),
    enabled: !!lessonId,
    staleTime: 30 * 1000, // 30 seconds - progress can change frequently
  })
}

export const useUserProgressInRoadmap = (roadmapId: string) => {
  return useQuery({
    queryKey: progressKeys.userRoadmap(roadmapId),
    queryFn: () => progressAPI.getUserProgressInRoadmap(roadmapId),
    enabled: !!roadmapId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUserOverallStats = (userId: string) => {
  return useQuery({
    queryKey: progressKeys.userOverallStats(userId),
    queryFn: () => progressAPI.getUserOverallStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRecentActivity = (userId: string, limit?: number) => {
  return useQuery({
    queryKey: progressKeys.recentActivity(userId, limit),
    queryFn: () => progressAPI.getRecentActivity(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useRoadmapCompletionRates = (roadmapId: string) => {
  return useQuery({
    queryKey: progressKeys.roadmapCompletionRates(roadmapId),
    queryFn: () => progressAPI.getRoadmapCompletionRates(roadmapId),
    enabled: !!roadmapId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useUserProgressStreak = (userId: string) => {
  return useQuery({
    queryKey: progressKeys.userStreak(userId),
    queryFn: () => progressAPI.getUserStreak(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useNextLesson = (lessonId: string) => {
  return useQuery({
    queryKey: progressKeys.nextLesson(lessonId),
    queryFn: () => progressAPI.getNextLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 10 * 60 * 1000, // 10 minutes - lesson order doesn't change often
  })
}

export const usePreviousLesson = (lessonId: string) => {
  return useQuery({
    queryKey: progressKeys.previousLesson(lessonId),
    queryFn: () => progressAPI.getPreviousLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 10 * 60 * 1000, // 10 minutes - lesson order doesn't change often
  })
}

// Mutations
export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: LessonProgressUpdateDto }) =>
      progressAPI.updateLessonProgress(lessonId, data),
    onSuccess: (_, { lessonId }) => {
      // Invalidate lesson progress
      queryClient.invalidateQueries({ queryKey: progressKeys.lesson(lessonId) })
      // Invalidate user roadmap progress
      queryClient.invalidateQueries({ queryKey: progressKeys.userRoadmap('') })
      // Invalidate user stats and activity
      queryClient.invalidateQueries({ queryKey: progressKeys.userOverallStats('') })
      queryClient.invalidateQueries({ queryKey: progressKeys.recentActivity('') })
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export const useMarkLessonCompleted = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lessonId, score }: { lessonId: string; score?: number }) =>
      progressAPI.markCompleted(lessonId, score),
    onSuccess: (_, { lessonId }) => {
      // Invalidate lesson progress
      queryClient.invalidateQueries({ queryKey: progressKeys.lesson(lessonId) })
      // Invalidate user roadmap progress
      queryClient.invalidateQueries({ queryKey: progressKeys.userRoadmap('') })
      // Invalidate user stats and activity
      queryClient.invalidateQueries({ queryKey: progressKeys.userOverallStats('') })
      queryClient.invalidateQueries({ queryKey: progressKeys.recentActivity('') })
      queryClient.invalidateQueries({ queryKey: progressKeys.userStreak('') })
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export const useMarkLessonIncomplete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => progressAPI.markIncomplete(lessonId),
    onSuccess: (_, lessonId) => {
      // Invalidate lesson progress
      queryClient.invalidateQueries({ queryKey: progressKeys.lesson(lessonId) })
      // Invalidate user roadmap progress
      queryClient.invalidateQueries({ queryKey: progressKeys.userRoadmap('') })
      // Invalidate user stats and activity
      queryClient.invalidateQueries({ queryKey: progressKeys.userOverallStats('') })
      queryClient.invalidateQueries({ queryKey: progressKeys.recentActivity('') })
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export const useResetProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmapId: string) => progressAPI.resetProgress(roadmapId),
    onSuccess: (_, roadmapId) => {
      // Invalidate all progress queries for this roadmap
      queryClient.invalidateQueries({ queryKey: progressKeys.userRoadmap(roadmapId) })
      queryClient.invalidateQueries({ queryKey: progressKeys.all })
      // Invalidate enrollment queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}
