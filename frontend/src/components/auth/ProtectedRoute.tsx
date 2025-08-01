'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireEmailVerification?: boolean
  adminOnly?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = false,
  adminOnly = false,
  redirectTo = '/login',
  fallback,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store intended destination for redirect after login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search)
        }
        router.push(redirectTo)
        return
      }

      if (requireEmailVerification && user && !user.isEmailVerified) {
        router.push('/verify-email')
        return
      }

      if (adminOnly && user && user.role !== 'admin') {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requireEmailVerification, adminOnly, router, redirectTo])

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Don't render if email verification required but not verified
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return null
  }

  // Don't render if admin required but user is not admin
  if (adminOnly && user && user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute