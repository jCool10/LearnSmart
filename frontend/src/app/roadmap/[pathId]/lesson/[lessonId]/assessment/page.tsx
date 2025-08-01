'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Star,
  RefreshCw,
  Brain,
  Target,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Award,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'code-completion'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

interface Answer {
  questionId: string
  answer: string | number
  isCorrect: boolean
  timeSpent: number
}

const AssessmentPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const pathId = params.pathId as string
  const lessonId = params.lessonId as string

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('')
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [passedAssessment, setPassedAssessment] = useState(false)

  // Mock assessment data
  const assessmentData = {
    id: 'assessment-1',
    lessonId: lessonId,
    title: 'Event Handling Assessment',
    description: 'Kiểm tra kiến thức về Event Handling trong JavaScript',
    timeLimit: 20, // minutes
    passingScore: 70,
    totalQuestions: 8,
    questions: [
      {
        id: '1',
        type: 'multiple-choice' as const,
        question: 'Phương thức nào được khuyến khích sử dụng để thêm event listener?',
        options: [
          'element.onclick = function() {}',
          'element.addEventListener("click", handler)',
          '<button onclick="handler()">',
          'element.attachEvent("onclick", handler)'
        ],
        correctAnswer: 1,
        explanation: 'addEventListener() là phương thức được khuyến khích vì nó cho phép thêm nhiều event listeners cho cùng một event và có nhiều tùy chọn hơn.',
        difficulty: 'easy' as const,
        points: 10
      },
      {
        id: '2',
        type: 'true-false' as const,
        question: 'Event bubbling xảy ra khi event được truyền từ element cha xuống element con.',
        correctAnswer: 0, // false
        explanation: 'Sai. Event bubbling xảy ra khi event được truyền từ element con lên element cha. Event capturing mới là từ cha xuống con.',
        difficulty: 'medium' as const,
        points: 15
      },
      {
        id: '3',
        type: 'multiple-choice' as const,
        question: 'event.preventDefault() được sử dụng để:',
        options: [
          'Ngăn chặn event bubbling',
          'Ngăn chặn hành vi mặc định của element',
          'Xóa event listener',
          'Tạo event mới'
        ],
        correctAnswer: 1,
        explanation: 'event.preventDefault() ngăn chặn hành vi mặc định của element, ví dụ như ngăn form submit hoặc link redirect.',
        difficulty: 'medium' as const,
        points: 15
      },
      {
        id: '4',
        type: 'code-completion' as const,
        question: 'Hoàn thành code để ngăn chặn event bubbling:\n\nbutton.addEventListener("click", function(event) {\n    console.log("Button clicked");\n    // Ngăn chặn event bubbling\n    event.______();\n});',
        correctAnswer: 'stopPropagation',
        explanation: 'event.stopPropagation() được sử dụng để ngăn chặn event bubbling, tức là ngăn event truyền lên các element cha.',
        difficulty: 'medium' as const,
        points: 20
      },
      {
        id: '5',
        type: 'multiple-choice' as const,
        question: 'Trong event handler, this keyword tham chiếu đến:',
        options: [
          'Window object',
          'Event object',
          'Element mà event listener được gắn vào',
          'Document object'
        ],
        correctAnswer: 2,
        explanation: 'Trong event handler (không phải arrow function), this tham chiếu đến element mà event listener được gắn vào.',
        difficulty: 'hard' as const,
        points: 20
      },
      {
        id: '6',
        type: 'short-answer' as const,
        question: 'Viết tên event được kích hoạt khi người dùng nhấn một phím trên bàn phím:',
        correctAnswer: 'keydown',
        explanation: 'keydown event được kích hoạt khi người dùng nhấn một phím. Có thể cũng chấp nhận keypress hoặc keyup tùy context.',
        difficulty: 'easy' as const,
        points: 10
      },
      {
        id: '7',
        type: 'multiple-choice' as const,
        question: 'Event delegation được sử dụng để:',
        options: [
          'Tạo events tự động',
          'Xử lý events cho các elements được tạo động',
          'Xóa tất cả event listeners',
          'Tăng tốc độ xử lý events'
        ],
        correctAnswer: 1,
        explanation: 'Event delegation cho phép xử lý events cho các elements được tạo động bằng cách gắn event listener vào element cha.',
        difficulty: 'hard' as const,
        points: 20
      },
      {
        id: '8',
        type: 'true-false' as const,
        question: 'Arrow functions và regular functions có cùng behavior với this keyword trong event handlers.',
        correctAnswer: 0, // false
        explanation: 'Sai. Arrow functions không có this binding riêng, nên this sẽ tham chiếu đến lexical scope, không phải element.',
        difficulty: 'hard' as const,
        points: 15
      }
    ] as Question[]
  }

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitAssessment()
    }
  }, [timeRemaining, isSubmitted])

  // Reset question timer when moving to next question
  useEffect(() => {
    setQuestionStartTime(Date.now())
    setSelectedAnswer('')
  }, [currentQuestion])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentQuestion = () => assessmentData.questions[currentQuestion]

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === '') return

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const question = getCurrentQuestion()
    const isCorrect = selectedAnswer === question.correctAnswer

    const newAnswer: Answer = {
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect,
      timeSpent
    }

    setAnswers(prev => [...prev, newAnswer])

    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmitAssessment()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      // Load previous answer if exists
      const previousAnswer = answers.find(a => a.questionId === assessmentData.questions[currentQuestion - 1].id)
      if (previousAnswer) {
        setSelectedAnswer(previousAnswer.answer)
      }
    }
  }

  const handleSubmitAssessment = async () => {
    setIsLoading(true)
    setIsSubmitted(true)

    // Add current answer if not already added
    if (selectedAnswer !== '' && !answers.find(a => a.questionId === getCurrentQuestion().id)) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
      const question = getCurrentQuestion()
      const isCorrect = selectedAnswer === question.correctAnswer

      const newAnswer: Answer = {
        questionId: question.id,
        answer: selectedAnswer,
        isCorrect,
        timeSpent
      }

      setAnswers(prev => [...prev, newAnswer])
    }

    // Simulate API call
    setTimeout(() => {
      calculateResults()
      setIsLoading(false)
      setShowResults(true)
    }, 1500)
  }

  const calculateResults = () => {
    let totalPoints = 0
    let earnedPoints = 0

    assessmentData.questions.forEach(question => {
      totalPoints += question.points
      const answer = answers.find(a => a.questionId === question.id)
      if (answer && answer.isCorrect) {
        earnedPoints += question.points
      }
    })

    const score = Math.round((earnedPoints / totalPoints) * 100)
    setFinalScore(score)
    setPassedAssessment(score >= assessmentData.passingScore)
  }

  const handleRetryAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer('')
    setTimeRemaining(assessmentData.timeLimit * 60)
    setIsSubmitted(false)
    setShowResults(false)
    setFinalScore(null)
    setPassedAssessment(false)
    setQuestionStartTime(Date.now())
  }

  if (showResults) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-content mb-4 ${
                passedAssessment 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {passedAssessment ? (
                  <Trophy className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {passedAssessment ? 'Chúc mừng!' : 'Chưa đạt yêu cầu'}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {passedAssessment 
                  ? 'Bạn đã hoàn thành bài kiểm tra thành công!'
                  : 'Bạn cần đạt ít nhất 70% để qua bài kiểm tra.'
                }
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-4 ${
                    passedAssessment 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {finalScore}%
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor((finalScore || 0) / 20) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {answers.filter(a => a.isCorrect).length}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Đúng</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {answers.filter(a => !a.isCorrect).length}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Sai</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Chi tiết kết quả
              </h3>
              
              <div className="space-y-6">
                {assessmentData.questions.map((question, index) => {
                  const answer = answers.find(a => a.questionId === question.id)
                  const isCorrect = answer?.isCorrect || false
                  
                  return (
                    <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/20' 
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Câu {index + 1}: {question.question}
                          </h4>
                          
                          {question.options && (
                            <div className="mb-3">
                              {question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex}
                                  className={`text-sm py-1 ${
                                    optionIndex === question.correctAnswer 
                                      ? 'text-green-600 dark:text-green-400 font-medium' 
                                      : optionIndex === answer?.answer 
                                        ? 'text-red-600 dark:text-red-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                  {optionIndex === question.correctAnswer && ' ✓'}
                                  {optionIndex === answer?.answer && optionIndex !== question.correctAnswer && ' ✗'}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-blue-900 dark:text-blue-300 text-sm mb-1">
                                  Giải thích:
                                </div>
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                  {question.explanation}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isCorrect ? question.points : 0}/{question.points}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            điểm
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-4">
              {passedAssessment ? (
                <Link href={`/roadmap/${pathId}`}>
                  <Button size="lg">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Tiếp tục học tập
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href={`/roadmap/${pathId}/lesson/${lessonId}`}>
                    <Button variant="outline" size="lg">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Ôn tập lại
                    </Button>
                  </Link>
                  <Button size="lg" onClick={handleRetryAssessment}>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Làm lại
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const question = getCurrentQuestion()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/roadmap/${pathId}/lesson/${lessonId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại bài học
                </Button>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assessmentData.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {assessmentData.description}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-500'}`} />
                <span className={`font-mono text-lg font-medium ${
                  timeRemaining < 300 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Câu hỏi {currentQuestion + 1} / {assessmentData.totalQuestions}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((currentQuestion + 1) / assessmentData.totalQuestions) * 100)}% hoàn thành
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / assessmentData.totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {currentQuestion + 1}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    question.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : question.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {question.points} điểm
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {question.question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {question.type === 'multiple-choice' && question.options && (
                    <>
                      {question.options.map((option, index) => (
                        <label 
                          key={index}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="answer"
                            value={index}
                            checked={selectedAnswer === index}
                            onChange={() => handleAnswerSelect(index)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                        </label>
                      ))}
                    </>
                  )}

                  {question.type === 'true-false' && (
                    <>
                      {['Đúng', 'Sai'].map((option, index) => (
                        <label 
                          key={index}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="answer"
                            value={index}
                            checked={selectedAnswer === index}
                            onChange={() => handleAnswerSelect(index)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            {option}
                          </span>
                        </label>
                      ))}
                    </>
                  )}

                  {(question.type === 'short-answer' || question.type === 'code-completion') && (
                    <div>
                      {question.type === 'code-completion' && (
                        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap">
                          {question.question.split('______')[0]}
                          <span className="bg-yellow-200 dark:bg-yellow-900/50 px-1">______</span>
                          {question.question.split('______')[1]}
                        </div>
                      )}
                      <input
                        type="text"
                        value={selectedAnswer}
                        onChange={(e) => handleAnswerSelect(e.target.value)}
                        placeholder={question.type === 'code-completion' ? 'Nhập code để hoàn thành...' : 'Nhập câu trả lời...'}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Câu trước
            </Button>

            <div className="flex items-center space-x-4">
              {currentQuestion === assessmentData.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={selectedAnswer === '' || isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Nộp bài
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === ''}
                >
                  Câu tiếp theo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Warning for time */}
          {timeRemaining < 300 && (
            <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 max-w-sm">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-900 dark:text-red-300">
                    Thời gian sắp hết!
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-400">
                    Còn lại {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default AssessmentPage