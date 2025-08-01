'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
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

        {/* Reset Password Form */}
        <ResetPasswordForm />

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Password Requirements
              </h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
                <li>• Include at least one special character (@$!%*?&)</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600">
              Having trouble?{' '}
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