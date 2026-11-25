<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStayStore } from '../stores/stay'
import { bookingError, dateAfter, dateError, money, nightsBetween } from '../lib/stay'
import { messageOf } from '../boot/api'

const route = useRoute()
const router = useRouter()
const quasar = useQuasar()
const stay = useStayStore()
const id = route.params.id
const busy = ref(true)
const saving = ref(false)
const loadError = ref('')
const error = ref('')
const form = reactive({ roomId: '', guestName: '', guests: 1, checkIn: dateAfter(1), checkOut: dateAfter(2) })
const room = computed(() => stay.rooms.find(item => item.id === form.roomId))
const place = computed(() => stay.places.find(item => item.id === room.value?.placeId))
const roomsAtPlace = computed(() => stay.rooms.filter(item => item.placeId === room.value?.placeId))
const backTo = computed(() => {
  if (id) return '/bookings'
  if (!place.value) return '/'
  return { name: 'rooms', params: { placeId: place.value.id }, query: route.query }
})
const nights = computed(() => Math.max(0, nightsBetween(form.checkIn, form.checkOut)) || 0)
const total = computed(() => nights.value * (room.value?.price || 0))
watch(room, selected => {
  if (selected && form.guests > selected.capacity) form.guests = selected.capacity
})
watch(() => [form.roomId, form.guests, form.guestName, form.checkIn, form.checkOut], () => { error.value = '' })

async function load() {
  busy.value = true
  loadError.value = ''
  try {
    await Promise.all([stay.loadPlaces(), stay.loadRooms()])
    if (id) {
      await stay.loadBookings()
      const item = stay.bookings.find(booking => booking.id === id)
      if (!item) { loadError.value = 'ไม่พบรายการจองของคุณ'; return }
      for (const field of Object.keys(form)) form[field] = item[field]
    } else {
      form.roomId = route.params.roomId
      if (!room.value) { loadError.value = 'ไม่พบห้องพักที่เลือก'; return }
      const { checkIn, checkOut } = route.query
      if (!dateError(checkIn, checkOut)) {
        form.checkIn = checkIn
        form.checkOut = checkOut
      }
      const guests = Number(route.query.guests)
      form.guests = Number.isInteger(guests) && guests > 0 && guests <= room.value.capacity ? guests : 1
    }
  } catch (problem) { loadError.value = messageOf(problem) }
  finally { busy.value = false }
}
async function save() {
  error.value = bookingError(form, room.value)
  if (error.value || saving.value) return
  saving.value = true
  try {
    await stay.save(form, id)
    quasar.notify(id ? 'บันทึกการแก้ไขแล้ว' : 'จองห้องพักสำเร็จ')
    await router.push({ name: 'bookings' })
  } catch (problem) { error.value = messageOf(problem) }
  finally { saving.value = false }
}
onMounted(load)
</script>

<template>
  <q-page class="container main-page inner-page">
    <router-link class="back" :to="backTo">{{ id ? '‹ การจองของฉัน' : '‹ ห้องพักที่เลือก' }}</router-link>
    <h1>{{ id ? 'แก้ไขการจอง' : 'จองห้องพัก' }}</h1>
    <p v-if="place" class="subtext">{{ place.name }} · {{ place.area }}</p>
    <p v-if="busy" class="notice" role="status"><q-spinner /> กำลังโหลด…</p>
    <div v-else-if="loadError" class="error" role="alert">{{ loadError }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></div>
    <div v-else-if="room" class="booking-grid">
      <q-form class="panel stack" @submit="save">
        <h2>ข้อมูลผู้เข้าพัก</h2>
        <label class="field">ห้องพัก
          <select v-model="form.roomId"><option v-for="item in roomsAtPlace" :key="item.id" :value="item.id">{{ item.id }} · {{ item.name }}</option></select>
        </label>
        <q-input v-model.trim="form.guestName" outlined label="ชื่อผู้จอง (ใช้ชื่อเล่นได้)" required maxlength="50" />
        <div class="date-grid">
          <label class="field">วันเข้าพัก<input v-model="form.checkIn" type="date" :min="dateAfter(0)" required></label>
          <label class="field">วันออก<input v-model="form.checkOut" type="date" :min="form.checkIn ? dateAfter(1, form.checkIn + 'T12:00:00') : dateAfter(1)" required></label>
        </div>
        <label class="field">จำนวนผู้เข้าพัก
          <select v-model.number="form.guests"><option v-for="n in room.capacity" :key="n" :value="n">{{ n }} คน</option></select>
        </label>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <div class="actions"><q-btn type="submit" color="primary" unelevated :loading="saving" :label="id ? 'บันทึกการแก้ไข' : 'ยืนยันการจอง'" />
          <q-btn flat label="ย้อนกลับ" :to="backTo" /></div>
      </q-form>
      <aside class="room-card summary">
        <div class="plan"><img :src="'./rooms/' + room.plan + '.webp'" :alt="'แผนผังของ' + room.name"><span class="room-tag">ห้อง {{ room.id }}</span></div>
        <div class="card-body"><h2>{{ room.name }}</h2><p class="subtext">{{ room.detail }}</p>
          <dl class="bill"><div><dt>ราคาต่อคืน</dt><dd>{{ money(room.price) }}</dd></div><div><dt>จำนวนคืน</dt><dd>{{ nights }} คืน</dd></div>
            <div class="bill-total"><dt>ยอดรวม</dt><dd aria-live="polite">{{ money(total) }}</dd></div></dl>
        </div>
      </aside>
    </div>
  </q-page>
</template>
