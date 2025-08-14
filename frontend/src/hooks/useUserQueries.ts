import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI, PaginationParams } from '@/lib/api'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  search: (query: string, params?: PaginationParams) => [...userKeys.all, 'search', { query, params }] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  enrolledRoadmaps: (userId: string, status?: string, params?: PaginationParams) => [...userKeys.all, 'enrolled-roadmaps', userId, { status, params }] as const,
}

// Queries
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userAPI.getUserById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useSearchUsers = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.search(query, params),
    queryFn: () => userAPI.searchUsers(query, params),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userAPI.getUserStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useUserEnrolledRoadmapsFromUser = (userId: string, status?: 'enrolled' | 'completed' | 'all', params?: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.enrolledRoadmaps(userId, status, params),
    queryFn: () => userAPI.getUserEnrolledRoadmaps(userId, status, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutations
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userAPI.updateUser(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific user and lists
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => userAPI.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}
