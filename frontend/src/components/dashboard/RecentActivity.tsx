'use client'

import React from 'react'
import { 
  BookOpen, 
  MessageCircle, 
  CheckCircle, 
  Target, 
  Calendar,
  Clock,
  User,
  Award,
  TrendingUp,
  Play
} from 'lucide-react'

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'completion',
      title: 'Hoàn thành chủ đề "Promises và Async/Await"',
      description: 'JavaScript từ cơ bản đến nâng cao',
      time: '2 giờ trước',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 2,
      type: 'chat',
      title: 'Đặt câu hỏi với AI Tutor',
      description: 'Về cách sử dụng useEffect trong React',
      time: '4 giờ trước',
      icon: MessageCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 3,
      type: 'practice',
      title: 'Thực hành coding challenge',
      description: 'Giải quyết bài toán Array Methods',
      time: '1 ngày trước',
      icon: Play,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Đạt thành tích "JavaScript Master"',
      description: 'Hoàn thành 50+ bài tập JavaScript',
      time: '2 ngày trước',
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      id: 5,
      type: 'start',
      title: 'Bắt đầu lộ trình mới',
      description: 'React.js và Ecosystem',
      time: '3 ngày trước',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    },
    {
      id: 6,
      type: 'goal',
      title: 'Hoàn thành mục tiêu tuần',
      description: 'Học 20 giờ trong tuần',
      time: '1 tuần trước',
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]

  const getActivityTitle = (activity: any) => {
    switch (activity.type) {
      case 'completion':
        return 'Hoàn thành'
      case 'chat':
        return 'Hỏi đáp'
      case 'practice':
        return 'Thực hành'
      case 'achievement':
        return 'Thành tích'
      case 'start':
        return 'Bắt đầu'
      case 'goal':
        return 'Mục tiêu'
      default:
        return 'Hoạt động'
    }
  }

  return (
    <div className="p-6">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có hoạt động nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Hoạt động học tập của bạn sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${activity.bgColor} ${activity.color}`}>
                    {getActivityTitle(activity)}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                  {activity.title}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Load More */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              Xem thêm hoạt động
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentActivity