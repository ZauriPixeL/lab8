// src/services/auth.service.js

// บัญชีผู้ใช้จำลองสำหรับการทดสอบระบบ Authentication และ Role-based Authorization
const demoUsers = [
  {
    id: 1,
    username: 'guest',
    password: '123456',
    name: 'คุณผู้เข้าพัก (Guest User)',
    email: 'guest@stayease.com',
    role: 'guest'
  },
  {
    id: 2,
    username: 'admin',
    password: '123456',
    name: 'เจ้าหน้าที่โรงแรม (Admin)',
    email: 'admin@stayease.com',
    role: 'admin'
  }
]

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = demoUsers.find(
        (u) => u.username === username.trim() && u.password === password
      )

      if (!found) {
        reject({
          response: {
            status: 401,
            data: { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
          }
        })
        return
      }

      const payload = btoa(JSON.stringify({
        id: found.id,
        username: found.username,
        role: found.role,
        exp: Date.now() + 1000 * 60 * 60 * 24 // หมดอายุใน 24 ชั่วโมง
      }))

      resolve({
        data: {
          success: true,
          message: 'Login successful.',
          data: {
            accessToken: `stayease.${payload}.token`,
            user: {
              id: found.id,
              username: found.username,
              name: found.name,
              email: found.email,
              role: found.role
            }
          }
        }
      })
    }, 500)
  })
}

export const getProfile = (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) {
        reject({
          response: { status: 401, data: { message: 'Access token is required.' } }
        })
        return
      }

      try {
        const parts = token.split('.')
        const decoded = JSON.parse(atob(parts[1]))

        if (decoded.exp && Date.now() > decoded.exp) {
          reject({
            response: { status: 401, data: { message: 'Token expired.' } }
          })
          return
        }

        const found = demoUsers.find((u) => u.id === decoded.id)
        if (!found) {
          reject({
            response: { status: 401, data: { message: 'Invalid token.' } }
          })
          return
        }

        resolve({
          data: {
            success: true,
            data: {
              id: found.id,
              username: found.username,
              name: found.name,
              email: found.email,
              role: found.role
            }
          }
        })
      } catch {
        reject({
          response: { status: 401, data: { message: 'Invalid token.' } }
        })
      }
    }, 200)
  })
}
