'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Bot,
  User
} from 'lucide-react'

export const AITutorWidget: React.FC = () => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "Explain JavaScript closures",
    "How to use React hooks?",
    "What is async/await?",
    "CSS Grid vs Flexbox?"
  ]

  const recentChats = [
    {
      id: 1,
      question: "How do I handle errors in async functions?",
      time: "2 giờ trước",
      preview: "Try-catch blocks are the most common way..."
    },
    {
      id: 2,
      question: "What's the difference between let and var?",
      time: "1 ngày trước",
      preview: "The main differences are scope, hoisting..."
    }
  ]

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setMessage('')
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setMessage(question)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quick Chat */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">AI Tutor</h3>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>

        {/* Quick Input */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Hỏi AI tutor bất kỳ câu hỏi nào..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
              <Lightbulb className="w-3 h-3 mr-1" />
              Câu hỏi gợi ý:
            </p>
            <div className="space-y-1">
              {quickQuestions.slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left text-xs text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Chats */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
          Cuộc trò chuyện gần đây
        </h4>
        
        {recentChats.length === 0 ? (
          <div className="text-center py-4">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chưa có cuộc trò chuyện nào
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <div 
                key={chat.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {chat.question}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {chat.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {chat.preview}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Giải thích chi tiết</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Ví dụ thực tế</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <HelpCircle className="w-4 h-4 text-green-500" />
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      {/* Full Chat Link */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/tutor">
          <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Mở chat đầy đủ</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AITutorWidget