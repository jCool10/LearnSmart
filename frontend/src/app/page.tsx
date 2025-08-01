'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Target,
      title: "Lộ trình học tập cá nhân hóa",
      description: "AI tạo lộ trình học tập phù hợp với mục tiêu và trình độ của bạn"
    },
    {
      icon: BookOpen,
      title: "Tổng hợp tài liệu thông minh",
      description: "Tìm kiếm và đề xuất tài liệu học tập chất lượng từ các nguồn uy tín"
    },
    {
      icon: Brain,
      title: "Trợ lý AI hỏi đáp",
      description: "Giải đáp mọi thắc mắc với AI tutor thông minh 24/7"
    },
    {
      icon: TrendingUp,
      title: "Thực hành với phản hồi AI",
      description: "Luyện tập kỹ năng và nhận phản hồi chi tiết từ AI"
    },
    {
      icon: Users,
      title: "Theo dõi tiến độ",
      description: "Visualize tiến trình học tập với biểu đồ và báo cáo chi tiết"
    },
    {
      icon: Sparkles,
      title: "Cá nhân hóa trải nghiệm",
      description: "Học tập thích ứng với phong cách và tốc độ riêng của bạn"
    }
  ]

  const testimonials = [
    {
      name: "Minh Anh",
      role: "Software Developer",
      content: "LearnSmart AI đã giúp tôi chuyển đổi từ Marketing sang lập trình chỉ trong 6 tháng!",
      rating: 5
    },
    {
      name: "Hoàng Nam",
      role: "Data Analyst",
      content: "Lộ trình học Data Science được AI tạo ra rất chi tiết và phù hợp với tôi.",
      rating: 5
    },
    {
      name: "Thu Hà",
      role: "Product Manager",
      content: "AI tutor giải thích rất dễ hiểu, như có gia sư riêng 24/7.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Học tập thông minh với
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}AI-powered
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              LearnSmart AI tạo lộ trình học tập cá nhân hóa, đề xuất tài liệu phù hợp, 
              và cung cấp trợ lý AI để hỗ trợ bạn đạt được mục tiêu học tập một cách hiệu quả nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="px-8 py-3 text-lg">
                    Vào Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="px-8 py-3 text-lg">
                      Bắt đầu miễn phí
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                      Đăng nhập
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Miễn phí 30 ngày đầu
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Không cần thẻ tín dụng
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Hỗ trợ tiếng Việt
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Những công cụ AI tiên tiến giúp bạn học tập hiệu quả và đạt được mục tiêu nhanh chóng
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn đã có thể bắt đầu hành trình học tập với AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Đặt mục tiêu",
                description: "Chia sẻ mục tiêu học tập và kỹ năng bạn muốn phát triển"
              },
              {
                step: "02", 
                title: "Nhận lộ trình AI",
                description: "AI tạo lộ trình cá nhân hóa với các bước học chi tiết"
              },
              {
                step: "03",
                title: "Học và thực hành",
                description: "Học theo lộ trình, thực hành và nhận phản hồi từ AI"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hàng nghìn người đã thành công với LearnSmart AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình học tập của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cùng hàng nghìn người đang học tập thông minh với AI
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                  Đăng ký miễn phí
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="mr-2 w-5 h-5" />
                Xem demo
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
