# 📋 Project Templates & Quick Start

## 🚀 เทมเพลตโปรเจคสำหรับการเริ่มต้นใหม่

> **วัตถุประสงค์**: เทมเพลตสำเร็จรูปสำหรับสร้างโปรเจคใหม่ที่สอดคล้องกับมาตรฐานการพัฒนา

---

## 🎯 เทมเพลตโปรเจคหลัก

### 1. **📊 Management System Template**
สำหรับระบบจัดการข้อมูลทั่วไป (ลูกค้า, สินค้า, ใบสั่งซื้อ, ฯลฯ)

### 2. **🏢 Business Management Template**
สำหรับระบบจัดการธุรกิจ (พนักงาน, เงินเดือน, ใบแจ้งหนี้, ฯลฯ)

### 3. **🛠️ Service Management Template**
สำหรับระบบจัดการบริการ (งานซ่อม, บริการ, การนัดหมาย, ฯลฯ)

### 4. **📦 Inventory Management Template**
สำหรับระบบจัดการคลังสินค้า (สินค้า, สต็อก, การจัดซื้อ, ฯลฯ)

---

## 🚀 Quick Start Templates

### 📊 **Template 1: Basic Management System**

#### 🎯 ใช้สำหรับ
- ระบบจัดการลูกค้า
- ระบบจัดการสินค้า
- ระบบจัดการใบสั่งซื้อ
- ระบบจัดการข้อมูลทั่วไป

#### 📁 โครงสร้าง
```
project-name/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── templates/
│   ├── lib/
│   ├── locales/
│   └── types/
├── prisma/
└── scripts/
```

#### 🔧 ฟีเจอร์หลัก
- Dashboard พร้อมสถิติ
- CRUD operations สำหรับ entities หลัก
- ระบบค้นหาและกรอง
- ระบบหลายภาษา (ไทย, อังกฤษ, จีน)
- ระบบจัดการผู้ใช้และสิทธิ์

#### 📋 Database Schema
```prisma
model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  address   String?
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  stock       Int      @default(0)
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id         String      @id @default(cuid())
  customerId String
  customer   Customer    @relation(fields: [customerId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Decimal
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
  SUSPENDED
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}
```

---

### 🏢 **Template 2: Business Management System**

#### 🎯 ใช้สำหรับ
- ระบบจัดการพนักงาน
- ระบบเงินเดือน
- ระบบใบแจ้งหนี้
- ระบบการชำระเงิน

#### 📁 โครงสร้าง
```
project-name/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── payroll/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── locales/
│   └── types/
├── prisma/
└── scripts/
```

#### 🔧 ฟีเจอร์หลัก
- ระบบจัดการพนักงาน
- ระบบเงินเดือนและสวัสดิการ
- ระบบใบแจ้งหนี้และการชำระเงิน
- ระบบรายงานและสถิติ
- ระบบจัดการสิทธิ์และบทบาท

#### 📋 Database Schema
```prisma
model Employee {
  id           String   @id @default(cuid())
  employeeId   String   @unique
  firstName    String
  lastName     String
  email        String   @unique
  phone        String?
  position     String
  department   String
  salary       Decimal
  hireDate     DateTime
  status       Status   @default(ACTIVE)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  payrolls     Payroll[]
}

model Payroll {
  id         String   @id @default(cuid())
  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id])
  month      Int
  year       Int
  baseSalary Decimal
  bonus      Decimal  @default(0)
  deduction  Decimal  @default(0)
  netSalary  Decimal
  status     PayrollStatus @default(PENDING)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Invoice {
  id          String   @id @default(cuid())
  invoiceNumber String @unique
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  amount      Decimal
  tax         Decimal  @default(0)
  total       Decimal
  status      InvoiceStatus @default(DRAFT)
  dueDate     DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  payments    Payment[]
}

model Payment {
  id         String   @id @default(cuid())
  invoiceId  String
  invoice    Invoice  @relation(fields: [invoiceId], references: [id])
  amount     Decimal
  method     PaymentMethod
  status     PaymentStatus @default(PENDING)
  paidAt     DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum PayrollStatus {
  PENDING
  PROCESSED
  PAID
  CANCELLED
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

enum PaymentMethod {
  CASH
  BANK_TRANSFER
  CREDIT_CARD
  DEBIT_CARD
  CHECK
  DIGITAL_WALLET
}
```

---

### 🛠️ **Template 3: Service Management System**

