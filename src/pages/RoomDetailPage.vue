<template>
  <q-page class="q-pa-md">
    <q-btn
      flat
      color="primary"
      icon="arrow_back"
      label="กลับหน้ารายการห้องพัก"
      class="q-mb-md"
      @click="router.push({ name: 'rooms' })"
    />

    <q-card v-if="room" flat bordered class="bg-white" style="max-width: 900px; margin: 0 auto;">
      <div class="row">
        <div class="col-12 col-md-6">
          <q-img :src="room.image" :ratio="16 / 10" class="full-height" />
        </div>

        <div class="col-12 col-md-6 q-pa-lg column justify-between">
          <div>
            <q-badge color="primary" class="q-mb-sm">{{ room.type }}</q-badge>
            <div class="text-h5 text-weight-bold text-grey-9">{{ room.name }}</div>
            <div class="text-h6 text-primary text-weight-bold q-mt-xs">
              {{ room.pricePerNight.toLocaleString() }} บาท / คืน
            </div>

            <q-separator class="q-my-md" />

            <div class="text-body1 text-grey-8">{{ room.description }}</div>

            <q-list dense class="q-mt-md">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="square_foot" color="primary" />
                </q-item-section>
                <q-item-section>ขนาดห้อง: {{ room.size }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="bed" color="primary" />
                </q-item-section>
                <q-item-section>รูปแบบเตียง: {{ room.bedType }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="groups" color="primary" />
                </q-item-section>
                <q-item-section>รองรับผู้เข้าพักสูงสุด: {{ room.maxGuests }} ท่าน</q-item-section>
              </q-item>
            </q-list>

            <div class="text-subtitle2 text-weight-bold q-mt-md q-mb-xs">สิ่งอำนวยความสะดวก</div>
            <div class="row q-gutter-xs">
              <q-chip
                v-for="item in room.amenities"
                :key="item"
                dense
                color="blue-1"
                text-color="primary"
                icon="check"
              >
                {{ item }}
              </q-chip>
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              unelevated
              color="primary"
              icon="book_online"
              label="จองห้องพักนี้ทันที"
              class="full-width"
              size="md"
              @click="showBookingDialog = true"
            />
          </div>
        </div>
      </div>
    </q-card>

    <q-banner v-else class="bg-orange-1 text-orange-10 rounded-borders">
      ไม่พบข้อมูลห้องพักรหัส {{ roomId }}
    </q-banner>

    <BookingFormDialog
      v-if="room"
      v-model="showBookingDialog"
      :preselected-room-id="room.id"
      :submitting="bookingStore.loading"
      @save="handleSaveBooking"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { roomsData } from '@/data/rooms'
import { useBookingStore } from '@/stores/booking-store'
import BookingFormDialog from '@/components/BookingFormDialog.vue'

useMeta({ title: 'รายละเอียดห้องพัก - StayEase' })

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const bookingStore = useBookingStore()

const roomId = computed(() => Number(route.params.id))
const room = computed(() => roomsData.find((r) => r.id === roomId.value))
const showBookingDialog = ref(false)

const handleSaveBooking = async (payload) => {
  try {
    await bookingStore.addBooking(payload)
    showBookingDialog.value = false
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'บันทึกการจองห้องพักเรียบร้อยแล้ว'
    })
    router.push({ name: 'bookings' })
  } catch {
    $q.notify({
      type: 'negative',
      message: bookingStore.errorMessage || 'ไม่สามารถบันทึกการจองได้'
    })
  }
}
</script>
