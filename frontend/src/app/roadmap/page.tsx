'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  Clock,
  Star,
  Users,
  TrendingUp,
  Target,
  Play,
  CheckCircle,
  BarChart3,
  Plus,
  Filter,
  Search,
  Award,
  Zap,
  Brain
} from 'lucide-react'
import Link from 'next/link'

const RoadmapIndexPage: React.FC = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { value: 'all', label: 'Tất cả', count: 12 },
    { value: 'programming', label: 'Lập trình', count: 6 },
    { value: 'design', label: 'Thiết kế', count: 3 },
    { value: 'business', label: 'Kinh doanh', count: 2 },
    { value: 'soft-skills', label: 'Kỹ năng mềm', count: 1 }
  ]

  // Mock roadmap data
  const roadmaps = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Học JavaScript từ cơ bản đến nâng cao với phương pháp step-by-step',
      category: 'programming',
      difficulty: 'Beginner',
      totalLessons: 15,
      completedLessons: 6,
      estimatedTime: '8 weeks',
      progress: 40,
      averageScore: 87,
      enrolledUsers: 2340,
      rating: 4.8,
      lastAccessed: '2024-12-08',
      tags: ['JavaScript', 'Frontend', 'Programming'],
      isEnrolled: true,
      isCompleted: false
    },
    {
      id: '2',
      title: 'React Development Path',
      description: 'Trở thành React Developer với roadmap toàn diện từ hooks đến advanced patterns',
      category: 'programming',
      difficulty: 'Intermediate',
      totalLessons: 20,
      completedLessons: 0,
      estimatedTime: '12 weeks',
      progress: 0,
      averageScore: 0,
      enrolledUsers: 1850,
      rating: 4.9,
      lastAccessed: null,
      tags: ['React', 'JavaScript', 'Frontend'],
      isEnrolled: false,
      isCompleted: false
    },
    {
      id: '3',
      title: 'UI/UX Design Mastery',
      description: 'Học thiết kế UI/UX từ nguyên lý cơ bản đến thực hành dự án thực tế',
      category: 'design',
      difficulty: 'Beginner',
      totalLessons: 18,
      completedLessons: 18,
      estimatedTime: '10 weeks',
      progress: 100,
      averageScore: 92,
      enrolledUsers: 1200,
      rating: 4.7,
      lastAccessed: '2024-12-05',
      tags: ['UI Design', 'UX Design', 'Figma'],
      isEnrolled: true,
      isCompleted: true
    },
    {
      id: '4',
      title: 'Python for Data Science',
      description: 'Roadmap hoàn chỉnh để trở thành Data Scientist với Python',
      category: 'programming',
      difficulty: 'Intermediate',
      totalLessons: 25,
      completedLessons: 3,
      estimatedTime: '16 weeks',
      progress: 12,
      averageScore: 85,
      enrolledUsers: 3200,
      rating: 4.8,
      lastAccessed: '2024-12-07',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      isEnrolled: true,
      isCompleted: false
    },
    {
      id: '5',
      title: 'Digital Marketing Strategy',
      description: 'Xây dựng chiến lược marketing digital hiệu quả cho doanh nghiệp',
      category: 'business',
      difficulty: 'Advanced',
      totalLessons: 12,
      completedLessons: 0,
      estimatedTime: '6 weeks',
      progress: 0,
      averageScore: 0,
      enrolledUsers: 890,
      rating: 4.6,
      lastAccessed: null,
      tags: ['Marketing', 'Strategy', 'Business'],
      isEnrolled: false,
      isCompleted: false
    },
    {
      id: '6',
      title: 'Leadership & Communication',
      description: 'Phát triển kỹ năng lãnh đạo và giao tiếp hiệu quả',
      category: 'soft-skills',
      difficulty: 'Intermediate',
      totalLessons: 10,
      completedLessons: 0,
      estimatedTime: '4 weeks',
      progress: 0,
      averageScore: 0,
      enrolledUsers: 650,
      rating: 4.5,
      lastAccessed: null,
      tags: ['Leadership', 'Communication', 'Soft Skills'],
      isEnrolled: false,
      isCompleted: false
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const enrolledRoadmaps = roadmaps.filter(r => r.isEnrolled)
  const completedRoadmaps = roadmaps.filter(r => r.isCompleted)

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
                  Roadmap Learning
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Học từng bước với lộ trình có cấu trúc và AI hỗ trợ cá nhân hóa
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
                <Link href="/learning-paths/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo roadmap mới
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {enrolledRoadmaps.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đang học</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {completedRoadmaps.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(enrolledRoadmaps.reduce((sum, r) => sum + r.progress, 0) / Math.max(enrolledRoadmaps.length, 1))}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ TB</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(enrolledRoadmaps.reduce((sum, r) => sum + r.averageScore, 0) / Math.max(enrolledRoadmaps.length, 1))}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm roadmap..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <div 
                key={roadmap.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(roadmap.difficulty)}`}>
                        {roadmap.difficulty}
                      </span>
                      {roadmap.isCompleted && (
                        <div className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {roadmap.rating}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {roadmap.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>

                  {/* Progress */}
                  {roadmap.isEnrolled && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Tiến độ</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {roadmap.completedLessons}/{roadmap.totalLessons} bài
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${roadmap.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{roadmap.progress}% hoàn thành</span>
                        {roadmap.averageScore > 0 && (
                          <span>Điểm TB: {roadmap.averageScore}%</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {roadmap.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {roadmap.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        +{roadmap.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {roadmap.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {roadmap.enrolledUsers.toLocaleString()}
                      </div>
                    </div>
                    
                    {roadmap.lastAccessed && (
                      <span className="text-xs">
                        Học lần cuối: {new Date(roadmap.lastAccessed).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {roadmap.isEnrolled ? (
                      <Link href={`/roadmap/${roadmap.id}`} className="flex-1">
                        <Button className="w-full">
                          {roadmap.isCompleted ? (
                            <>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Xem lại
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Tiếp tục học
                            </>
                          )}
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/roadmap/${roadmap.id}`} className="flex-1">
                        <Button className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Tham gia roadmap
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy roadmap nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}>
                Đặt lại bộ lọc
              </Button>
            </div>
          )}

          {/* AI Recommendation Section */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Đề xuất cho bạn
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Dựa trên tiến độ học tập và sở thích của bạn
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Roadmap phù hợp nhất
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Dựa trên việc bạn đang học JavaScript, AI khuyên bạn nên học React tiếp theo.
                </p>
                <Link href="/roadmap/2">
                  <Button variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Xem React Development Path
                  </Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Kỹ năng bổ trợ
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Để trở thành developer toàn diện, bạn nên bổ sung thêm kỹ năng thiết kế UI/UX.
                </p>
                <Link href="/roadmap/3">
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Xem UI/UX Design Mastery
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

export default RoadmapIndexPage