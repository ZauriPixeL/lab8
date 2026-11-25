<script setup>
import { money } from '../lib/stay'
defineProps({ room: { type: Object, required: true } })
defineEmits(['book'])
</script>

<template>
  <article class="room-card">
    <div class="plan">
      <img :src="'./rooms/' + room.id + '.webp'" :alt="'แผนผัง ' + room.name + ' ' + room.beds">
      <span class="room-tag">ห้อง {{ room.id }}</span>
    </div>
    <div class="card-body">
      <p class="eyebrow">{{ room.english }}</p>
      <h2>{{ room.name }}</h2>
      <p class="specs">{{ room.beds }} <i>·</i> {{ room.capacity }} คน <i>·</i> {{ room.area }} ตร.ม.</p>
      <div class="card-bottom">
        <span><strong>{{ money(room.price) }}</strong><small> / คืน</small></span>
        <q-btn unelevated no-caps color="primary" label="จองห้องนี้" @click="$emit('book', room.id)" />
      </div>
    </div>
  </article>
</template>
