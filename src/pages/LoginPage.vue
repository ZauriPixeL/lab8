<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { messageOf } from '../boot/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
function fillDemo() { username.value = 'demo'; password.value = 'stay1234'; error.value = '' }
async function login() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    const next = route.query.next
    const destination = typeof next === 'string' && /^\/bookings(?:[/?]|$)/.test(next) ? next : '/'
    await router.replace(destination)
  } catch (problem) { error.value = messageOf(problem) }
  finally { loading.value = false }
}
</script>

<template>
  <q-page class="container inner-page">
    <div class="login-grid">
      <div class="login-art"><p class="eyebrow">Banrim Stay</p><h1>บ้านริม</h1><p>จองห้องพักของคุณ</p></div>
      <section class="login-panel">
        <p class="eyebrow">Guest access</p><h2>เข้าสู่ระบบ</h2>
        <p v-if="route.query.next" class="subtext">เข้าสู่ระบบเพื่อกลับไปทำรายการที่เลือกไว้</p>
        <q-form class="stack" @submit="login">
          <q-input v-model="username" outlined label="ชื่อผู้ใช้" autocomplete="username" required />
          <q-input v-model="password" outlined label="รหัสผ่าน" type="password" autocomplete="current-password" required />
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <q-btn type="submit" unelevated color="primary" label="เข้าสู่ระบบ" :loading="loading" />
        </q-form>
        <div class="demo-box"><div><b>บัญชีทดลอง</b><div><code>demo</code> / <code>stay1234</code></div></div>
          <q-btn flat no-caps label="กรอกให้" color="primary" @click="fillDemo" /></div>
      </section>
    </div>
  </q-page>
</template>