#### 🎯 ใช้สำหรับ
- ระบบจัดการงานซ่อม
- ระบบจัดการบริการ
- ระบบการนัดหมาย
- ระบบติดตามงาน

#### 📁 โครงสร้าง
```
project-name/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── technicians/
│   │   ├── work-orders/
│   │   ├── appointments/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── locales/
│   └── types/
├── prisma/
└── scripts/
```

#### 🔧 ฟีเจอร์หลัก
- ระบบจัดการลูกค้า
- ระบบจัดการช่าง/ผู้ให้บริการ
- ระบบใบงาน/งานบริการ
- ระบบการนัดหมาย
- ระบบติดตามสถานะงาน

#### 📋 Database Schema
```prisma
model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  address   String?
  company   String?
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  workOrders WorkOrder[]
  appointments Appointment[]
}

model Technician {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phone       String
  skills      String[]
  hourlyRate  Decimal
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  workOrders  WorkOrder[]
  appointments Appointment[]
}

model WorkOrder {
  id          String      @id @default(cuid())
  workOrderNumber String  @unique
  customerId  String
  customer    Customer    @relation(fields: [customerId], references: [id])
  technicianId String?
  technician  Technician? @relation(fields: [technicianId], references: [id])
  title       String
  description String
  priority    Priority    @default(MEDIUM)
  status      WorkOrderStatus @default(PENDING)
  estimatedCost Decimal?
  actualCost   Decimal?
  startDate    DateTime?
  completedDate DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Appointment {
  id           String   @id @default(cuid())
  customerId   String
  customer     Customer @relation(fields: [customerId], references: [id])
  technicianId String?
  technician   Technician? @relation(fields: [technicianId], references: [id])
  date         DateTime
  duration     Int      // minutes
  notes        String?
  status       AppointmentStatus @default(SCHEDULED)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum WorkOrderStatus {
  PENDING
  IN_PROGRESS
  WAITING_PARTS
  COMPLETED
  CANCELLED
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

---

### 📦 **Template 4: Inventory Management System**

#### 🎯 ใช้สำหรับ
- ระบบจัดการคลังสินค้า
- ระบบจัดซื้อจัดจ้าง
- ระบบจัดการซัพพลายเออร์
- ระบบรายงานสต็อก

#### 📁 โครงสร้าง
```
project-name/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── inventory/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── locales/
│   └── types/
├── prisma/
└── scripts/
```

#### 🔧 ฟีเจอร์หลัก
- ระบบจัดการสินค้าและสต็อก
- ระบบจัดการซัพพลายเออร์
- ระบบจัดซื้อจัดจ้าง
- ระบบรายงานและแจ้งเตือน
- ระบบจัดการคลังสินค้า

#### 📋 Database Schema
```prisma
model Product {
  id          String   @id @default(cuid())
  sku         String   @unique
  name        String
  description String?
  category    String
  unit        String
  costPrice   Decimal
  sellingPrice Decimal
  minStock    Int      @default(0)
  maxStock    Int?
  currentStock Int     @default(0)
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  purchaseItems PurchaseItem[]
  stockMovements StockMovement[]
}

model Supplier {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  address   String?
  contactPerson String?
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  purchases Purchase[]
}

model Purchase {
  id           String   @id @default(cuid())
  purchaseNumber String @unique
  supplierId   String
  supplier     Supplier @relation(fields: [supplierId], references: [id])
  orderDate    DateTime
  expectedDate DateTime?
  receivedDate DateTime?
  totalAmount  Decimal
  status       PurchaseStatus @default(PENDING)
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  items        PurchaseItem[]
}

model PurchaseItem {
  id         String  @id @default(cuid())
  purchaseId String
  purchase   Purchase @relation(fields: [purchaseId], references: [id])
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  quantity   Int
  unitPrice  Decimal
  totalPrice Decimal
}

model StockMovement {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  type      MovementType
  quantity  Int
  reference String?  // Purchase number, Order number, etc.
  notes     String?
  createdAt DateTime @default(now())
}

enum PurchaseStatus {
  PENDING
  ORDERED
  RECEIVED
  CANCELLED
}

enum MovementType {
  IN
  OUT
  ADJUSTMENT
}
```

---

## 🚀 การใช้เทมเพลต

### 📋 ขั้นตอนการสร้างโปรเจคใหม่

#### 1. **เลือกเทมเพลตที่เหมาะสม**
```bash
# ดูรายการเทมเพลต
ls templates/

