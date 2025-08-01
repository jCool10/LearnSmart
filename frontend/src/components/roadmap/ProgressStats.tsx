'use client'

import React from 'react'
import { 
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Clock,
  Target,
  Award,
  BookOpen
} from 'lucide-react'

interface ProgressStatsProps {
  stats: {
    progress: number
    completedLessons: number
    totalLessons: number
    averageScore: number
    currentStreak: number
    totalTimeSpent?: number
    totalPoints?: number
  }
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const progressStats = [
    {
      title: 'Tiến độ',
      value: `${stats.progress}%`,
      change: '+12%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Bài học',
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      change: '+2',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Điểm TB',
      value: `${stats.averageScore}%`,
      change: '+5%',
      changeType: 'increase' as const,
      icon: Star,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Chuỗi ngày',
      value: `${stats.currentStreak}`,
      change: '+1',
      changeType: 'increase' as const,
      icon: Zap,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]

  if (stats.totalTimeSpent) {
    progressStats.push({
      title: 'Thời gian',
      value: formatTime(stats.totalTimeSpent),
      change: '+2h',
      changeType: 'increase' as const,
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    })
  }

  if (stats.totalPoints) {
    progressStats.push({
      title: 'Điểm số',
      value: `${stats.totalPoints}`,
      change: '+50',
      changeType: 'increase' as const,
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {progressStats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          </div>
          
          {stat.change && (
            <div className="mt-4 flex items-center">
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                từ tuần trước
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProgressStats