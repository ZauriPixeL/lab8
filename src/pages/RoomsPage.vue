<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStayStore } from '../stores/stay'
import { dateAfter, dateError, formatDate } from '../lib/stay'
import { messageOf } from '../boot/api'
import RoomCard from '../components/RoomCard.vue'

const route = useRoute()
const router = useRouter()
const stay = useStayStore()
const placeId = route.params.placeId
const place = computed(() => stay.places.find(item => item.id === placeId))
const guests = ref(Math.min(4, Math.max(1, Number(route.query.guests) || 1)))
const checkIn = ref(route.query.checkIn || '')
const checkOut = ref(route.query.checkOut || '')
const options = ref([])
const filtered = computed(() => options.value.filter(room => room.capacity >= guests.value))
const loading = ref(true)
const error = ref('')
const formError = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    await stay.loadPlaces()
    if (place.value) {
      options.value = await stay.findRooms({ placeId, checkIn: route.query.checkIn, checkOut: route.query.checkOut })
    }
  } catch (problem) { error.value = messageOf(problem) }
  finally { loading.value = false }
}

function searchDates() {
  formError.value = dateError(checkIn.value, checkOut.value)
  if (formError.value) return
  router.push({ name: 'rooms', params: { placeId }, query: { guests: guests.value, checkIn: checkIn.value, checkOut: checkOut.value } })
}
function resetDates() {
  checkIn.value = ''
  checkOut.value = ''
  formError.value = ''
  router.push({ name: 'rooms', params: { placeId }, query: { guests: guests.value } })
}
function book(roomId) {
  router.push({ name: 'new', params: { roomId }, query: { ...route.query, guests: guests.value } })
}
onMounted(load)
</script>

<template>
  <q-page class="container main-page">
    <router-link class="back" :to="{path:'/',query:{province:place?.province}}">‹ กลับไปเลือกที่พัก</router-link>
    <p v-if="loading" role="status" class="notice">กำลังโหลดห้องพัก…</p>
    <div v-else-if="!place && !error" class="empty panel"><h1>ไม่พบสถานที่นี้</h1><q-btn flat color="primary" label="ดูทุกสถานที่" to="/" /></div>
    <template v-else>
      <header v-if="place" class="section-heading">
        <div><h1>{{ place.name }}</h1><p class="subtext">{{ place.area }} · {{ place.setting }}</p></div>
      </header>
      <form v-if="place" class="availability" @submit.prevent="searchDates">
        <label class="field">วันเข้าพัก<input v-model="checkIn" type="date" :min="dateAfter(0)" required></label>
        <label class="field">วันออก<input v-model="checkOut" type="date" :min="dateAfter(1, checkIn ? checkIn + 'T12:00:00' : new Date())" required></label>
        <label class="field filter">ผู้เข้าพัก<select v-model.number="guests"><option v-for="n in 4" :key="n" :value="n">{{ n }} คน</option></select></label>
        <q-btn unelevated type="submit" color="primary" label="ค้นหาห้องว่าง" />
        <q-btn v-if="checkIn || checkOut || route.query.checkIn" flat type="button" color="primary" label="ล้างวันที่" @click="resetDates" />
      </form>
      <p v-if="formError" class="error" role="alert">{{ formError }}</p>
      <div v-if="error" role="alert" class="error">{{ error }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></div>
      <template v-else>
        <p class="results" aria-live="polite">
          <template v-if="route.query.checkIn">ห้องว่าง {{ formatDate(route.query.checkIn) }} – {{ formatDate(route.query.checkOut) }} · </template>พบ {{ filtered.length }} ห้อง
        </p>
        <div v-if="filtered.length" class="row q-col-gutter-lg">
          <div v-for="room in filtered" :key="room.id" class="col-12 col-sm-6 col-md-4"><RoomCard :room="room" @book="book" /></div>
        </div>
        <div v-else class="empty panel"><h2>ไม่มีห้องตรงตามที่เลือก</h2><p>ลองเปลี่ยนวันที่ จำนวนคน หรือเลือกสถานที่อื่น</p></div>
      </template>
    </template>
  </q-page>
</template>
