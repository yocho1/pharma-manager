import apiClient from './axiosConfig'

/**
 * Fetch all categories.
 */
export const getCategories = async () => {
  const { data } = await apiClient.get('/categories/')
  return data
}

/**
 * Create a new category.
 */
export const createCategorie = async (payload) => {
  const { data } = await apiClient.post('/categories/', payload)
  return data
}
