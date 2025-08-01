'use client'

import React from 'react'
import Link from 'next/link'
import { Brain, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Sản phẩm',
      links: [
        { name: 'Lộ trình học tập', href: '/learning-paths' },
        { name: 'AI Tutor', href: '/tutor' },
        { name: 'Thực hành kỹ năng', href: '/practice' },
        { name: 'Theo dõi tiến độ', href: '/progress' },
      ]
    },
    {
      title: 'Tài nguyên',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Trung tâm trợ giúp', href: '/help' },
        { name: 'Hướng dẫn sử dụng', href: '/guides' },
        { name: 'API Documentation', href: '/api-docs' },
      ]
    },
    {
      title: 'Công ty',
      links: [
        { name: 'Về chúng tôi', href: '/about' },
        { name: 'Nghề nghiệp', href: '/careers' },
        { name: 'Tin tức', href: '/news' },
        { name: 'Đối tác', href: '/partners' },
      ]
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Liên hệ', href: '/contact' },
        { name: 'Trạng thái hệ thống', href: '/status' },
        { name: 'Báo cáo lỗi', href: '/report-bug' },
        { name: 'Yêu cầu tính năng', href: '/feature-request' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LearnSmart AI</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Nền tảng học tập thông minh với AI, giúp bạn tạo lộ trình cá nhân hóa 
              và đạt được mục tiêu học tập một cách hiệu quả nhất.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@learnsmart.ai</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
            <p className="text-gray-300 text-sm mb-4">
              Nhận thông tin về tính năng mới và tips học tập từ chúng tôi
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            © {currentYear} LearnSmart AI. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="/cookies"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer