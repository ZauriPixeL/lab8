<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <div class="text-h5 text-weight-bold text-grey-9">รายการห้องพัก</div>
        <div class="text-caption text-grey-7">
          เลือกประเภทห้องพักที่ต้องการ แล้วกดจองได้ทันที
        </div>
      </div>

      <div class="col-12 col-md-6 row justify-end q-gutter-sm">
        <q-input
          v-model="searchText"
          outlined
          dense
          clearable
          placeholder="ค้นหาชื่อห้องพัก..."
          class="bg-white"
          style="min-width: 220px;"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="selectedType"
          :options="typeOptions"
          outlined
          dense
          label="ประเภทห้อง"
          class="bg-white"
          style="min-width: 150px;"
        />
      </div>
    </div>

    <div v-if="filteredRooms.length === 0" class="text-center q-pa-xl text-grey-6">
      <q-icon name="search_off" size="48px" />
      <div class="text-subtitle1 q-mt-sm">ไม่พบห้องพักที่ตรงกับเงื่อนไขการค้นหา</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <RoomCard
          :room="room"
          @view-detail="goToDetail"
          @book-room="openBookingModal"
        >
          <template #badge>
            <q-badge :color="getTypeColor(room.type)" class="q-pa-xs text-weight-bold">
              {{ room.type }}
            </q-badge>
          </template>
        </RoomCard>
      </div>
    </div>

    <BookingFormDialog
      v-model="showBookingDialog"
      :preselected-room-id="selectedRoomId"
      :submitting="bookingStore.loading"
      @save="handleSaveBooking"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { roomsData } from '@/data/rooms'
import { useBookingStore } from '@/stores/booking-store'
import RoomCard from '@/components/RoomCard.vue'
import BookingFormDialog from '@/components/BookingFormDialog.vue'

useMeta({ title: 'รายการห้องพัก - StayEase' })

const router = useRouter()
const $q = useQuasar()
const bookingStore = useBookingStore()

const searchText = ref('')
const selectedType = ref('ทั้งหมด')
const typeOptions = ['ทั้งหมด', 'Standard', 'Deluxe', 'Suite', 'Family']

const showBookingDialog = ref(false)
const selectedRoomId = ref(null)

// ใช้ computed กรองรายการห้องพัก (บทที่ 3)
const filteredRooms = computed(() => {
  return roomsData.filter((room) => {
    const matchType = selectedType.value === 'ทั้งหมด' || room.type === selectedType.value
    const keyword = (searchText.value || '').toLowerCase()
    const matchSearch =
      room.name.toLowerCase().includes(keyword) ||
      room.description.toLowerCase().includes(keyword)
    return matchType && matchSearch
  })
})

const getTypeColor = (type) => {
  const colors = {
    Standard: 'primary',
    Deluxe: 'info',
    Suite: 'amber-9',
    Family: 'secondary'
  }
  return colors[type] || 'grey'
}

const goToDetail = (room) => {
  router.push({
    name: 'room-detail',
    params: { id: room.id }
  })
}

const openBookingModal = (room) => {
  selectedRoomId.value = room.id
  showBookingDialog.value = true
}

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
      message: bookingStore.errorMessage || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    })
  }
}
</script>
