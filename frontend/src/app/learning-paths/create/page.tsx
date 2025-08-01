'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Target, 
  Clock, 
  Brain,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  ChevronDown,
  Lightbulb,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CreateLearningPathPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPath, setGeneratedPath] = useState<any>(null)

  // Form data
  const [formData, setFormData] = useState({
    goal: '',
    currentLevel: 'beginner',
    timeCommitment: '1-2',
    learningStyle: 'mixed',
    specificTopics: [] as string[],
    additionalInfo: ''
  })

  const [newTopic, setNewTopic] = useState('')

  const levels = [
    { value: 'beginner', label: 'Người mới bắt đầu', description: 'Tôi chưa có kinh nghiệm về chủ đề này' },
    { value: 'intermediate', label: 'Trung bình', description: 'Tôi có một số kiến thức cơ bản' },
    { value: 'advanced', label: 'Nâng cao', description: 'Tôi đã có kinh nghiệm và muốn học sâu hơn' }
  ]

  const timeOptions = [
    { value: '1-2', label: '1-2 giờ/tuần' },
    { value: '3-5', label: '3-5 giờ/tuần' },
    { value: '6-10', label: '6-10 giờ/tuần' },
    { value: '10+', label: 'Hơn 10 giờ/tuần' }
  ]

  const learningStyles = [
    { value: 'visual', label: 'Trực quan', description: 'Video, infographics, sơ đồ' },
    { value: 'reading', label: 'Đọc hiểu', description: 'Bài viết, sách, tài liệu' },
    { value: 'practical', label: 'Thực hành', description: 'Coding, projects, hands-on' },
    { value: 'mixed', label: 'Kết hợp', description: 'Tất cả các phương pháp trên' }
  ]

  const suggestions = [
    "Lập trình JavaScript từ cơ bản đến nâng cao",
    "Thiết kế UI/UX cho người mới bắt đầu",
    "Data Science với Python",
    "Marketing Digital và SEO",
    "Phát triển ứng dụng mobile với React Native",
    "Machine Learning cơ bản",
    "Photography và Video editing",
    "Business Analysis và Project Management"
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTopic = () => {
    if (newTopic.trim() && !formData.specificTopics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        specificTopics: [...prev.specificTopics, newTopic.trim()]
      }))
      setNewTopic('')
    }
  }

  const removeTopic = (topicToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specificTopics: prev.specificTopics.filter(topic => topic !== topicToRemove)
    }))
  }

  const generateLearningPath = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const mockPath = {
        title: formData.goal,
        description: `Lộ trình học tập được tạo bởi AI dựa trên mục tiêu "${formData.goal}" với trình độ ${levels.find(l => l.value === formData.currentLevel)?.label.toLowerCase()}`,
        estimatedDuration: formData.timeCommitment === '1-2' ? '8-12 tuần' : 
                          formData.timeCommitment === '3-5' ? '6-8 tuần' :
                          formData.timeCommitment === '6-10' ? '4-6 tuần' : '3-4 tuần',
        difficulty: formData.currentLevel === 'beginner' ? 'Cơ bản' :
                   formData.currentLevel === 'intermediate' ? 'Trung bình' : 'Nâng cao',
        topics: [
          { title: 'Kiến thức nền tảng', duration: '1 tuần', description: 'Học các khái niệm cơ bản và terminology' },
          { title: 'Thực hành cơ bản', duration: '2 tuần', description: 'Áp dụng kiến thức vào các bài tập đơn giản' },
          { title: 'Dự án thực tế', duration: '2-3 tuần', description: 'Xây dựng project hoàn chỉnh' },
          { title: 'Tối ưu và nâng cao', duration: '1-2 tuần', description: 'Học các kỹ thuật nâng cao và best practices' }
        ],
        resources: [
          { type: 'Video', title: 'Introduction Course', duration: '2h' },
          { type: 'Article', title: 'Best Practices Guide', duration: '30min' },
          { type: 'Practice', title: 'Hands-on Exercises', duration: '4h' }
        ]
      }
      setGeneratedPath(mockPath)
      setIsGenerating(false)
      setCurrentStep(3)
    }, 3000)
  }

  const saveLearningPath = async () => {
    // Simulate saving
    setTimeout(() => {
      router.push('/learning-paths')
    }, 1000)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 2) {
        generateLearningPath()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.goal.trim().length > 10
      case 2:
        return true
      default:
        return false
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/learning-paths">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tạo lộ trình học tập với AI
                </h1>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 ml-2 ${
                      step < currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {currentStep === 1 && 'Bước 1: Mục tiêu học tập'}
              {currentStep === 2 && 'Bước 2: Thông tin cá nhân hóa'}
              {currentStep === 3 && 'Bước 3: Xem trước lộ trình'}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {currentStep === 1 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bạn muốn học gì?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Mô tả mục tiêu học tập của bạn. AI sẽ tạo lộ trình phù hợp dựa trên thông tin này.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mục tiêu học tập *
                    </label>
                    <textarea
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      placeholder="Ví dụ: Tôi muốn học lập trình JavaScript để phát triển ứng dụng web hiện đại..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    />
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.goal.length}/500 ký tự
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Hoặc chọn từ gợi ý:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleInputChange('goal', suggestion)}
                          className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                        >
                          <Lightbulb className="w-4 h-4 inline mr-2 text-yellow-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Thông tin cá nhân hóa
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Giúp AI hiểu rõ hơn về trình độ và sở thích học tập của bạn.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Current Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Trình độ hiện tại
                    </label>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="currentLevel"
                            value={level.value}
                            checked={formData.currentLevel === level.value}
                            onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{level.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{level.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time Commitment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Thời gian học mỗi tuần
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {timeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleInputChange('timeCommitment', option.value)}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            formData.timeCommitment === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Learning Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Phong cách học tập ưa thích
                    </label>
                    <div className="space-y-2">
                      {learningStyles.map((style) => (
                        <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="learningStyle"
                            value={style.value}
                            checked={formData.learningStyle === style.value}
                            onChange={(e) => handleInputChange('learningStyle', e.target.value)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{style.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{style.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Specific Topics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chủ đề cụ thể muốn học (tùy chọn)
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                        placeholder="Nhập chủ đề..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <Button onClick={addTopic} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.specificTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specificTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                          >
                            {topic}
                            <button
                              onClick={() => removeTopic(topic)}
                              className="ml-2 hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thông tin bổ sung (tùy chọn)
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Có điều gì đặc biệt AI cần biết để tạo lộ trình phù hợp nhất?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-8">
                {isGenerating ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      AI đang tạo lộ trình cho bạn...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                ) : generatedPath && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Lộ trình được tạo bởi AI
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Xem trước và chỉnh sửa lộ trình trước khi lưu
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Path Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-start space-x-3">
                          <Sparkles className="w-6 h-6 text-blue-500 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {generatedPath.title}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {generatedPath.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {generatedPath.estimatedDuration}
                              </div>
                              <div className="flex items-center">
                                <Target className="w-4 h-4 mr-1" />
                                {generatedPath.difficulty}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Topics */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Chủ đề học tập
                        </h4>
                        <div className="space-y-3">
                          {generatedPath.topics.map((topic: any, index: number) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {index + 1}. {topic.title}
                                </h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {topic.duration}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {topic.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Tài liệu đề xuất
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {generatedPath.resources.map((resource: any, index: number) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                  {resource.type}
                                </span>
                              </div>
                              <h6 className="font-medium text-gray-900 dark:text-white mb-1">
                                {resource.title}
                              </h6>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {resource.duration}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                )}
              </div>
              
              <div>
                {currentStep < 3 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    {currentStep === 2 ? 'Tạo lộ trình' : 'Tiếp tục'}
                    {currentStep === 2 ? (
                      <Sparkles className="w-4 h-4 ml-2" />
                    ) : (
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    )}
                  </Button>
                ) : (
                  generatedPath && (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Chỉnh sửa
                      </Button>
                      <Button onClick={saveLearningPath}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Lưu lộ trình
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default CreateLearningPathPage