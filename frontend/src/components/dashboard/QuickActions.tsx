'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  MessageCircle, 
  BookOpen, 
  Target, 
  TrendingUp,
  Brain,
  Users,
  Zap
} from 'lucide-react'

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Tạo lộ trình mới',
      description: 'Để AI tạo lộ trình học tập cá nhân hóa',
      icon: Plus,
      href: '/learning-paths/create',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Chat với AI Tutor',
      description: 'Hỏi đáp với trợ lý AI thông minh',
      icon: MessageCircle,
      href: '/tutor',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Tiếp tục học',
      description: 'Quay lại lộ trình đang học',
      icon: BookOpen,
      href: '/learning-paths',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Thực hành kỹ năng',
      description: 'Luyện tập và nhận phản hồi từ AI',
      icon: Target,
      href: '/practice',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      title: 'Xem tiến độ',
      description: 'Theo dõi quá trình học tập',
      icon: TrendingUp,
      href: '/progress',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      title: 'Khám phá tài liệu',
      description: 'Tìm tài liệu được đề xuất bởi AI',
      icon: Brain,
      href: '/resources',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Hành động nhanh
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Zap className="w-4 h-4 mr-1" />
          Bắt đầu ngay
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickActions