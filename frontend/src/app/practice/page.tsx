'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  Code, 
  MessageCircle, 
  Target, 
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Zap,
  BookOpen,
  Settings,
  Filter,
  Star,
  Trophy,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Send,
  Mic,
  Camera,
  Upload
} from 'lucide-react'
import Link from 'next/link'

const PracticePage: React.FC = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'programming', label: 'Lập trình' },
    { value: 'soft-skills', label: 'Kỹ năng mềm' },
    { value: 'design', label: 'Thiết kế' },
    { value: 'business', label: 'Kinh doanh' }
  ]

  const difficulties = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung bình' },
    { value: 'advanced', label: 'Nâng cao' }
  ]

  const types = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'coding', label: 'Coding Challenge' },
    { value: 'interview', label: 'Phỏng vấn' },
    { value: 'presentation', label: 'Thuyết trình' },
    { value: 'project', label: 'Dự án thực tế' }
  ]

  const practiceActivities = [
    {
      id: 1,
      title: 'JavaScript Array Methods Challenge',
      description: 'Giải quyết các bài tập về Array methods như map, filter, reduce',
      category: 'programming',
      type: 'coding',
      difficulty: 'intermediate',
      estimatedTime: 30,
      points: 50,
      completedBy: 1250,
      rating: 4.8,
      tags: ['JavaScript', 'Arrays', 'Functional Programming'],
      icon: Code,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Mock Technical Interview',
      description: 'Thực hành phỏng vấn kỹ thuật với AI interviewer',
      category: 'soft-skills',
      type: 'interview',
      difficulty: 'advanced',
      estimatedTime: 45,
      points: 75,
      completedBy: 890,
      rating: 4.9,
      tags: ['Interview', 'Communication', 'Problem Solving'],
      icon: MessageCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'React Component Design',
      description: 'Thiết kế và xây dựng React component với best practices',
      category: 'programming',
      type: 'project',
      difficulty: 'intermediate',
      estimatedTime: 60,
      points: 100,
      completedBy: 650,
      rating: 4.7,
      tags: ['React', 'Components', 'UI Design'],
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      title: 'Product Pitch Presentation',
      description: 'Luyện tập thuyết trình ý tưởng sản phẩm trong 5 phút',
      category: 'soft-skills',
      type: 'presentation',
      difficulty: 'beginner',
      estimatedTime: 20,
      points: 40,
      completedBy: 420,
      rating: 4.6,
      tags: ['Presentation', 'Product', 'Communication'],
      icon: Lightbulb,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      title: 'CSS Grid Layout Challenge',
      description: 'Tạo responsive layout phức tạp sử dụng CSS Grid',
      category: 'design',
      type: 'coding',
      difficulty: 'advanced',
      estimatedTime: 40,
      points: 60,
      completedBy: 310,
      rating: 4.5,
      tags: ['CSS', 'Grid', 'Responsive Design'],
      icon: Code,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 6,
      title: 'API Integration Project',
      description: 'Tích hợp và xử lý dữ liệu từ REST API',
      category: 'programming',
      type: 'project',
      difficulty: 'intermediate',
      estimatedTime: 90,
      points: 120,
      completedBy: 280,
      rating: 4.8,
      tags: ['API', 'JavaScript', 'Async/Await'],
      icon: Zap,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const recentActivities = [
    {
      title: 'JavaScript Promises',
      score: 85,
      completedAt: '2024-12-08',
      feedback: 'Tốt! Bạn đã hiểu rõ về async/await',
      type: 'coding'
    },
    {
      title: 'Mock Interview',
      score: 92,
      completedAt: '2024-12-07',
      feedback: 'Excellent communication skills!',
      type: 'interview'
    },
    {
      title: 'React Hooks Practice',
      score: 78,
      completedAt: '2024-12-06',
      feedback: 'Cần cải thiện về useEffect dependencies',
      type: 'coding'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return Code
      case 'interview':
        return MessageCircle
      case 'presentation':
        return Lightbulb
      case 'project':
        return Target
      default:
        return BookOpen
    }
  }

  const filteredActivities = practiceActivities.filter(activity => {
    return (
      (selectedCategory === 'all' || activity.category === selectedCategory) &&
      (selectedDifficulty === 'all' || activity.difficulty === selectedDifficulty) &&
      (selectedType === 'all' || activity.type === selectedType)
    )
  })

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
                  Thực hành kỹ năng
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Luyện tập với AI feedback để cải thiện kỹ năng của bạn
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </Button>
                
                <Link href="/practice/custom">
                  <Button>
                    <Target className="w-4 h-4 mr-2" />
                    Tạo bài tập
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Star className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,240</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm số</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Streak ngày</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Practice Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActivities.map((activity) => {
                  const TypeIcon = getTypeIcon(activity.type)
                  
                  return (
                    <div 
                      key={activity.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-lg flex items-center justify-center`}>
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty === 'beginner' ? 'Cơ bản' : 
                           activity.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {activity.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {activity.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {activity.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {activity.estimatedTime}p
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {activity.rating}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {activity.points}đ
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {activity.completedBy} người đã hoàn thành
                      </div>

                      {/* Action */}
                      <Link href={`/practice/${activity.id}`}>
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Bắt đầu thực hành
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Không tìm thấy bài tập nào
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Thử thay đổi bộ lọc để xem thêm bài tập
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                    setSelectedType('all')
                  }}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Feedback Widget */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Feedback</h3>
                    <p className="text-xs text-green-600 dark:text-green-400">Sẵn sàng hỗ trợ</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Nhận phản hồi chi tiết và gợi ý cải thiện từ AI sau mỗi bài thực hành.
                </p>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Phân tích code chi tiết</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Gợi ý cải thiện</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Best practices</span>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Hoạt động gần đây
                </h3>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {activity.title}
                        </h4>
                        <span className={`text-sm font-medium ${
                          activity.score >= 80 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {activity.score}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                        {activity.feedback}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.completedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-4">
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Practice Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Tips thực hành
                  </h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Đọc kỹ đề bài trước khi bắt đầu</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Kiểm tra code kỹ trước khi submit</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Đọc feedback AI để cải thiện</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Thực hành đều đặn mỗi ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default PracticePage