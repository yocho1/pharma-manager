import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVentes,
  getVente,
  createVente,
  annulerVente,
} from '../api/ventesApi'

/**
 * Hook to fetch paginated ventes list.
 */
export function useVentes(params = {}) {
  return useQuery({
    queryKey: ['ventes', params],
    queryFn: () => getVentes(params),
  })
}

/**
 * Hook to fetch a single vente.
 */
export function useVente(id) {
  return useQuery({
    queryKey: ['ventes', id],
    queryFn: () => getVente(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new vente with cache invalidation.
 */
export function useCreateVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventes'] })
      queryClient.invalidateQueries({ queryKey: ['medicaments'] })
    },
  })
}

/**
 * Hook to cancel a vente with cache invalidation.
 */
export function useAnnulerVente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: annulerVente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventes'] })
      queryClient.invalidateQueries({ queryKey: ['medicaments'] })
    },
  })
}
