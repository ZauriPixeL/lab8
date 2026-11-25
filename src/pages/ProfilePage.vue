<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-weight-bold text-grey-9 q-mb-md">โปรไฟล์ผู้ใช้งานและข้อมูลระบบ</div>

    <div class="row q-col-gutter-md">
      <!-- การ์ดข้อมูลผู้ใช้งาน (บทที่ 7) -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white full-height">
          <q-card-section class="row items-center q-gutter-md">
            <q-avatar size="64px" color="primary" text-color="white" icon="person" />
            <div>
              <div class="text-h6 text-weight-bold">{{ authStore.user?.name }}</div>
              <div class="text-caption text-grey-7">{{ authStore.user?.email }}</div>
              <q-badge
                :color="authStore.role === 'admin' ? 'amber-9' : 'teal-7'"
                class="q-mt-xs"
              >
                Role: {{ authStore.role }}
              </q-badge>
            </div>
          </q-card-section>

          <q-separator />

          <q-list dense padding>
            <q-item>
              <q-item-section avatar><q-icon name="badge" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Username</q-item-label>
                <q-item-label>{{ authStore.user?.username }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="vpn_key" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Authentication Status</q-item-label>
                <q-item-label class="text-positive text-weight-medium">
                  Authenticated (Bearer Token Active)
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- การ์ดข้อมูล Environment Variables (บทที่ 8) -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-white full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-9">
              Environment Configuration (Ch.8)
            </div>
            <div class="text-caption text-grey-7">
              ค่าตัวแปรระบบที่อ่านจาก Environment Variables (import.meta.env)
            </div>
          </q-card-section>

          <q-separator />

          <q-list dense padding>
            <q-item>
              <q-item-section avatar><q-icon name="apps" color="secondary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Application Title (QCLI_APP_TITLE)</q-item-label>
                <q-item-label>{{ appTitle }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="cloud" color="secondary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Connected API URL (QCLI_API_URL)</q-item-label>
                <q-item-label class="text-primary">{{ apiUrl }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="settings" color="secondary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Build Mode (import.meta.env.MODE)</q-item-label>
                <q-item-label>
                  <q-badge :color="mode === 'production' ? 'positive' : 'orange-8'">
                    {{ mode }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

useMeta({ title: 'โปรไฟล์และระบบ - StayEase' })

const authStore = useAuthStore()

const appTitle = import.meta.env.QCLI_APP_TITLE || 'StayEase Room Booking'
const apiUrl = import.meta.env.QCLI_API_URL || '/api'
const mode = import.meta.env.MODE
</script>
