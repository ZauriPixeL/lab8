<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStayStore } from '../stores/stay'
import { useAuthStore } from '../stores/auth'
import { formatDate, money } from '../lib/stay'
import { messageOf } from '../boot/api'

const stay = useStayStore()
const auth = useAuthStore()
const quasar = useQuasar()
const loading = ref(true)
const error = ref('')
const selected = ref(null)
const confirmOpen = ref(false)
const removing = ref(false)
const removeError = ref('')
async function load() {
  loading.value = true
  error.value = ''
  try { await stay.loadBookings() }
  catch (problem) { error.value = messageOf(problem) }
  finally { loading.value = false }
}
function askRemove(item) {
  selected.value = item
  removeError.value = ''
  confirmOpen.value = true
}
async function remove() {
  removing.value = true
  try {
    await stay.remove(selected.value.id)
    confirmOpen.value = false
    quasar.notify('ลบการจองแล้ว')
  } catch (problem) { removeError.value = messageOf(problem) }
  finally { removing.value = false }
}
onMounted(load)
</script>

<template>
  <q-page class="container main-page inner-page">
    <header class="section-heading account-heading"><div><p class="eyebrow">Guest book</p><h1>การจองของฉัน</h1>
      <p class="subtext">บัญชี {{ auth.user?.username }}</p></div><q-btn color="primary" unelevated label="เลือกห้องพัก" to="/" /></header>
    <p v-if="loading" class="notice" role="status"><q-spinner /> กำลังโหลดรายการจอง…</p>
    <div v-else-if="error" class="error" role="alert">{{ error }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></div>
    <div v-else-if="!stay.bookings.length" class="empty panel">
      <span class="empty-mark" aria-hidden="true">⌂</span><h2>ยังไม่มีรายการจอง</h2><p>เลือกห้องพักและวันเข้าพักเพื่อสร้างรายการแรก</p>
      <q-btn outline color="primary" label="ดูห้องพัก" to="/" />
    </div>
    <div v-else class="stack">
      <article v-for="item in stay.sortedBookings" :key="item.id" class="reservation panel">
        <img :src="'./rooms/' + item.roomId + '.webp'" :alt="'แผนผัง ' + item.roomName">
        <div class="reservation-info"><p class="eyebrow">ห้อง {{ item.roomId }} · #{{ item.id.slice(0, 6).toUpperCase() }}</p>
          <h2>{{ item.roomName }}</h2>
          <p>{{ formatDate(item.checkIn) }} – {{ formatDate(item.checkOut) }} <span>({{ item.nights }} คืน)</span></p>
          <p class="subtext">{{ item.guestName }} · {{ item.guests }} คน</p>
        </div>
        <div class="reservation-end"><strong>{{ money(item.total) }}</strong>
          <div class="actions"><q-btn outline color="primary" label="แก้ไข" :to="{ name: 'edit', params: { id: item.id } }" />
            <q-btn flat color="negative" label="ลบ" @click="askRemove(item)" /></div>
        </div>
      </article>
    </div>
    <q-dialog v-model="confirmOpen" :persistent="removing">
      <q-card v-if="selected" class="confirm-box"><p class="eyebrow">Reservation</p><h2>ลบรายการจองนี้?</h2>
        <p>{{ selected.roomName }} · {{ selected.guestName }}<br>{{ formatDate(selected.checkIn) }} – {{ formatDate(selected.checkOut) }}</p>
        <p v-if="removeError" role="alert" class="error">{{ removeError }}</p>
        <div class="actions"><q-btn outline label="เก็บรายการไว้" :disable="removing" @click="confirmOpen = false" />
          <q-btn unelevated color="negative" label="ยืนยันลบ" :loading="removing" @click="remove" /></div>
      </q-card>
    </q-dialog>
  </q-page>
</template>
