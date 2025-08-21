# 📋 Page Template Guide - AP Repair System

## 🎯 ภาพรวม

เทมเพลตหลัก `PageTemplate` ถูกออกแบบมาเพื่อให้หน้าต่างๆ ในระบบ AP Repair มีโครงสร้างและ UI ที่สอดคล้องกัน โดยใช้หน้า **Payments** เป็นต้นแบบ

## 🏗️ โครงสร้างหลัก

### 1. PageTemplate Component

```tsx
import PageTemplate from '@/components/ui/PageTemplate'

<PageTemplate
  title="ชื่อหน้า"
  description="คำอธิบายหน้า"
  showCreateButton={true}
  createButtonText="Create Item"
  onCreateClick={() => console.log('Create clicked')}
  itemCount={items.length}
  itemName="items"
>
  {/* Content */}
</PageTemplate>
```

### 2. Props ที่ใช้ได้

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | หัวข้อหลักของหน้า |
| `description` | string | - | คำอธิบายหน้า |
| `showCreateButton` | boolean | false | แสดงปุ่ม Create |
| `createButtonText` | string | "Create" | ข้อความปุ่ม Create |
| `onCreateClick` | function | - | ฟังก์ชันเมื่อคลิกปุ่ม Create |
| `itemCount` | number | - | จำนวนรายการ |
| `itemName` | string | "items" | ชื่อรายการ |

## 🧩 Components ที่ใช้ได้

### 1. FilterSection
```tsx
import { FilterSection } from '@/components/ui/PageTemplate'

<FilterSection>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SearchInput />
    <FilterSelect />
  </div>
</FilterSection>
```

### 2. DataTable
```tsx
import { DataTable } from '@/components/ui/PageTemplate'

<DataTable>
  <table className="min-w-full divide-y divide-gray-200">
    {/* Table content */}
  </table>
</DataTable>
```

### 3. SearchInput
```tsx
import { SearchInput } from '@/components/ui/PageTemplate'

<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search items..."
/>
```

### 4. FilterSelect
```tsx
import { FilterSelect } from '@/components/ui/PageTemplate'

<FilterSelect
  value={filterValue}
  onChange={setFilterValue}
  options={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' }
  ]}
  placeholder="Filter by status"
/>
```

### 5. SortableHeader
```tsx
import { SortableHeader } from '@/components/ui/PageTemplate'

<SortableHeader
  field="name"
  currentSort={sortField}
  sortDirection={sortDirection}
  onSort={handleSort}
>
  Name
</SortableHeader>
```

### 6. ActionButton & ActionButtons
```tsx
import { ActionButton, ActionButtons } from '@/components/ui/PageTemplate'

<ActionButtons>
  <ActionButton onClick={() => handleView(item.id)}>
    View
  </ActionButton>
  <ActionButton onClick={() => handleEdit(item.id)}>
    Edit
  </ActionButton>
  <ActionButton onClick={() => handleDelete(item.id)} variant="danger">
    Delete
  </ActionButton>
</ActionButtons>
```

### 7. EmptyState
```tsx
import { EmptyState } from '@/components/ui/PageTemplate'

<EmptyState
  message="No items found"
  actionText="Create Item"
  onAction={() => handleCreate()}
/>
```

### 8. LoadingSpinner & ErrorState
```tsx
import { LoadingSpinner, ErrorState } from '@/components/ui/PageTemplate'

if (loading) return <LoadingSpinner />
if (error) return <ErrorState error={error} onRetry={fetchData} />
```

## 🎨 Action Button Variants

| Variant | สี | ใช้สำหรับ |
|---------|----|-----------|
| `default` | Gray | ปุ่มทั่วไป |
| `primary` | Blue | ปุ่มหลัก |
| `danger` | Red | ปุ่มลบ/อันตราย |

## 📝 ตัวอย่างการใช้งาน

### หน้าตารางข้อมูลทั่วไป

```tsx
'use client'

import React, { useState, useEffect } from 'react'
import PageTemplate, { 
  FilterSection, 
  DataTable, 
  ActionButton, 
  ActionButtons, 
  SortableHeader, 
  SearchInput, 
  FilterSelect, 
  EmptyState, 
  LoadingSpinner, 
  ErrorState 
} from '@/components/ui/PageTemplate'

export default function ItemsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  // Fetch data logic...

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState error={error} onRetry={fetchData} />

  return (
    <PageTemplate
      title="Items"
      description="Manage items"
      showCreateButton={true}
      createButtonText="Create Item"
      onCreateClick={handleCreate}
      itemCount={items.length}
      itemName="items"
    >
      {/* Filters */}
      <FilterSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search items..."
          />
          <FilterSelect
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' }
            ]}
            placeholder="Filter by status"
          />
        </div>
      </FilterSection>

      {/* Data Table */}
      <DataTable>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader
                field="name"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Name
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <EmptyState
                message="No items found"
                actionText="Create Item"
                onAction={handleCreate}
              />
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons>
                      <ActionButton onClick={() => handleView(item.id)}>
                        View
                      </ActionButton>
                      <ActionButton onClick={() => handleEdit(item.id)}>
                        Edit
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>
    </PageTemplate>
  )
}
```

## 🎯 หน้าที่ใช้เทมเพลตแล้ว

- ✅ **Payments** (`/payments`) - ต้นแบบ
- ✅ **Invoices** (`/invoices`) - ปรับปรุงแล้ว

## 📋 หน้าที่ต้องปรับปรุง

- 🔄 **Work Orders** (`/work-orders`)
- 🔄 **Customers** (`/customers`)
- 🔄 **Technicians** (`/technicians`)
- 🔄 **Miner Models** (`/miners`)
- 🔄 **Dashboard** (`/dashboard`)

## 🚀 ข้อดีของเทมเพลต

1. **ความสอดคล้อง** - UI เหมือนกันทุกหน้า
2. **การบำรุงรักษาง่าย** - แก้ไขที่เดียวได้ผลทุกหน้า
3. **การพัฒนารวดเร็ว** - ใช้ component สำเร็จรูป
4. **UX ที่ดี** - ปุ่ม Actions ที่ใช้งานง่าย
5. **Responsive** - ทำงานได้ทุกขนาดหน้าจอ

## 🎨 สีและสไตล์

### สีหลัก
- **Blue**: `bg-blue-600`, `hover:bg-blue-700` (ปุ่มหลัก)
- **Gray**: `bg-gray-300`, `hover:bg-gray-400` (ปุ่มทั่วไป)
- **Red**: `bg-red-600`, `hover:bg-red-700` (ปุ่มอันตราย)

### ขนาดและระยะห่าง
- **Padding**: `p-6` (container), `px-4 py-2` (ปุ่ม)
- **Margin**: `space-y-6` (ระหว่าง section)
- **Border Radius**: `rounded-md` (ปุ่ม), `rounded-lg` (card)

## 📞 การสนับสนุน

หากมีปัญหาหรือต้องการปรับปรุงเทมเพลต กรุณาติดต่อทีมพัฒนา

