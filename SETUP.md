# AP Repair - คู่มือการติดตั้งและใช้งาน

## 🚀 การติดตั้งระบบ

### ความต้องการของระบบ
- Node.js 18+ 
- npm หรือ yarn
- macOS, Windows, หรือ Linux

### ขั้นตอนการติดตั้ง

1. **Clone โปรเจค**
```bash
git clone <repository-url>
cd ap-repaire
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **ตั้งค่าฐานข้อมูล**
```bash
# สร้างไฟล์ .env.local
echo 'DATABASE_URL="file:./dev.db"' > .env.local
echo 'NEXTAUTH_SECRET="your-secret-key-here"' >> .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local

# สร้างฐานข้อมูล
export DATABASE_URL="file:./dev.db"
npx prisma generate
npx prisma db push --accept-data-loss
```

4. **เพิ่มข้อมูลตัวอย่าง**
```bash
npm run db:seed
```

5. **รันโปรเจค**
```bash
npm run dev
```

6. **เปิดเบราว์เซอร์**
ไปที่ `http://localhost:3000`

## 👤 ข้อมูลเข้าสู่ระบบ

หลังจากรัน seed script จะมีข้อมูลตัวอย่าง:

**Admin User:**
- Email: `admin@aprepair.com`
- Password: `admin123`

## 📋 คุณสมบัติหลัก

### 🏠 แดชบอร์ด
- ภาพรวมสถานะงานซ่อม
- สถิติลูกค้าและช่างซ่อม
- รายงานรายได้และงานล่าสุด

### 👥 จัดการลูกค้า
- เพิ่ม/แก้ไข/ลบข้อมูลลูกค้า
- ประวัติการซ่อม
- ข้อมูลติดต่อและบริษัท

### 🔧 จัดการช่างซ่อม
- เพิ่ม/แก้ไข/ลบข้อมูลช่างซ่อม
- ความเชี่ยวชาญเฉพาะทาง
- อัตราค่าจ้างและสถานะการทำงาน

### 📋 จัดการใบงานซ่อม
- สร้างและติดตามใบงาน
- สถานะงาน (รอดำเนินการ, กำลังดำเนินการ, เสร็จสิ้น)
- ความสำคัญ (ต่ำ, ปานกลาง, สูง, เร่งด่วน)
- ค่าใช้จ่ายโดยประมาณและจริง

### ⚡ จัดการรุ่นเครื่องขุด
- รองรับ Bitmain, Whatsminer, Avalon
- ข้อมูลเทคนิค (อัตราการแฮช, กำลังไฟ)
- การจัดการรุ่นย่อยต่างๆ

### ⚙️ ระบบหลังบ้าน
- จัดการผู้ใช้และสิทธิ์
- การสำรองและกู้คืนข้อมูล
- รายงานและสถิติ
- บันทึกระบบ

## 🌍 การเปลี่ยนภาษา

ระบบรองรับ 3 ภาษา:
- 🇺🇸 English (เริ่มต้น)
- 🇹🇭 ไทย
- 🇨🇳 中文

สามารถเปลี่ยนภาษาได้จากเมนูด้านซ้าย

## 🛠️ คำสั่งที่มีประโยชน์

```bash
# รันโปรเจคในโหมด development
npm run dev

# Build โปรเจคสำหรับ production
npm run build

# รันโปรเจคในโหมด production
npm start

# ตรวจสอบ code quality
npm run lint

# จัดการฐานข้อมูล
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed sample data
```

## 📁 โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # หน้าแดชบอร์ด
│   ├── customers/         # จัดการลูกค้า
│   ├── technicians/       # จัดการช่างซ่อม
│   ├── work-orders/       # จัดการใบงาน
│   ├── miners/           # จัดการรุ่นเครื่องขุด
│   └── admin/            # ระบบหลังบ้าน
├── components/            # React Components
│   ├── layout/           # Layout Components
│   ├── ui/               # UI Components
│   └── forms/            # Form Components
├── contexts/             # React Contexts
├── lib/                  # Utilities และ Configs
├── locales/              # ไฟล์แปลภาษา
│   ├── en.ts            # ภาษาอังกฤษ
│   ├── th.ts            # ภาษาไทย
│   └── zh.ts            # ภาษาจีน
├── types/                # TypeScript Types
└── utils/                # Utility Functions
```

## 🔧 การพัฒนาต่อ

### การเพิ่มฟีเจอร์ใหม่
1. สร้างหน้าใหม่ใน `src/app/`
2. เพิ่มเมนูใน `src/components/layout/Sidebar.tsx`
3. เพิ่มคำแปลในไฟล์ locales
4. อัปเดต types ใน `src/types/index.ts`

### การแก้ไขฐานข้อมูล
1. แก้ไข schema ใน `prisma/schema.prisma`
2. รัน migration: `npx prisma migrate dev`
3. อัปเดต types: `npx prisma generate`

## 🚀 การ Deploy

### สำหรับ Production
1. **Build โปรเจค**
```bash
npm run build
```

2. **Start Production Server**
```bash
npm start
```

### สำหรับ Vercel
1. Push โค้ดไปยัง GitHub
2. เชื่อมต่อกับ Vercel
3. ตั้งค่า Environment Variables
4. Deploy

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ฐานข้อมูลไม่เชื่อมต่อ**
   - ตรวจสอบ DATABASE_URL ใน .env.local
   - รัน `npx prisma generate` และ `npx prisma db push`

2. **Port 3000 ถูกใช้งาน**
   - เปลี่ยน port: `npm run dev -- -p 3001`

3. **Dependencies ไม่ครบ**
   - ลบ node_modules และ package-lock.json
   - รัน `npm install` ใหม่

## 📞 การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- สร้าง Issue ใน GitHub
- ติดต่อทีมพัฒนา

---

**AP Repair** - ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์แบบครบวงจร
