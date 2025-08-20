# AP Repair - ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์

ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์แบบครบวงจร สำหรับยี่ห้อ Bitmain, Whatsminer, และ Avalon

**เวอร์ชั่น**: 1.1.2  
**สถานะ**: ✅ พร้อมใช้งาน  
**อัพเดทล่าสุด**: 20 สิงหาคม 2025

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

- **Frontend**: Next.js 15.5.0, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Components
- **Database**: SQLite (Prisma ORM), PostgreSQL (Production)
- **Icons**: Heroicons, Lucide React
- **State Management**: React Context, Zustand, React Query
- **Form Handling**: React Hook Form, Zod Validation
- **Testing**: Jest, Playwright
- **Code Quality**: Prettier, ESLint
- **UI Components**: Radix UI, Class Variance Authority

## การติดตั้ง

### ความต้องการของระบบ
- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **Clone โปรเจค**
```bash
git clone https://github.com/ton-apicha/ap-repaire.git
cd ap-repaire
```

2. **ติดตั้ง dependencies**
```bash
npm install --legacy-peer-deps
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

### การทดสอบระบบ
```bash
# รัน unit tests
npm run test

# รัน E2E tests
npm run test:e2e

# ตรวจสอบ code quality
npm run lint
npm run type-check
```

## ข้อมูลล็อกอินสำหรับทดสอบ

### Admin Account
- **Email**: admin@aprepair.com
- **Password**: admin123
- **Role**: ADMIN

### Demo Account (สำหรับทดสอบ)
- **Email**: admin@aprepair.com
- **Password**: admin123
- **Role**: ADMIN

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
│   ├── ui/               # UI Components (Radix UI)
│   └── forms/            # Form Components
├── contexts/             # React Contexts
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities และ Configs
│   ├── api.ts           # API Client และ Service
│   ├── utils.ts         # Utility Functions
│   ├── validations.ts   # Zod Validation Schemas
│   └── constants.ts     # Application Constants
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

### สำหรับ Docker
```bash
# Build Docker image
docker build -t ap-repaire .

# Run container
docker run -p 3000:3000 ap-repaire

# หรือใช้ Docker Compose
docker-compose up -d
```

## ประวัติการอัพเดท

### 🚀 v1.1.2 (20 สิงหาคม 2025) - Enhanced Development Environment

#### ✅ การปรับปรุงสภาพแวดล้อมการพัฒนา
- **Testing Framework**: เพิ่ม Jest และ Playwright สำหรับการทดสอบ
- **UI Components**: เพิ่ม Radix UI components (Button, Input, Dialog, Table)
- **API Management**: สร้าง API client และ service wrapper พร้อม error handling
- **Code Quality**: เพิ่ม Prettier และ validation tools
- **Documentation**: เพิ่ม comprehensive documentation

#### 🔧 ฟีเจอร์ใหม่
- **Table Sorting**: การเรียงลำดับในทุกตาราง (Customers, Technicians, Work Orders, Miners, Admin Users)
- **Custom Hooks**: useCustomers, useTechnicians, useWorkOrders, useMiners, useUsers
- **Validation Schemas**: Zod schemas สำหรับทุก entity
- **Utility Functions**: ฟังก์ชันช่วยเหลือต่างๆ
- **Constants**: ค่าคงที่ของระบบ

#### 📦 Dependencies ใหม่
- **UI**: @radix-ui/react-*, class-variance-authority, clsx, tailwind-merge
- **State Management**: zustand, @tanstack/react-query
- **Testing**: jest, @playwright/test
- **Code Quality**: prettier, commitizen, standard-version

#### 📁 ไฟล์ใหม่ที่เพิ่ม
```
├── jest.config.js                    # Jest configuration
├── jest.setup.js                     # Jest setup
├── playwright.config.ts              # Playwright configuration
├── .prettierrc                       # Prettier configuration
├── src/lib/
│   ├── utils.ts                      # Utility functions
│   ├── validations.ts                # Zod schemas
│   ├── api.ts                        # API client
│   └── constants.ts                  # Application constants
├── src/hooks/
│   └── useApi.ts                     # Custom API hooks
└── src/components/ui/
    ├── button.tsx                    # Button component
    ├── input.tsx                     # Input component
    ├── dialog.tsx                    # Dialog component
    ├── table.tsx                     # Table components
    └── index.ts                      # UI exports
