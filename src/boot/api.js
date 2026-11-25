import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

export const sessionKey = 'banrim-access-token'
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem(sessionKey)
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

export function messageOf(error) {
  return error.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'
}
