<template>
  <q-card flat bordered class="room-card full-height column justify-between bg-white">
    <div>
      <div class="relative-position">
        <q-img
          :src="room.image"
          :ratio="16 / 9"
          spinner-color="primary"
        />
        <div class="absolute-top-right q-pa-sm">
          <slot name="badge">
            <q-badge color="primary" class="q-pa-xs text-weight-medium">
              {{ room.type }}
            </q-badge>
          </slot>
        </div>
      </div>

      <q-card-section>
        <div class="text-h6 text-weight-bold text-grey-9">{{ room.name }}</div>
        <div class="text-subtitle1 text-primary text-weight-bold q-mt-xs">
          {{ room.pricePerNight.toLocaleString() }} บาท / คืน
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          ขนาด {{ room.size }} | พักได้สูงสุด {{ room.maxGuests }} ท่าน
        </div>
        <div class="text-body2 text-grey-8 q-mt-sm">
          {{ room.description }}
        </div>
      </q-card-section>
    </div>

    <q-card-actions align="right" class="q-px-md q-pb-md">
      <q-btn
        flat
        color="primary"
        label="ดูรายละเอียด"
        icon="info"
        @click="onViewDetail"
      />
      <q-btn
        unelevated
        color="primary"
        label="จองห้องนี้"
        icon="book_online"
        @click="onBookRoom"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-detail', 'book-room'])

const onViewDetail = () => {
  emit('view-detail', props.room)
}

const onBookRoom = () => {
  emit('book-room', props.room)
}
</script>
