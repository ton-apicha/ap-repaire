# AP Repair - ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์

ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์แบบครบวงจร สำหรับยี่ห้อ Bitmain, Whatsminer, และ Avalon

## คุณสมบัติหลัก

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

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Icons**: Heroicons
- **State Management**: React Context
- **Form Handling**: React Hook Form

## การติดตั้ง

### ความต้องการของระบบ
- Node.js 18+ 
- npm หรือ yarn

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
npx prisma generate
npx prisma db push
```

4. **สร้างไฟล์ environment**
สร้างไฟล์ `.env.local` และเพิ่ม:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

5. **Seed ข้อมูลเริ่มต้น (ไม่บังคับ)**
```bash
npx tsx prisma/seed.ts
```

6. **รันโปรเจค**
```bash
npm run dev
```

7. **เปิดเบราว์เซอร์**
ไปที่ `http://localhost:3000`

## ข้อมูลล็อกอินสำหรับทดสอบ

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: ADMIN

### Manager Account
- **Email**: manager@example.com
- **Password**: manager123
- **Role**: MANAGER

### Technician Account
- **Email**: technician@example.com
- **Password**: tech123
- **Role**: TECHNICIAN

## โครงสร้างโปรเจค

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

## การใช้งาน

### การเปลี่ยนภาษา
ระบบรองรับ 3 ภาษา:
- 🇺🇸 English (เริ่มต้น)
- 🇹🇭 ไทย
- 🇨🇳 中文

สามารถเปลี่ยนภาษาได้จากเมนูด้านซ้าย

### การเพิ่มข้อมูล
1. **ลูกค้า**: ไปที่หน้า Customers → กดปุ่ม "เพิ่มลูกค้า"
2. **ช่างซ่อม**: ไปที่หน้า Technicians → กดปุ่ม "เพิ่มช่างซ่อม"
3. **ใบงาน**: ไปที่หน้า Work Orders → กดปุ่ม "เพิ่มใบงาน"
4. **รุ่นเครื่องขุด**: ไปที่หน้า Miners → กดปุ่ม "เพิ่มรุ่นเครื่องขุด"

### การจัดการข้อมูล
- ใช้ปุ่มแก้ไข (ดินสอ) เพื่อแก้ไขข้อมูล
- ใช้ปุ่มลบ (ถังขยะ) เพื่อลบข้อมูล
- ใช้ช่องค้นหาเพื่อกรองข้อมูล

## การ Deploy

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

## การพัฒนาต่อ

### การเพิ่มฟีเจอร์ใหม่
1. สร้างหน้าใหม่ใน `src/app/`
2. เพิ่มเมนูใน `src/components/layout/Sidebar.tsx`
3. เพิ่มคำแปลในไฟล์ locales
4. อัปเดต types ใน `src/types/index.ts`

### การแก้ไขฐานข้อมูล
1. แก้ไข schema ใน `prisma/schema.prisma`
2. รัน migration: `npx prisma migrate dev`
3. อัปเดต types: `npx prisma generate`

## การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- สร้าง Issue ใน GitHub
- ติดต่อทีมพัฒนา

## License

MIT License - ดูรายละเอียดในไฟล์ LICENSE
