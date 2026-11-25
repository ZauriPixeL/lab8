// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth-store'
import { Notify } from 'quasar'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Global Navigation Guard (Route Guard + Role Guard) ตามบทที่ 5 และ 7
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      Notify.create({
        type: 'warning',
        message: 'Please login first.'
      })
      return next({ name: 'login' })
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return next({ name: 'rooms' })
    }

    if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
      Notify.create({
        type: 'negative',
        message: 'You do not have permission to access this page.'
      })
      return next({ name: 'rooms' })
    }

    next()
  })

  return Router
})
