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
          <span class="brand-mark" aria-hidden="true">⌂</span>
          <span><b>บ้านริม</b><small>BANRIM STAY</small></span>
        </router-link>
        <nav aria-label="เมนูหลัก">
          <router-link to="/">ห้องพัก</router-link>
          <router-link to="/bookings">การจองของฉัน</router-link>
        </nav>
        <q-btn v-if="auth.user" no-caps unelevated class="session-btn" label="ออกจากระบบ" :loading="leaving" @click="logout" />
        <q-btn v-else no-caps unelevated class="session-btn" label="เข้าสู่ระบบ" to="/login" />
      </div>
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
    <footer><div class="container footer-inner"><b>บ้านริม · Banrim Stay</b><span>ระบบจองห้องพักสาธิตสำหรับ Lab 8</span></div></footer>
  </q-layout>
</template>
