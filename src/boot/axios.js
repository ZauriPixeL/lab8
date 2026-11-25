// src/boot/axios.js
import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const api = axios.create({
  baseURL: import.meta.env.QCLI_API_URL || '/api',
  timeout: 10000
})

api.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default defineBoot(async ({ app }) => {
  if (!import.meta.env.QCLI_API_URL || import.meta.env.QCLI_API_URL === '/api') {
    const { enableBookingMock } = await import('./mock-bookings')
    enableBookingMock(api)
  }
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
