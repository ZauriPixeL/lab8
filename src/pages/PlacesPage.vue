<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStayStore } from '../stores/stay'
import { useRoute } from 'vue-router'
import { money } from '../lib/stay'
import { messageOf } from '../boot/api'

const stay = useStayStore()
const route = useRoute()
const province = computed(() => route.query.province || '')
const provinces = computed(() => [...new Set(stay.places.map(p => p.province))])
const loading = ref(true)
const error = ref('')
const filtered = computed(() => {
  return stay.places.filter(place => place.province === province.value)
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
    <header class="destination-hero" v-if="!province"><h1>เลือกจังหวัด</h1></header>
    <header class="hotel-title" v-else><router-link to="/">‹ ทุกจังหวัด</router-link><h1>ที่พักใน{{ province }}</h1></header>
    <p v-if="loading" class="notice" role="status">กำลังโหลดสถานที่…</p>
    <p v-else-if="error" class="error" role="alert">{{ error }} <q-btn flat label="ลองอีกครั้ง" @click="load" /></p>
    <div v-else-if="!province" class="province-grid">
      <router-link v-for="name in provinces" :key="name" class="province-row" :to="{query:{province:name}}">
        <strong>{{ name }}</strong><span>{{ stay.places.filter(p => p.province === name).length }} ที่พัก ›</span>
      </router-link>
    </div>
    <div v-else class="places-grid">
      <article v-for="place in filtered" :key="place.id" class="place-card">
        <router-link class="place-link" :to="{ name: 'rooms', params: { placeId: place.id } }" :aria-label="'ดูห้องพักที่' + place.name">

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
