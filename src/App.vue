<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from './stores/auth'
import { useStayStore } from './stores/stay'
import { messageOf } from './boot/api'

const auth = useAuthStore()
const stay = useStayStore()
const router = useRouter()
const quasar = useQuasar()
const leaving = ref(false)

async function logout() {
  leaving.value = true
  try {
    await auth.logout()
    stay.bookings = []
    await router.push('/')
    quasar.notify('ออกจากระบบแล้ว')
  } catch (error) {
    quasar.notify(messageOf(error))
  } finally {
    leaving.value = false
  }
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="site-header">
      <div class="container topbar">
        <router-link class="brand" to="/" aria-label="บ้านริม หน้าหลัก">
          <b>บ้านริม</b>
        </router-link>
        <nav aria-label="เมนูหลัก">
          <router-link to="/" :class="{ current: $route.name === 'rooms' }">เลือกสถานที่</router-link>
          <router-link to="/bookings">การจองของฉัน</router-link>
        </nav>
        <q-btn v-if="auth.user" no-caps unelevated class="session-btn" label="ออกจากระบบ" :loading="leaving" @click="logout" />
        <q-btn v-else no-caps unelevated class="session-btn" label="เข้าสู่ระบบ" to="/login" />
      </div>
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
    <footer class="container">ข้อมูลการจองเก็บในเบราว์เซอร์นี้</footer>
  </q-layout>
</template>
