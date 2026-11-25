import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import { QLayout, QHeader, QPageContainer, QPage, QBtn, QForm, QInput, QDialog, QCard, QSpinner } from 'quasar'
import 'quasar/dist/quasar.css'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { api } from './boot/api'
import { useAuthStore } from './stores/auth'
import { useStayStore } from './stores/stay'

async function start() {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    const { enableMock } = await import('./mock/api')
    enableMock(api)
  }
  const app = createApp(App)
  app.use(createPinia())
  app.use(Quasar, {
    components: { QLayout, QHeader, QPageContainer, QPage, QBtn, QForm, QInput, QDialog, QCard, QSpinner },
    plugins: { Notify },
    config: { brand: { primary: '#225b4a', negative: '#9b372c' }, notify: { position: 'bottom', timeout: 2500 } }
  })
  api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      useAuthStore().clear()
      useStayStore().bookings = []
      if (router.currentRoute.value.meta.requiresAuth) {
        router.replace({ name: 'login', query: { next: router.currentRoute.value.fullPath } })
      }
    }
    return Promise.reject(error)
  })
  app.use(router)
  await router.isReady()
  app.mount('#app')
}
start().catch(() => {
  document.querySelector('#app').textContent = 'เปิดแอปไม่สำเร็จ กรุณาเปิดใช้พื้นที่จัดเก็บของเบราว์เซอร์ แล้วโหลดหน้าใหม่'
})
