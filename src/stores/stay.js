import { defineStore } from 'pinia'
import { api } from '../boot/api'

export const useStayStore = defineStore('stay', {
  state: () => ({ rooms: [], bookings: [] }),
  getters: {
    sortedBookings: state => [...state.bookings].sort((a, b) => a.checkIn.localeCompare(b.checkIn))
  },
  actions: {
    async loadRooms() {
      this.rooms = (await api.get('/rooms')).data
    },
    async loadBookings() {
      this.bookings = (await api.get('/bookings')).data
    },
    async save(input, id) {
      if (id) await api.put('/bookings/' + id, input)
      else await api.post('/bookings', input)
    },
    async remove(id) {
      await api.delete('/bookings/' + id)
      this.bookings = this.bookings.filter(item => item.id !== id)
    }
  }
})
