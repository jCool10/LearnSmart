'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  useUserProgressInRoadmap,
  useLessonProgress,
  useUpdateLessonProgress,
  useMarkLessonCompleted,
  useMarkLessonIncomplete,
  useResetProgress,
  useUserOverallStats,
  useRecentActivity,
  useUserProgressStreak,
  useNextLesson,
  usePreviousLesson
} from '@/hooks/useProgressQueries'
import {
  useRecalculateProgress
} from '@/hooks/useEnrollmentQueries'
import { 
  LessonProgress, 
  LessonProgressUpdateDto,
  UserOverallStats,
  RecentActivity,
  Lesson,
  RoadmapNavigation
} from '@/types/roadmap.types'

// Context types
interface ProgressContextType {
  // Current lesson state
  currentLessonId: string | null
  setCurrentLessonId: (lessonId: string | null) => void
  currentRoadmapId: string | null
  setCurrentRoadmapId: (roadmapId: string | null) => void
  
  // Progress operations
  updateLessonProgress: (lessonId: string, data: LessonProgressUpdateDto) => Promise<void>
  markLessonCompleted: (lessonId: string, score?: number) => Promise<void>
  markLessonIncomplete: (lessonId: string) => Promise<void>
  resetRoadmapProgress: (roadmapId: string) => Promise<void>
  recalculateProgress: (roadmapId: string) => Promise<void>
  
  // Navigation helpers
  goToNextLesson: () => Promise<void>
  goToPreviousLesson: () => Promise<void>
  canGoNext: boolean
  canGoPrevious: boolean
  
  // Data getters
  getLessonProgress: (lessonId: string) => LessonProgress | undefined
  getUserProgressInRoadmap: (roadmapId: string) => LessonProgress[]
  getUserOverallStats: () => UserOverallStats | undefined
  getRecentActivity: (limit?: number) => RecentActivity[]
  getUserStreak: () => number
  getNavigationInfo: () => RoadmapNavigation | null
  
  // Loading states
  isLoadingProgress: boolean
  isUpdatingProgress: boolean
  isMarkingCompleted: boolean
  isMarkingIncomplete: boolean
  isResettingProgress: boolean
  isRecalculatingProgress: boolean
  
  // Refresh functions
  refreshProgress: () => void
  refreshStats: () => void
}

// Create context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

// Provider props
interface ProgressProviderProps {
  children: ReactNode
}

// Provider component
export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user } = useAuth()
  
  // State
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null)
  
  // Queries
  const { 
    data: roadmapProgressData, 
    isLoading: isLoadingRoadmapProgress,
    refetch: refetchRoadmapProgress
  } = useUserProgressInRoadmap(currentRoadmapId || '')
  
  const { 
    data: currentLessonProgressData,
    refetch: refetchCurrentLessonProgress
  } = useLessonProgress(currentLessonId || '')
  
  const { 
    data: overallStatsData,
    refetch: refetchOverallStats
  } = useUserOverallStats(user?.id || '')
  
  const { 
    data: recentActivityData 
  } = useRecentActivity(user?.id || '', 10)
  
  const { 
    data: userStreakData 
  } = useUserProgressStreak(user?.id || '')
  
  const { 
    data: nextLessonData 
  } = useNextLesson(currentLessonId || '')
  
  const { 
    data: previousLessonData 
  } = usePreviousLesson(currentLessonId || '')
  
  // Mutations
  const { 
    mutateAsync: updateProgressMutation, 
    isPending: isUpdatingProgress 
  } = useUpdateLessonProgress()
  
  const { 
    mutateAsync: markCompletedMutation, 
    isPending: isMarkingCompleted 
  } = useMarkLessonCompleted()
  
  const { 
    mutateAsync: markIncompleteMutation, 
    isPending: isMarkingIncomplete 
  } = useMarkLessonIncomplete()
  
  const { 
    mutateAsync: resetProgressMutation, 
    isPending: isResettingProgress 
  } = useResetProgress()
  
  const { 
    mutateAsync: recalculateProgressMutation, 
    isPending: isRecalculatingProgress 
  } = useRecalculateProgress()
  
  // Progress operations
  const updateLessonProgress = useCallback(async (lessonId: string, data: LessonProgressUpdateDto) => {
    try {
      await updateProgressMutation({ lessonId, data })
      // Refresh current lesson progress if it's the one being updated
      if (currentLessonId === lessonId) {
        refetchCurrentLessonProgress()
      }
      // Refresh roadmap progress
      refetchRoadmapProgress()
    } catch (error) {
      console.error('Failed to update lesson progress:', error)
      throw error
    }
  }, [updateProgressMutation, currentLessonId, refetchCurrentLessonProgress, refetchRoadmapProgress])
  
  const markLessonCompleted = useCallback(async (lessonId: string, score?: number) => {
    try {
      await markCompletedMutation({ lessonId, score })
      // Refresh progress data
      if (currentLessonId === lessonId) {
        refetchCurrentLessonProgress()
      }
      refetchRoadmapProgress()
      refetchOverallStats()
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error)
      throw error
    }
  }, [markCompletedMutation, currentLessonId, refetchCurrentLessonProgress, refetchRoadmapProgress, refetchOverallStats])
  
  const markLessonIncomplete = useCallback(async (lessonId: string) => {
    try {
      await markIncompleteMutation(lessonId)
      // Refresh progress data
      if (currentLessonId === lessonId) {
        refetchCurrentLessonProgress()
      }
      refetchRoadmapProgress()
      refetchOverallStats()
    } catch (error) {
      console.error('Failed to mark lesson as incomplete:', error)
      throw error
    }
  }, [markIncompleteMutation, currentLessonId, refetchCurrentLessonProgress, refetchRoadmapProgress, refetchOverallStats])
  
  const resetRoadmapProgress = useCallback(async (roadmapId: string) => {
    try {
      await resetProgressMutation(roadmapId)
      // Refresh all progress data
      refetchRoadmapProgress()
      refetchCurrentLessonProgress()
      refetchOverallStats()
    } catch (error) {
      console.error('Failed to reset roadmap progress:', error)
      throw error
    }
  }, [resetProgressMutation, refetchRoadmapProgress, refetchCurrentLessonProgress, refetchOverallStats])
  
  const recalculateProgress = useCallback(async (roadmapId: string) => {
    try {
      await recalculateProgressMutation(roadmapId)
      // Refresh progress data
      refetchRoadmapProgress()
    } catch (error) {
      console.error('Failed to recalculate progress:', error)
      throw error
    }
  }, [recalculateProgressMutation, refetchRoadmapProgress])
  
  // Navigation helpers
  const goToNextLesson = useCallback(async () => {
    if (nextLessonData?.data) {
      setCurrentLessonId(nextLessonData.data.id)
    }
  }, [nextLessonData])
  
  const goToPreviousLesson = useCallback(async () => {
    if (previousLessonData?.data) {
      setCurrentLessonId(previousLessonData.data.id)
    }
  }, [previousLessonData])
  
  const canGoNext = Boolean(nextLessonData?.data)
  const canGoPrevious = Boolean(previousLessonData?.data)
  
  // Data getters
  const getLessonProgress = useCallback((lessonId: string): LessonProgress | undefined => {
    if (!roadmapProgressData?.data) return undefined
    return roadmapProgressData.data.find(progress => progress.lessonId === lessonId)
  }, [roadmapProgressData])
  
  const getUserProgressInRoadmap = useCallback((roadmapId: string): LessonProgress[] => {
    if (roadmapId !== currentRoadmapId || !roadmapProgressData?.data) return []
    return roadmapProgressData.data
  }, [currentRoadmapId, roadmapProgressData])
  
  const getUserOverallStats = useCallback((): UserOverallStats | undefined => {
    return overallStatsData?.data
  }, [overallStatsData])
  
  const getRecentActivity = useCallback((limit?: number): RecentActivity[] => {
    if (!recentActivityData?.data) return []
    return limit ? recentActivityData.data.slice(0, limit) : recentActivityData.data
  }, [recentActivityData])
  
  const getUserStreak = useCallback((): number => {
    return userStreakData?.data?.streak || 0
  }, [userStreakData])
  
  const getNavigationInfo = useCallback((): RoadmapNavigation | null => {
    if (!currentLessonId || !roadmapProgressData?.data) return null
    
    const allProgress = roadmapProgressData.data
    const completedLessons = allProgress.filter(p => p.isCompleted).length
    const totalLessons = allProgress.length
    
    // Find current lesson progress to determine if user can proceed
    const currentProgress = allProgress.find(p => p.lessonId === currentLessonId)
    const canProceed = currentProgress?.isCompleted || false
    
    return {
      currentLessonId,
      nextLessonId: nextLessonData?.data?.id,
      previousLessonId: previousLessonData?.data?.id,
      totalLessons,
      completedLessons,
      canProceed
    }
  }, [currentLessonId, roadmapProgressData, nextLessonData, previousLessonData])
  
  // Refresh functions
  const refreshProgress = useCallback(() => {
    refetchRoadmapProgress()
    refetchCurrentLessonProgress()
  }, [refetchRoadmapProgress, refetchCurrentLessonProgress])
  
  const refreshStats = useCallback(() => {
    refetchOverallStats()
  }, [refetchOverallStats])
  
  // Loading state
  const isLoadingProgress = isLoadingRoadmapProgress
  
  // Context value
  const value: ProgressContextType = {
    // Current lesson state
    currentLessonId,
    setCurrentLessonId,
    currentRoadmapId,
    setCurrentRoadmapId,
    
    // Progress operations
    updateLessonProgress,
    markLessonCompleted,
    markLessonIncomplete,
    resetRoadmapProgress,
    recalculateProgress,
    
    // Navigation helpers
    goToNextLesson,
    goToPreviousLesson,
    canGoNext,
    canGoPrevious,
    
    // Data getters
    getLessonProgress,
    getUserProgressInRoadmap,
    getUserOverallStats,
    getRecentActivity,
    getUserStreak,
    getNavigationInfo,
    
    // Loading states
    isLoadingProgress,
    isUpdatingProgress,
    isMarkingCompleted,
    isMarkingIncomplete,
    isResettingProgress,
    isRecalculatingProgress,
    
    // Refresh functions
    refreshProgress,
    refreshStats,
  }
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

// Custom hook to use progress context
export const useProgressContext = (): ProgressContextType => {
  const context = useContext(ProgressContext)
  
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider')
  }
  
  return context
}

export default ProgressContext
