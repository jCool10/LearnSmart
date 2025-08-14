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
import { useRoadmaps, usePopularRoadmaps, useRecommendedRoadmaps } from '@/hooks/useRoadmapQueries'
import { useCategories } from '@/hooks/useCategoryQueries'
import { useUserEnrollments, useUserStats } from '@/hooks/useEnrollmentQueries'
import { RoadmapCard } from '@/components/roadmap/RoadmapCard'

const RoadmapIndexPage: React.FC = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Fetch data from API
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const { data: userEnrollmentsData } = useUserEnrollments(user?.id || '', 'all')
  const { data: userStatsData } = useUserStats(user?.id || '')
  
  // Build filters and pagination
  const filters = {
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery.trim() || undefined
  }
  
  const pagination = {
    page: currentPage,
    limit: 12
  }
  
  const { 
    data: roadmapsData, 
    isLoading: isLoadingRoadmaps 
  } = useRoadmaps({ ...filters, ...pagination })
  
  const { 
    data: popularRoadmapsData, 
    isLoading: isLoadingPopular 
  } = usePopularRoadmaps(6)
  
  const { 
    data: recommendedRoadmapsData, 
    isLoading: isLoadingRecommended 
  } = useRecommendedRoadmaps(4)
  
  // Process categories data
  const categories = React.useMemo(() => {
    if (!categoriesData?.data) {
      return [{ value: 'all', label: 'Tất cả', count: 0 }]
    }
    
    const allCategory = { 
      value: 'all', 
      label: 'Tất cả', 
      count: categoriesData.data.reduce((sum, cat) => sum + (cat.roadmapCount || 0), 0) 
    }
    
    const categoryOptions = categoriesData.data.map(cat => ({
      value: cat.value,
      label: cat.label,
      count: cat.roadmapCount || 0
    }))
    
    return [allCategory, ...categoryOptions]
  }, [categoriesData])
  
  // Process roadmaps data - Backend returns { data: [], meta: {} }
  const roadmaps = roadmapsData?.data?.data || []  // Backend structure: response.data.data
  const pagination_info = roadmapsData?.data?.meta  // Backend structure: response.data.meta
  
  // Calculate user stats
  const userEnrollments = userEnrollmentsData?.data || []
  const enrolledRoadmaps = userEnrollments.filter(e => !e.isCompleted)
  const completedRoadmaps = userEnrollments.filter(e => e.isCompleted)
  const userStats = userStatsData?.data
  
  const averageProgress = enrolledRoadmaps.length > 0 
    ? Math.round(enrolledRoadmaps.reduce((sum, e) => sum + e.progress, 0) / enrolledRoadmaps.length)
    : 0
  
  const averageScore = userStats?.averageScore || 0

  // Handle search and category changes
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when changing category
  }
  
  // Loading states
  const isLoading = isLoadingRoadmaps || isLoadingCategories

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
                      {averageProgress}%
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
                      {Math.round(averageScore)}%
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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((roadmap) => (
                <RoadmapCard 
                  key={roadmap.id}
                  roadmap={roadmap}
                  showEnrollButton={true}
                  showProgress={true}
                  variant="default"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination_info && pagination_info.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button 
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trang trước
              </Button>
              
              <span className="text-gray-600 dark:text-gray-400">
                Trang {currentPage} / {pagination_info.totalPages}
              </span>
              
              <Button 
                variant="outline"
                disabled={currentPage === pagination_info.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Trang sau
              </Button>
            </div>
          )}


          {!isLoading && roadmaps.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy roadmap nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </p>
              <Button variant="outline" onClick={() => {
                handleSearch('')
                handleCategoryChange('all')
              }}>
                Đặt lại bộ lọc
              </Button>
            </div>
          )}

          {/* AI Recommendation Section */}
          {recommendedRoadmapsData?.data && recommendedRoadmapsData.data.length > 0 && (
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

              {isLoadingRecommended ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedRoadmapsData.data.slice(0, 2).map((roadmap, index) => (
                    <div key={roadmap.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        {index === 0 ? (
                          <Zap className="w-6 h-6 text-orange-500" />
                        ) : (
                          <Award className="w-6 h-6 text-yellow-500" />
                        )}
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {index === 0 ? 'Roadmap phù hợp nhất' : 'Kỹ năng bổ trợ'}
                        </h4>
                      </div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {roadmap.title}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {roadmap.description}
                      </p>
                      <Link href={`/roadmap/${roadmap.id}`}>
                        <Button variant="outline">
                          <Target className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popular Roadmaps Section */}
          {popularRoadmapsData?.data && popularRoadmapsData.data.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Roadmap phổ biến
                </h3>
                <Link href="/roadmap?category=all">
                  <Button variant="outline">
                    Xem tất cả
                  </Button>
                </Link>
              </div>

              {isLoadingPopular ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularRoadmapsData.data.slice(0, 3).map((roadmap) => (
                    <RoadmapCard 
                      key={roadmap.id}
                      roadmap={roadmap}
                      showEnrollButton={true}
                      showProgress={false}
                      variant="compact"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default RoadmapIndexPage