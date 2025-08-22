# 🚀 Development Standards & Templates

## 📋 คู่มือการพัฒนามาตรฐานสำหรับโปรเจคใหม่

> **วัตถุประสงค์**: สร้างรูปแบบการเขียนโปรแกรมที่สอดคล้องกัน เพื่อให้ผู้ใช้งานรู้สึกคุ้นชินเวลาเขียนโปรแกรมใหม่ๆ

---

## 🎯 หลักการพื้นฐาน

### 1. **Consistency First**
- ใช้รูปแบบการเขียนโค้ดที่สอดคล้องกันทุกโปรเจค
- ใช้ชื่อตัวแปร, ฟังก์ชัน, และโครงสร้างไฟล์ที่เหมือนกัน
- ใช้ UI/UX patterns เดียวกัน

### 2. **User Experience Continuity**
- ผู้ใช้งานควรรู้สึกคุ้นชินเมื่อใช้ระบบใหม่
- ใช้ layout, navigation, และ interaction patterns เดียวกัน
- ใช้สี, ฟอนต์, และ visual elements ที่สอดคล้องกัน

### 3. **Multi-language Support from Start**
- ทุกโปรเจคต้องรองรับ 3 ภาษาตั้งแต่ต้น (ไทย, อังกฤษ, จีน)
- ใช้ระบบ i18n เดียวกัน
- ใช้โครงสร้างไฟล์แปลภาษาที่เหมือนกัน

---

## 🏗️ โครงสร้างโปรเจคมาตรฐาน

### 📁 โครงสร้างโฟลเดอร์
```
project-name/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/         # หน้าแดชบอร์ด
│   │   ├── [entity]/          # หน้าจัดการข้อมูล
│   │   ├── admin/             # ระบบหลังบ้าน
│   │   └── api/               # API Routes
│   ├── components/            # React Components
│   │   ├── layout/           # Layout Components
│   │   ├── ui/               # UI Components
│   │   ├── templates/        # Template Components
│   │   └── forms/            # Form Components
│   ├── contexts/             # React Contexts
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Utilities และ Configs
│   ├── locales/              # ไฟล์แปลภาษา
│   ├── types/                # TypeScript Types
│   └── utils/                # Utility Functions
├── prisma/                   # Database Schema
├── scripts/                  # Automation Scripts
├── docs/                     # Documentation
└── tests/                    # Test Files
```

### 📄 ไฟล์ที่ต้องมีเสมอ
```
project-name/
├── README.md                 # เอกสารหลัก
├── DEVELOPMENT_STANDARDS.md  # คู่มือการพัฒนามาตรฐาน
├── DEVELOPMENT_COMMANDS.md   # ชุดคำสั่งสำเร็จรูป
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind CSS Config
├── tsconfig.json             # TypeScript Config
├── .env.example              # Environment Variables Example
├── .gitignore                # Git Ignore
└── prisma/schema.prisma      # Database Schema
```

---

## 🎨 UI/UX Standards

### 🎯 Design System
```typescript
// สีหลักที่ใช้เสมอ
const colors = {
  primary: '#3B82F6',      // Blue-500
  secondary: '#6B7280',    // Gray-500
  success: '#10B981',      // Green-500
  warning: '#F59E0B',      // Amber-500
  error: '#EF4444',        // Red-500
  info: '#06B6D4',         // Cyan-500
}

// ฟอนต์ที่ใช้เสมอ
const fonts = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### 📱 Layout Patterns
```typescript
// Layout หลักที่ใช้เสมอ
const MainLayout = {
  sidebar: 'w-64 bg-white border-r border-gray-200',
  header: 'h-16 bg-white border-b border-gray-200',
  content: 'flex-1 p-6 bg-gray-50',
  container: 'max-w-7xl mx-auto',
}
```

### 🧩 Component Patterns
```typescript
// ปุ่มมาตรฐาน
const ButtonVariants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

// การ์ดมาตรฐาน
const CardPattern = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
```

---

## 🌐 Internationalization (i18n) Standards

### 📁 โครงสร้างไฟล์แปลภาษา
```typescript
// src/locales/en.ts
export const en = {
  common: {
    title: 'System Title',
    description: 'System Description',
    actions: {
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
    },
  },
  navigation: {
    dashboard: 'Dashboard',
    users: 'Users',
    settings: 'Settings',
    admin: 'Admin',
  },
  // Entity-specific translations
  [entityName]: {
    title: '[Entity] Management',
    description: 'Manage [entity] data',
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      status: 'Status',
    },
    actions: {
      create: 'Create [Entity]',
      edit: 'Edit [Entity]',
      delete: 'Delete [Entity]',
    },
  },
}
```

### 🔧 i18n Configuration
```typescript
// src/lib/i18n.ts
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'th', 'zh'],
  localeNames: {
    en: 'English',
    th: 'ไทย',
    zh: '中文',
  },
}
```

---

## 🗄️ Database Standards

### 📊 Schema Patterns
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  USER
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
  SUSPENDED
}
```

### 🔑 Naming Conventions
- **Tables**: lowercase, plural (users, products, orders)
- **Columns**: camelCase (firstName, createdAt, isActive)
- **Enums**: UPPER_SNAKE_CASE (ACTIVE, PENDING, COMPLETED)
- **Relations**: camelCase (userId, productId)

---

## 🔧 API Standards

### 📡 API Response Format
```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Example Response
{
  "success": true,
  "data": [...],
  "message": "Data retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 🛣️ API Route Structure
```typescript
// src/app/api/[entity]/route.ts
export async function GET(request: Request) {
  try {
    // Implementation
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

---

## 🧩 Component Standards

### 📄 Page Template Pattern
```typescript
// src/components/templates/PageTemplate.tsx
interface PageTemplateProps<T> {
  pageKey: string;
  titleKey: string;
  descriptionKey: string;
  apiEndpoint: string;
  columns: Column[];
  formFields: FormField[];
  filters?: Filter[];
}

export function PageTemplate<T>({
  pageKey,
  titleKey,
  descriptionKey,
  apiEndpoint,
  columns,
  formFields,
  filters
}: PageTemplateProps<T>) {
  // Implementation
}
```

### 🎨 UI Component Pattern
```typescript
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}: ButtonProps) {
  // Implementation
}
```

---

## 🧪 Testing Standards

### 📋 Test Structure
```typescript
// src/__tests__/[component].test.tsx
import { render, screen } from '@testing-library/react';
import { Component } from '../components/Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

### 🔧 Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

---

## 🚀 Development Commands

### 📝 Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "create-page": "node scripts/create-page.js",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

## 📚 Documentation Standards

### 📖 README.md Structure
```markdown
# Project Name - ระบบจัดการ [Domain]

## คุณสมบัติหลัก
- Feature 1
- Feature 2
- Feature 3

## การติดตั้ง
1. Clone โปรเจค
2. ติดตั้ง dependencies
3. ตั้งค่าฐานข้อมูล
4. รันโปรเจค

## การใช้งาน
- การใช้งาน Feature 1
- การใช้งาน Feature 2

## การพัฒนาต่อ
- การเพิ่มฟีเจอร์ใหม่
- การแก้ไขฐานข้อมูล
- การทดสอบ

## License
MIT License
```

### 📋 API Documentation
```markdown
## API Endpoints

### GET /api/[entity]
Get all [entity] records

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `filter`: Filter criteria

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```
```

---

## 🔒 Security Standards

### 🛡️ Authentication & Authorization
```typescript
// src/lib/auth.ts
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implementation
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Implementation
    },
    async session({ session, token }) {
      // Implementation
    }
  }
}
```

### 🔐 Role-Based Access Control (RBAC)
```typescript
// src/lib/permissions.ts
export const permissions = {
  users: {
    view: 'users.view',
    manage: 'users.manage',
  },
  products: {
    view: 'products.view',
    manage: 'products.manage',
  },
  // ... more permissions
}

export const roles = {
  SUPER_ADMIN: Object.values(permissions).flat(),
  ADMIN: ['users.view', 'products.view', 'products.manage'],
  USER: ['products.view'],
}
```

---

## 📦 Dependencies Standards

### 📋 Core Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^6.0.0",
    "next-auth": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@radix-ui/react-*": "^1.0.0",
    "zod": "^3.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "prisma": "^6.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.0.0"
  }
}
```

---

## 🎯 Checklist สำหรับโปรเจคใหม่

### ✅ Setup Phase
- [ ] สร้างโครงสร้างโฟลเดอร์ตามมาตรฐาน
- [ ] ติดตั้ง dependencies หลัก
- [ ] ตั้งค่า TypeScript, ESLint, Prettier
- [ ] ตั้งค่า Tailwind CSS
- [ ] สร้างไฟล์ README.md
- [ ] สร้างไฟล์ DEVELOPMENT_STANDARDS.md

### ✅ Database Phase
- [ ] ตั้งค่า Prisma schema
- [ ] สร้าง models หลัก
- [ ] ตั้งค่า migrations
- [ ] สร้าง seed data

### ✅ Frontend Phase
- [ ] สร้าง layout components
- [ ] สร้าง UI components หลัก
- [ ] ตั้งค่าระบบ i18n
- [ ] สร้าง page templates

### ✅ Backend Phase
- [ ] สร้าง API routes หลัก
- [ ] ตั้งค่าระบบ authentication
- [ ] สร้าง middleware สำหรับ authorization
- [ ] ตั้งค่าระบบ error handling

### ✅ Testing Phase
- [ ] ตั้งค่า Jest configuration
- [ ] สร้าง unit tests หลัก
- [ ] ตั้งค่า Playwright สำหรับ E2E tests
- [ ] สร้าง test utilities

### ✅ Documentation Phase
- [ ] อัพเดท README.md
- [ ] สร้าง API documentation
- [ ] สร้าง user guide
- [ ] สร้าง development guide

---

## 🔄 การอัพเดทมาตรฐาน

### 📝 เมื่อมีการเปลี่ยนแปลงมาตรฐาน
1. อัพเดทไฟล์ `DEVELOPMENT_STANDARDS.md`
2. อัพเดทโปรเจคเก่าทั้งหมด
3. แจ้งทีมพัฒนาถึงการเปลี่ยนแปลง
4. อัพเดท documentation

### 📚 การเรียนรู้มาตรฐานใหม่
1. อ่านไฟล์ `DEVELOPMENT_STANDARDS.md`
2. ดูตัวอย่างจากโปรเจคเก่า
3. ฝึกใช้งานในโปรเจคทดสอบ
4. ปรึกษาทีมพัฒนาหากมีข้อสงสัย

---

## 🎯 สรุป

การใช้มาตรฐานการพัฒนานี้จะช่วยให้:

1. **ผู้ใช้งาน** รู้สึกคุ้นชินกับระบบใหม่
2. **นักพัฒนา** ทำงานได้เร็วขึ้นด้วยเทมเพลตสำเร็จรูป
3. **ทีม** มีความสอดคล้องในการพัฒนา
4. **โปรเจค** มีคุณภาพและความเสถียรสูง

**🚀 เริ่มต้นโปรเจคใหม่ด้วยมาตรฐานนี้เพื่อประสบการณ์การใช้งานที่สอดคล้องกัน!**
