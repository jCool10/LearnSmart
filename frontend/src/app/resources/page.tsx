'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Search, 
  Filter,
  Star,
  Clock,
  Play,
  Download,
  Bookmark,
  Share,
  ExternalLink,
  Tag,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Heart,
  Eye,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'

const ResourcesPage: React.FC = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'Tất cả', count: 156 },
    { value: 'programming', label: 'Lập trình', count: 68 },
    { value: 'design', label: 'Thiết kế', count: 32 },
    { value: 'business', label: 'Kinh doanh', count: 28 },
    { value: 'soft-skills', label: 'Kỹ năng mềm', count: 28 }
  ]

  const types = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'video', label: 'Video' },
    { value: 'article', label: 'Bài viết' },
    { value: 'course', label: 'Khóa học' },
    { value: 'book', label: 'Sách' },
    { value: 'podcast', label: 'Podcast' }
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Đề xuất AI' },
    { value: 'rating', label: 'Đánh giá cao' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' }
  ]

  const resources = [
    {
      id: 1,
      title: 'JavaScript: The Complete Guide 2024',
      description: 'Khóa học JavaScript toàn diện từ cơ bản đến nâng cao, bao gồm ES6+, async/await, và modern frameworks.',
      type: 'course',
      category: 'programming',
      author: 'Maximilian Schwarzmüller',
      platform: 'Udemy',
      duration: '52h 30m',
      rating: 4.8,
      reviewCount: 89450,
      price: 'Paid',
      level: 'All Levels',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['JavaScript', 'ES6', 'Async/Await', 'DOM'],
      isBookmarked: true,
      aiRecommended: true,
      addedDate: '2024-12-01',
      views: 12500
    },
    {
      id: 2,
      title: 'React Hooks in Action',
      description: 'Deep dive vào React Hooks với các ví dụ thực tế và best practices.',
      type: 'article',
      category: 'programming',
      author: 'Dan Abramov',
      platform: 'React Blog',
      duration: '15 min read',
      rating: 4.9,
      reviewCount: 2340,
      price: 'Free',
      level: 'Intermediate',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      isBookmarked: false,
      aiRecommended: true,
      addedDate: '2024-11-28',
      views: 8700
    },
    {
      id: 3,
      title: 'Figma for Beginners: Complete UI/UX Design',
      description: 'Học thiết kế UI/UX từ đầu với Figma, từ wireframes đến prototypes.',
      type: 'video',
      category: 'design',
      author: 'Adrian Twarog',
      platform: 'YouTube',
      duration: '3h 45m',
      rating: 4.7,
      reviewCount: 15600,
      price: 'Free',
      level: 'Beginner',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Figma', 'UI Design', 'UX Design', 'Prototyping'],
      isBookmarked: true,
      aiRecommended: false,
      addedDate: '2024-11-25',
      views: 45200
    },
    {
      id: 4,
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description: 'Cuốn sách kinh điển về viết code sạch và maintainable.',
      type: 'book',
      category: 'programming',
      author: 'Robert C. Martin',
      platform: 'Amazon',
      duration: '464 pages',
      rating: 4.6,
      reviewCount: 8900,
      price: 'Paid',
      level: 'Intermediate',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Clean Code', 'Best Practices', 'Software Development'],
      isBookmarked: false,
      aiRecommended: true,
      addedDate: '2024-11-20',
      views: 3400
    },
    {
      id: 5,
      title: 'CSS Grid vs Flexbox: When to Use Which?',
      description: 'So sánh chi tiết CSS Grid và Flexbox với các use cases cụ thể.',
      type: 'article',
      category: 'design',
      author: 'Rachel Andrew',
      platform: 'CSS-Tricks',
      duration: '12 min read',
      rating: 4.8,
      reviewCount: 1250,
      price: 'Free',
      level: 'Intermediate',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
      isBookmarked: true,
      aiRecommended: false,
      addedDate: '2024-11-18',
      views: 6800
    },
    {
      id: 6,
      title: 'The Lean Startup Methodology',
      description: 'Podcast về phương pháp Lean Startup và cách áp dụng vào business.',
      type: 'podcast',
      category: 'business',
      author: 'Tim Ferriss',
      platform: 'Spotify',
      duration: '1h 25m',
      rating: 4.5,
      reviewCount: 890,
      price: 'Free',
      level: 'All Levels',
      language: 'English',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Startup', 'Business Strategy', 'Entrepreneurship'],
      isBookmarked: false,
      aiRecommended: true,
      addedDate: '2024-11-15',
      views: 2100
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play
      case 'article':
        return BookOpen
      case 'course':
        return Play
      case 'book':
        return BookOpen
      case 'podcast':
        return Play
      default:
        return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'article':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'course':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'book':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'podcast':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const toggleBookmark = (resourceId: number) => {
    // Handle bookmark toggle
    console.log('Bookmark toggled for resource:', resourceId)
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
                  Tài liệu học tập
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Khám phá bộ sưu tập tài liệu được AI đề xuất dựa trên lộ trình học tập của bạn
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc nâng cao
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.count})
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
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type)
              
              return (
                <div 
                  key={resource.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {resource.aiRecommended && (
                            <div className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI đề xuất
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            {resource.type}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(resource.id)}
                          className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            resource.isBookmarked ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                          {resource.description}
                        </p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>By {resource.author}</span>
                          <span>•</span>
                          <span>{resource.platform}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {resource.duration}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {resource.rating} ({resource.reviewCount})
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {resource.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              +{resource.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            resource.price === 'Free' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {resource.price}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.level}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Xem
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="w-4 h-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {resource.title}
                            </h3>
                            {resource.aiRecommended && (
                              <div className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                              {resource.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              {resource.rating}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {resource.duration}
                            </div>
                            <span className={`text-sm font-medium ${
                              resource.price === 'Free' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`}>
                              {resource.price}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>By {resource.author}</span>
                            <span>•</span>
                            <span>{resource.platform}</span>
                            <span>•</span>
                            <span>{resource.level}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Share className="w-4 h-4" />
                            </Button>
                            <Button size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Xem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy tài liệu nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedType('all')
              }}>
                Đặt lại bộ lọc
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredResources.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline">
                Tải thêm tài liệu
              </Button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default ResourcesPage