'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get message from URL params for displaying success/info messages
  const message = searchParams?.get('message')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
      sessionStorage.removeItem('redirectAfterLogin')
      router.push(redirectTo)
    }
  }, [isAuthenticated, router])

  const getMessageDisplay = (messageType: string | null) => {
    switch (messageType) {
      case 'password-reset-success':
        return (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              Your password has been reset successfully. Please sign in with your new password.
            </p>
          </div>
        )
      case 'email-verified':
        return (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              Your email has been verified successfully. You can now sign in.
            </p>
          </div>
        )
      case 'registration-complete':
        return (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              Registration successful! Please sign in to access your account.
            </p>
          </div>
        )
      case 'session-expired':
        return (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              Your session has expired. Please sign in again.
            </p>
          </div>
        )
      default:
        return null
    }
  }

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

        {/* Success/Info Messages */}
        {message && getMessageDisplay(message)}

        {/* Login Form */}
        <LoginForm />

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              New to LearnSmart AI?{' '}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create your account
              </a>
            </p>
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