```

---

### 🔧 v1.1.1 (20 สิงหาคม 2025) - Actions Column Optimization

#### ✅ การปรับปรุง UX
- **Actions Column**: ย้ายคอลัมน์ "การดำเนินการ" ไปด้านหน้าสุดในทุกตาราง
- **Reduced Scrolling**: ลดการเลื่อนสไลด์บาร์ไปด้านข้าง
- **Better Accessibility**: ปรับปรุงการเข้าถึงสำหรับผู้ใช้

#### 📋 ไฟล์ที่แก้ไข
- `src/app/customers/page.tsx`
- `src/app/technicians/page.tsx`
- `src/app/work-orders/page.tsx`
- `src/app/miners/page.tsx`
- `src/app/admin/users/page.tsx`

---

### 🎯 v1.1.0 (20 สิงหาคม 2025) - Display Fixes and UI Improvements

#### ✅ การแก้ไขที่สำคัญ
- **การแปลภาษา**: แก้ไขปัญหาการแสดง `workOrders.status.COMPLETED` และ `workOrders.priority.HIGH`
- **Search Bar**: ทำให้ Search Bar เหมือนกันทุกหน้า
- **ตาราง Responsive**: เพิ่มความสามารถในการ scroll และ responsive
- **UI/UX**: ปรับปรุงการแสดงผลและ user experience

#### 🔧 ฟีเจอร์ใหม่
- เพิ่มฟังก์ชัน `getStatusText()` และ `getPriorityText()`
- รองรับ status `WAITING_PARTS`
- ปรับปรุง responsive design
- เพิ่มการทดสอบอัตโนมัติ

#### 📋 ไฟล์ที่เพิ่ม
- `test-display-issues.js` - ตรวจสอบปัญหาการแสดงผล
- `test-display-fixes.js` - ทดสอบการแก้ไข
- `DISPLAY_ISSUES_FIXES.md` - สรุปการแก้ไข

## การพัฒนาต่อ

### การเพิ่มฟีเจอร์ใหม่
1. สร้างหน้าใหม่ใน `src/app/`
2. เพิ่มเมนูใน `src/components/layout/Sidebar.tsx`
3. เพิ่มคำแปลในไฟล์ locales
4. อัปเดต types ใน `src/types/index.ts`
5. เพิ่ม validation schema ใน `src/lib/validations.ts`
6. สร้าง API service ใน `src/lib/api.ts`

### การแก้ไขฐานข้อมูล
1. แก้ไข schema ใน `prisma/schema.prisma`
2. รัน migration: `npx prisma migrate dev`
3. อัปเดต types: `npx prisma generate`

### การทดสอบ
```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Code Formatting
npm run format

# Type Checking
npm run type-check
```

### การเพิ่ม UI Components
1. สร้าง component ใหม่ใน `src/components/ui/`
2. ใช้ Radix UI primitives เป็นพื้นฐาน
3. ใช้ `class-variance-authority` สำหรับ variants
4. เพิ่มใน `src/components/ui/index.ts`

### การเพิ่ม API Endpoints
1. สร้าง API route ใน `src/app/api/`
2. เพิ่ม service method ใน `src/lib/api.ts`
3. สร้าง custom hook ใน `src/hooks/useApi.ts`
4. เพิ่ม validation schema ใน `src/lib/validations.ts`

## การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- สร้าง Issue ใน GitHub
- ติดต่อทีมพัฒนา

## License

MIT License - ดูรายละเอียดในไฟล์ LICENSE
