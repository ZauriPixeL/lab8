// src/boot/auth.js
import { useAuthStore } from '@/stores/auth-store'

export default async () => {
  const authStore = useAuthStore()
  await authStore.checkAuth()
}
