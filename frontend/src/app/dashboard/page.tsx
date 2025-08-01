'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { LearningPathsPreview } from '@/components/dashboard/LearningPathsPreview'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'
import { AITutorWidget } from '@/components/dashboard/AITutorWidget'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Brain,
  Plus,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.username}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Hôm nay bạn muốn học gì? Hãy tiếp tục hành trình phát triển bản thân của mình.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Paths Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Lộ trình học tập
                      </h2>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      Xem tất cả
                    </button>
                  </div>
                </div>
                <LearningPathsPreview />
              </div>

              {/* Progress Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Tiến độ học tập
                    </h2>
                  </div>
                </div>
                <ProgressOverview />
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Hoạt động gần đây
                    </h2>
                  </div>
                </div>
                <RecentActivity />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* AI Tutor Widget */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      AI Tutor
                    </h2>
                  </div>
                </div>
                <AITutorWidget />
              </div>

              {/* Achievements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Thành tích
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          First Learning Path
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hoàn thành lộ trình đầu tiên
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 opacity-50">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Goal Achiever
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Đạt được 5 mục tiêu
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      Xem tất cả thành tích
                    </button>
                  </div>
                </div>
              </div>

              {/* Today's Goals */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Mục tiêu hôm nay
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Hoàn thành 1 chương JavaScript
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <span className="text-gray-700 dark:text-gray-300 line-through">
                      Thực hành 30 phút với AI
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Đọc 2 bài viết về React
                    </span>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  + Thêm mục tiêu
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardPage