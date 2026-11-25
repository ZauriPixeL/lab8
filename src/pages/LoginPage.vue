<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="q-pa-lg shadow-4" style="width: 100%; max-width: 420px; border-radius: 14px;">
      <q-card-section class="text-center q-pb-none">
        <q-avatar size="68px" color="primary" text-color="white" icon="hotel" class="q-mb-md" />
        <div class="text-h5 text-weight-bold text-grey-9">StayEase Booking</div>
        <div class="text-caption text-grey-6 q-mt-xs">
          กรุณาเข้าสู่ระบบเพื่อใช้งานระบบจองห้องพัก
        </div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-input
          v-model="username"
          label="Username"
          outlined
          dense
          lazy-rules
          :rules="[val => !!val || 'กรุณากรอก Username']"
          @keyup.enter="onLogin"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          outlined
          dense
          lazy-rules
          class="q-mt-xs"
          :rules="[val => !!val || 'กรุณากรอก Password']"
          @keyup.enter="onLogin"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-banner
          v-if="authStore.errorMessage"
          class="bg-red-1 text-negative rounded-borders q-mt-sm"
          dense
        >
          <template v-slot:avatar>
            <q-icon name="error" color="negative" />
          </template>
          {{ authStore.errorMessage }}
        </q-banner>

        <div class="q-mt-md">
          <q-btn
            color="primary"
            label="เข้าสู่ระบบ (Login)"
            class="full-width text-weight-bold"
            size="md"
            unelevated
            :loading="authStore.loading"
            :disable="!username || !password"
            @click="onLogin"
          />
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section class="q-pt-sm">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
          บัญชีสำหรับทดสอบ (Demo Accounts)
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-btn
              outline
              dense
              color="teal-7"
              class="full-width"
              label="Guest (guest)"
              @click="fillDemo('guest', '123456')"
            />
          </div>
          <div class="col-6">
            <q-btn
              outline
              dense
              color="amber-9"
              class="full-width"
              label="Admin (admin)"
              @click="fillDemo('admin', '123456')"
            />
          </div>
        </div>
        <div class="text-caption text-grey-6 q-mt-xs text-center">
          รหัสผ่านทั้งสองบัญชีคือ 123456
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

useMeta({ title: 'เข้าสู่ระบบ - StayEase' })

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const roleLabel = {
  guest: 'Guest User',
  admin: 'Administrator'
}

const fillDemo = (u, p) => {
  username.value = u
  password.value = p
}

const onLogin = async () => {
  if (!username.value || !password.value) return
  try {
    await authStore.login(username.value, password.value)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `ยินดีต้อนรับ, ${authStore.user.username}`,
      caption: `Role: ${roleLabel[authStore.user.role]}`
    })

    if (authStore.role === 'admin') {
      router.push({ name: 'admin' })
    } else {
      router.push({ name: 'rooms' })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
