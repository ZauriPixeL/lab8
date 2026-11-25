<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStayStore } from '../stores/stay'
import { money } from '../lib/stay'
import { messageOf } from '../boot/api'

const stay = useStayStore()
const search = ref('')
const loading = ref(true)
const error = ref('')
const filtered = computed(() => {
  const word = search.value.trim()
  return stay.places.filter(place => [place.name, place.area, place.setting].some(text => text.includes(word)))
})
async function load() {
  loading.value = true
  error.value = ''
  try { await stay.loadPlaces() }
  catch (problem) { error.value = messageOf(problem) }
  finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <q-page class="container main-page">
    <div class="section-heading place-heading">
      <div><h1>เลือกสถานที่พัก</h1><p class="subtext">อยากไปที่ไหน เลือกดูห้องพักได้เลย</p></div>
      <label class="search-field">ค้นหาสถานที่
        <input v-model="search" type="search" placeholder="เช่น กระบี่ หรือ ทะเล">
      </label>
    </div>
    <p v-if="loading" class="notice" role="status">กำลังโหลดสถานที่…</p>
    <p v-else-if="error" class="error" role="alert">{{ error }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></p>
    <div v-else-if="!filtered.length" class="empty panel">
      <h2>ไม่พบสถานที่ที่ค้นหา</h2><q-btn outline color="primary" label="ดูทุกสถานที่" @click="search = ''" />
    </div>
    <div v-else class="places-grid">
      <article v-for="place in filtered" :key="place.id" class="place-card">
        <router-link class="place-link" :to="{ name: 'rooms', params: { placeId: place.id } }" :aria-label="'ดูห้องพักที่' + place.name">
          <img class="place-photo" :src="'./places/' + place.id + '.webp'" :alt="place.imageAlt">
          <div class="place-info">
            <div class="place-meta">{{ place.area }} · {{ place.setting }}</div>
            <h2>{{ place.name }}</h2>
            <p class="place-price">เริ่มต้น <strong>{{ money(place.from) }}</strong> / คืน</p>
            <div class="place-action"><span>{{ place.count }} ห้องพัก</span><b>ดูห้องพัก</b></div>
          </div>
        </router-link>
      </article>
    </div>
  </q-page>
</template>
