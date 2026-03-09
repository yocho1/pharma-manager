import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMedicaments,
  getMedicament,
  createMedicament,
  updateMedicament,
  deleteMedicament,
  getAlertes,
} from '../api/medicamentsApi'

/**
 * Hook to fetch paginated medicaments list.
 */
export function useMedicaments(params = {}) {
  return useQuery({
    queryKey: ['medicaments', params],
    queryFn: () => getMedicaments(params),
  })
}

/**
 * Hook to fetch a single medicament.
 */
export function useMedicament(id) {
  return useQuery({
    queryKey: ['medicaments', id],
    queryFn: () => getMedicament(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch stock alerts.
 */
export function useAlertes() {
  return useQuery({
    queryKey: ['medicaments', 'alertes'],
    queryFn: getAlertes,
  })
}

/**
 * Hook to create a medicament.
 */
export function useCreateMedicament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicaments'] })
    },
  })
}

/**
 * Hook to update a medicament.
 */
export function useUpdateMedicament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateMedicament(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicaments'] })
    },
  })
}

/**
 * Hook to soft-delete a medicament.
 */
export function useDeleteMedicament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMedicament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicaments'] })
    },
  })
}
