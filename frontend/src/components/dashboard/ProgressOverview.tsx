'use client'

import React from 'react'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  BarChart3
} from 'lucide-react'

export const ProgressOverview: React.FC = () => {
  const weeklyData = [
    { day: 'T2', hours: 2.5, completed: 3 },
    { day: 'T3', hours: 1.8, completed: 2 },
    { day: 'T4', hours: 3.2, completed: 4 },
    { day: 'T5', hours: 2.1, completed: 2 },
    { day: 'T6', hours: 4.0, completed: 5 },
    { day: 'T7', hours: 1.5, completed: 1 },
    { day: 'CN', hours: 2.8, completed: 3 }
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))

  const monthlyGoals = [
    {
      title: 'Hoàn thành JavaScript',
      progress: 85,
      target: 100,
      color: 'bg-blue-500',
      dueDate: '15/12/2024'
    },
    {
      title: 'Học React Hooks',
      progress: 60,
      target: 100,
      color: 'bg-green-500',
      dueDate: '20/12/2024'
    },
    {
      title: 'Thực hành UI/UX',
      progress: 30,
      target: 100,
      color: 'bg-purple-500',
      dueDate: '25/12/2024'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Weekly Activity Chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hoạt động tuần này
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            18.9 giờ tổng cộng
          </div>
        </div>
        
        <div className="flex items-end justify-between space-x-2 h-32 mb-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md mb-2 min-h-[4px] transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ 
                  height: `${(day.hours / maxHours) * 100}%`,
                  minHeight: '8px'
                }}
              />
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {day.hours}h
              </div>
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                {day.day}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">20</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Chủ đề hoàn thành</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">18.9h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian học</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</div>
          </div>
        </div>
      </div>

      {/* Monthly Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mục tiêu tháng này
          </h3>
          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
            Chỉnh sửa
          </button>
        </div>

        <div className="space-y-4">
          {monthlyGoals.map((goal, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {goal.title}
                </h4>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {goal.dueDate}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {goal.progress}% hoàn thành
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {goal.progress}/{goal.target}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`${goal.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak and Achievement */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Streak
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">7 ngày</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Học liên tục</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Cải thiện
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">+15%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">So với tuần trước</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressOverview