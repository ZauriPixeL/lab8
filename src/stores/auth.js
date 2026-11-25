import { defineStore } from 'pinia'
import { api, sessionKey } from '../boot/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, restored: false }),
  getters: {
    signedIn: state => Boolean(state.user && state.user.expires > Date.now())
  },
  actions: {
    async login(username, password) {
      const { data } = await api.post('/auth/login', { username, password })
      this.user = data
      sessionStorage.setItem(sessionKey, data.token)
    },
    async restore() {
      if (sessionStorage.getItem(sessionKey)) {
        try {
          this.user = (await api.get('/auth/me')).data
        } catch (error) {
          if (error.response?.status !== 401) throw error
          this.clear()
        }
      }
      this.restored = true
    },
    clear() {
      this.user = null
      sessionStorage.removeItem(sessionKey)
    },
    async logout() {
      await api.post('/auth/logout')
      this.clear()
    }
  }
})
