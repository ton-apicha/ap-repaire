# 🚀 AP Repair Development Guide

## 📋 สภาพแวดล้อมการพัฒนาที่รองรับ 3 ภาษา

### 🎯 เป้าหมาย
สร้างสภาพแวดล้อมการพัฒนาที่ทำให้การสร้างหน้าใหม่ๆ ทำได้ง่าย รวดเร็ว และรองรับ 3 ภาษา (ไทย, อังกฤษ, จีน) ตั้งแต่ต้น

---

## 🛠️ เครื่องมือที่สร้างขึ้น

### 1. PageTemplateWithI18n Component
**ไฟล์**: `src/components/templates/PageTemplateWithI18n.tsx`

**คุณสมบัติ**:
- ✅ รองรับ 3 ภาษาตั้งแต่ต้น
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search และ Filter
- ✅ Sorting
- ✅ Modal forms
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

**การใช้งาน**:
```tsx
import PageTemplateWithI18n from '@/components/templates/PageTemplateWithI18n'

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

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
        { key: 'phone', labelKey: 'suppliers.fields.phone', type: 'text' },
        { key: 'address', labelKey: 'suppliers.fields.address', type: 'textarea' }
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

### 2. Translation Helper
**ไฟล์**: `src/utils/translationHelper.ts`

**คุณสมบัติ**:
- ✅ สร้างคำแปลอัตโนมัติสำหรับ 3 ภาษา
- ✅ Validation คำแปล
- ✅ Merge คำแปลใหม่เข้ากับไฟล์เดิม

**การใช้งาน**:
```typescript
import { createNewPageWithTranslations } from '@/utils/translationHelper'

const { translations, validationErrors } = createNewPageWithTranslations('suppliers', 'Suppliers')

// translations.en, translations.th, translations.zh
```

### 3. Create Page Script
**ไฟล์**: `scripts/create-page.ts`

**การใช้งาน**:
```bash
npm run create-page <pageKey> <pageName> <apiEndpoint>
```

**ตัวอย่าง**:
```bash
npm run create-page suppliers Suppliers /api/suppliers
```

**ผลลัพธ์**:
- ✅ สร้างไฟล์ `src/app/suppliers/page.tsx`
- ✅ สร้างไฟล์ `src/app/api/suppliers/route.ts`
- ✅ เพิ่มคำแปลใน `src/locales/en.ts`, `th.ts`, `zh.ts`

---

## 📝 ขั้นตอนการสร้างหน้าใหม่

### 1. ใช้ Script อัตโนมัติ (แนะนำ)
```bash
# สร้างหน้า Suppliers
npm run create-page suppliers Suppliers /api/suppliers

# สร้างหน้า Inventory
npm run create-page inventory Inventory /api/inventory

# สร้างหน้า Reports
npm run create-page reports Reports /api/reports
```

### 2. ปรับแต่งหน้า (ถ้าจำเป็น)
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
        // ปรับแต่ง columns ตามต้องการ
        { key: 'name', labelKey: 'suppliers.fields.name', sortable: true },
        { key: 'email', labelKey: 'suppliers.fields.email', sortable: true },
        { key: 'phone', labelKey: 'suppliers.fields.phone' },
        { key: 'address', labelKey: 'suppliers.fields.address' },
        { 
          key: 'status', 
          labelKey: 'suppliers.fields.status',
          render: (item) => (
            <span className={`px-2 py-1 rounded text-xs ${
              item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.status}
            </span>
          )
        }
      ]}
      formFields={[
        // ปรับแต่ง form fields ตามต้องการ
        { key: 'name', labelKey: 'suppliers.fields.name', type: 'text', required: true },
        { key: 'email', labelKey: 'suppliers.fields.email', type: 'email', required: true },
        { key: 'phone', labelKey: 'suppliers.fields.phone', type: 'text' },
        { key: 'address', labelKey: 'suppliers.fields.address', type: 'textarea' },
        {
          key: 'status',
          labelKey: 'suppliers.fields.status',
          type: 'select',
          required: true,
          options: [
            { value: 'active', labelKey: 'suppliers.statuses.active' },
            { value: 'inactive', labelKey: 'suppliers.statuses.inactive' }
          ]
        }
      ]}
      filters={[
        // ปรับแต่ง filters ตามต้องการ
        {
          key: 'status',
          labelKey: 'suppliers.fields.status',
          type: 'select',
          options: [
            { value: 'all', labelKey: 'common.all' },
            { value: 'active', labelKey: 'suppliers.statuses.active' },
            { value: 'inactive', labelKey: 'suppliers.statuses.inactive' }
          ]
        }
      ]}
      // Custom callbacks
      onAfterCreate={(supplier) => {
        console.log('Supplier created:', supplier)
      }}
      onAfterUpdate={(supplier) => {
        console.log('Supplier updated:', supplier)
      }}
      onAfterDelete={(id) => {
        console.log('Supplier deleted:', id)
      }}
    />
  )
}
```

### 3. เพิ่มใน Navigation Menu
```tsx
// src/app/layout.tsx หรือไฟล์ navigation
<a href="/suppliers" className="...">
  <Icon />
  <span>{t('suppliers.title')}</span>
</a>
```

### 4. อัปเดต Prisma Schema (ถ้าจำเป็น)
```prisma
// prisma/schema.prisma
model Supplier {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  address   String?
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🌐 การจัดการคำแปล

### โครงสร้างคำแปลที่แนะนำ
```typescript
// src/locales/en.ts
export const en = {
  suppliers: {
    title: 'Suppliers',
    description: 'Manage suppliers',
    createButton: 'Create Supplier',
    createTitle: 'Create New Supplier',
    editTitle: 'Edit Supplier',
    deleteTitle: 'Delete Supplier',
    deleteConfirmation: 'Are you sure you want to delete this supplier?',
    createSuccess: 'Supplier created successfully',
    createError: 'Failed to create supplier',
    updateSuccess: 'Supplier updated successfully',
    updateError: 'Failed to update supplier',
    deleteSuccess: 'Supplier deleted successfully',
    deleteError: 'Failed to delete supplier',
    noItems: 'No suppliers found',
    createFirst: 'Create your first supplier',
    itemName: 'suppliers',
    searchPlaceholder: 'Search suppliers...',
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      status: 'Status'
    },
    statuses: {
      active: 'Active',
      inactive: 'Inactive'
    }
  }
}
```

### การเพิ่มคำแปลใหม่
```typescript
import { addTranslationKeys } from '@/utils/translationHelper'

const newTranslations = {
  suppliers: {
    fields: {
      taxId: 'Tax ID',
      contactPerson: 'Contact Person'
    }
  }
}

// เพิ่มในไฟล์ en.ts
const updatedEn = addTranslationKeys(existingEn, newTranslations, 'en')
```

---

## 🔧 การปรับแต่งขั้นสูง

### Custom Actions
```tsx
customActions={(supplier) => (
  <>
    <ActionButton onClick={() => handleView(supplier)}>
      {t('common.view')}
    </ActionButton>
    <ActionButton onClick={() => handleDuplicate(supplier)}>
      {t('common.duplicate')}
    </ActionButton>
  </>
)}
```

### Custom Header
```tsx
customHeader={
  <div className="bg-blue-50 p-4 rounded-lg mb-6">
    <h3 className="text-lg font-medium text-blue-900">
      {t('suppliers.quickStats')}
    </h3>
    <p className="text-blue-700">
      {t('suppliers.totalCount', { count: items.length })}
    </p>
  </div>
}
```

### Custom Filters
```tsx
customFilters={
  <div className="bg-gray-50 p-4 rounded-lg mb-6">
    <h4 className="font-medium mb-2">{t('suppliers.advancedFilters')}</h4>
    {/* Custom filter components */}
  </div>
}
```

### Custom Table
```tsx
customTable={
  <div className="bg-white shadow rounded-lg">
    {/* Custom table implementation */}
  </div>
}
```

---

## 🧪 การทดสอบ

### 1. ทดสอบการทำงานพื้นฐาน
```bash
# เริ่มเซอร์วิส
npm run dev

# เปิด browser ไปที่ http://localhost:3000/suppliers
```

### 2. ทดสอบการเปลี่ยนภาษา
- คลิกปุ่ม 🇹🇭 ไทย
- คลิกปุ่ม 🇺🇸 English  
- คลิกปุ่ม 🇨🇳 中文

### 3. ทดสอบ CRUD Operations
- สร้างข้อมูลใหม่
- แก้ไขข้อมูล
- ลบข้อมูล
- ค้นหาและกรอง

---

## 📚 Best Practices

### 1. การตั้งชื่อ
- **pageKey**: ใช้ตัวพิมพ์เล็กและไม่มีช่องว่าง (เช่น `suppliers`, `workOrders`)
- **pageName**: ใช้ PascalCase (เช่น `Suppliers`, `WorkOrders`)
- **apiEndpoint**: ใช้ kebab-case (เช่น `/api/suppliers`, `/api/work-orders`)

### 2. การจัดการคำแปล
- ใช้ key ที่มีความหมายและเป็นลำดับชั้น
- หลีกเลี่ยงการ hardcode ข้อความในโค้ด
- ทดสอบการแสดงผลในทุกภาษา

### 3. การจัดการข้อมูล
- ใช้ TypeScript interfaces สำหรับ type safety
- ใช้ Zod สำหรับ validation
- จัดการ error states อย่างเหมาะสม

### 4. Performance
- ใช้ React.useMemo สำหรับ expensive calculations
- ใช้ pagination สำหรับข้อมูลจำนวนมาก
- Optimize re-renders ด้วย React.memo

---

## 🚨 Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. คำแปลไม่แสดง
```bash
# ตรวจสอบว่า import useLanguage แล้ว
import { useLanguage } from '@/contexts/LanguageContext'

# ตรวจสอบว่าใช้ t() function แล้ว
const { t } = useLanguage()
```

#### 2. API Error
```bash
# ตรวจสอบ API endpoint
# ตรวจสอบ Prisma schema
# ตรวจสอบ database connection
```

#### 3. TypeScript Error
```bash
# รัน type check
npm run type-check

# ตรวจสอบ interface definition
```

---

## 📞 การขอความช่วยเหลือ

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. ตรวจสอบ error logs ใน terminal
2. ตรวจสอบ browser console
3. ตรวจสอบ Network tab ใน DevTools
4. ปรึกษาทีมพัฒนาหรือสร้าง issue ใน repository

---

## 🎉 สรุป

ด้วยสภาพแวดล้อมการพัฒนาที่สร้างขึ้น คุณสามารถ:

✅ **สร้างหน้าใหม่ได้ใน 1 นาที** ด้วย `npm run create-page`  
✅ **รองรับ 3 ภาษา** ตั้งแต่ต้นโดยไม่ต้องแก้ไขทีหลัง  
✅ **มี UI/UX ที่สอดคล้อง** กับหน้าอื่นๆ  
✅ **มี CRUD operations** พร้อมใช้งาน  
✅ **มี error handling** และ loading states  
✅ **มี search และ filter** พร้อมใช้งาน  

**Happy Coding! 🚀**
