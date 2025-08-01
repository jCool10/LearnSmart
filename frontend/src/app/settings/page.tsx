'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Clock,
  Target,
  Brain,
  BookOpen,
  Save,
  X,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Trash2,
  Download,
  Upload,
  Key,
  Mail,
  Smartphone,
  CreditCard
} from 'lucide-react'
import { useTheme } from 'next-themes'

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  
  // Settings state
  const [activeTab, setActiveTab] = useState('profile')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    avatar: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: {
      learningReminders: true,
      weeklyProgress: true,
      newResources: false,
      achievements: true,
      systemUpdates: false
    },
    push: {
      learningReminders: true,
      weeklyProgress: false,
      newResources: false,
      achievements: true,
      systemUpdates: false
    },
    sound: true
  })

  // Learning preferences
  const [learningPrefs, setLearningPrefs] = useState({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    studyTime: 'morning',
    difficulty: 'intermediate',
    goals: {
      dailyHours: 2,
      weeklyGoals: 3,
      monthlyGoals: 12
    },
    aiPersonality: 'friendly',
    feedbackStyle: 'detailed'
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showProgress: false,
    showAchievements: true,
    allowDataCollection: true,
    twoFactorAuth: false
  })

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'learning', label: 'Học tập', icon: BookOpen },
    { id: 'privacy', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'account', label: 'Tài khoản', icon: User }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
      // Show success message
    }, 1000)
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleNotificationChange = (category: 'email' | 'push', setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: { ...prev[category], [setting]: value }
    }))
    setHasChanges(true)
  }

  const handleLearningChange = (field: string, value: any) => {
    setLearningPrefs(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thông tin cá nhân
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Họ tên
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giới thiệu bản thân
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Chia sẻ về mục tiêu học tập và sở thích của bạn..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa điểm
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleProfileChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ví dụ: Hà Nội, Việt Nam"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => handleProfileChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thông báo Email
        </h3>
        
        <div className="space-y-4">
          {Object.entries(notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {key === 'learningReminders' && 'Nhắc nhở học tập'}
                  {key === 'weeklyProgress' && 'Báo cáo tiến độ hàng tuần'}
                  {key === 'newResources' && 'Tài liệu mới'}
                  {key === 'achievements' && 'Thành tích mới'}
                  {key === 'systemUpdates' && 'Cập nhật hệ thống'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {key === 'learningReminders' && 'Nhận nhắc nhở khi đến giờ học'}
                  {key === 'weeklyProgress' && 'Báo cáo chi tiết về tiến độ học tập'}
                  {key === 'newResources' && 'Thông báo khi có tài liệu mới phù hợp'}
                  {key === 'achievements' && 'Thông báo khi đạt được thành tích mới'}
                  {key === 'systemUpdates' && 'Thông tin về tính năng và cập nhật mới'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thông báo Push
        </h3>
        
        <div className="space-y-4">
          {Object.entries(notifications.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {key === 'learningReminders' && 'Nhắc nhở học tập'}
                  {key === 'weeklyProgress' && 'Báo cáo tiến độ hàng tuần'}
                  {key === 'newResources' && 'Tài liệu mới'}
                  {key === 'achievements' && 'Thành tích mới'}
                  {key === 'systemUpdates' && 'Cập nhật hệ thống'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Âm thanh
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {notifications.sound ? (
              <Volume2 className="w-5 h-5 text-gray-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Âm thanh thông báo
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Phát âm thanh khi có thông báo mới
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.sound}
              onChange={(e) => setNotifications(prev => ({ ...prev, sound: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderLearningTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tùy chọn học tập
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngôn ngữ giao diện
            </label>
            <select
              value={learningPrefs.language}
              onChange={(e) => handleLearningChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Múi giờ
            </label>
            <select
              value={learningPrefs.timezone}
              onChange={(e) => handleLearningChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
              <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thời gian học tốt nhất
            </label>
            <select
              value={learningPrefs.studyTime}
              onChange={(e) => handleLearningChange('studyTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="morning">Buổi sáng (6-12h)</option>
              <option value="afternoon">Buổi chiều (12-18h)</option>
              <option value="evening">Buổi tối (18-22h)</option>
              <option value="night">Buổi đêm (22-6h)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mức độ khó mặc định
            </label>
            <select
              value={learningPrefs.difficulty}
              onChange={(e) => handleLearningChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mục tiêu học tập
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số giờ học/ngày
            </label>
            <input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={learningPrefs.goals.dailyHours}
              onChange={(e) => handleLearningChange('goals', { ...learningPrefs.goals, dailyHours: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mục tiêu/tuần
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={learningPrefs.goals.weeklyGoals}
              onChange={(e) => handleLearningChange('goals', { ...learningPrefs.goals, weeklyGoals: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mục tiêu/tháng
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={learningPrefs.goals.monthlyGoals}
              onChange={(e) => handleLearningChange('goals', { ...learningPrefs.goals, monthlyGoals: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Tutor Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tính cách AI
            </label>
            <select
              value={learningPrefs.aiPersonality}
              onChange={(e) => handleLearningChange('aiPersonality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="friendly">Thân thiện</option>
              <option value="professional">Chuyên nghiệp</option>
              <option value="casual">Thoải mái</option>
              <option value="encouraging">Động viên</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phong cách feedback
            </label>
            <select
              value={learningPrefs.feedbackStyle}
              onChange={(e) => handleLearningChange('feedbackStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="detailed">Chi tiết</option>
              <option value="concise">Ngắn gọn</option>
              <option value="encouraging">Khuyến khích</option>
              <option value="critical">Phê bình xây dựng</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chủ đề giao diện
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Sun className="w-5 h-5 text-yellow-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Light</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Giao diện sáng</p>
            </div>
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
              theme === 'dark' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Dark</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Giao diện tối</p>
            </div>
          </button>
          
          <button
            onClick={() => setTheme('system')}
            className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
              theme === 'system' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Monitor className="w-5 h-5 text-gray-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">System</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Theo hệ thống</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bảo mật tài khoản
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Đổi mật khẩu</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cập nhật mật khẩu định kỳ</p>
              </div>
            </div>
            <Button variant="outline">Đổi mật khẩu</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Xác thực 2 bước</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bảo vệ tài khoản với 2FA</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.twoFactorAuth}
                onChange={(e) => handlePrivacyChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dữ liệu và sao lưu
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Xuất dữ liệu</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tải về tất cả dữ liệu của bạn</p>
              </div>
            </div>
            <Button variant="outline">Xuất dữ liệu</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Nhập dữ liệu</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Khôi phục từ bản sao lưu</p>
              </div>
            </div>
            <Button variant="outline">Nhập dữ liệu</Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          Vùng nguy hiểm
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-200">Xóa tài khoản</p>
                <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                </p>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tài khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cài đặt
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Quản lý tài khoản và tùy chỉnh trải nghiệm học tập của bạn
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'learning' && renderLearningTab()}
                {activeTab === 'appearance' && renderAppearanceTab()}
                {activeTab === 'account' && renderAccountTab()}
                {activeTab === 'privacy' && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Privacy Settings
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Tính năng này đang được phát triển
                    </p>
                  </div>
                )}

                {/* Save Button */}
                {hasChanges && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bạn có thay đổi chưa được lưu
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setHasChanges(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Lưu thay đổi
                          </>
                        )}
                      </Button>
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

export default SettingsPage