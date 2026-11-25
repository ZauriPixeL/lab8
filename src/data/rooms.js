// src/data/rooms.js
export const roomsData = [
  {
    id: 1,
    name: 'Standard Twin Room',
    type: 'Standard',
    pricePerNight: 1200,
    maxGuests: 2,
    size: '28 ตร.ม.',
    bedType: 'เตียงเดี่ยว 2 เตียง',
    image: '/images/room-standard.svg',
    amenities: ['Wi-Fi ความเร็วสูง', 'เครื่องปรับอากาศ', 'ทีวีจอแบน', 'ตู้เย็น'],
    description: 'ห้องพักขนาดกะทัดรัด ตกแต่งเรียบง่าย สะอาดตา เหมาะสำหรับการเดินทางพักผ่อนหรือมาทำงานในตัวเมือง'
  },
  {
    id: 2,
    name: 'Deluxe Sea View',
    type: 'Deluxe',
    pricePerNight: 2200,
    maxGuests: 2,
    size: '38 ตร.ม.',
    bedType: 'เตียงคิงไซส์ 1 เตียง',
    image: '/images/room-deluxe.svg',
    amenities: ['ระเบียงชมวิวทะเล', 'Wi-Fi ความเร็วสูง', 'อ่างอาบน้ำ', 'อาหารเช้า 2 ท่าน'],
    description: 'ห้องพักกว้างขวางพร้อมระเบียงส่วนตัว มองเห็นวิวทะเลชัดเจน เหมาะสำหรับคู่รักหรือการพักผ่อนช่วงวันหยุด'
  },
  {
    id: 3,
    name: 'Executive Pool Suite',
    type: 'Suite',
    pricePerNight: 3800,
    maxGuests: 3,
    size: '54 ตร.ม.',
    bedType: 'เตียงคิงไซส์ + โซฟาเบด',
    image: '/images/room-suite.svg',
    amenities: ['ทางลงสระว่ายน้ำส่วนตัว', 'ห้องนั่งเล่นแยกส่วน', 'เครื่องชงกาแฟ', 'อาหารเช้า 2 ท่าน'],
    description: 'ห้องสวีทระดับพรีเมียม แยกโซนห้องนั่งเล่นและห้องนอนเป็นสัดส่วน พร้อมสิทธิ์เข้าใช้สระว่ายน้ำจากระเบียงห้อง'
  },
  {
    id: 4,
    name: 'Family Garden Room',
    type: 'Family',
    pricePerNight: 3200,
    maxGuests: 4,
    size: '48 ตร.ม.',
    bedType: 'เตียงใหญ่ 2 เตียง',
    image: '/images/room-family.svg',
    amenities: ['วิวสวนร่มรื่น', 'Wi-Fi ความเร็วสูง', 'ไมโครเวฟและกาน้ำร้อน', 'อาหารเช้า 4 ท่าน'],
    description: 'ห้องพักสำหรับครอบครัว รองรับผู้เข้าพักได้สูงสุด 4 ท่าน บรรยากาศเงียบสงบติดสวนหย่อมของโรงแรม'
  }
]
