// Mock API สำหรับ Lab ข้อมูลเก็บใน IndexedDB ของเบราว์เซอร์ที่ใช้งาน
import MockAdapter from 'axios-mock-adapter'
import { openDB } from 'idb'
import { rooms } from './rooms'
import { bookingError, nightsBetween } from '../lib/stay'

const users = [
  { username: 'demo', password: 'stay1234', name: 'นักเดินทาง' },
  { username: 'guest2', password: 'stay1234', name: 'ผู้เข้าพักคนที่สอง' }
]

const dbReady = openDB('banrim-stay-v1', 1, {
  upgrade(db) {
    db.createObjectStore('bookings', { keyPath: 'id' })
    db.createObjectStore('sessions', { keyPath: 'token' })
  }
})

function error(status, message) {
  return [status, { message }]
}

async function sessionOf(request) {
  const token = request.headers.Authorization?.replace(/^Bearer /, '')
  if (!token) return null
  const db = await dbReady
  const session = await db.get('sessions', token)
  if (session && session.expires > Date.now()) return session
  return null
}

function memberOnly(action) {
  return async request => {
    const session = await sessionOf(request)
    if (!session) return error(401, 'กรุณาเข้าสู่ระบบอีกครั้ง')
    return action(request, session, await dbReady)
  }
}

async function saveBooking(request, session, db) {
  const input = JSON.parse(request.data)
  const room = rooms.find(item => item.id === input.roomId)
  const message = bookingError(input, room)
  if (message) return error(400, message)

  // ตรวจห้องซ้อนและบันทึกในธุรกรรมเดียวกัน แม้เปิดไว้สองแท็บ
  const tx = db.transaction('bookings', 'readwrite')
  const bookings = await tx.store.getAll()
  const editing = request.method === 'put'
  const id = editing ? request.url.split('/').pop() : crypto.randomUUID()
  if (editing && !bookings.some(item => item.id === id && item.owner === session.username)) {
    return error(404, 'ไม่พบรายการจองของคุณ')
  }
  const overlaps = bookings.some(item => item.id !== id && item.roomId === room.id
    && input.checkIn < item.checkOut && input.checkOut > item.checkIn)
  if (overlaps) return error(409, 'ห้องนี้มีผู้จองในช่วงวันที่เลือก กรุณาเปลี่ยนห้องหรือวันพัก')

  const nights = nightsBetween(input.checkIn, input.checkOut)
  const booking = {
    id, owner: session.username, roomId: room.id, roomName: room.name,
    guestName: input.guestName.trim(), guests: input.guests,
    checkIn: input.checkIn, checkOut: input.checkOut, nights, total: nights * room.price
  }
  await tx.store.put(booking)
  await tx.done
  return [editing ? 200 : 201, booking]
}

export function enableMock(api) {
  const mock = new MockAdapter(api, { delayResponse: 180 })
  mock.onGet('/rooms').reply(200, rooms)
  mock.onPost('/auth/login').reply(async request => {
    const input = JSON.parse(request.data)
    const user = users.find(item => item.username === input.username && item.password === input.password)
    if (!user) return error(401, 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    const session = {
      username: user.username, name: user.name, token: crypto.randomUUID(),
      expires: Date.now() + 8 * 60 * 60 * 1000
    }
    const db = await dbReady
    await db.put('sessions', session)
    return [200, session]
  })
  mock.onGet('/auth/me').reply(memberOnly((request, session) => [200, session]))
  mock.onPost('/auth/logout').reply(memberOnly(async (request, session, db) => {
    await db.delete('sessions', session.token)
    return [204]
  }))
  mock.onGet('/bookings').reply(memberOnly(async (request, session, db) => {
    const bookings = await db.getAll('bookings')
    return [200, bookings.filter(item => item.owner === session.username)]
  }))
  mock.onPost('/bookings').reply(memberOnly(saveBooking))
  mock.onPut(/^\/bookings\/[^/]+$/).reply(memberOnly(saveBooking))
  mock.onDelete(/^\/bookings\/[^/]+$/).reply(memberOnly(async (request, session, db) => {
    const id = request.url.split('/').pop()
    const tx = db.transaction('bookings', 'readwrite')
    const item = await tx.store.get(id)
    if (item?.owner !== session.username) return error(404, 'ไม่พบรายการจองของคุณ')
    await tx.store.delete(id)
    await tx.done
    return [204]
  }))
  mock.onAny().reply(404, { message: 'ไม่พบ API ที่เรียก' })
}
