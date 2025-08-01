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

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Lộ trình đang học',
      value: '3',
      change: '+1 tuần này',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      changeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Mục tiêu hoàn thành',
      value: '12/15',
      change: '80% hoàn thành',
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      changeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Thời gian học',
      value: '24h',
      change: '+3h tuần này',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      changeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Điểm số AI',
      value: '85',
      change: '+5 điểm',
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      changeColor: 'text-green-600 dark:text-green-400'
    }
  ]

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