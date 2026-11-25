<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-grey-9">
          จัดการอนุมัติการจอง (Admin Dashboard)
        </div>
        <div class="text-caption text-grey-7">
          หน้านี้เข้าถึงได้เฉพาะผู้ใช้ที่มีสิทธิ์ Role: admin เท่านั้น (Role Guard)
        </div>
      </div>

      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="โหลดข้อมูลล่าสุด"
        :loading="bookingStore.loading"
        @click="bookingStore.fetchBookings()"
      />
    </div>

    <SummaryCards
      :total-bookings="bookingStore.totalBookings"
      :confirmed-count="bookingStore.confirmedCount"
      :pending-count="bookingStore.pendingCount"
      :total-revenue="bookingStore.totalRevenue"
    />

    <q-banner
      v-if="bookingStore.errorMessage"
      class="bg-red-1 text-negative rounded-borders q-mb-md"
    >
      <template v-slot:avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ bookingStore.errorMessage }}
    </q-banner>

    <q-card flat bordered class="bg-white">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1 text-weight-bold">รายการจองทั้งหมดสำหรับตรวจสอบสถานะ</div>
        <q-btn-toggle
          v-model="statusFilter"
          unelevated
          toggle-color="primary"
          color="grey-2"
          text-color="grey-9"
          :options="[
            { label: 'ทั้งหมด', value: 'ALL' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]"
        />
      </q-card-section>

      <q-separator />

      <div v-if="bookingStore.loading && bookingStore.bookings.length === 0" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="42px" />
      </div>

      <q-list v-else-if="filteredBookings.length > 0" separator>
        <q-item v-for="item in filteredBookings" :key="item.id" class="q-py-md">
          <q-item-section avatar>
            <q-avatar :color="getStatusColor(item.status)" text-color="white" icon="hotel" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">
              {{ item.guestName }} — {{ item.roomName }}
            </q-item-label>
            <q-item-label caption>
              เช็กอิน: {{ item.checkIn }} | {{ item.nights }} คืน | {{ item.guests }} ท่าน | โทร: {{ item.phone }}
            </q-item-label>
            <q-item-label caption class="text-primary text-weight-medium">
              ยอดรวม: {{ Number(item.totalPrice || 0).toLocaleString() }} บาท
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-xs">
              <q-badge :color="getStatusColor(item.status)" class="q-pa-xs q-mr-sm">
                {{ item.status }}
              </q-badge>

              <q-btn
                v-if="item.status !== 'Confirmed'"
                size="sm"
                unelevated
                color="positive"
                icon="check"
                label="อนุมัติ"
                @click="changeStatus(item, 'Confirmed')"
              />
              <q-btn
                v-if="item.status !== 'Cancelled'"
                size="sm"
                outline
                color="negative"
                icon="close"
                label="ยกเลิก"
                @click="changeStatus(item, 'Cancelled')"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="text-center q-pa-xl text-grey-6">
        ไม่พบรายการจองในสถานะที่เลือก
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { useBookingStore } from '@/stores/booking-store'
import SummaryCards from '@/components/SummaryCards.vue'

useMeta({ title: 'Admin Dashboard - StayEase' })

const $q = useQuasar()
const bookingStore = useBookingStore()

const statusFilter = ref('ALL')

const filteredBookings = computed(() => {
  if (statusFilter.value === 'ALL') return bookingStore.bookings
  return bookingStore.bookings.filter((item) => item.status === statusFilter.value)
})

const getStatusColor = (status) => {
  if (status === 'Confirmed') return 'positive'
  if (status === 'Cancelled') return 'negative'
  return 'orange-8'
}

const changeStatus = async (item, newStatus) => {
  try {
    await bookingStore.updateBooking(item.id, {
      ...item,
      status: newStatus
    })
    $q.notify({
      type: newStatus === 'Confirmed' ? 'positive' : 'warning',
      message: `อัปเดตสถานะของ ${item.guestName} เป็น ${newStatus} แล้ว`
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: bookingStore.errorMessage || 'ไม่สามารถอัปเดตสถานะได้'
    })
  }
}

onMounted(() => {
  bookingStore.fetchBookings()
})
</script>
