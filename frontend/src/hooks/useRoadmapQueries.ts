import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roadmapAPI, userAPI, RoadmapQueryDto, RoadmapCreateDto, RoadmapUpdateDto, PaginationParams } from '@/lib/api'

// Query keys
export const roadmapKeys = {
  all: ['roadmaps'] as const,
  lists: () => [...roadmapKeys.all, 'list'] as const,
  list: (filters: RoadmapQueryDto & PaginationParams) => [...roadmapKeys.lists(), { filters }] as const,
  details: () => [...roadmapKeys.all, 'detail'] as const,
  detail: (id: string) => [...roadmapKeys.details(), id] as const,
  popular: (limit?: number) => [...roadmapKeys.all, 'popular', { limit }] as const,
  recommended: (limit?: number) => [...roadmapKeys.all, 'recommended', { limit }] as const,
  search: (query: string, filters?: any) => [...roadmapKeys.all, 'search', { query, filters }] as const,
  byCreator: (creatorId: string, params?: PaginationParams) => [...roadmapKeys.all, 'creator', creatorId, { params }] as const,
  userEnrolled: (userId: string, status?: string, params?: PaginationParams) => [...roadmapKeys.all, 'user-enrolled', userId, { status, params }] as const,
  stats: (id: string) => [...roadmapKeys.all, 'stats', id] as const,
}

// Queries
export const useRoadmaps = (params?: RoadmapQueryDto & PaginationParams) => {
  return useQuery({
    queryKey: roadmapKeys.list(params || {}),
    queryFn: () => roadmapAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRoadmap = (id: string) => {
  return useQuery({
    queryKey: roadmapKeys.detail(id),
    queryFn: () => roadmapAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePopularRoadmaps = (limit?: number) => {
  return useQuery({
    queryKey: roadmapKeys.popular(limit),
    queryFn: () => roadmapAPI.getPopular(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useRecommendedRoadmaps = (limit?: number) => {
  return useQuery({
    queryKey: roadmapKeys.recommended(limit),
    queryFn: () => roadmapAPI.getRecommended(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useSearchRoadmaps = (query: string, filters?: { category?: string; difficulty?: string } & PaginationParams) => {
  return useQuery({
    queryKey: roadmapKeys.search(query, filters),
    queryFn: () => roadmapAPI.search(query, filters),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useRoadmapsByCreator = (creatorId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: roadmapKeys.byCreator(creatorId, params),
    queryFn: () => roadmapAPI.getByCreator(creatorId, params),
    enabled: !!creatorId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useUserEnrolledRoadmaps = (userId: string, status?: 'enrolled' | 'completed' | 'all', params?: PaginationParams) => {
  return useQuery({
    queryKey: roadmapKeys.userEnrolled(userId, status, params),
    queryFn: () => userAPI.getUserEnrolledRoadmaps(userId, status, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRoadmapStats = (id: string) => {
  return useQuery({
    queryKey: roadmapKeys.stats(id),
    queryFn: () => roadmapAPI.getStats(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutations
export const useCreateRoadmap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RoadmapCreateDto) => roadmapAPI.create(data),
    onSuccess: () => {
      // Invalidate and refetch roadmap lists
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roadmapKeys.popular() })
    },
  })
}

export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoadmapUpdateDto }) => roadmapAPI.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific roadmap and lists
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() })
    },
  })
}

export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => roadmapAPI.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: roadmapKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() })
    },
  })
}
