# 🚀 **ชุดคำสั่งสำเร็จรูปสำหรับการพัฒนา AP Repair**

## **📋 คำสั่งพื้นฐาน**

### **🔄 รีสตาร์ทเซอร์วิส**
```bash
# รีสตาร์ท dev server
kill $(lsof -t -i:3000) 2>/dev/null || true
npm run dev

# รีสตาร์ทแบบสมบูรณ์
kill $(lsof -t -i:3000) 2>/dev/null || true
rm -rf .next node_modules/.cache .swc
npm cache clean --force
npm install
npm run dev
```

### **🧹 ล้าง Cache และ Rebuild**
```bash
# ล้าง cache ทั้งหมด
rm -rf .next node_modules/.cache .swc
npm cache clean --force

# Rebuild
npm run build
npm run dev
```

### **🔍 ตรวจสอบระบบ**
```bash
# Health Check
npm run health-check

# Lint Check
npm run lint

# Type Check
npm run type-check
```

## **🌐 การทดสอบหน้าเว็บ**

### **📱 ทดสอบหน้าเว็บหลัก**
```bash
# เปิดหน้าเว็บในเบราว์เซอร์
open http://localhost:3000
open http://localhost:3000/dashboard
open http://localhost:3000/work-orders
open http://localhost:3000/customers
open http://localhost:3000/technicians
open http://localhost:3000/miners
open http://localhost:3000/invoices
open http://localhost:3000/payments
```

### **⚙️ ทดสอบหน้า Admin**
```bash
# เปิดหน้า Admin
open http://localhost:3000/admin
open http://localhost:3000/admin/users
open http://localhost:3000/admin/roles
open http://localhost:3000/admin/permissions
open http://localhost:3000/admin/backup
open http://localhost:3000/admin/audit-logs
```

### **🔗 ทดสอบ API**
```bash
# ทดสอบ API หลัก
curl -s http://localhost:3000/api/customers | head -5
curl -s http://localhost:3000/api/work-orders | head -5
curl -s http://localhost:3000/api/technicians | head -5
curl -s http://localhost:3000/api/miners | head -5

# ทดสอบ API Admin
curl -s http://localhost:3000/api/admin/roles | head -5
curl -s http://localhost:3000/api/admin/permissions | head -5
curl -s http://localhost:3000/api/admin/users | head -5
```

## **🌍 การทดสอบภาษา**

### **🔤 ทดสอบการเปลี่ยนภาษา**
```bash
# เปิดหน้าเว็บและทดสอบการเปลี่ยนภาษา
open http://localhost:3000/dashboard
# เปลี่ยนภาษา: 🇺🇸 English, 🇹🇭 ไทย, 🇨🇳 中文
```

### **📝 ตรวจสอบไฟล์ภาษา**
```bash
# ตรวจสอบไฟล์ภาษา
cat src/locales/th.ts | grep -i "dashboard\|admin"
cat src/locales/en.ts | grep -i "dashboard\|admin"
cat src/locales/zh.ts | grep -i "dashboard\|admin"
```

## **💾 การจัดการ Git**

### **📤 บันทึกโปรเจค**
```bash
# บันทึกและอัพโหลดโปรเจค
git add .
git commit -m "📝 Update project and commit changes"
git push origin main
```

### **🔄 ย้อนกลับเวอร์ชั่น**
```bash
# ย้อนกลับไปเวอร์ชั่นล่าสุด
git reset --hard HEAD
git clean -fd
```

### **🏷️ สร้าง Tag**
```bash
# สร้าง version tag
git tag -a v1.4.2 -m "Version 1.4.2 - Enhanced Admin Features"
git push origin v1.4.2
```

## **🔧 การแก้ไขปัญหา**

### **🐛 แก้ไข Tailwind CSS Error**
```bash
# แก้ไข border-gray-300 error
# ตรวจสอบ tailwind.config.ts และลบ borderColor ที่ซ้ำซ้อน
```

### **⚡ แก้ไข Performance Issues**
```bash
# ล้าง cache และ rebuild
rm -rf .next node_modules/.cache .swc
npm cache clean --force
npm install
npm run dev
```

### **🔐 แก้ไข Authentication Issues**
```bash
# รีสตาร์ท session
# ตรวจสอบ AuthGuard component
# ตรวจสอบ API routes
```

## **📊 การตรวจสอบข้อมูล**

### **🗄️ ตรวจสอบฐานข้อมูล**
```bash
# ตรวจสอบ Prisma
npx prisma studio
npx prisma generate
npx prisma db push
```

### **📈 ตรวจสอบ Logs**
```bash
# ตรวจสอบ logs
tail -f .next/server.log
```

## **🎯 คำสั่งพิเศษ**

### **🚀 "บันทึกโปรเจค" (ตาม Memory)**
```bash
# เมื่อผู้ใช้บอก "บันทึกโปรเจค"
git add README.md
git commit -m "📝 Update README and commit changes"
git push origin main
```

### **🌐 ทดสอบครบทุกหน้า**
```bash
# ทดสอบทุกหน้าหลัก
for page in dashboard work-orders customers technicians miners invoices payments admin; do
  echo "Testing: $page"
  curl -s "http://localhost:3000/$page" > /dev/null && echo "✅ $page OK" || echo "❌ $page FAILED"
done
```

### **🔍 ตรวจสอบ CRUD Operations**
```bash
# ทดสอบ CRUD operations
echo "Testing CRUD operations..."
# ตรวจสอบการสร้าง แก้ไข ลบ ข้อมูลในแต่ละหน้า
```

## **📝 บันทึกการพัฒนา**

### **✅ สิ่งที่เสร็จแล้ว**
- ✅ Admin Roles Management
- ✅ Admin Permissions Management  
- ✅ Dashboard Enhancement
- ✅ i18n Support (Thai, English, Chinese)
- ✅ Tailwind CSS Configuration
- ✅ PageTemplate System
- ✅ Action Buttons Standardization

### **🔄 สิ่งที่กำลังทำ**
- 🔄 System Performance Optimization
- 🔄 Error Handling Enhancement
- 🔄 User Experience Improvement

### **📋 สิ่งที่ต้องทำต่อไป**
- 📋 Supplier Management
- 📋 Advanced Reporting
- 📋 Mobile Responsiveness
- 📋 Advanced Search & Filtering
- 📋 Real-time Notifications
- 📋 Advanced Analytics Dashboard

---

## **🎉 สรุป**

ระบบ AP Repair ตอนนี้มีฟีเจอร์ครบถ้วนสำหรับการจัดการงานซ่อมเครื่องขุดบิดคอยน์ พร้อมระบบ Admin ที่สมบูรณ์ และรองรับสามภาษา (ไทย, อังกฤษ, จีน)

**URL หลัก:** http://localhost:3000
**Admin Panel:** http://localhost:3000/admin
**Dashboard:** http://localhost:3000/dashboard

🚀 **พร้อมใช้งานแล้ว!**
