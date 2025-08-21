# AP Repair - ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=flat-square&logo=prisma)

ระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์แบบครบวงจร สำหรับยี่ห้อ Bitmain, Whatsminer, และ Avalon

**เวอร์ชั่น**: 1.3.0  
**สถานะ**: ✅ พร้อมใช้งาน  
**อัพเดทล่าสุด**: 21 สิงหาคม 2025

[🚀 Demo](#การใช้งาน) • [📖 Documentation](#โครงสร้างโปรเจค) • [🛠️ Installation](#การติดตั้ง) • [🎯 Features](#คุณสมบัติหลัก)

</div>

---

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
- **ระบบ Auto-ID**: สร้างหมายเลขใบงานอัตโนมัติ (YYMMDD + 3-digit)
- **สถานะงาน**: รอดำเนินการ, กำลังดำเนินการ, รอชิ้นส่วน, เสร็จสิ้น, ยกเลิก
- **ระดับความสำคัญ**: ต่ำ, ปานกลาง, สูง, เร่งด่วน
- **การคำนวณต้นทุน**: ค่าใช้จ่ายโดยประมาณและจริง
- **ติดตามเวลา**: วันที่เริ่ม, วันที่เสร็จสิ้น

### 📄 จัดการใบแจ้งหนี้ (Invoices)
- **ระบบ Auto-ID**: สร้างหมายเลขใบแจ้งหนี้อัตโนมัติ
- **สถานะใบแจ้งหนี้**: ร่าง, ส่งแล้ว, ชำระแล้ว, เกินกำหนด, ยกเลิก, ชำระบางส่วน
- **การคำนวณ**: ภาษี, ส่วนลด, ยอดรวม
- **การติดตาม**: วันที่ออก, วันที่ครบกำหนด, ยอดที่ชำระแล้ว

### 💳 จัดการการชำระเงิน (Payments)
- **วิธีการชำระ**: เงินสด, โอนเงิน, บัตรเครดิต, บัตรเดบิต, เช็ค, กระเป๋าเงินดิจิทัล
- **การติดตาม**: สถานะการชำระ, วันที่ชำระ, จำนวนเงิน
- **การเชื่อมโยง**: เชื่อมโยงกับใบแจ้งหนี้

### ⚡ จัดการรุ่นเครื่องขุด
- รองรับ Bitmain, Whatsminer, Avalon
- ข้อมูลเทคนิค (อัตราการแฮช, กำลังไฟ)
- การจัดการรุ่นย่อยต่างๆ

### ⚙️ ระบบหลังบ้าน (Admin)
- **จัดการผู้ใช้**: CRUD operations สำหรับ users
- **ระบบสิทธิ์**: Role-based access control (ADMIN, MANAGER, TECHNICIAN, USER)
- **การยืนยันตัวตน**: NextAuth.js integration
- **ระบบสถิติ**: Dashboard แสดงข้อมูลภาพรวม
- **ระบบรายงาน**: Export และ analytics

### 🌐 ระบบหลายภาษา
- **English** 🇺🇸 - ภาษาอังกฤษ
- **ไทย** 🇹🇭 - ภาษาไทย  
- **中文** 🇨🇳 - ภาษาจีน
- **Context switching**: เปลี่ยนภาษาได้ทันที

### 🧪 ระบบทดสอบ
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Code Quality**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **System Health**: Automated health checks

### 🎨 ระบบ UI Template
- **PageTemplate**: เทมเพลตหลักสำหรับหน้าต่างๆ
- **PageTemplateWithI18n**: เทมเพลตที่รองรับ 3 ภาษาตั้งแต่ต้น
- **Consistent Design**: UI ที่สอดคล้องกันทุกหน้า
- **Reusable Components**: Components ที่ใช้ซ้ำได้
- **Action Buttons**: ปุ่ม View/Edit ที่ใช้งานง่าย
- **Responsive Layout**: ทำงานได้ทุกขนาดหน้าจอ

### 🚀 ระบบการพัฒนาที่รองรับ 3 ภาษา
- **Create Page Script**: สร้างหน้าใหม่พร้อมคำแปลอัตโนมัติ
- **Translation Helper**: จัดการคำแปลและ validation
- **Auto Translation**: สร้างคำแปล 3 ภาษา (ไทย, อังกฤษ, จีน) อัตโนมัติ
- **Development Guide**: คู่มือการพัฒนาครบถ้วน
- **Template System**: ระบบเทมเพลตที่ใช้งานง่าย

## 🛠️ เทคโนโลยีที่ใช้

<table>
<tr>
<td><strong>🎨 Frontend</strong></td>
<td>
  <img src="https://img.shields.io/badge/Next.js-15.5.0-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
</td>
</tr>
<tr>
<td><strong>💅 Styling</strong></td>
<td>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Radix%20UI-Components-161618?style=flat-square" alt="Radix UI"/>
  <img src="https://img.shields.io/badge/Heroicons-Icons-8B5CF6?style=flat-square" alt="Heroicons"/>
</td>
</tr>
<tr>
<td><strong>🗄️ Database</strong></td>
<td>
  <img src="https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=flat-square&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/SQLite-Dev-003B57?style=flat-square&logo=sqlite" alt="SQLite"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Prod-336791?style=flat-square&logo=postgresql" alt="PostgreSQL"/>
</td>
</tr>
<tr>
<td><strong>🔐 Auth & State</strong></td>
<td>
  <img src="https://img.shields.io/badge/NextAuth.js-Authentication-purple?style=flat-square" alt="NextAuth"/>
  <img src="https://img.shields.io/badge/Zustand-State-FF6B6B?style=flat-square" alt="Zustand"/>
  <img src="https://img.shields.io/badge/React%20Query-Data-FF4154?style=flat-square" alt="React Query"/>
</td>
</tr>
<tr>
<td><strong>✅ Testing & Quality</strong></td>
<td>
  <img src="https://img.shields.io/badge/Jest-Unit%20Tests-C21325?style=flat-square&logo=jest" alt="Jest"/>
  <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square" alt="Playwright"/>
  <img src="https://img.shields.io/badge/ESLint-Code%20Quality-4B32C3?style=flat-square&logo=eslint" alt="ESLint"/>
</td>
</tr>
</table>

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

5. **Seed ข้อมูลเริ่มต้น**
```bash
node seed-complete-data.js
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

# ตรวจสอบสุขภาพระบบ
curl http://localhost:3000/api/health
```

## 🔑 ข้อมูลล็อกอินสำหรับทดสอบ

> ⚠️ **หมายเหตุ**: ข้อมูลเหล่านี้สำหรับการทดสอบเท่านั้น กรุณาเปลี่ยนรหัสผ่านก่อนใช้งานจริง

<table>
<tr>
<th>Role</th>
<th>Email</th>
<th>Password</th>
<th>Permissions</th>
</tr>
<tr>
<td><strong>👑 ADMIN</strong></td>
<td><code>admin@example.com</code></td>
<td><code>admin123</code></td>
<td>ทุกสิทธิ์ (User Management, System Settings)</td>
</tr>
<tr>
<td><strong>👨‍💼 MANAGER</strong></td>
<td><code>manager@example.com</code></td>
<td><code>manager123</code></td>
<td>จัดการงาน, ดูรายงาน</td>
</tr>
<tr>
<td><strong>🔧 TECHNICIAN</strong></td>
<td><code>tech@example.com</code></td>
<td><code>tech123</code></td>
<td>อัพเดทสถานะงาน, ดูงานที่ได้รับมอบหมาย</td>
</tr>
<tr>
<td><strong>👤 USER</strong></td>
<td><code>user@example.com</code></td>
<td><code>user123</code></td>
<td>ดูข้อมูลพื้นฐาน</td>
</tr>
</table>

## โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # หน้าแดชบอร์ด
│   ├── customers/         # จัดการลูกค้า
│   ├── technicians/       # จัดการช่างซ่อม
│   ├── work-orders/       # จัดการใบงาน
│   ├── miners/           # จัดการรุ่นเครื่องขุด
│   ├── invoices/         # จัดการใบแจ้งหนี้
│   ├── payments/         # จัดการการชำระเงิน
│   ├── admin/            # ระบบหลังบ้าน
│   └── api/              # API Routes
│       ├── customers/     # Customer API
│       ├── technicians/   # Technician API
│       ├── work-orders/   # Work Order API
│       ├── miners/        # Miner API
│       ├── invoices/      # Invoice API
│       ├── payments/      # Payment API
│       └── health/        # Health Check API
├── components/            # React Components
│   ├── layout/           # Layout Components
│   ├── ui/               # UI Components (Radix UI + PageTemplate)
│   │   └── PageTemplate.tsx  # Main page template system
│   ├── templates/        # Template Components
│   │   └── PageTemplateWithI18n.tsx  # Template with i18n support
│   ├── forms/            # Form Components
│   └── auth/             # Authentication Components
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
    ├── errorHandler.ts   # Error handling utilities
    ├── logger.ts         # Logging system
    ├── validation.ts     # Data validation
    ├── middleware.ts     # Server middleware
    ├── systemHealth.ts   # System health checks
    ├── testUtils.ts      # Testing utilities
    └── translationHelper.ts  # Translation management utilities
```

## การใช้งาน

### การเปลี่ยนภาษา
ระบบรองรับ 3 ภาษา:
- 🇺🇸 English (เริ่มต้น)
- 🇹🇭 ไทย
- 🇨🇳 中文

สามารถเปลี่ยนภาษาได้จากเมนูด้านซ้าย

### 🚀 การสร้างหน้าใหม่ด้วยระบบรองรับ 3 ภาษา

#### สร้างหน้าใหม่ใน 1 นาที:
```bash
# สร้างหน้า Suppliers
npm run create-page suppliers Suppliers /api/suppliers

# สร้างหน้า Inventory  
npm run create-page inventory Inventory /api/inventory

# สร้างหน้า Reports
npm run create-page reports Reports /api/reports
```

#### ผลลัพธ์ที่ได้:
- ✅ ไฟล์ `src/app/suppliers/page.tsx`
- ✅ ไฟล์ `src/app/api/suppliers/route.ts`
- ✅ คำแปลใน `src/locales/en.ts`, `th.ts`, `zh.ts`
- ✅ TypeScript interfaces
- ✅ CRUD operations พร้อมใช้งาน
- ✅ Search และ Filter
- ✅ Responsive UI

#### การปรับแต่งหน้า:
```tsx
// src/app/suppliers/page.tsx
export default function SuppliersPage() {
  return (
    <PageTemplateWithI18n<Supplier>
      pageKey="suppliers"
      titleKey="suppliers.title"
      descriptionKey="suppliers.description"
      apiEndpoint="/api/suppliers"
      columns={[
        { key: 'name', labelKey: 'suppliers.fields.name', sortable: true },
        { key: 'email', labelKey: 'suppliers.fields.email', sortable: true },
        { key: 'phone', labelKey: 'suppliers.fields.phone' }
      ]}
      formFields={[
        { key: 'name', labelKey: 'suppliers.fields.name', type: 'text', required: true },
        { key: 'email', labelKey: 'suppliers.fields.email', type: 'email', required: true },
        { key: 'phone', labelKey: 'suppliers.fields.phone', type: 'text' }
      ]}
      filters={[
        {
          key: 'status',
          labelKey: 'suppliers.fields.status',
          type: 'select',
          options: [
            { value: 'active', labelKey: 'suppliers.statuses.active' },
            { value: 'inactive', labelKey: 'suppliers.statuses.inactive' }
          ]
        }
      ]}
    />
  )
}
```

#### ดูคู่มือการพัฒนาครบถ้วนได้ที่:
📖 [Development Guide](./docs/DEVELOPMENT_GUIDE.md)

### การเพิ่มข้อมูล
1. **ลูกค้า**: ไปที่หน้า Customers → กดปุ่ม "เพิ่มลูกค้า"
2. **ช่างซ่อม**: ไปที่หน้า Technicians → กดปุ่ม "เพิ่มช่างซ่อม"
3. **ใบงาน**: ไปที่หน้า Work Orders → กดปุ่ม "เพิ่มใบงาน"
4. **รุ่นเครื่องขุด**: ไปที่หน้า Miners → กดปุ่ม "เพิ่มรุ่นเครื่องขุด"
5. **ใบแจ้งหนี้**: ไปที่หน้า Invoices → กดปุ่ม "สร้างใบแจ้งหนี้"
6. **การชำระเงิน**: ไปที่หน้า Payments → กดปุ่ม "เพิ่มการชำระเงิน"

### การจัดการข้อมูล
- ใช้ปุ่มแก้ไข (ดินสอ) เพื่อแก้ไขข้อมูล

### 🎨 ระบบ UI Template
ระบบใช้ `PageTemplate` เป็นเทมเพลตหลักสำหรับหน้าต่างๆ เพื่อให้ UI สอดคล้องกัน:

#### หน้าที่ใช้เทมเพลตแล้ว
- ✅ **Payments** (`/payments`) - ต้นแบบ
- ✅ **Invoices** (`/invoices`) - ปรับปรุงแล้ว

#### หน้าที่กำลังปรับปรุง
- 🔄 **Work Orders** (`/work-orders`)
- 🔄 **Customers** (`/customers`)
- 🔄 **Technicians** (`/technicians`)
- 🔄 **Miner Models** (`/miners`)
- 🔄 **Dashboard** (`/dashboard`)

#### คุณสมบัติของเทมเพลต
- **Consistent Layout**: โครงสร้างหน้าเหมือนกันทุกหน้า
- **Action Buttons**: ปุ่ม View/Edit ที่ใช้งานง่าย
- **Filter & Search**: ระบบค้นหาและกรองข้อมูล
- **Sorting**: การเรียงลำดับข้อมูล
- **Responsive Design**: ทำงานได้ทุกขนาดหน้าจอ
- ใช้ปุ่มลบ (ถังขยะ) เพื่อลบข้อมูล
- ใช้ช่องค้นหาเพื่อกรองข้อมูล
- ใช้ dropdown filters เพื่อกรองตามสถานะ

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

### 🚀 v1.2.0 (21 สิงหาคม 2025) - Complete System Enhancement

#### ✅ การปรับปรุงระบบครบวงจร
- **🎨 UI/UX Consistency**: ปรับปรุง CSS ให้ทุกหน้าใช้สไตล์เดียวกัน
- **📄 Invoice Management**: เพิ่มระบบจัดการใบแจ้งหนี้ครบวงจร
- **💳 Payment Management**: เพิ่มระบบจัดการการชำระเงิน
- **🔧 API Standardization**: ปรับปรุง API response format เป็น `{ success: true, data: [...] }`
- **🛡️ Error Handling**: เพิ่มระบบจัดการ error ที่ครอบคลุม
- **📊 System Health**: เพิ่ม health check API และ monitoring
- **🧪 Testing Infrastructure**: ปรับปรุงระบบทดสอบให้ครอบคลุม

#### 🔧 ฟีเจอร์ใหม่
- **📄 Invoice System**: 
  - Auto-ID generation (INV + YYMMDD + 3-digit)
  - Status management (DRAFT, SENT, PAID, OVERDUE, CANCELLED, PARTIAL)
  - Tax calculation และ discount support
  - Due date tracking
- **💳 Payment System**:
  - Multiple payment methods (CASH, BANK_TRANSFER, CREDIT_CARD, etc.)
  - Payment status tracking
  - Invoice linking
- **🔍 Advanced Search & Filtering**: 
  - Real-time search ในทุกหน้า
  - Status-based filtering
  - Sortable columns
- **📱 Responsive Design**: ปรับปรุง UI ให้รองรับทุกขนาดหน้าจอ

#### 🛠️ Technical Improvements
- **🔧 Environment Upgrade**: อัพเกรด dependencies และ configuration
- **📏 Code Quality**: เพิ่ม ESLint, Prettier, TypeScript strict mode
- **🧪 Testing**: เพิ่ม Jest, Playwright, comprehensive test suites
- **📊 Monitoring**: เพิ่ม system health checks และ logging
- **🔒 Security**: ปรับปรุง authentication และ authorization
- **⚡ Performance**: Optimize bundle size และ loading speed

#### 📦 New Dependencies
- **🎨 UI**: @radix-ui/react-*, class-variance-authority, clsx, tailwind-merge
- **🔄 State Management**: zustand, @tanstack/react-query
- **🧪 Testing**: jest, @playwright/test, @testing-library/react
- **📏 Code Quality**: prettier, commitizen, standard-version
- **🔧 Utilities**: zod, date-fns, react-hot-toast

#### 📁 New Files & Structure
```
├── src/app/invoices/              # Invoice management pages
├── src/app/payments/              # Payment management pages
├── src/app/api/invoices/          # Invoice API routes
├── src/app/api/payments/          # Payment API routes
├── src/app/api/health/            # Health check API
├── src/utils/                     # Utility functions
│   ├── errorHandler.ts           # Error handling
│   ├── logger.ts                 # Logging system
│   ├── validation.ts             # Data validation
│   ├── middleware.ts             # Server middleware
│   ├── systemHealth.ts           # Health checks
│   └── testUtils.ts              # Testing utilities
├── scripts/                       # Automation scripts
│   └── upgrade-environment.js    # Environment upgrade
└── Various test files            # Comprehensive test suites
```

#### 🔧 Major Fixes
- **✅ API Response Format**: Standardized all API responses
- **✅ Frontend Data Handling**: Fixed data extraction from API responses
- **✅ Null Safety**: Added null checks for optional relationships
- **✅ UI Components**: Fixed Select component value props
- **✅ CSS Consistency**: Unified styling across all pages
- **✅ TypeScript Errors**: Resolved all type safety issues
- **✅ Build Process**: Optimized for production deployment

#### 📊 Project Statistics
- **📁 Total Files**: 500+ files
- **🧪 Test Coverage**: Comprehensive test suites implemented
- **✅ Build Status**: Production-ready
- **🔍 Code Quality**: 0 errors, minimal warnings
- **📦 Bundle Size**: Optimized for performance
- **🌐 API Endpoints**: 20+ endpoints with standardized responses
- **🎨 UI Templates**: PageTemplate system for consistent design
- **🌐 i18n System**: Complete 3-language support (Thai, English, Chinese)
- **🚀 Development Tools**: Automated page creation with translation support

---

### 🔧 v1.1.2 (21 สิงหาคม 2025) - Enhanced Development Environment

#### ✅ การปรับปรุงสภาพแวดล้อมการพัฒนา
- **🧪 Testing Framework**: เพิ่ม Jest และ Playwright สำหรับการทดสอบ
- **🎨 UI Components**: เพิ่ม Radix UI components (Button, Input, Dialog, Table)
- **🔌 API Management**: สร้าง API client และ service wrapper พร้อม error handling
- **📏 Code Quality**: เพิ่ม Prettier และ validation tools
- **📚 Documentation**: เพิ่ม comprehensive documentation
- **🔧 TypeScript Fixes**: แก้ไข type errors และปรับปรุง type safety

#### 🔧 ฟีเจอร์ใหม่
- **📊 Table Sorting**: การเรียงลำดับในทุกตาราง (Customers, Technicians, Work Orders, Miners, Admin Users)
- **🪝 Custom Hooks**: useCustomers, useTechnicians, useWorkOrders, useMiners, useUsers
- **✅ Validation Schemas**: Zod schemas สำหรับทุก entity
- **🛠️ Utility Functions**: ฟังก์ชันช่วยเหลือต่างๆ รวมถึง work order ID generation
- **📋 Constants**: ค่าคงที่ของระบบ
- **🔄 Environment Optimization**: ปรับปรุงสภาพแวดล้อมให้พร้อมสำหรับการพัฒนาต่อไป

#### 📦 Dependencies ใหม่
- **🎨 UI**: @radix-ui/react-*, class-variance-authority, clsx, tailwind-merge
- **🔄 State Management**: zustand, @tanstack/react-query
- **🧪 Testing**: jest, @playwright/test, @testing-library/react
- **📏 Code Quality**: prettier, commitizen, standard-version

#### 📁 ไฟล์ใหม่ที่เพิ่ม
```
├── ENVIRONMENT_STATUS.md            # สถานะสภาพแวดล้อมการพัฒนา
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest setup
├── playwright.config.ts             # Playwright configuration
├── .prettierrc                      # Prettier configuration
├── src/__tests__/
│   └── utils.test.ts                # Unit tests for utilities
├── src/lib/
│   ├── utils.ts                     # Utility functions (work order ID generation)
│   ├── validations.ts               # Zod schemas
│   ├── api.ts                       # API client และ service wrapper
│   └── constants.ts                 # Application constants
├── src/hooks/
│   └── useApi.ts                    # Custom API hooks
└── src/components/ui/
   ├── button.tsx                   # Button component (Radix UI)
   ├── input.tsx                    # Input component
   ├── dialog.tsx                   # Dialog component
   ├── table.tsx                    # Table components
   └── index.ts                     # UI exports
```

#### 🔧 การแก้ไขที่สำคัญ
- **✅ TypeScript Errors**: แก้ไข API service type mismatches
- **✅ ESLint Errors**: แก้ไข import/export syntax issues
- **✅ Jest Configuration**: ปรับปรุง configuration ให้ทำงานกับ Next.js 15
- **✅ Build Process**: ทำให้ production build ผ่าน
- **✅ Testing Infrastructure**: Unit tests ผ่านทั้งหมด (5/5 tests)

#### 📊 สถิติโปรเจค
- **📁 Total Files**: 500+ files
- **🧪 Test Coverage**: Comprehensive test suites implemented
- **✅ Build Status**: Production-ready
- **🔍 Code Quality**: 0 errors, minimal warnings
- **📦 Bundle Size**: Optimized for performance
- **🌐 API Endpoints**: 20+ endpoints with standardized responses
- **🎨 UI Templates**: PageTemplate system for consistent design
- **🌐 i18n System**: Complete 3-language support (Thai, English, Chinese)
- **🚀 Development Tools**: Automated page creation with translation support

---

### 🚀 v1.3.0 (21 สิงหาคม 2025) - Complete i18n Development Environment

#### ✨ ฟีเจอร์ใหม่
- **🌐 PageTemplateWithI18n**: เทมเพลตที่รองรับ 3 ภาษาตั้งแต่ต้น
- **🔧 Translation Helper**: สร้างคำแปลอัตโนมัติสำหรับ 3 ภาษา
- **📝 Create Page Script**: สร้างหน้าใหม่พร้อมคำแปลอัตโนมัติ
- **📚 Development Guide**: คู่มือการพัฒนาครบถ้วน

#### 🛠️ การปรับปรุงทางเทคนิค
- **✅ CRUD operations**: พร้อม i18n support
- **✅ Search และ Filter**: ฟังก์ชันการค้นหาและกรอง
- **✅ Modal forms**: ฟอร์มในโมดอลพร้อม validation
- **✅ Loading states**: สถานะการโหลดและ error handling
- **✅ Toast notifications**: การแจ้งเตือน
- **✅ Responsive design**: ดีไซน์ที่รองรับทุกขนาดหน้าจอ

#### 📁 ไฟล์ใหม่
- `src/components/templates/PageTemplateWithI18n.tsx`
- `src/utils/translationHelper.ts`
- `scripts/create-page.ts`
- `docs/DEVELOPMENT_GUIDE.md`

#### 🎯 ประโยชน์ที่ได้
- **สร้างหน้าใหม่ได้ใน 1 นาที** ด้วย `npm run create-page`
- **รองรับ 3 ภาษา** ตั้งแต่ต้นโดยไม่ต้องแก้ไขทีหลัง
- **มี UI/UX ที่สอดคล้อง** กับหน้าอื่นๆ
- **มี CRUD operations** พร้อมใช้งาน
- **มี error handling** และ loading states
- **มี search และ filter** พร้อมใช้งาน

#### 📖 คู่มือการใช้งาน
```bash
# สร้างหน้าใหม่
npm run create-page suppliers Suppliers /api/suppliers

# ดูคู่มือการพัฒนาครบถ้วน
# docs/DEVELOPMENT_GUIDE.md
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

# System Health Check
curl http://localhost:3000/api/health
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
