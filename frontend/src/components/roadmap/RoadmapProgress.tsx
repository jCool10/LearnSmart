'use client'

import React from 'react'
import { CheckCircle, Lock, Play, Circle } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  isCompleted: boolean
  isUnlocked: boolean
  score?: number | null
}

interface RoadmapProgressProps {
  lessons: Lesson[]
  currentLessonId?: string
  onLessonClick?: (lessonId: string) => void
}

const RoadmapProgress: React.FC<RoadmapProgressProps> = ({ 
  lessons, 
  currentLessonId, 
  onLessonClick 
}) => {
  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.isCompleted) return 'completed'
    if (lesson.isUnlocked) return 'unlocked'
    return 'locked'
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isCompleted) return CheckCircle
    if (lesson.isUnlocked) return Play
    return Lock
  }

  const getLessonColor = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      if (lesson.score && lesson.score >= 90) return 'text-green-500'
      if (lesson.score && lesson.score >= 70) return 'text-blue-500'
      return 'text-yellow-500'
    }
    if (lesson.isUnlocked) return 'text-blue-500'
    return 'text-gray-400'
  }

  const getBorderColor = (lesson: Lesson) => {
    if (lesson.id === currentLessonId) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    if (lesson.isCompleted) {
      if (lesson.score && lesson.score >= 90) return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      if (lesson.score && lesson.score >= 70) return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
      return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
    }
    if (lesson.isUnlocked) return 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
    return 'border-gray-100 dark:border-gray-800'
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => {
        const StatusIcon = getLessonIcon(lesson)
        
        return (
          <div key={lesson.id} className="relative">
            <div 
              className={`border-2 rounded-lg p-4 transition-all duration-200 ${getBorderColor(lesson)} ${
                lesson.isUnlocked && onLessonClick ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => lesson.isUnlocked && onLessonClick?.(lesson.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </div>
                  <StatusIcon className={`w-5 h-5 ${getLessonColor(lesson)}`} />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    lesson.isUnlocked 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {lesson.title}
                  </h4>
                  
                  {lesson.isCompleted && lesson.score && (
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Điểm: {lesson.score}%
                      </span>
                    </div>
                  )}
                </div>
                
                {lesson.id === currentLessonId && (
                  <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    Đang học
                  </div>
                )}
              </div>
            </div>
            
            {/* Connection line */}
            {index < lessons.length - 1 && (
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RoadmapProgress