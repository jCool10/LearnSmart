'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Star,
  Brain,
  Lightbulb,
  Code,
  MessageCircle,
  Mic,
  Camera,
  Upload,
  Download,
  Share,
  BookOpen,
  Zap,
  Award,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

const PracticeDetailPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const practiceId = params.id as string

  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  // Form states
  const [userCode, setUserCode] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [aiFeedback, setAiFeedback] = useState('')
  const [score, setScore] = useState<number | null>(null)

  // Mock practice activity data
  const practiceActivity = {
    id: parseInt(practiceId),
    title: 'JavaScript Array Methods Challenge',
    description: 'Giải quyết các bài tập về Array methods như map, filter, reduce để xử lý dữ liệu hiệu quả.',
    type: 'coding',
    difficulty: 'intermediate',
    estimatedTime: 30,
    points: 50,
    instructions: `
## Bài tập: Array Processing Challenge

Bạn được cung cấp một mảng các đối tượng đại diện cho học viên:

\`\`\`javascript
const students = [
  { name: 'Alice', age: 20, score: 85, subject: 'Math' },
  { name: 'Bob', age: 22, score: 92, subject: 'Physics' },
  { name: 'Charlie', age: 19, score: 78, subject: 'Math' },
  { name: 'Diana', age: 21, score: 88, subject: 'Chemistry' },
  { name: 'Eve', age: 20, score: 95, subject: 'Physics' }
];
\`\`\`

### Yêu cầu:

1. **Lọc học viên có điểm >= 85**
2. **Tính điểm trung bình của các học viên được lọc**
3. **Tạo danh sách tên và môn học của họ**
4. **Sắp xếp theo điểm số giảm dần**

### Kết quả mong đợi:
- Danh sách học viên có điểm >= 85
- Điểm trung bình: 90
- Danh sách được sắp xếp theo điểm số

### Gợi ý:
- Sử dụng \`filter()\` để lọc
- Sử dụng \`reduce()\` để tính trung bình  
- Sử dụng \`map()\` để tạo danh sách mới
- Sử dụng \`sort()\` để sắp xếp
    `,
    solution: `
// Giải pháp mẫu
const students = [
  { name: 'Alice', age: 20, score: 85, subject: 'Math' },
  { name: 'Bob', age: 22, score: 92, subject: 'Physics' },
  { name: 'Charlie', age: 19, score: 78, subject: 'Math' },
  { name: 'Diana', age: 21, score: 88, subject: 'Chemistry' },
  { name: 'Eve', age: 20, score: 95, subject: 'Physics' }
];

// 1. Lọc học viên có điểm >= 85
const highScoreStudents = students.filter(student => student.score >= 85);

// 2. Tính điểm trung bình
const averageScore = highScoreStudents.reduce((sum, student) => sum + student.score, 0) / highScoreStudents.length;

// 3. Tạo danh sách tên và môn học
const studentInfo = highScoreStudents.map(student => ({
  name: student.name,
  subject: student.subject,
  score: student.score
}));

// 4. Sắp xếp theo điểm số giảm dần
const sortedStudents = studentInfo.sort((a, b) => b.score - a.score);

console.log('Học viên có điểm >= 85:', sortedStudents);
console.log('Điểm trung bình:', averageScore);
    `,
    testCases: [
      {
        input: 'students.filter(s => s.score >= 85)',
        expected: '4 học viên',
        description: 'Lọc đúng số lượng học viên'
      },
      {
        input: 'averageScore calculation',
        expected: '90',
        description: 'Tính đúng điểm trung bình'
      }
    ]
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isStarted && !isPaused && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isStarted, isPaused, isCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsStarted(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsStarted(false)
    setIsPaused(false)
    setTimeElapsed(0)
    setUserCode('')
    setUserAnswer('')
    setAiFeedback('')
    setScore(null)
    setIsCompleted(false)
  }

  const handleSubmit = async () => {
    if (!userCode.trim() && !userAnswer.trim()) return

    setIsSubmitting(true)
    
    // Simulate AI feedback generation
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70 // 70-100
      const mockFeedback = `
**Đánh giá chi tiết:**

**Điểm số: ${mockScore}/100** ⭐

**Điểm tốt:**
✅ Code structure rõ ràng và dễ đọc
✅ Sử dụng đúng Array methods (filter, map, reduce)
✅ Logic xử lý chính xác

**Cần cải thiện:**
${mockScore < 85 ? '⚠️ Có thể tối ưu hóa performance bằng cách chain methods' : ''}
${mockScore < 90 ? '⚠️ Nên thêm error handling cho edge cases' : ''}

**Gợi ý:**
💡 Có thể combine nhiều operations trong một chain
💡 Consider using method chaining để code ngắn gọn hơn
💡 Thêm comments để explain logic phức tạp

**Tài liệu tham khảo:**
📚 MDN Array Methods Documentation
📚 JavaScript Array Best Practices
      `
      
      setScore(mockScore)
      setAiFeedback(mockFeedback)
      setIsCompleted(true)
      setIsSubmitting(false)
    }, 2000)
  }

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/practice">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {practiceActivity.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(practiceActivity.difficulty)}`}>
                    {practiceActivity.difficulty === 'beginner' ? 'Cơ bản' : 
                     practiceActivity.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {practiceActivity.estimatedTime} phút
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Target className="w-4 h-4 mr-1" />
                    {practiceActivity.points} điểm
                  </div>
                </div>
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center space-x-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-lg font-medium text-gray-900 dark:text-white">
                    {formatTime(timeElapsed)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isStarted ? (
                  <Button onClick={handleStart}>
                    <Play className="w-4 h-4 mr-2" />
                    Bắt đầu
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handlePause}>
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Instructions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hướng dẫn
                </h3>
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                    {practiceActivity.instructions}
                  </div>
                </div>

                {/* Test Cases */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Test Cases
                  </h4>
                  <div className="space-y-2">
                    {practiceActivity.testCases.map((testCase, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {testCase.description}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Expected: {testCase.expected}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solution Toggle */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full"
                    disabled={!isCompleted}
                  >
                    {showSolution ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showSolution ? 'Ẩn' : 'Xem'} lời giải
                  </Button>
                  
                  {showSolution && (
                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                        <code>{practiceActivity.solution}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coding Area */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                      <Code className="w-4 h-4" />
                      <span>Code Editor</span>
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Viết code của bạn:
                    </label>
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder={`// Viết code JavaScript của bạn ở đây
const students = [
  { name: 'Alice', age: 20, score: 85, subject: 'Math' },
  // ... rest of the data
];

// Your solution here...`}
                      className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
                      disabled={!isStarted || isPaused || isCompleted}
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giải thích logic (tùy chọn):
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Giải thích cách tiếp cận và logic của bạn..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      disabled={!isStarted || isPaused || isCompleted}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Brain className="w-4 h-4" />
                      <span>AI sẽ review và đưa ra feedback chi tiết</span>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStarted || isPaused || isCompleted || isSubmitting || (!userCode.trim() && !userAnswer.trim())}
                      className="px-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Nộp bài
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* AI Feedback */}
                {aiFeedback && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          AI Feedback
                        </h3>
                        {score && (
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              score >= 80 ? 'text-green-600 dark:text-green-400' : 
                              score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                              'text-red-600 dark:text-red-400'
                            }`}>
                              Điểm: {score}/100
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(score / 20) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm">
                          {aiFeedback}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4 mr-2" />
                          Chia sẻ
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Tải về
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleReset}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Thử lại
                        </Button>
                        <Link href="/practice">
                          <Button>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Hoàn thành
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default PracticeDetailPage