# บ้านริม · Banrim Stay

Mini Front-end Project วิชา 968-362 | Lab 8

ระบบจองห้องพักขนาดเล็ก มีห้องให้เลือก 3 ห้อง ผู้ใช้ดูผังห้องและราคาได้ก่อนเข้าสู่ระบบ เมื่อเข้าสู่ระบบแล้วจึงจอง แก้ไข หรือลบรายการของตนเองได้

[เปิดเว็บเดโม](https://banrim-stay-lab8.littlestar32.chatgpt.site) · [GitHub Repository](https://github.com/ZauriPixeL/lab8)

## ทดลองใช้งาน

| บัญชีทดลอง | รหัสผ่าน | ใช้ทดสอบ |
| --- | --- | --- |
| demo | stay1234 | จองและจัดการรายการของตนเอง |
| guest2 | stay1234 | ตรวจว่าบัญชีที่สองเห็นเฉพาะรายการของตนเอง |

1. เลือกจำนวนผู้เข้าพักเพื่อกรองห้อง แล้วกด **จองห้องนี้** ระบบจะพาไปหน้าเข้าสู่ระบบ
2. กด **กรอกให้** เพื่อเติมบัญชี demo จากนั้นกด **เข้าสู่ระบบ** ระบบจะกลับไปที่ห้องเดิม
3. เลือกห้อง 101 ระบุชื่อเล่น เลือกจำนวนคนและช่วงที่พัก 2 คืน จะเห็นยอดรวม 790 × 2 = 1,580 บาท กด **ยืนยันการจอง**
4. ที่ **การจองของฉัน** กด **แก้ไข** ขยายวันออกอีกหนึ่งคืน ยอดรวมจะเป็น 2,370 บาท เมื่อบันทึกแล้ว ลองรีเฟรชหน้า
5. ลองจองห้อง 101 อีกครั้งในวันที่ทับกัน ระบบจะแจ้งเตือน สามารถเริ่มการจองใหม่ในวันที่รายการเดิมเช็กเอาต์ได้
6. กด **ลบ** เลือกเก็บรายการไว้ หรือกด **ยืนยันลบ** แล้วออกจากระบบ ลองเปิด **การจองของฉัน** อีกครั้งเพื่อดูการทำงานของ Route Guard

## การรันบนเครื่อง

ใช้ Node.js 22.12 ขึ้นไปในสาย 22 หรือ Node.js 24 และ npm เปิด terminal ในโฟลเดอร์ที่มี package.json

```sh
npm ci
npm run dev
```

เปิด URL ที่ Vite แสดง หากต้องการตรวจชุด production ให้ใช้คำสั่งด้านล่าง

```sh
npm run build
npm run preview
```

Vite สร้างเว็บพร้อมเผยแพร่ไว้ใน `dist/` สำหรับ static hosting เช่น Vercel ให้เลือก preset เป็น Vite, install command เป็น `npm ci`, build command เป็น `npm run build` และ output directory เป็น `dist` ระบบใช้ hash history เพื่อให้เปิดหน้าภายในโดยตรงหรือรีเฟรชได้

## หน้าของระบบ

| หน้า | เส้นทาง | สิทธิ์ |
| --- | --- | --- |
| เลือกห้องพักและกรองจำนวนคน | `#/` | ทุกคน |
| เข้าสู่ระบบ | `#/login` | ผู้ที่ยังไม่เข้าสู่ระบบ |
| สร้างการจอง | `#/bookings/new/101` (เปลี่ยนเลขห้องได้) | สมาชิก |
| การจองของฉัน | `#/bookings` | สมาชิก เห็นเฉพาะของตนเอง |
| แก้ไขการจอง | `#/bookings/:id/edit` | เจ้าของรายการ |

## โค้ดเชื่อมกับบทเรียนอย่างไร

| บท | สิ่งที่นำมาใช้ | ตัวอย่างในโปรเจกต์ |
| --- | --- | --- |
| 1 · Front-end / Quasar | สร้าง Vue SPA ด้วย Vite และ Quasar แบ่งไฟล์ตามหน้าที่ | package.json, src/main.js |
| 2 · Responsive Design | QLayout, QHeader, Flex Grid และ breakpoint แสดงการ์ดหลายคอลัมน์บนจอใหญ่และคอลัมน์เดียวบนมือถือ | src/App.vue, src/pages/RoomsPage.vue, src/style.css |
| 3 · Basic Vue.js | RoomCard รับ props และส่ง event เมื่อกดจอง ใช้ ref, reactive, computed, watch และ onMounted | src/components/RoomCard.vue, src/pages/BookingForm.vue |
| 4 · UI Components | QForm, QInput, QBtn, QDialog ยืนยันก่อนลบ และ Notify หลังทำรายการ | src/pages/LoginPage.vue, src/pages/MyBookings.vue |
| 5 · Pinia | auth store เก็บผู้ใช้ ส่วน stay store เก็บห้องและรายการจอง มี getter เรียงตามวันเข้าพักและ actions สำหรับ CRUD | src/stores/ |
| 6 · API | Axios instance, async/await และ Mock API ตามรูปแบบ REST พร้อมสถานะกำลังโหลด สำเร็จ ว่าง และผิดพลาด | src/boot/api.js, src/mock/api.js |
| 7 · Authentication | Login รับ token, Axios interceptor แนบ Bearer token, Route Guard จดจำหน้าปลายทาง, API ตรวจเจ้าของ, Logout ยกเลิก session | src/router/index.js, src/stores/auth.js, src/mock/api.js |
| 8 · Deployment | Environment variables, production build, GitHub และ Cloud Hosting | .env.example, vite.config.js และลิงก์ข้างต้น |

## การทำงานของ Mock API

ใช้ axios-mock-adapter ตอบคำขอของ Axios ภายในเบราว์เซอร์ เปิดเว็บครั้งแรกจะเห็นห้องตัวอย่างสามห้องและเริ่มด้วยรายการจองว่าง ผู้ตรวจสามารถทดลองกรอกชื่อสมมติได้ ข้อมูลการจองและ session จำลองอยู่ใน IndexedDB ของเว็บไซต์นั้น ส่วน token ของแท็บอยู่ใน sessionStorage และหมดอายุใน 8 ชั่วโมง เมื่อรีเฟรช ระบบตรวจ token อีกครั้งผ่าน /auth/me

การจองจะทับกันเมื่อเป็นห้องเดียวกันและ `วันเข้าใหม่ < วันออกเดิม` พร้อมกับ `วันออกใหม่ > วันเข้าเดิม` ตอนแก้ไขจะข้ามรายการที่กำลังแก้ ระบบตรวจห้องซ้อนจากรายการของทุกบัญชีในเบราว์เซอร์เดียวกัน การตรวจและบันทึกอยู่ในธุรกรรม IndexedDB เดียวกัน ข้อมูลของแต่ละอุปกรณ์หรือโปรไฟล์เบราว์เซอร์แยกกัน

| Method | Endpoint | หน้าที่ |
| --- | --- | --- |
| GET | /rooms | อ่านห้องทั้งหมด |
| POST | /auth/login | ตรวจบัญชีทดลองและออก token |
| GET | /auth/me | ตรวจ session เมื่อเปิดหน้าใหม่ |
| POST | /auth/logout | ยกเลิก token |
| GET | /bookings | อ่านการจองของบัญชีปัจจุบัน |
| POST | /bookings | เพิ่มการจอง |
| PUT | /bookings/:id | แก้ไขการจอง |
| DELETE | /bookings/:id | ลบการจอง |

Mock API เปิดเป็นค่าเริ่มต้น การตั้งค่าเสริมอยู่ที่ .env.example คัดลอกเป็น .env.local เมื่อต้องการเปลี่ยนค่า หากมี REST API จริงที่รองรับ endpoints และรูปแบบข้อมูลเดียวกัน ให้ตั้ง VITE_USE_MOCK=false และ VITE_API_BASE_URL เป็น URL ของ API นั้น แล้ว build ใหม่

ภาพผังห้องสร้างขึ้นสำหรับโปรเจกต์นี้ ฟอนต์ Noto Sans Thai พร้อมใบอนุญาตอยู่ใน public/fonts/
