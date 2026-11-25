<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="hotel" size="26px" class="q-mr-sm" />
          <span class="text-weight-bold">{{ appTitle }}</span>
        </q-toolbar-title>

        <!-- Role Badge และปุ่ม Logout เมื่อเข้าสู่ระบบแล้ว -->
        <div v-if="authStore.isAuthenticated" class="row items-center q-gutter-sm">
          <q-chip
            dense
            :color="authStore.role === 'admin' ? 'amber-8' : 'teal-6'"
            text-color="white"
            :icon="authStore.role === 'admin' ? 'admin_panel_settings' : 'person'"
          >
            {{ authStore.user?.username }} ({{ authStore.role }})
          </q-chip>
          <q-btn
            size="sm"
            color="white"
            text-color="primary"
            icon="logout"
            label="Logout"
            unelevated
            @click="onLogout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="authStore.isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
    >
      <q-list padding>
        <q-item-label header class="text-grey-7 text-weight-bold">
          เมนูหลัก
        </q-item-label>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'rooms' }"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="meeting_room" />
          </q-item-section>
          <q-item-section>
            <q-item-label>รายการห้องพัก</q-item-label>
            <q-item-label caption>เลือกดูห้องพักและจองห้อง</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'bookings' }"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="event_note" />
          </q-item-section>
          <q-item-section>
            <q-item-label>รายการจองห้องพัก</q-item-label>
            <q-item-label caption>เพิ่ม แก้ไข และยกเลิกการจอง</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'profile' }"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>โปรไฟล์และระบบ</q-item-label>
            <q-item-label caption>ข้อมูลผู้ใช้และ API Environment</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item-label header class="text-grey-7 text-weight-bold">
          สำหรับเจ้าหน้าที่ (Admin)
        </q-item-label>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'admin' }"
          active-class="text-primary bg-blue-1 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>จัดการอนุมัติการจอง</q-item-label>
            <q-item-label caption>เฉพาะสิทธิ์ Admin เท่านั้น</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-grey-7">
      <div class="q-pa-xs text-center text-caption">
        StayEase Room Booking System | 968-362 Front-end Development (Lab 8)
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const appTitle = import.meta.env.QCLI_APP_TITLE || 'StayEase Room Booking'

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const onLogout = () => {
  $q.dialog({
    title: 'ยืนยันการออกจากระบบ',
    message: 'คุณต้องการออกจากระบบใช่หรือไม่?',
    cancel: {
      label: 'ยกเลิก',
      flat: true,
      color: 'grey'
    },
    ok: {
      label: 'ออกจากระบบ',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(() => {
    authStore.logout()
    $q.notify({
      type: 'positive',
      message: 'ออกจากระบบเรียบร้อยแล้ว'
    })
    router.replace({ name: 'login' })
  })
}
</script>
