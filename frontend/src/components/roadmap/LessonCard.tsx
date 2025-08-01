'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle,
  Lock,
  Play,
  Clock,
  Star,
  Target,
  Calendar,
  BookOpen,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    description: string
    duration: number
    isCompleted: boolean
    isUnlocked: boolean
    score?: number | null
    attempts: number
    lastAttempt?: string | null
  }
  pathId: string
  lessonIndex: number
  onRetry?: () => void
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  pathId, 
  lessonIndex, 
  onRetry 
}) => {
  const getLessonStatusColor = () => {
    if (lesson.isCompleted) {
      if (lesson.score && lesson.score >= 90) return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      if (lesson.score && lesson.score >= 70) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    }
    if (lesson.isUnlocked) return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
    return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
  }

  const getLessonIcon = () => {
    if (lesson.isCompleted) return CheckCircle
    if (lesson.isUnlocked) return Play
    return Lock
  }

  const getLessonIconColor = () => {
    if (lesson.isCompleted) {
      if (lesson.score && lesson.score >= 90) return 'text-green-600 dark:text-green-400'
      if (lesson.score && lesson.score >= 70) return 'text-blue-600 dark:text-blue-400'
      return 'text-yellow-600 dark:text-yellow-400'
    }
    if (lesson.isUnlocked) return 'text-blue-600 dark:text-blue-400'
    return 'text-gray-400'
  }

  const StatusIcon = getLessonIcon()

  return (
    <div 
      className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-md ${getLessonStatusColor()} ${
        lesson.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {lessonIndex + 1}
            </div>
            <StatusIcon className={`w-6 h-6 ${getLessonIconColor()}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`text-lg font-semibold ${
                lesson.isUnlocked 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {lesson.title}
              </h3>
              {lesson.isCompleted && lesson.score && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lesson.score}%
                  </span>
                </div>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${
              lesson.isUnlocked 
                ? 'text-gray-600 dark:text-gray-300' 
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {lesson.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {lesson.duration} phút
              </div>
              {lesson.attempts > 0 && (
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {lesson.attempts} lần thử
                </div>
              )}
              {lesson.lastAttempt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(lesson.lastAttempt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {lesson.isCompleted && (
            <Link href={`/roadmap/${pathId}/lesson/${lesson.id}/review`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Xem lại
              </Button>
            </Link>
          )}
          
          {lesson.isUnlocked && (
            <Link href={`/roadmap/${pathId}/lesson/${lesson.id}`}>
              <Button size="sm" disabled={!lesson.isUnlocked}>
                {lesson.isCompleted ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-1" />
                    Học lại
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    {lesson.attempts > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                  </>
                )}
              </Button>
            </Link>
          )}
          
          {!lesson.isUnlocked && (
            <Button size="sm" disabled className="opacity-50">
              <Lock className="w-4 h-4 mr-1" />
              Chưa mở khóa
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonCard