# 🎨 UI Components Library

## 📋 คู่มือ UI Components มาตรฐาน

> **วัตถุประสงค์**: สร้าง UI Components ที่สอดคล้องกันและใช้ซ้ำได้ เพื่อให้ผู้ใช้งานรู้สึกคุ้นชินกับระบบใหม่

---

## 🎯 หลักการออกแบบ UI

### 1. **Consistency First**
- ใช้สี, ฟอนต์, และ spacing เดียวกันทุกที่
- ใช้ interaction patterns เดียวกัน
- ใช้ visual hierarchy เดียวกัน

### 2. **Accessibility**
- รองรับ keyboard navigation
- มี proper ARIA labels
- ใช้ contrast ratio ที่เหมาะสม
- รองรับ screen readers

### 3. **Responsive Design**
- ทำงานได้ทุกขนาดหน้าจอ
- ใช้ mobile-first approach
- ปรับ layout ตามขนาดหน้าจอ

### 4. **Performance**
- ใช้ lazy loading
- Optimize bundle size
- ใช้ proper caching

---

## 🧩 Core Components

### 🎨 **Button Component**

#### 📋 Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
}
```

#### 🎨 Variants
```typescript
const buttonVariants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500',
  success: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
  danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500',
  info: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500',
}
```

#### 📏 Sizes
```typescript
const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}
```

#### 💻 Usage Example
```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button variant="primary" size="md">
  Save Changes
</Button>

// Button with icon
<Button variant="success" icon={<PlusIcon />} iconPosition="left">
  Add New
</Button>

// Loading button
<Button variant="primary" loading>
  Processing...
</Button>
```

---

### 📝 **Input Component**

#### 📋 Props Interface
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}
```

#### 🎨 Styling
```typescript
const inputStyles = {
  base: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'border-red-500 focus:ring-red-500',
  disabled: 'bg-gray-100 cursor-not-allowed',
}
```

#### 💻 Usage Example
```tsx
import { Input } from '@/components/ui/Input';

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password is required"
/>

// Input with icon
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>
```

---

### 📋 **Select Component**

#### 📋 Props Interface
```typescript
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

#### 💻 Usage Example
```tsx
import { Select } from '@/components/ui/Select';

const options = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

<Select
  label="Status"
  value={status}
  onChange={setStatus}
  options={options}
  placeholder="Select status"
/>
```

---

### 📊 **Table Component**

#### 📋 Props Interface
```typescript
interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  sortable?: boolean;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}
```

#### 💻 Usage Example
```tsx
import { Table } from '@/components/ui/Table';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'actions', label: 'Actions', render: (_, row) => <ActionButtons row={row} /> },
];

<Table
  data={customers}
  columns={columns}
  sortable
  onSort={handleSort}
  loading={loading}
  pagination={pagination}
/>
```

---

### 🎭 **Modal Component**

#### 📋 Props Interface
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

#### 📏 Sizes
```typescript
const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}
```

#### 💻 Usage Example
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit Customer"
  size="lg"
>
  <CustomerForm customer={selectedCustomer} onSubmit={handleSubmit} />
</Modal>
```

---

### 📊 **Card Component**

#### 📋 Props Interface
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

#### 🎨 Variants
```typescript
const cardVariants = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg border-0',
  outlined: 'bg-transparent border-2 border-gray-200',
}
```

#### 💻 Usage Example
```tsx
import { Card } from '@/components/ui/Card';

<Card
  title="Customer Information"
  subtitle="Basic customer details"
  actions={<Button>Edit</Button>}
  variant="elevated"
>
  <p>Customer details content...</p>
</Card>
```

---

## 🎨 Status Components

### 🏷️ **Status Badge**

#### 📋 Props Interface
```typescript
interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'pill' | 'dot';
  size?: 'sm' | 'md' | 'lg';
}
```

#### 🎨 Status Colors
```typescript
const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  suspended: 'bg-orange-100 text-orange-800 border-orange-200',
}
```

#### 💻 Usage Example
```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge status="active" variant="pill" />
<StatusBadge status="pending" variant="dot" />
```

---

### 📈 **Progress Bar**

#### 📋 Props Interface
```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}
```

#### 💻 Usage Example
```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar
  value={75}
  max={100}
  variant="success"
  showLabel
  animated
/>
```

---

## 📱 Layout Components

### 🧭 **Sidebar Component**

#### 📋 Props Interface
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string | number;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

#### 💻 Usage Example
```tsx
import { Sidebar } from '@/components/layout/Sidebar';

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: <UsersIcon />,
    badge: '12',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />,
    children: [
      { label: 'General', href: '/settings/general' },
      { label: 'Security', href: '/settings/security' },
    ],
  },
];

<Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  items={sidebarItems}
  collapsed={sidebarCollapsed}
  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
/>
```

---

### 📋 **Header Component**

#### 📋 Props Interface
```typescript
interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  onMenuClick?: () => void;
}
```

#### 💻 Usage Example
```tsx
import { Header } from '@/components/layout/Header';

<Header
  title="Customer Management"
  subtitle="Manage your customer data"
  actions={<Button>Add Customer</Button>}
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers' },
  ]}
  onMenuClick={() => setSidebarOpen(true)}
/>
```

---

## 🎨 Form Components

### 📝 **Form Field**

#### 📋 Props Interface
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

#### 💻 Usage Example
```tsx
import { FormField } from '@/components/ui/FormField';

<FormField
  label="Email Address"
  error={errors.email}
  helperText="We'll never share your email"
  required
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormField>
```

---

### 🔍 **Search Input**

#### 📋 Props Interface
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  clearable?: boolean;
}
```

#### 💻 Usage Example
```tsx
import { SearchInput } from '@/components/ui/SearchInput';

<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search customers..."
  onSearch={handleSearch}
  debounceMs={300}
  clearable
/>
```

---

## 🎨 Data Display Components

### 📊 **Data Table**

#### 📋 Props Interface
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  sorting?: SortingProps;
  filtering?: FilteringProps;
  selection?: SelectionProps<T>;
  onRowClick?: (row: T) => void;
}
```

#### 💻 Usage Example
```tsx
import { DataTable } from '@/components/ui/DataTable';

<DataTable
  data={customers}
  columns={customerColumns}
  loading={loading}
  pagination={{
    page: currentPage,
    limit: pageSize,
    total: totalCount,
    onPageChange: setCurrentPage,
  }}
  sorting={{
    sortBy: sortBy,
    sortOrder: sortOrder,
    onSort: handleSort,
  }}
  filtering={{
    filters: filters,
    onFilterChange: setFilters,
  }}
  onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
/>
```

---

### 📈 **Chart Components**

#### 📊 **Line Chart**
```tsx
import { LineChart } from '@/components/ui/charts/LineChart';

<LineChart
  data={chartData}
  xKey="date"
  yKey="value"
  title="Revenue Trend"
  color="blue"
/>
```

#### 📊 **Bar Chart**
```tsx
import { BarChart } from '@/components/ui/charts/BarChart';

<BarChart
  data={chartData}
  xKey="category"
  yKey="value"
  title="Sales by Category"
  colors={['blue', 'green', 'yellow']}
/>
```

#### 📊 **Pie Chart**
```tsx
import { PieChart } from '@/components/ui/charts/PieChart';

<PieChart
  data={chartData}
  nameKey="category"
  valueKey="value"
  title="Market Share"
/>
```

---

## 🎨 Feedback Components

### 🔔 **Toast Notification**

#### 📋 Props Interface
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}
```

#### 💻 Usage Example
```tsx
import { toast } from '@/components/ui/Toast';

// Success toast
toast.success('Success!', 'Your changes have been saved.');

// Error toast
toast.error('Error!', 'Something went wrong. Please try again.');

// Warning toast
toast.warning('Warning!', 'Please review your input.');

// Info toast
toast.info('Info', 'New features are available.');
```

---

### 🎭 **Alert Component**

#### 📋 Props Interface
```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

#### 💻 Usage Example
```tsx
import { Alert } from '@/components/ui/Alert';

<Alert type="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

<Alert type="error" dismissible onDismiss={() => setShowAlert(false)}>
  An error occurred while processing your request.
</Alert>
```

---

## 🎨 Loading Components

### ⏳ **Spinner Component**

#### 📋 Props Interface
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
}
```

#### 💻 Usage Example
```tsx
import { Spinner } from '@/components/ui/Spinner';

<Spinner size="md" color="primary" text="Loading..." />
```

---

### 📄 **Skeleton Component**

#### 📋 Props Interface
```typescript
interface SkeletonProps {
  type: 'text' | 'avatar' | 'button' | 'card';
  lines?: number;
  width?: string;
  height?: string;
}
```

#### 💻 Usage Example
```tsx
import { Skeleton } from '@/components/ui/Skeleton';

// Text skeleton
<Skeleton type="text" lines={3} />

// Avatar skeleton
<Skeleton type="avatar" width="40px" height="40px" />

// Card skeleton
<Skeleton type="card" />
```

---

## 🎨 Utility Components

### 🔧 **Tooltip Component**

#### 📋 Props Interface
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}
```

#### 💻 Usage Example
```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="This is a helpful tooltip" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

---

### 📋 **Dropdown Component**

#### 📋 Props Interface
```typescript
interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    divider?: boolean;
  }>;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}
```

#### 💻 Usage Example
```tsx
import { Dropdown } from '@/components/ui/Dropdown';

<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { label: 'Edit', onClick: handleEdit, icon: <EditIcon /> },
    { label: 'Delete', onClick: handleDelete, icon: <DeleteIcon /> },
    { divider: true },
    { label: 'Export', onClick: handleExport, icon: <ExportIcon /> },
  ]}
/>
```

---

## 🎨 Theme Configuration

### 🎨 **Color Palette**
```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
}
```

### 📏 **Spacing Scale**
```typescript
const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
}
```

### 📝 **Typography Scale**
```typescript
const typography = {
  xs: { fontSize: '12px', lineHeight: '16px' },
  sm: { fontSize: '14px', lineHeight: '20px' },
  base: { fontSize: '16px', lineHeight: '24px' },
  lg: { fontSize: '18px', lineHeight: '28px' },
  xl: { fontSize: '20px', lineHeight: '28px' },
  '2xl': { fontSize: '24px', lineHeight: '32px' },
  '3xl': { fontSize: '30px', lineHeight: '36px' },
  '4xl': { fontSize: '36px', lineHeight: '40px' },
  '5xl': { fontSize: '48px', lineHeight: '48px' },
  '6xl': { fontSize: '60px', lineHeight: '60px' },
}
```

---

## 🎯 สรุป

การใช้ UI Components Library นี้จะช่วยให้:

1. **ความสอดคล้อง** - UI ที่เหมือนกันทุกโปรเจค
2. **การพัฒนาที่เร็วขึ้น** - ใช้ components สำเร็จรูป
3. **การบำรุงรักษาที่ง่าย** - แก้ไขที่เดียวใช้ได้ทุกที่
4. **คุณภาพที่สูง** - ผ่านการทดสอบและใช้งานจริง
5. **ประสบการณ์ผู้ใช้ที่ดี** - UI/UX ที่คุ้นชิน

**🎨 ใช้ UI Components Library นี้เพื่อสร้างประสบการณ์ผู้ใช้ที่สอดคล้องกัน!**
