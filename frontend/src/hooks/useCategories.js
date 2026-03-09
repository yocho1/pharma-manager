import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategorie } from '../api/categoriesApi'

/**
 * Hook to fetch all categories.
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

/**
 * Hook to create a new category with cache invalidation.
 */
export function useCreateCategorie() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
