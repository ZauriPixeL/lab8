<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStayStore } from '../stores/stay'
import { messageOf } from '../boot/api'
import RoomCard from '../components/RoomCard.vue'

const stay = useStayStore()
const router = useRouter()
const guests = ref(1)
const loading = ref(true)
const error = ref('')
const filtered = computed(() => stay.rooms.filter(room => room.capacity >= guests.value))

async function load() {
  loading.value = true
  error.value = ''
  try { await stay.loadRooms() }
  catch (problem) { error.value = messageOf(problem) }
  finally { loading.value = false }
}
function book(roomId) {
  router.push({ name: 'new', params: { roomId }, query: { guests: guests.value } })
}
onMounted(load)
</script>

<template>
  <q-page class="container main-page">
    <header class="hero">
      <div><p class="eyebrow">Banrim Stay</p><h1>เลือกห้องพัก</h1><p>ดูผังห้อง เปรียบเทียบราคา แล้วเลือกวันเข้าพัก</p></div>
    </header>
    <section aria-labelledby="rooms-title">
      <div class="section-heading"><div><h2 id="rooms-title">ห้องพักของเรา</h2>
        <p class="subtext" aria-live="polite" v-if="!loading && !error">พบ {{ filtered.length }} ห้อง</p></div>
        <label class="filter">ผู้เข้าพัก <select v-model.number="guests"><option v-for="n in 4" :key="n" :value="n">{{ n }} คน</option></select></label>
      </div>
      <p v-if="loading" class="notice" role="status"><q-spinner /> กำลังโหลดห้องพัก…</p>
      <div v-else-if="error" class="error" role="alert">{{ error }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></div>
      <div v-else class="row q-col-gutter-lg"><div v-for="room in filtered" :key="room.id" class="col-12 col-sm-6 col-md-4">
        <RoomCard :room="room" @book="book" />
      </div></div>
    </section>
  </q-page>
</template>
