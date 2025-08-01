'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  Clock,
  Target,
  TrendingUp,
  Play,
  CheckCircle,
  MoreHorizontal,
  Star,
  Users,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

const LearningPathsPage: React.FC = () => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all')

  const learningPaths = [
    {
      id: 1,
      title: 'Lập trình JavaScript từ cơ bản đến nâng cao',
      description: 'Học JavaScript từ những khái niệm cơ bản như biến, hàm, đối tượng đến các kỹ thuật nâng cao như async/await, closures, và design patterns.',
      progress: 65,
      totalTopics: 25,
      completedTopics: 16,
      estimatedTime: '8 tuần',
      difficulty: 'Trung bình',
      category: 'Programming',
      color: 'from-blue-500 to-blue-600',
      nextTopic: 'Promises và Async/Await',
      createdAt: '2024-11-15',
      rating: 4.8,
      students: 1250,
      status: 'active'
    },
    {
      id: 2,
      title: 'React.js và Modern Frontend Development',
      description: 'Xây dựng ứng dụng web hiện đại với React, hooks, context API, và các thư viện ecosystem như React Router, Redux Toolkit.',
      progress: 30,
      totalTopics: 18,
      completedTopics: 5,
      estimatedTime: '6 tuần',
      difficulty: 'Nâng cao',
      category: 'Frontend',
      color: 'from-green-500 to-green-600',
      nextTopic: 'React Hooks Deep Dive',
      createdAt: '2024-11-20',
      rating: 4.9,
      students: 890,
      status: 'active'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Học thiết kế giao diện người dùng và trải nghiệm người dùng từ cơ bản đến nâng cao với các tools như Figma, Sketch.',
      progress: 100,
      totalTopics: 15,
      completedTopics: 15,
      estimatedTime: '4 tuần',
      difficulty: 'Cơ bản',
      category: 'Design',
      color: 'from-purple-500 to-purple-600',
      nextTopic: null,
      createdAt: '2024-10-01',
      rating: 4.7,
      students: 650,
      status: 'completed'
    },
    {
      id: 4,
      title: 'Node.js và Backend Development',
      description: 'Xây dựng API và ứng dụng backend với Node.js, Express, MongoDB, authentication và deployment.',
      progress: 0,
      totalTopics: 20,
      completedTopics: 0,
      estimatedTime: '7 tuần',
      difficulty: 'Nâng cao',
      category: 'Backend',
      color: 'from-yellow-500 to-yellow-600',
      nextTopic: 'Introduction to Node.js',
      createdAt: '2024-12-01',
      rating: 4.6,
      students: 420,
      status: 'active'
    }
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'active':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || path.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Lộ trình học tập
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Quản lý và theo dõi tiến độ các lộ trình học tập của bạn
                </p>
              </div>
              <Link href="/learning-paths/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Tạo lộ trình mới</span>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {learningPaths.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng lộ trình</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Play className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {learningPaths.filter(p => p.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đang học</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {learningPaths.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(learningPaths.reduce((acc, p) => acc + p.progress, 0) / learningPaths.length)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ TB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lộ trình..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang học</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Learning Paths */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredPaths.map((path) => (
              <div 
                key={path.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                          {path.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {path.category}
                        </span>
                      </div>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {path.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {path.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {path.completedTopics}/{path.totalTopics} chủ đề
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
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {path.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {path.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {path.students}
                      </div>
                    </div>

                    {/* Next Topic */}
                    {path.nextTopic && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Chủ đề tiếp theo:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {path.nextTopic}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Link href={`/learning-paths/${path.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                      {path.status === 'completed' ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Hoàn thành
                        </div>
                      ) : (
                        <Link href={`/learning-paths/${path.id}/continue`}>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            {path.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {path.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                            {path.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {path.progress}% hoàn thành
                          </div>
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${path.color} h-2 rounded-full`}
                              style={{ width: `${path.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {path.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{path.completedTopics}/{path.totalTopics} chủ đề</span>
                        <span>{path.estimatedTime}</span>
                        <span>⭐ {path.rating}</span>
                        <span>{path.students} học viên</span>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex items-center space-x-2">
                      <Link href={`/learning-paths/${path.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                      {path.status === 'completed' ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Hoàn thành
                        </div>
                      ) : (
                        <Link href={`/learning-paths/${path.id}/continue`}>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            {path.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredPaths.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy lộ trình nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Tạo lộ trình học tập đầu tiên của bạn'}
              </p>
              <Link href="/learning-paths/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo lộ trình mới
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default LearningPathsPage