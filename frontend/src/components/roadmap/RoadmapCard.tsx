'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Users,
  Star,
  ChevronRight,
  CheckCircle,
  Play,
  UserPlus,
  UserMinus,
  BarChart3
} from 'lucide-react'
import { Roadmap } from '@/types/roadmap.types'
import { useAuth } from '@/contexts/AuthContext'
import { useEnrollInRoadmap, useUnenrollFromRoadmap, useEnrollmentStatus } from '@/hooks/useEnrollmentQueries'

interface RoadmapCardProps {
  roadmap: Roadmap
  showEnrollButton?: boolean
  showProgress?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  onViewDetails?: (roadmapId: string) => void
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ 
  roadmap,
  showEnrollButton = true,
  showProgress = false,
  variant = 'default',
  onViewDetails
}) => {
  const { user, isAuthenticated } = useAuth()
  
  // Helper function to handle estimatedTime conversion
  const getEstimatedWeeks = (estimatedTime: number | string) => {
    const timeInNumber = typeof estimatedTime === 'string' ? parseInt(estimatedTime) : estimatedTime
    return Math.ceil(timeInNumber / 7)
  }
  
  // Check enrollment status
  const { 
    data: enrollmentStatusData, 
    isLoading: isLoadingStatus 
  } = useEnrollmentStatus(roadmap.id)
  
  // Enrollment mutations
  const { 
    mutateAsync: enrollMutation, 
    isPending: isEnrolling 
  } = useEnrollInRoadmap()
  
  const { 
    mutateAsync: unenrollMutation, 
    isPending: isUnenrolling 
  } = useUnenrollFromRoadmap()
  
  const isEnrolled = enrollmentStatusData?.data?.isEnrolled || false
  const progress = roadmap.enrollment?.progress || 0
  
  // Map difficulty to Vietnamese and colors
  const difficultyMap = {
    'beginner': { label: 'Cơ bản', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    'intermediate': { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    'advanced': { label: 'Nâng cao', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
  }
  
  const difficulty = difficultyMap[roadmap.difficulty] || { label: roadmap.difficulty, color: 'bg-gray-100 text-gray-800' }
  
  // Handle enrollment actions
  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login'
      return
    }
    
    try {
      await enrollMutation(roadmap.id)
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }
  
  const handleUnenroll = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await unenrollMutation(roadmap.id)
    } catch (error) {
      console.error('Failed to unenroll:', error)
    }
  }
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(roadmap.id)
    }
  }
  
  // Compact variant for sidebar or small spaces
  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
            {roadmap.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color} shrink-0 ml-2`}>
            {difficulty.label}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {roadmap.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <div className="flex items-center">
              <BookOpen className="w-3 h-3 mr-1" />
              {roadmap.lessons?.length || 0}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getEstimatedWeeks(roadmap.estimatedTime)}w
            </div>
          </div>
          
          <Link href={`/roadmap/${roadmap.id}`}>
            <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
              <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  // Detailed variant with more information
  if (variant === 'detailed') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                {roadmap.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>
            
            {roadmap.category && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                {roadmap.category.label}
              </p>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
              {roadmap.description}
            </p>
          </div>
        </div>
        
        {/* Progress Bar (if enrolled) */}
        {showProgress && isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Tiến độ học tập
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="text-sm">Bài học</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {roadmap.lessons?.length || 0}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">Thời gian</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {getEstimatedWeeks(roadmap.estimatedTime)} tuần
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Học viên</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {roadmap.enrollmentCount || 0}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="text-sm">Hoàn thành</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.round(roadmap.completionRate || 0)}%
            </p>
          </div>
        </div>
        
        {/* Tags */}
        {roadmap.tags && roadmap.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {roadmap.tags.slice(0, 5).map((tag) => (
                <span 
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                >
                  {tag.name}
                </span>
              ))}
              {roadmap.tags.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                  +{roadmap.tags.length - 5} thêm
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href={`/roadmap/${roadmap.id}`}>
            <Button variant="outline" onClick={handleViewDetails}>
              Xem chi tiết
            </Button>
          </Link>
          
          {showEnrollButton && (
            <div className="flex items-center space-x-2">
              {isLoadingStatus ? (
                <Button disabled>
                  Đang tải...
                </Button>
              ) : isEnrolled ? (
                <>
                  {showProgress && progress < 100 && (
                    <Link href={`/roadmap/${roadmap.id}`}>
                      <Button className="flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>Tiếp tục học</span>
                      </Button>
                    </Link>
                  )}
                  
                  {showProgress && progress >= 100 && (
                    <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Đã hoàn thành
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleUnenroll}
                    disabled={isUnenrolling}
                    className="flex items-center space-x-1"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>{isUnenrolling ? 'Đang hủy...' : 'Hủy đăng ký'}</span>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isEnrolling ? 'Đang đăng ký...' : 'Đăng ký học'}</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Default variant
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
              {roadmap.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
              {difficulty.label}
            </span>
          </div>
          
          {roadmap.category && (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
              {roadmap.category.label}
            </p>
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {roadmap.description}
          </p>
        </div>
      </div>
      
      {/* Progress Bar (if enrolled and showProgress) */}
      {showProgress && isEnrolled && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Tiến độ</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-1" />
          {roadmap.lessons?.length || 0} bài học
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {Math.ceil(roadmap.estimatedTime / 7)} tuần
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {roadmap.enrollmentCount || 0}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href={`/roadmap/${roadmap.id}`}>
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            Xem chi tiết
          </Button>
        </Link>
        
        {showEnrollButton && (
          <>
            {isLoadingStatus ? (
              <Button size="sm" disabled>
                Đang tải...
              </Button>
            ) : isEnrolled ? (
              <div className="flex items-center space-x-2">
                {showProgress && progress < 100 && (
                  <Link href={`/roadmap/${roadmap.id}`}>
                    <Button size="sm" className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>Tiếp tục</span>
                    </Button>
                  </Link>
                )}
                
                {showProgress && progress >= 100 && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Hoàn thành
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUnenroll}
                  disabled={isUnenrolling}
                >
                  {isUnenrolling ? 'Đang hủy...' : 'Hủy'}
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="flex items-center space-x-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isEnrolling ? 'Đang đăng ký...' : 'Đăng ký'}</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RoadmapCard
