// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/rooms'
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { requiresAuth: false, title: 'เข้าสู่ระบบ' }
      },
      {
        path: 'rooms',
        name: 'rooms',
        component: () => import('@/pages/RoomsPage.vue'),
        meta: { requiresAuth: true, title: 'รายการห้องพัก' }
      },
      {
        path: 'rooms/:id',
        name: 'room-detail',
        component: () => import('@/pages/RoomDetailPage.vue'),
        meta: { requiresAuth: true, title: 'รายละเอียดห้องพัก' }
      },
      {
        path: 'bookings',
        name: 'bookings',
        component: () => import('@/pages/BookingsPage.vue'),
        meta: { requiresAuth: true, title: 'รายการจองห้องพัก' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true, title: 'โปรไฟล์ผู้ใช้งาน' }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/pages/AdminManagePage.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin'],
          title: 'จัดการระบบ (Admin)'
        }
      }
    ]
  },

  // Catch-all 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
