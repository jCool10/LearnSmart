'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Don't render if already authenticated (to prevent flash)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LearnSmart AI</h1>
          <p className="text-gray-600">Your AI-powered learning companion</p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                What you'll get with LearnSmart AI:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Personalized learning paths created by AI</li>
                <li>• Interactive AI tutor for questions and guidance</li>
                <li>• Progress tracking and learning analytics</li>
                <li>• Practice exercises with AI feedback</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600">
              Need help getting started?{' '}
              <a
                href="/support"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 LearnSmart AI. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="/terms" className="text-xs text-gray-500 hover:text-gray-700">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  )
}