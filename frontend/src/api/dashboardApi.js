import apiClient from './axiosConfig'

/**
 * Fetch dashboard statistics.
 */
export const getDashboardStats = async () => {
  const { data } = await apiClient.get('/dashboard/')
  return data
}
