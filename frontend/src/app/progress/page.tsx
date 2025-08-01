'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Trophy,
  Star,
  ChevronDown,
  Download,
  Share,
  Filter,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

const ProgressPage: React.FC = () => {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('time')

  const periods = [
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'quarter', label: 'Quý này' },
    { value: 'year', label: 'Năm này' }
  ]

  const metrics = [
    { value: 'time', label: 'Thời gian học', icon: Clock },
    { value: 'topics', label: 'Chủ đề hoàn thành', icon: BookOpen },
    { value: 'accuracy', label: 'Độ chính xác', icon: Target },
    { value: 'streak', label: 'Chuỗi ngày học', icon: Zap }
  ]

  // Mock data
  const overallStats = [
    {
      title: 'Tổng thời gian học',
      value: '127h 32m',
      change: '+12%',
      changeType: 'increase',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Chủ đề hoàn thành',
      value: '68',
      change: '+8',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Chuỗi ngày học',
      value: '15 ngày',
      change: '+3',
      changeType: 'increase',
      icon: Zap,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Điểm trung bình',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: Star,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  const weeklyData = [
    { day: 'T2', time: 2.5, topics: 3, accuracy: 85, date: '2024-12-02' },
    { day: 'T3', time: 1.8, topics: 2, accuracy: 92, date: '2024-12-03' },
    { day: 'T4', time: 3.2, topics: 4, accuracy: 78, date: '2024-12-04' },
    { day: 'T5', time: 2.1, topics: 2, accuracy: 88, date: '2024-12-05' },
    { day: 'T6', time: 4.0, topics: 5, accuracy: 91, date: '2024-12-06' },
    { day: 'T7', time: 1.5, topics: 1, accuracy: 85, date: '2024-12-07' },
    { day: 'CN', time: 2.8, topics: 3, accuracy: 89, date: '2024-12-08' }
  ]

  const learningPaths = [
    {
      name: 'JavaScript Fundamentals',
      progress: 85,
      timeSpent: '24h 15m',
      completedTopics: 17,
      totalTopics: 20,
      averageScore: 89,
      color: 'bg-blue-500'
    },
    {
      name: 'React Development',
      progress: 60,
      timeSpent: '18h 30m',
      completedTopics: 9,
      totalTopics: 15,
      averageScore: 92,
      color: 'bg-green-500'
    },
    {
      name: 'UI/UX Design',
      progress: 40,
      timeSpent: '12h 45m',
      completedTopics: 6,
      totalTopics: 15,
      averageScore: 78,
      color: 'bg-purple-500'
    }
  ]

  const achievements = [
    {
      title: 'Week Warrior',
      description: 'Học 7 ngày liên tiếp',
      date: '2024-12-01',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'JavaScript Master',
      description: 'Hoàn thành 50+ bài tập JS',
      date: '2024-11-28',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Fast Learner',
      description: 'Hoàn thành 5 chủ đề trong 1 ngày',
      date: '2024-11-25',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(d => d[key]))
  }

  const getCurrentValue = (key: string) => {
    switch(key) {
      case 'time':
        return weeklyData.reduce((sum, d) => sum + d.time, 0)
      case 'topics':
        return weeklyData.reduce((sum, d) => sum + d.topics, 0)
      case 'accuracy':
        return Math.round(weeklyData.reduce((sum, d) => sum + d.accuracy, 0) / weeklyData.length)
      case 'streak':
        return 15
      default:
        return 0
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Tiến độ học tập
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Theo dõi chi tiết quá trình học tập và phát triển của bạn
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
                
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất báo cáo
                </Button>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {overallStats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.changeType === 'increase' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Hoạt động hàng ngày
                  </h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {metrics.map(metric => (
                        <option key={metric.value} value={metric.value}>
                          {metric.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chart */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between space-x-2 h-48">
                    {weeklyData.map((day, index) => {
                      const maxVal = getMaxValue(weeklyData, selectedMetric)
                      const currentVal = day[selectedMetric as keyof typeof day] as number
                      const heightPercent = (currentVal / maxVal) * 100
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="flex-1 flex items-end w-full">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer group relative"
                              style={{ 
                                height: `${heightPercent}%`,
                                minHeight: '8px'
                              }}
                            >
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                                  {selectedMetric === 'time' && `${currentVal}h`}
                                  {selectedMetric === 'topics' && `${currentVal} chủ đề`}
                                  {selectedMetric === 'accuracy' && `${currentVal}%`}
                                  {selectedMetric === 'streak' && `${currentVal} ngày`}
                                  <div className="text-xs text-gray-400 mt-1">{day.date}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            {day.day}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {getCurrentValue('time')}h
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tổng thời gian</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {getCurrentValue('topics')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Chủ đề</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {getCurrentValue('accuracy')}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {getCurrentValue('streak')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Chuỗi ngày</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Paths Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Tiến độ theo lộ trình
                </h3>
                
                <div className="space-y-6">
                  {learningPaths.map((path, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {path.name}
                        </h4>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {path.progress}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <div 
                          className={`${path.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{path.timeSpent}</span>
                          <div>Thời gian</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {path.completedTopics}/{path.totalTopics}
                          </span>
                          <div>Chủ đề</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{path.averageScore}%</span>
                          <div>Điểm TB</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Achievements & Goals */}
            <div className="space-y-8">
              {/* Recent Achievements */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Thành tích gần đây
                  </h3>
                  <Button variant="ghost" size="sm">
                    Xem tất cả
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className={`w-10 h-10 ${achievement.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(achievement.date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Goals */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Mục tiêu hiện tại
                  </h3>
                  <Button variant="ghost" size="sm">
                    Chỉnh sửa
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Hoàn thành JavaScript
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Còn 3 chủ đề nữa để hoàn thành
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Học 20h tuần này  
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">12/20h</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Còn 8 giờ nữa để đạt mục tiêu
                    </p>
                  </div>
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      15 ngày
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Chuỗi ngày học liên tục
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-1 mb-4">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < 5 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Tiếp tục để duy trì chuỗi ngày học!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default ProgressPage