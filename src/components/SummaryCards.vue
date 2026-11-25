<template>
  <div class="row q-col-gutter-md q-mb-md">
    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="bg-white">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-caption text-grey-7">การจองทั้งหมด</div>
            <div class="text-h5 text-weight-bold text-primary">{{ totalBookings }}</div>
          </div>
          <q-avatar color="blue-1" text-color="primary" icon="event_note" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="bg-white">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-caption text-grey-7">ยืนยันแล้ว (Confirmed)</div>
            <div class="text-h5 text-weight-bold text-positive">{{ confirmedCount }}</div>
          </div>
          <q-avatar color="green-1" text-color="positive" icon="check_circle" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="bg-white">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-caption text-grey-7">รอยืนยัน (Pending)</div>
            <div class="text-h5 text-weight-bold text-orange-8">{{ pendingCount }}</div>
          </div>
          <q-avatar color="orange-1" text-color="orange-8" icon="schedule" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="bg-white">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-caption text-grey-7">ยอดรวม (บาท)</div>
            <div class="text-h5 text-weight-bold text-secondary">
              {{ totalRevenue.toLocaleString() }}
            </div>
          </div>
          <q-avatar color="teal-1" text-color="secondary" icon="payments" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalBookings: {
    type: Number,
    default: 0
  },
  confirmedCount: {
    type: Number,
    default: 0
  },
  pendingCount: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
})
</script>
