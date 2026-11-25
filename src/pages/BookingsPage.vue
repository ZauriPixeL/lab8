<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md q-col-gutter-sm">
      <div class="col-12 col-sm-6">
        <div class="text-h5 text-weight-bold text-grey-9">รายการจองห้องพัก</div>
        <div class="text-caption text-grey-7">
          จัดการข้อมูลการจองผ่าน REST API (เพิ่ม ดู แก้ไข และลบรายการ)
        </div>
      </div>

      <div class="col-12 col-sm-6 row justify-end q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="refresh"
          label="รีเฟรชข้อมูล"
          :loading="bookingStore.loading"
          @click="bookingStore.fetchBookings()"
        />
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="เพิ่มการจองใหม่"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <SummaryCards
      :total-bookings="bookingStore.totalBookings"
      :confirmed-count="bookingStore.confirmedCount"
      :pending-count="bookingStore.pendingCount"
      :total-revenue="bookingStore.totalRevenue"
    />

    <!-- Error State (บทที่ 6) -->
    <q-banner
      v-if="bookingStore.errorMessage"
      class="bg-red-1 text-negative rounded-borders q-mb-md"
    >
      <template v-slot:avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ bookingStore.errorMessage }}
      <template v-slot:action>
        <q-btn flat color="negative" label="ลองใหม่" @click="bookingStore.fetchBookings()" />
      </template>
    </q-banner>

    <!-- Loading State -->
    <div
      v-if="bookingStore.loading && bookingStore.bookings.length === 0"
      class="text-center q-pa-xl"
    >
      <q-spinner-dots color="primary" size="48px" />
      <div class="text-caption text-grey-7 q-mt-sm">กำลังโหลดข้อมูลการจองจากเซิร์ฟเวอร์...</div>
    </div>

    <!-- Empty State -->
    <q-card
      v-else-if="!bookingStore.loading && bookingStore.bookings.length === 0 && !bookingStore.errorMessage"
      flat
      bordered
      class="text-center q-pa-xl bg-white"
    >
      <q-icon name="event_busy" size="56px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-sm">ยังไม่มีรายการจองห้องพัก</div>
      <div class="text-caption text-grey-6 q-mb-md">
        กดปุ่มด้านล่างเพื่อสร้างรายการจองใหม่รายการแรก
      </div>
      <q-btn unelevated color="primary" icon="add" label="เพิ่มการจองใหม่" @click="openCreateDialog" />
    </q-card>

    <!-- Data Table (บทที่ 4) -->
    <q-table
      v-else
      title="ตารางรายการจองทั้งหมด"
      :rows="bookingStore.bookings"
      :columns="columns"
      row-key="id"
      :filter="filterText"
      :loading="bookingStore.loading"
      :pagination="pagination"
      flat
      bordered
      class="bg-white"
    >
      <template v-slot:top-right>
        <q-input
          v-model="filterText"
          outlined
          dense
          debounce="300"
          placeholder="ค้นหาชื่อผู้เข้าพักหรือห้อง..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-totalPrice="props">
        <q-td :props="props" class="text-weight-bold text-primary">
          {{ Number(props.row.totalPrice || 0).toLocaleString() }} บาท
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            :color="getStatusColor(props.row.status)"
            text-color="white"
            class="text-weight-medium"
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit" aria-label="แก้ไขรายการจอง"
            @click="openEditDialog(props.row)"
          >
            <q-tooltip>แก้ไขรายการจอง</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete_outline" aria-label="ลบรายการจอง"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>ลบรายการจอง</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog เพิ่ม / แก้ไขข้อมูล -->
    <BookingFormDialog
      v-model="formDialogOpen"
      :initial-data="editingBooking"
      :show-status-field="authStore.role === 'admin'"
      :submitting="bookingStore.loading"
      @save="handleSave"
    />

    <!-- Dialog ยืนยันการลบ (บทที่ 4) -->
    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card style="min-width: 320px;">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="orange" size="40px" class="q-mr-md" />
          <div>
            <div class="text-h6">ยืนยันการลบรายการจอง</div>
            <div class="text-body2 text-grey-8">
              ต้องการลบรายการจองของ "{{ targetDelete?.guestName }}" ใช่หรือไม่?
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ยกเลิก" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="ลบรายการ"
            color="negative"
            :loading="bookingStore.loading"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { useBookingStore } from '@/stores/booking-store'
import { useAuthStore } from '@/stores/auth-store'
import SummaryCards from '@/components/SummaryCards.vue'
import BookingFormDialog from '@/components/BookingFormDialog.vue'

useMeta({ title: 'รายการจองห้องพัก - StayEase' })

const $q = useQuasar()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

const filterText = ref('')
const formDialogOpen = ref(false)
const editingBooking = ref(null)
const deleteDialogOpen = ref(false)
const targetDelete = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'guestName', label: 'ผู้เข้าพัก', field: 'guestName', align: 'left', sortable: true },
  { name: 'phone', label: 'เบอร์โทร', field: 'phone', align: 'left' },
  { name: 'roomName', label: 'ห้องพัก', field: 'roomName', align: 'left', sortable: true },
  { name: 'checkIn', label: 'วันเช็กอิน', field: 'checkIn', align: 'center', sortable: true },
  { name: 'nights', label: 'คืน', field: 'nights', align: 'center', sortable: true },
  { name: 'totalPrice', label: 'ยอดรวม', field: 'totalPrice', align: 'right', sortable: true },
  { name: 'status', label: 'สถานะ', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'จัดการ', field: 'actions', align: 'center' }
]

const getStatusColor = (status) => {
  if (status === 'Confirmed') return 'positive'
  if (status === 'Cancelled') return 'negative'
  return 'orange-8'
}

const openCreateDialog = () => {
  editingBooking.value = null
  formDialogOpen.value = true
}

const openEditDialog = (row) => {
  editingBooking.value = { ...row }
  formDialogOpen.value = true
}

const handleSave = async (payload) => {
  try {
    if (editingBooking.value && editingBooking.value.id) {
      await bookingStore.updateBooking(editingBooking.value.id, payload)
      $q.notify({
        type: 'positive',
        icon: 'sync',
        message: 'แก้ไขข้อมูลการจองเรียบร้อยแล้ว'
      })
    } else {
      await bookingStore.addBooking(payload)
      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: 'เพิ่มรายการจองใหม่เรียบร้อยแล้ว'
      })
    }
    formDialogOpen.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: bookingStore.errorMessage || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    })
  }
}

const confirmDelete = (row) => {
  targetDelete.value = row
  deleteDialogOpen.value = true
}

const executeDelete = async () => {
  if (!targetDelete.value) return
  try {
    await bookingStore.deleteBooking(targetDelete.value.id)
    deleteDialogOpen.value = false
    $q.notify({
      type: 'positive',
      icon: 'delete',
      message: 'ลบรายการจองเรียบร้อยแล้ว'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: bookingStore.errorMessage || 'ไม่สามารถลบรายการได้'
    })
  }
}

onMounted(() => {
  bookingStore.fetchBookings()
})
</script>
