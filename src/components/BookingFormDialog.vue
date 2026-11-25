<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="width: 100%; max-width: 520px; border-radius: 12px;">
      <q-card-section class="bg-primary text-white row items-center justify-between">
        <div class="text-h6 text-weight-bold">
          {{ isEdit ? 'แก้ไขข้อมูลการจองห้องพัก' : 'สร้างรายการจองห้องพักใหม่' }}
        </div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="bookingForm" class="q-gutter-sm">
          <q-input
            v-model="form.guestName"
            label="ชื่อ-นามสกุล ผู้เข้าพัก"
            outlined
            dense
            :rules="[val => !!val && val.trim().length > 0 || 'กรุณากรอกชื่อผู้เข้าพัก']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="form.phone"
            label="เบอร์โทรศัพท์ติดต่อ"
            outlined
            dense
            placeholder="เช่น 081-234-5678"
            :rules="[val => !!val && val.trim().length >= 9 || 'กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 9 หลัก']"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="primary" />
            </template>
          </q-input>

          <q-select
            v-model="form.roomId"
            :options="roomOptions"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            label="เลือกห้องพัก"
            outlined
            dense
            :rules="[val => !!val || 'กรุณาเลือกห้องพัก']"
          >
            <template v-slot:prepend>
              <q-icon name="hotel" color="primary" />
            </template>
          </q-select>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.checkIn"
                type="date"
                label="วันที่เช็กอิน"
                outlined
                dense
                :rules="[val => !!val || 'กรุณาเลือกวันที่เช็กอิน']"
              />
            </div>

            <div class="col-6 col-sm-3">
              <q-input
                v-model.number="form.nights"
                type="number"
                label="จำนวนคืน"
                outlined
                dense
                :rules="[
                  val => (val !== null && val !== '') || 'ระบุจำนวนคืน',
                  val => (val >= 1 && val <= 30) || '1-30 คืน'
                ]"
              />
            </div>

            <div class="col-6 col-sm-3">
              <q-input
                v-model.number="form.guests"
                type="number"
                label="จำนวนคน"
                outlined
                dense
                :rules="[
                  val => (val !== null && val !== '') || 'ระบุจำนวนคน',
                  val => (val >= 1 && val <= 6) || '1-6 คน'
                ]"
              />
            </div>
          </div>

          <q-select
            v-if="showStatusField"
            v-model="form.status"
            :options="['Pending', 'Confirmed', 'Cancelled']"
            label="สถานะการจอง"
            outlined
            dense
          />

          <q-input
            v-model="form.note"
            label="หมายเหตุเพิ่มเติม (ถ้ามี)"
            type="textarea"
            rows="2"
            outlined
            dense
          />

          <q-banner class="bg-blue-1 text-primary rounded-borders q-mt-sm">
            <div class="row items-center justify-between">
              <div class="text-subtitle2">ยอดชำระโดยประมาณ</div>
              <div class="text-h6 text-weight-bold">
                {{ calculatedTotal.toLocaleString() }} บาท
              </div>
            </div>
          </q-banner>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="ยกเลิก" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          :label="isEdit ? 'บันทึกการแก้ไข' : 'ยืนยันการจอง'"
          :loading="submitting"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { roomsData } from '@/data/rooms'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  },
  preselectedRoomId: {
    type: Number,
    default: null
  },
  showStatusField: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const bookingForm = ref(null)
const calculatedTotal = ref(0)

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

const form = ref({
  guestName: '',
  phone: '',
  roomId: 1,
  checkIn: getTodayDate(),
  nights: 1,
  guests: 2,
  status: 'Pending',
  note: ''
})

const isEdit = computed(() => Boolean(props.initialData && props.initialData.id))

const roomOptions = computed(() => {
  return roomsData.map((r) => ({
    id: r.id,
    label: `${r.name} (${r.pricePerNight.toLocaleString()} บาท/คืน)`
  }))
})

// ใช้ watch คำนวณราคารวมอัตโนมัติเมื่อเปลี่ยนห้องพักหรือจำนวนคืน (บทที่ 3)
watch(
  [() => form.value.roomId, () => form.value.nights],
  ([newRoomId, newNights]) => {
    const selectedRoom = roomsData.find((r) => r.id === Number(newRoomId))
    const nights = Number(newNights) > 0 ? Number(newNights) : 0
    calculatedTotal.value = selectedRoom ? selectedRoom.pricePerNight * nights : 0
  },
  { immediate: true }
)

// เตรียมข้อมูลในฟอร์มทุกครั้งที่เปิด Dialog
watch(
  () => props.modelValue,
  async (opened) => {
    if (!opened) return

    if (props.initialData) {
      form.value = {
        guestName: props.initialData.guestName || '',
        phone: props.initialData.phone || '',
        roomId: Number(props.initialData.roomId) || 1,
        checkIn: props.initialData.checkIn || getTodayDate(),
        nights: Number(props.initialData.nights) || 1,
        guests: Number(props.initialData.guests) || 2,
        status: props.initialData.status || 'Pending',
        note: props.initialData.note || ''
      }
    } else {
      form.value = {
        guestName: '',
        phone: '',
        roomId: props.preselectedRoomId || 1,
        checkIn: getTodayDate(),
        nights: 1,
        guests: 2,
        status: 'Pending',
        note: ''
      }
    }

    await nextTick()
    if (bookingForm.value) {
      bookingForm.value.resetValidation()
    }
  }
)

const onSubmit = async () => {
  if (!bookingForm.value) return
  const valid = await bookingForm.value.validate()
  if (!valid) return

  const selectedRoom = roomsData.find((r) => r.id === Number(form.value.roomId))
  const payload = {
    guestName: form.value.guestName.trim(),
    phone: form.value.phone.trim(),
    roomId: selectedRoom.id,
    roomName: selectedRoom.name,
    roomType: selectedRoom.type,
    checkIn: form.value.checkIn,
    nights: Number(form.value.nights),
    guests: Number(form.value.guests),
    totalPrice: calculatedTotal.value,
    status: form.value.status,
    note: form.value.note.trim()
  }

  emit('save', payload)
}
</script>
