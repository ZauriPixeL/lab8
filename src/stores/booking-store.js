// src/stores/booking-store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/boot/axios'

export const useBookingStore = defineStore('bookings', () => {
  // State
  const bookings = ref([])
  const loading = ref(false)
  const errorMessage = ref('')

  // Getters
  const totalBookings = computed(() => bookings.value.length)

  const confirmedCount = computed(() => {
    return bookings.value.filter((item) => item.status === 'Confirmed').length
  })

  const pendingCount = computed(() => {
    return bookings.value.filter((item) => item.status === 'Pending').length
  })

  const totalRevenue = computed(() => {
    return bookings.value
      .filter((item) => item.status !== 'Cancelled')
      .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0)
  })

  // Helper จัดการ Error จาก AxiosError ตามบทที่ 6
  const handleError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage.value = 'Your session has expired. Please login again.'
          break
        case 404:
          errorMessage.value = 'ไม่พบข้อมูลหรือ Endpoint ที่ร้องขอ (404 Not Found)'
          break
        case 500:
          errorMessage.value = 'เซิร์ฟเวอร์เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง (500)'
          break
        default:
          errorMessage.value = `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${error.response.status})`
      }
    } else if (error.request) {
      errorMessage.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ API ได้ กรุณาตรวจสอบ QCLI_API_URL ในไฟล์ .env'
    } else {
      errorMessage.value = error.message
    }
    console.error('Booking API Error:', error)
  }

  // Actions (CRUD ผ่าน REST API / MockAPI)
  const fetchBookings = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await api.get('/bookings')
      bookings.value = response.data
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const addBooking = async (newBooking) => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await api.post('/bookings', newBooking)
      bookings.value.unshift(response.data)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateBooking = async (id, updatedData) => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await api.put(`/bookings/${id}`, updatedData)
      const index = bookings.value.findIndex((item) => String(item.id) === String(id))
      if (index !== -1) {
        bookings.value[index] = response.data
      }
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteBooking = async (id) => {
    loading.value = true
    errorMessage.value = ''
    try {
      await api.delete(`/bookings/${id}`)
      bookings.value = bookings.value.filter((item) => String(item.id) !== String(id))
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    errorMessage,
    totalBookings,
    confirmedCount,
    pendingCount,
    totalRevenue,
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking
  }
})
