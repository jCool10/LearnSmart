'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  Send, 
  Bot, 
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  Code,
  HelpCircle,
  Mic,
  Paperclip,
  MoreVertical,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageCircle,
  Clock,
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const TutorPage: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Xin chào ${user?.username || 'bạn'}! Tôi là AI Tutor của LearnSmart. Tôi có thể giúp bạn:\n\n• Giải thích các khái niệm khó hiểu\n• Đưa ra ví dụ thực tế\n• Hướng dẫn giải quyết bài tập\n• Đề xuất tài liệu học tập\n• Trả lời mọi câu hỏi học tập\n\nHãy hỏi tôi bất cứ điều gì bạn muốn học!`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickQuestions = [
    {
      icon: Code,
      title: "Giải thích JavaScript closures",
      category: "Programming"
    },
    {
      icon: BookOpen,
      title: "React hooks hoạt động như thế nào?",
      category: "Frontend"
    },
    {
      icon: Lightbulb,
      title: "Sự khác biệt giữa Git và GitHub?",
      category: "Tools"
    },
    {
      icon: HelpCircle,
      title: "Cách tối ưu hóa performance website?",
      category: "Optimization"
    }
  ]

  const suggestions = [
    "Explain this code to me",
    "Give me an example",
    "What are best practices for this?",
    "Can you suggest resources to learn more?",
    "Help me debug this issue",
    "What's the difference between X and Y?"
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    // Simple mock AI responses
    const responses = [
      `Tôi hiểu bạn đang hỏi về "${userInput}". Đây là một câu hỏi rất hay!\n\nĐể giải thích chi tiết:\n\n1. **Khái niệm cơ bản**: Đây là nền tảng bạn cần hiểu trước\n2. **Ví dụ thực tế**: Hãy xem ví dụ này để hiểu rõ hơn\n3. **Ứng dụng**: Bạn có thể áp dụng như thế này\n\nBạn có muốn tôi giải thích sâu hơn về phần nào không?`,
      
      `Câu hỏi về "${userInput}" này khá phổ biến! Tôi sẽ giải thích từng bước:\n\n📚 **Lý thuyết**: Trước tiên, hãy hiểu khái niệm\n💡 **Ví dụ**: Đây là cách nó hoạt động trong thực tế\n🔧 **Thực hành**: Bạn có thể thử làm theo các bước này\n\nCó gì khó hiểu thì hỏi tiếp nhé!`,
      
      `Rất tốt khi bạn hỏi về "${userInput}"!\n\nĐây là cách tôi khuyên bạn tiếp cận:\n\n• **Bước 1**: Nắm vững kiến thức cơ bản\n• **Bước 2**: Xem các ví dụ minh họa\n• **Bước 3**: Thực hành với bài tập đơn giản\n• **Bước 4**: Áp dụng vào dự án thực tế\n\nBạn muốn tôi giúp với bước nào trước?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const likeMessage = (messageId: string) => {
    // Handle like functionality
    console.log('Liked message:', messageId)
  }

  const dislikeMessage = (messageId: string) => {
    // Handle dislike functionality
    console.log('Disliked message:', messageId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Tutor</h3>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 dark:text-green-400">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>AI-powered learning assistant</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Phản hồi trong vài giây</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Hỗ trợ đa ngôn ngữ</span>
                  </div>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Câu hỏi phổ biến
                </h4>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question.title)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <question.icon className="w-4 h-4 mt-1 text-gray-400 group-hover:text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {question.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {question.category}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Thống kê hôm nay
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Câu hỏi đã hỏi</span>
                    <span className="font-medium text-gray-900 dark:text-white">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Thời gian chat</span>
                    <span className="font-medium text-gray-900 dark:text-white">45 phút</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Chủ đề học</span>
                    <span className="font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">AI Tutor</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Sẵn sàng giúp bạn học tập
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-3xl`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-500 ml-2' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 mr-2'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        {message.isTyping ? (
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">AI đang trả lời...</span>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.type === 'user' 
                                ? 'text-blue-100' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Message Actions */}
                      {!message.isTyping && message.type === 'bot' && (
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => likeMessage(message.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-green-600"
                            title="Like"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => dislikeMessage(message.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600"
                            title="Dislike"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Gợi ý câu hỏi:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Hỏi AI tutor bất kỳ câu hỏi nào..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-3"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default TutorPage