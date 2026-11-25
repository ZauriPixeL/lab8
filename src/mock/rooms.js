export const places = [
  { id: 'chiang-mai', name: 'เชียงใหม่', area: 'จอมทอง', setting: 'ภูเขา', imageAlt: 'วิวภูเขาจากดอยอินทนนท์' },
  { id: 'krabi', name: 'กระบี่', area: 'อ่าวนาง', setting: 'ทะเล', imageAlt: 'หน้าผาหินปูนและทะเลที่ไร่เลย์' },
  { id: 'khao-yai', name: 'เขาใหญ่', area: 'ปากช่อง', setting: 'ป่าและทุ่งหญ้า', imageAlt: 'แนวป่าและทุ่งหญ้าในเขาใหญ่' }
]

// plan คือเลขผังห้อง ห้องที่จัดเตียงแบบเดียวกันใช้ภาพร่วมกัน
export const rooms = [
  { id: '101', placeId: 'chiang-mai', plan: '101', name: 'ห้องริมสวน', capacity: 2, beds: 'เตียงควีน 1 เตียง', area: 24, price: 790, detail: 'มีโต๊ะเขียนหนังสือริมหน้าต่าง' },
  { id: '102', placeId: 'chiang-mai', plan: '102', name: 'ห้องริมลม', capacity: 2, beds: 'เตียงเดี่ยว 2 เตียง', area: 28, price: 990, detail: 'เตียงแยกสำหรับคนที่อยากนอนคนละเตียง' },
  { id: '103', placeId: 'chiang-mai', plan: '103', name: 'ห้องริมธาร', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1490, detail: 'มีพื้นที่นั่งเล่นและโต๊ะกินข้าว' },
  { id: '201', placeId: 'krabi', plan: '102', name: 'ห้องลมทะเล', capacity: 2, beds: 'เตียงเดี่ยว 2 เตียง', area: 28, price: 950, detail: 'ห้องเตียงแยกพร้อมมุมวางสัมภาระ' },
  { id: '202', placeId: 'krabi', plan: '103', name: 'ห้องครอบครัว', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1690, detail: 'มีโต๊ะกลางสำหรับกินข้าวด้วยกัน' },
  { id: '301', placeId: 'khao-yai', plan: '101', name: 'ห้องริมป่า', capacity: 2, beds: 'เตียงควีน 1 เตียง', area: 24, price: 890, detail: 'โต๊ะทำงานอยู่ข้างหน้าต่าง' },
  { id: '302', placeId: 'khao-yai', plan: '103', name: 'ห้องชมเขา', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1590, detail: 'มีพื้นที่นั่งเล่นสำหรับครอบครัว' }
]
