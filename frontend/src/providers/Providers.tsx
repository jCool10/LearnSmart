'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { RoadmapProvider } from '@/contexts/RoadmapContext'
import { ProgressProvider } from '@/contexts/ProgressContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before refetching stale data
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time before inactive queries are garbage collected
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except for 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 2
          }
          return false
        }
        // Retry on network errors and 5xx errors
        return failureCount < 3
      },
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except for 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 1
          }
          return false
        }
        // Retry on network errors and 5xx errors
        return failureCount < 2
      },
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={false}
      >
        <AuthProvider>
          <RoadmapProvider>
            <ProgressProvider>
              {children}
            </ProgressProvider>
          </RoadmapProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers