import apiClient from './axiosConfig'

/**
 * Fetch all medicaments.
 */
export const getMedicaments = async (params = {}) => {
  const { data } = await apiClient.get('/medicaments/', { params })
  return data
}

/**
 * Fetch a single medicament by id.
 */
export const getMedicament = async (id) => {
  const { data } = await apiClient.get(`/medicaments/${id}/`)
  return data
}

/**
 * Create a new medicament.
 */
export const createMedicament = async (payload) => {
  const { data } = await apiClient.post('/medicaments/', payload)
  return data
}

/**
 * Update a medicament.
 */
export const updateMedicament = async (id, payload) => {
  const { data } = await apiClient.patch(`/medicaments/${id}/`, payload)
  return data
}

/**
 * Soft-delete a medicament.
 */
export const deleteMedicament = async (id) => {
  const { data } = await apiClient.delete(`/medicaments/${id}/`)
  return data
}

/**
 * Fetch stock alerts.
 */
export const getAlertes = async () => {
  const { data } = await apiClient.get('/medicaments/alertes/')
  return data
}
