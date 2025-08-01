'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
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

        {/* Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Security Information */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Security Information
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Reset links expire after 15 minutes for security</p>
              <p>• Check your spam folder if you don't see the email</p>
              <p>• Only the most recent reset link will work</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Need help?{' '}
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