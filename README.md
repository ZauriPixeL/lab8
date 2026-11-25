# StayEase Room Booking

Lab 8 วิชา 968-362 Front-end Development

[เว็บเดโม](https://banrim-stay-lab8.littlestar32.chatgpt.site) · [GitHub](https://github.com/ZauriPixeL/lab8)

บัญชีทดลอง guest และ admin ใช้รหัสผ่าน 123456 ทั้งสองบัญชี เฉพาะ admin เปิดหน้าจัดการอนุมัติการจองได้

## เปิดบนเครื่อง

ใช้ Node.js 22.12 ขึ้นไป ติดตั้งด้วย `npm ci` แล้วรัน `npm run dev`
สร้างเว็บสำหรับเผยแพร่ด้วย `npm run build` ผลลัพธ์อยู่ใน `dist`

## ข้อมูลการจอง

Vue Router ตรวจสิทธิ์ก่อนเปิดหน้า Pinia เก็บสถานะบัญชีและรายการจอง Axios เรียก Mock API สำหรับเพิ่ม อ่าน แก้ไข และลบการจอง โดยเริ่มจากข้อมูลตัวอย่างใน db.json ข้อมูลที่แก้ไขเก็บในเบราว์เซอร์ที่ใช้ทดลอง หากต้องการเชื่อม REST API ภายนอกให้ตั้ง QCLI_API_URL ใน .env ก่อน build
