import apiClient from './axiosConfig'

/**
 * Fetch all ventes.
 */
export const getVentes = async (params = {}) => {
  const { data } = await apiClient.get('/ventes/', { params })
  return data
}

/**
 * Fetch a single vente by id.
 */
export const getVente = async (id) => {
  const { data } = await apiClient.get(`/ventes/${id}/`)
  return data
}

/**
 * Create a new vente.
 */
export const createVente = async (payload) => {
  const { data } = await apiClient.post('/ventes/', payload)
  return data
}

/**
 * Cancel (annuler) a vente.
 */
export const annulerVente = async (id) => {
  const { data } = await apiClient.post(`/ventes/${id}/annuler/`)
  return data
}