# เลือกเทมเพลต
cp -r templates/basic-management-system new-project-name
```

#### 2. **ปรับแต่งโปรเจค**
```bash
cd new-project-name

# เปลี่ยนชื่อโปรเจค
sed -i 's/old-project-name/new-project-name/g' package.json
sed -i 's/Old Project Name/New Project Name/g' README.md

# ติดตั้ง dependencies
npm install
```

#### 3. **ปรับแต่งฐานข้อมูล**
```bash
# แก้ไข schema.prisma ตามความต้องการ
nano prisma/schema.prisma

# สร้าง migration
npx prisma migrate dev --name init

# สร้าง seed data
node scripts/seed-data.js
```

#### 4. **ปรับแต่ง UI/UX**
```bash
# แก้ไขสีและธีม
nano tailwind.config.ts

# แก้ไข layout
nano src/components/layout/Sidebar.tsx
```

#### 5. **ปรับแต่งการแปลภาษา**
```bash
# แก้ไขคำแปล
nano src/locales/th.ts
nano src/locales/en.ts
nano src/locales/zh.ts
```

---

## 🎯 เทมเพลตพิเศษ

### 🔧 **Template 5: Custom Template Generator**

#### 📋 สร้างเทมเพลตใหม่
```bash
# สร้างเทมเพลตใหม่
npm run create-template custom-template-name

# ใช้เทมเพลตใหม่
npm run use-template custom-template-name new-project-name
```

#### 🔧 ฟีเจอร์
- สร้างเทมเพลตตามความต้องการ
- กำหนด entities และ relationships
- สร้าง UI components อัตโนมัติ
- สร้าง API routes อัตโนมัติ
- สร้างคำแปลอัตโนมัติ

---

## 📚 คู่มือการใช้งาน

### 🎯 การเลือกเทมเพลต

#### **เลือก Basic Management System เมื่อ:**
- ต้องการระบบจัดการข้อมูลทั่วไป
- มี entities หลัก 3-5 ตัว
- ไม่ต้องการฟีเจอร์ซับซ้อน

#### **เลือก Business Management System เมื่อ:**
- ต้องการระบบจัดการธุรกิจ
- มีระบบเงินเดือนและใบแจ้งหนี้
- ต้องการระบบรายงานทางการเงิน

#### **เลือก Service Management System เมื่อ:**
- ต้องการระบบจัดการบริการ
- มีการนัดหมายและติดตามงาน
- ต้องการระบบจัดการช่าง/ผู้ให้บริการ

#### **เลือก Inventory Management System เมื่อ:**
- ต้องการระบบจัดการคลังสินค้า
- มีการจัดซื้อจัดจ้าง
- ต้องการระบบแจ้งเตือนสต็อก

### 🔧 การปรับแต่งเทมเพลต

#### **ปรับแต่ง Database Schema:**
1. แก้ไข `prisma/schema.prisma`
2. เพิ่ม/ลบ models ตามต้องการ
3. รัน migration: `npx prisma migrate dev`
4. อัพเดท types: `npx prisma generate`

#### **ปรับแต่ง UI Components:**
1. แก้ไข `src/components/ui/`
2. ปรับแต่งสีใน `tailwind.config.ts`
3. แก้ไข layout ใน `src/components/layout/`

#### **ปรับแต่ง API Routes:**
1. แก้ไข `src/app/api/`
2. เพิ่ม/ลบ endpoints ตามต้องการ
3. อัพเดท validation schemas

#### **ปรับแต่งการแปลภาษา:**
1. แก้ไข `src/locales/th.ts`, `en.ts`, `zh.ts`
2. เพิ่มคำแปลใหม่
3. อัพเดท translation keys

---

## 🎯 สรุป

การใช้เทมเพลตโปรเจคจะช่วยให้:

1. **เริ่มต้นโปรเจคใหม่ได้เร็วขึ้น** - ไม่ต้องสร้างจากศูนย์
2. **มีโครงสร้างที่สอดคล้องกัน** - ตามมาตรฐานการพัฒนา
3. **มีฟีเจอร์พื้นฐานครบถ้วน** - CRUD, i18n, authentication
4. **ปรับแต่งได้ง่าย** - แก้ไขตามความต้องการ
5. **มีคุณภาพสูง** - ผ่านการทดสอบและใช้งานจริง

**🚀 เลือกเทมเพลตที่เหมาะสมและเริ่มต้นโปรเจคใหม่ได้ทันที!**
