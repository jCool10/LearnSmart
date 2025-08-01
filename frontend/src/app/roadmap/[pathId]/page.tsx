'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Play,
  Star,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  BarChart3,
  Calendar,
  Zap,
  Brain,
  ArrowLeft,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const RoadmapDetailPage: React.FC = () => {
  const { user } = useAuth()
  const params = useParams()
  const pathId = params.pathId as string

  // Mock data - trong thực tế sẽ fetch từ API
  const roadmapData = {
    id: pathId,
    title: 'JavaScript Fundamentals',
    description: 'Học JavaScript từ cơ bản đến nâng cao với phương pháp step-by-step',
    totalLessons: 15,
    completedLessons: 6,
    estimatedTime: '8 weeks',
    difficulty: 'Beginner',
    progress: 40,
    averageScore: 87,
    currentStreak: 5,
    lessons: [
      {
        id: '1',
        title: 'Introduction to JavaScript',
        description: 'Giới thiệu về JavaScript và vai trò trong web development',
        duration: 45,
        isCompleted: true,
        isUnlocked: true,
        score: 92,
        attempts: 1,
        lastAttempt: '2024-12-01'
      },
      {
        id: '2', 
        title: 'Variables and Data Types',
        description: 'Tìm hiểu về biến và các kiểu dữ liệu cơ bản',
        duration: 60,
        isCompleted: true,
        isUnlocked: true,
        score: 88,
        attempts: 2,
        lastAttempt: '2024-12-02'
      },
      {
        id: '3',
        title: 'Functions and Scope',
        description: 'Học về functions, parameters và scope',
        duration: 75,
        isCompleted: true,
        isUnlocked: true,
        score: 95,
        attempts: 1,
        lastAttempt: '2024-12-03'
      },
      {
        id: '4',
        title: 'Arrays and Objects',
        description: 'Làm việc với arrays và objects trong JavaScript',
        duration: 90,
        isCompleted: true,
        isUnlocked: true,
        score: 84,
        attempts: 3,
        lastAttempt: '2024-12-04'
      },
      {
        id: '5',
        title: 'Control Flow and Loops',
        description: 'If/else statements, loops và control flow',
        duration: 80,
        isCompleted: true,
        isUnlocked: true,
        score: 78,
        attempts: 2,
        lastAttempt: '2024-12-05'
      },
      {
        id: '6',
        title: 'DOM Manipulation',
        description: 'Tương tác với DOM elements',
        duration: 100,
        isCompleted: true,
        isUnlocked: true,
        score: 91,
        attempts: 1,
        lastAttempt: '2024-12-06'
      },
      {
        id: '7',
        title: 'Event Handling',
        description: 'Xử lý events và user interactions',
        duration: 85,
        isCompleted: false,
        isUnlocked: true,
        score: null,
        attempts: 0,
        lastAttempt: null
      },
      {
        id: '8',
        title: 'Asynchronous JavaScript',
        description: 'Promises, async/await và asynchronous programming',
        duration: 120,
        isCompleted: false,
        isUnlocked: false,
        score: null,
        attempts: 0,
        lastAttempt: null
      },
      {
        id: '9',
        title: 'Error Handling',
        description: 'Try/catch và error handling strategies',
        duration: 70,
        isCompleted: false,
        isUnlocked: false,
        score: null,
        attempts: 0,
        lastAttempt: null
      },
      {
        id: '10',
        title: 'Modules and Imports',
        description: 'ES6 modules và code organization',
        duration: 90,
        isCompleted: false,
        isUnlocked: false,
        score: null,
        attempts: 0,
        lastAttempt: null
      }
    ]
  }

  const getLessonStatusColor = (lesson: any) => {
    if (lesson.isCompleted) {
      if (lesson.score >= 90) return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      if (lesson.score >= 70) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    }
    if (lesson.isUnlocked) return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
    return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
  }

  const getLessonIcon = (lesson: any) => {
    if (lesson.isCompleted) return CheckCircle
    if (lesson.isUnlocked) return Play
    return Lock
  }

  const getLessonIconColor = (lesson: any) => {
    if (lesson.isCompleted) {
      if (lesson.score >= 90) return 'text-green-600 dark:text-green-400'
      if (lesson.score >= 70) return 'text-blue-600 dark:text-blue-400'
      return 'text-yellow-600 dark:text-yellow-400'
    }
    if (lesson.isUnlocked) return 'text-blue-600 dark:text-blue-400'
    return 'text-gray-400'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/learning-paths">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {roadmapData.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {roadmapData.description}
                </p>
              </div>
              
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </Button>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {roadmapData.progress}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {roadmapData.completedLessons}/{roadmapData.totalLessons}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bài học</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {roadmapData.averageScore}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {roadmapData.currentStreak}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chuỗi ngày</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tiến độ tổng thể
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {roadmapData.completedLessons} trên {roadmapData.totalLessons} bài học đã hoàn thành
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {roadmapData.progress}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hoàn thành
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${roadmapData.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lessons Roadmap */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lộ trình bài học
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Hoàn thành
                </div>
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-1 text-blue-500" />
                  Có thể học
                </div>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-gray-400" />
                  Chưa mở khóa
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {roadmapData.lessons.map((lesson, index) => {
                const StatusIcon = getLessonIcon(lesson)
                
                return (
                  <div 
                    key={lesson.id}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-md ${getLessonStatusColor(lesson)} ${
                      lesson.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            {index + 1}
                          </div>
                          <StatusIcon className={`w-6 h-6 ${getLessonIconColor(lesson)}`} />
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

                    {/* Connection line to next lesson */}
                    {index < roadmapData.lessons.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Achievement Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Tiến độ xuất sắc!
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bạn đã duy trì chuỗi học {roadmapData.currentStreak} ngày liên tiếp
                    </p>
                  </div>
                </div>
                
                <Link href={`/progress`}>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Xem chi tiết tiến độ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default RoadmapDetailPage