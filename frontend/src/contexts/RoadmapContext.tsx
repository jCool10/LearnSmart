'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { 
  useRoadmaps, 
  useRoadmap, 
  usePopularRoadmaps, 
  useRecommendedRoadmaps,
  useSearchRoadmaps,
  useCreateRoadmap,
  useUpdateRoadmap,
  useDeleteRoadmap
} from '@/hooks/useRoadmapQueries'
import {
  useEnrollInRoadmap,
  useUnenrollFromRoadmap,
  useEnrollmentStatus,
  useEnrollmentDetails
} from '@/hooks/useEnrollmentQueries'
import { 
  Roadmap, 
  RoadmapQueryDto, 
  RoadmapCreateDto, 
  RoadmapUpdateDto,
  PaginationParams,
  UserRoadmapEnrollment
} from '@/types/roadmap.types'

// Context types
interface RoadmapContextType {
  // Current roadmap state
  currentRoadmap: Roadmap | null
  setCurrentRoadmap: (roadmap: Roadmap | null) => void
  
  // Search and filters
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: RoadmapQueryDto
  setFilters: (filters: RoadmapQueryDto) => void
  pagination: PaginationParams
  setPagination: (pagination: PaginationParams) => void
  
  // Roadmap operations
  createRoadmap: (data: RoadmapCreateDto) => Promise<void>
  updateRoadmap: (id: string, data: RoadmapUpdateDto) => Promise<void>
  deleteRoadmap: (id: string) => Promise<void>
  
  // Enrollment operations
  enrollInRoadmap: (roadmapId: string) => Promise<void>
  unenrollFromRoadmap: (roadmapId: string) => Promise<void>
  
  // Helper functions
  isEnrolledInRoadmap: (roadmapId: string) => boolean
  getEnrollmentDetails: (roadmapId: string) => UserRoadmapEnrollment | undefined
  refreshRoadmaps: () => void
  
  // Loading states
  isLoadingRoadmaps: boolean
  isLoadingCurrentRoadmap: boolean
  isCreatingRoadmap: boolean
  isUpdatingRoadmap: boolean
  isDeletingRoadmap: boolean
  isEnrolling: boolean
  isUnenrolling: boolean
}

// Create context
const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined)

// Provider props
interface RoadmapProviderProps {
  children: ReactNode
}

// Provider component
export const RoadmapProvider: React.FC<RoadmapProviderProps> = ({ children }) => {
  const { user } = useAuth()
  
  // State
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<RoadmapQueryDto>({})
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 })
  
  // Queries
  const { 
    data: roadmapsData, 
    isLoading: isLoadingRoadmaps,
    refetch: refetchRoadmaps
  } = useRoadmaps({ ...filters, ...pagination })
  
  const { 
    isLoading: isLoadingCurrentRoadmap 
  } = useRoadmap(currentRoadmap?.id || '')
  
  // Mutations
  const { 
    mutateAsync: createRoadmapMutation, 
    isPending: isCreatingRoadmap 
  } = useCreateRoadmap()
  
  const { 
    mutateAsync: updateRoadmapMutation, 
    isPending: isUpdatingRoadmap 
  } = useUpdateRoadmap()
  
  const { 
    mutateAsync: deleteRoadmapMutation, 
    isPending: isDeletingRoadmap 
  } = useDeleteRoadmap()
  
  const { 
    mutateAsync: enrollMutation, 
    isPending: isEnrolling 
  } = useEnrollInRoadmap()
  
  const { 
    mutateAsync: unenrollMutation, 
    isPending: isUnenrolling 
  } = useUnenrollFromRoadmap()
  
  // Roadmap operations
  const createRoadmap = useCallback(async (data: RoadmapCreateDto) => {
    try {
      await createRoadmapMutation(data)
      // Refresh roadmaps list
      refetchRoadmaps()
    } catch (error) {
      console.error('Failed to create roadmap:', error)
      throw error
    }
  }, [createRoadmapMutation, refetchRoadmaps])
  
  const updateRoadmap = useCallback(async (id: string, data: RoadmapUpdateDto) => {
    try {
      await updateRoadmapMutation({ id, data })
      // Update current roadmap if it's the one being updated
      if (currentRoadmap?.id === id) {
        setCurrentRoadmap(prev => prev ? { ...prev, ...data } : null)
      }
    } catch (error) {
      console.error('Failed to update roadmap:', error)
      throw error
    }
  }, [updateRoadmapMutation, currentRoadmap])
  
  const deleteRoadmap = useCallback(async (id: string) => {
    try {
      await deleteRoadmapMutation(id)
      // Clear current roadmap if it's the one being deleted
      if (currentRoadmap?.id === id) {
        setCurrentRoadmap(null)
      }
    } catch (error) {
      console.error('Failed to delete roadmap:', error)
      throw error
    }
  }, [deleteRoadmapMutation, currentRoadmap])
  
  // Enrollment operations
  const enrollInRoadmap = useCallback(async (roadmapId: string) => {
    if (!user) {
      throw new Error('User must be logged in to enroll')
    }
    
    try {
      await enrollMutation(roadmapId)
    } catch (error) {
      console.error('Failed to enroll in roadmap:', error)
      throw error
    }
  }, [enrollMutation, user])
  
  const unenrollFromRoadmap = useCallback(async (roadmapId: string) => {
    if (!user) {
      throw new Error('User must be logged in to unenroll')
    }
    
    try {
      await unenrollMutation(roadmapId)
    } catch (error) {
      console.error('Failed to unenroll from roadmap:', error)
      throw error
    }
  }, [unenrollMutation, user])
  
  // Helper functions
  const isEnrolledInRoadmap = useCallback((roadmapId: string): boolean => {
    // This would need to be implemented with enrollment status query
    // For now, return false
    return false
  }, [])
  
  const getEnrollmentDetails = useCallback((roadmapId: string): UserRoadmapEnrollment | undefined => {
    // This would need to be implemented with enrollment details query
    // For now, return undefined
    return undefined
  }, [])
  
  const refreshRoadmaps = useCallback(() => {
    refetchRoadmaps()
  }, [refetchRoadmaps])
  
  // Context value
  const value: RoadmapContextType = {
    // Current roadmap state
    currentRoadmap,
    setCurrentRoadmap,
    
    // Search and filters
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    pagination,
    setPagination,
    
    // Roadmap operations
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    
    // Enrollment operations
    enrollInRoadmap,
    unenrollFromRoadmap,
    
    // Helper functions
    isEnrolledInRoadmap,
    getEnrollmentDetails,
    refreshRoadmaps,
    
    // Loading states
    isLoadingRoadmaps,
    isLoadingCurrentRoadmap,
    isCreatingRoadmap,
    isUpdatingRoadmap,
    isDeletingRoadmap,
    isEnrolling,
    isUnenrolling,
  }
  
  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  )
}

// Custom hook to use roadmap context
export const useRoadmapContext = (): RoadmapContextType => {
  const context = useContext(RoadmapContext)
  
  if (context === undefined) {
    throw new Error('useRoadmapContext must be used within a RoadmapProvider')
  }
  
  return context
}

export default RoadmapContext
