export const places = [
  {
    "id": "chiang-mai",
    "province": "เชียงใหม่",
    "name": "บ้านสวนจอมทอง",
    "area": "จอมทอง",
    "setting": "บ้านพัก"
  },
  {
    "id": "krabi",
    "province": "กระบี่",
    "name": "โรงแรมลมอ่าวนาง",
    "area": "อ่าวนาง",
    "setting": "โรงแรม"
  },
  {
    "id": "khao-yai",
    "province": "นครราชสีมา",
    "name": "บ้านริมป่าเขาใหญ่",
    "area": "ปากช่อง",
    "setting": "บ้านพัก"
  },
  {
    "id": "ping",
    "province": "เชียงใหม่",
    "name": "โรงแรมริมปิง",
    "area": "เมืองเชียงใหม่",
    "setting": "โรงแรม"
  },
  {
    "id": "nimman",
    "province": "เชียงใหม่",
    "name": "บ้านซอยนิมมาน",
    "area": "นิมมานเหมินท์",
    "setting": "เกสต์เฮาส์"
  },
  {
    "id": "lantahome",
    "province": "กระบี่",
    "name": "บ้านพักเกาะลันตา",
    "area": "เกาะลันตา",
    "setting": "บ้านพัก"
  },
  {
    "id": "krabitown",
    "province": "กระบี่",
    "name": "โรงแรมถนนคนเดิน",
    "area": "เมืองกระบี่",
    "setting": "โรงแรม"
  },
  {
    "id": "korat",
    "province": "นครราชสีมา",
    "name": "โรงแรมหน้าสถานี",
    "area": "เมืองนครราชสีมา",
    "setting": "โรงแรม"
  },
  {
    "id": "wangnam",
    "province": "นครราชสีมา",
    "name": "บ้านพักวังน้ำเขียว",
    "area": "วังน้ำเขียว",
    "setting": "บ้านพัก"
  }
]

export const rooms = [
  { id: '101', placeId: 'chiang-mai', plan: '101', name: 'ห้องริมสวน', capacity: 2, beds: 'เตียงควีน 1 เตียง', area: 24, price: 790, detail: 'มีโต๊ะเขียนหนังสือริมหน้าต่าง' },
  { id: '102', placeId: 'chiang-mai', plan: '102', name: 'ห้องริมลม', capacity: 2, beds: 'เตียงเดี่ยว 2 เตียง', area: 28, price: 990, detail: 'เตียงแยกสำหรับคนที่อยากนอนคนละเตียง' },
  { id: '103', placeId: 'chiang-mai', plan: '103', name: 'ห้องริมธาร', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1490, detail: 'มีพื้นที่นั่งเล่นและโต๊ะกินข้าว' },
  { id: '201', placeId: 'krabi', plan: '102', name: 'ห้องลมทะเล', capacity: 2, beds: 'เตียงเดี่ยว 2 เตียง', area: 28, price: 950, detail: 'ห้องเตียงแยกพร้อมมุมวางสัมภาระ' },
  { id: '202', placeId: 'krabi', plan: '103', name: 'ห้องครอบครัว', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1690, detail: 'มีโต๊ะกลางสำหรับกินข้าวด้วยกัน' },
  { id: '301', placeId: 'khao-yai', plan: '101', name: 'ห้องริมป่า', capacity: 2, beds: 'เตียงควีน 1 เตียง', area: 24, price: 890, detail: 'โต๊ะทำงานอยู่ข้างหน้าต่าง' },
  { id: '302', placeId: 'khao-yai', plan: '103', name: 'ห้องชมเขา', capacity: 4, beds: 'เตียงควีน 2 เตียง', area: 40, price: 1590, detail: 'มีพื้นที่นั่งเล่นสำหรับครอบครัว' },
  {"id": "401", "placeId": "ping", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 920, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "402", "placeId": "ping", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1070, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"},
  {"id": "501", "placeId": "nimman", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 990, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "502", "placeId": "nimman", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1140, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"},
  {"id": "601", "placeId": "lantahome", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 1060, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "602", "placeId": "lantahome", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1210, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"},
  {"id": "701", "placeId": "krabitown", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 1130, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "702", "placeId": "krabitown", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1280, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"},
  {"id": "801", "placeId": "korat", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 1200, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "802", "placeId": "korat", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1350, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"},
  {"id": "901", "placeId": "wangnam", "plan": "101", "name": "ห้องคู่", "capacity": 2, "beds": "เตียงควีน 1 เตียง", "area": 24, "price": 1270, "detail": "มีโต๊ะทำงานข้างหน้าต่าง"},
  {"id": "902", "placeId": "wangnam", "plan": "103", "name": "ห้องครอบครัว", "capacity": 4, "beds": "เตียงควีน 2 เตียง", "area": 40, "price": 1420, "detail": "มีมุมนั่งเล่นและโต๊ะกินข้าว"}
]
