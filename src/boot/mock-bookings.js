import MockAdapter from 'axios-mock-adapter'
import seed from '../../db.json'

export function enableBookingMock(api) {
  const mock = new MockAdapter(api, { delayResponse: 150 })
  const key = 'stayease-demo-bookings-v1'
  const read = () => JSON.parse(localStorage.getItem(key) || JSON.stringify(seed.bookings))
  const save = rows => localStorage.setItem(key, JSON.stringify(rows))
  const item = /^\/bookings\/[^/]+$/

  mock.onGet('/bookings').reply(() => [200, read()])
  mock.onPost('/bookings').reply(request => {
    const rows = read()
    const booking = { ...JSON.parse(request.data), id: crypto.randomUUID() }
    rows.unshift(booking)
    save(rows)
    return [201, booking]
  })
  mock.onPut(item).reply(request => {
    const rows = read()
    const id = request.url.split('/').pop()
    const index = rows.findIndex(row => String(row.id) === id)
    if (index < 0) return [404]
    rows[index] = { ...rows[index], ...JSON.parse(request.data), id }
    save(rows)
    return [200, rows[index]]
  })
  mock.onDelete(item).reply(request => {
    const rows = read()
    const id = request.url.split('/').pop()
    if (!rows.some(row => String(row.id) === id)) return [404]
    save(rows.filter(row => String(row.id) !== id))
    return [204]
  })
}
