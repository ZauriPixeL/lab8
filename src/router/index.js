import { createRouter, createWebHashHistory } from 'vue-router'
import RoomsPage from '../pages/RoomsPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import BookingForm from '../pages/BookingForm.vue'
import MyBookings from '../pages/MyBookings.vue'
import { useAuthStore } from '../stores/auth'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'rooms', component: RoomsPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/bookings', name: 'bookings', component: MyBookings, meta: { requiresAuth: true } },
    { path: '/bookings/new/:roomId', name: 'new', component: BookingForm, meta: { requiresAuth: true } },
    { path: '/bookings/:id/edit', name: 'edit', component: BookingForm, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async to => {
  const auth = useAuthStore()
  if (!auth.restored) await auth.restore()
  if (to.meta.requiresAuth && (!auth.signedIn || auth.user.expires <= Date.now())) {
    auth.clear()
    return { name: 'login', query: { next: to.fullPath } }
  }
  if (to.name === 'login' && auth.signedIn) return { name: 'rooms' }
})
