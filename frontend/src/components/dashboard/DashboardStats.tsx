'use client'

import React from 'react'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserOverallStats } from '@/hooks/useProgressQueries'
import { useUserEnrollments, useUserStats, useUserStreak } from '@/hooks/useEnrollmentQueries'

export const DashboardStats: React.FC = () => {
  const { user } = useAuth()
  
  // Fetch user data
  const { data: overallStatsData, isLoading: isLoadingStats } = useUserOverallStats(user?.id || '')
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useUserEnrollments(user?.id || '', 'enrolled')
  const { data: userStatsData, isLoading: isLoadingUserStats } = useUserStats(user?.id || '')
  const { data: streakData, isLoading: isLoadingStreak } = useUserStreak(user?.id || '')
  
  // Calculate stats from API data
  const stats = React.useMemo(() => {
    const overallStats = overallStatsData?.data
    const enrollments = enrollmentsData?.data || []
    const userStats = userStatsData?.data
    const streak = streakData?.data?.streak || 0
    
    const activeEnrollments = enrollments.filter(e => !e.isCompleted).length
    const completedRoadmaps = overallStats?.totalRoadmapsCompleted || 0
    const totalRoadmaps = overallStats?.totalRoadmapsEnrolled || 0
    const totalLearningTime = Math.round((overallStats?.totalLearningTime || 0) / 60) // Convert to hours
    const averageScore = Math.round(overallStats?.averageScore || 0)
    
    return [
      {
        title: 'Lộ trình đang học',
        value: activeEnrollments.toString(),
        change: `${totalRoadmaps} tổng cộng`,
        icon: BookOpen,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        changeColor: 'text-gray-600 dark:text-gray-400'
      },
      {
        title: 'Lộ trình hoàn thành',
        value: `${completedRoadmaps}/${totalRoadmaps}`,
        change: totalRoadmaps > 0 ? `${Math.round((completedRoadmaps / totalRoadmaps) * 100)}% hoàn thành` : '0% hoàn thành',
        icon: Target,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        changeColor: 'text-green-600 dark:text-green-400'
      },
      {
        title: 'Thời gian học',
        value: `${totalLearningTime}h`,
        change: `${streak} ngày liên tiếp`,
        icon: Clock,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        changeColor: streak > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
      },
      {
        title: 'Điểm số trung bình',
        value: averageScore.toString(),
        change: `${overallStats?.totalLessonsCompleted || 0} bài học`,
        icon: Award,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        changeColor: 'text-gray-600 dark:text-gray-400'
      }
    ]
  }, [overallStatsData, enrollmentsData, userStatsData, streakData])
  
  const isLoading = isLoadingStats || isLoadingEnrollments || isLoadingUserStats || isLoadingStreak

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className={`text-sm ${stat.changeColor} font-medium`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats