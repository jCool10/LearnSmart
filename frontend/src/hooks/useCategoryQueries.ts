import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryAPI, CategoryCreateDto, CategoryUpdateDto } from '@/lib/api'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  withStats: () => [...categoryKeys.all, 'with-stats'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  byValue: (value: string) => [...categoryKeys.all, 'by-value', value] as const,
}

// Queries
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryAPI.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes - categories don't change often
  })
}

export const useCategoriesWithStats = () => {
  return useQuery({
    queryKey: categoryKeys.withStats(),
    queryFn: () => categoryAPI.getWithStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryAPI.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useCategoryByValue = (value: string) => {
  return useQuery({
    queryKey: categoryKeys.byValue(value),
    queryFn: () => categoryAPI.getByValue(value),
    enabled: !!value,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Mutations
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryCreateDto) => categoryAPI.create(data),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdateDto }) => categoryAPI.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific category and all lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.withStats() })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryAPI.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.withStats() })
    },
  })
}

export const useRestoreCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryAPI.restore(id),
    onSuccess: (_, id) => {
      // Invalidate specific category and all lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.withStats() })
    },
  })
}
