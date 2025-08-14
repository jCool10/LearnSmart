'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play,
  MoreHorizontal,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserEnrolledRoadmaps } from '@/hooks/useRoadmapQueries'

export const LearningPathsPreview: React.FC = () => {
  const { user } = useAuth()
  
  // Fetch user's enrolled roadmaps
  const { 
    data: enrolledRoadmapsData, 
    isLoading: isLoadingRoadmaps 
  } = useUserEnrolledRoadmaps(user?.id || '', 'enrolled', { page: 1, limit: 3 })
  
  const learningPaths = React.useMemo(() => {
    if (!enrolledRoadmapsData?.data?.roadmaps) return []
    
    return enrolledRoadmapsData.data.roadmaps.map((roadmap) => {
      const enrollment = roadmap.enrollment
      const progress = enrollment?.progress || 0
      const totalLessons = roadmap.lessons?.length || 0
      const completedLessons = Math.round((progress / 100) * totalLessons)
      
      // Find next incomplete lesson
      const nextLesson = roadmap.lessons?.find(lesson => !lesson.progress?.isCompleted)
      
      // Map difficulty to Vietnamese
      const difficultyMap = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung bình',
        'advanced': 'Nâng cao'
      }
      
      // Assign colors based on category or use default
      const colorMap = {
        'javascript': 'from-yellow-500 to-yellow-600',
        'react': 'from-blue-500 to-blue-600',
        'vue': 'from-green-500 to-green-600',
        'angular': 'from-red-500 to-red-600',
        'nodejs': 'from-green-600 to-green-700',
        'python': 'from-blue-600 to-blue-700',
        'design': 'from-purple-500 to-purple-600'
      }
      
      const categoryValue = roadmap.category?.value?.toLowerCase() || ''
      const color = colorMap[categoryValue as keyof typeof colorMap] || 'from-gray-500 to-gray-600'
      
      return {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        progress: Math.round(progress),
        totalTopics: totalLessons,
        completedTopics: completedLessons,
        estimatedTime: `${Math.ceil(roadmap.estimatedTime / 7)} tuần`,
        difficulty: difficultyMap[roadmap.difficulty] || roadmap.difficulty,
        color,
        nextTopic: nextLesson?.title || 'Không có bài học tiếp theo',
        category: roadmap.category?.label
      }
    })
  }, [enrolledRoadmapsData])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Cơ bản':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Nâng cao':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (isLoadingRoadmaps) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {learningPaths.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có lộ trình học tập
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Khám phá và đăng ký các lộ trình học tập với sự hỗ trợ của AI
          </p>
          <Link href="/roadmap">
            <Button>
              Khám phá lộ trình
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {learningPaths.map((path) => (
            <div 
              key={path.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {path.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {path.description}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Tiến độ: {path.completedTopics}/{path.totalTopics} chủ đề
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {path.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {path.estimatedTime}
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {path.totalTopics} chủ đề
                </div>
              </div>

              {/* Next Topic */}
              {path.progress < 100 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Chủ đề tiếp theo:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {path.nextTopic}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link href={`/roadmap/${path.id}`}>
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                </Link>
                {path.progress < 100 ? (
                  <Link href={`/roadmap/${path.id}`}>
                    <Button size="sm" className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>Tiếp tục học</span>
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Hoàn thành
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* View All Link */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/roadmap">
              <Button variant="ghost" className="w-full flex items-center justify-center space-x-2">
                <span>Xem tất cả lộ trình</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPathsPreview