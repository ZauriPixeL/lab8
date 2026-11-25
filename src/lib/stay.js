export function dateAfter(days, start = new Date()) {
  const date = new Date(start)
  date.setDate(date.getDate() + days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function nightsBetween(start, end) {
  // วันที่แบบ YYYY-MM-DD ถูกแปลงเป็น UTC จึงไม่นับเศษชั่วโมง
  return (Date.parse(end) - Date.parse(start)) / 86400000
}

export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(value + 'T12:00:00'))
}

export function money(value) {
  return '฿' + value.toLocaleString('th-TH')
}

export function bookingError(input, room) {
  if (!room) return 'กรุณาเลือกห้องพัก'
  if (!input.guestName?.trim() || input.guestName.trim().length > 50) return 'กรุณาระบุชื่อผู้จอง 1–50 ตัวอักษร'
  if (!validDate(input.checkIn) || !validDate(input.checkOut)) return 'กรุณาระบุวันที่ให้ครบถ้วน'
  if (input.checkIn < dateAfter(0)) return 'วันเข้าพักต้องเป็นวันนี้หรือวันถัดไป'
  if (input.checkOut <= input.checkIn) return 'วันออกต้องอยู่หลังวันเข้าพัก'
  if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > room.capacity) {
    return 'จำนวนผู้เข้าพักต้องอยู่ระหว่าง 1 ถึง ' + room.capacity + ' คน'
  }
  return ''
}
