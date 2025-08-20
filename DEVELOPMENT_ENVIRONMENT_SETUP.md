# การปรับปรุงสภาพแวดล้อมการพัฒนา (Development Environment Setup)

## 🎯 **เป้าหมาย**
ปรับปรุงสภาพแวดล้อมการพัฒนาของโปรเจ็ค AP Repair System ให้เหมาะกับการทำงานในอนาคต โดยเฉพาะสำหรับการพัฒนาระบบขนาดใหญ่ที่มีหลายเมนูและโมดูล

## ✅ **สิ่งที่เพิ่มเข้ามา**

### **1. Testing Framework**
- ✅ **Jest** - Unit testing framework
- ✅ **Playwright** - E2E testing framework
- ✅ **Storybook** - Component development and documentation
- ✅ **Testing Library** - React testing utilities

### **2. Code Quality Tools**
- ✅ **Prettier** - Code formatting
- ✅ **ESLint** - Code linting (already existed)
- ✅ **Husky** - Git hooks
- ✅ **Commitlint** - Commit message validation
- ✅ **Lint-staged** - Run linters on staged files

### **3. UI Component Library**
- ✅ **Radix UI** - Accessible UI primitives
- ✅ **Class Variance Authority** - Component variant management
- ✅ **Tailwind Merge** - Utility for merging Tailwind classes
- ✅ **Lucide React** - Icon library

### **4. State Management & Data Fetching**
- ✅ **Zustand** - Lightweight state management
- ✅ **React Query (TanStack Query)** - Server state management
- ✅ **TanStack Table** - Advanced table component

### **5. Form Handling & Validation**
- ✅ **React Hook Form** - Form state management (already existed)
- ✅ **Zod** - Schema validation (already existed)
- ✅ **Hookform Resolvers** - Zod integration (already existed)

### **6. Documentation**
- ✅ **Nextra** - Documentation site generator
- ✅ **Storybook** - Component documentation

### **7. Development Tools**
- ✅ **Commitizen** - Standardized commit messages
- ✅ **Standard Version** - Automated versioning
- ✅ **Bundle Analyzer** - Bundle size analysis

## 🔧 **การเปลี่ยนแปลงหลัก**

### **1. Package.json Updates**
```json
{
  "version": "1.1.2",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "format": "prettier --write .",
    "commit": "git-cz",
    "release": "standard-version",
    "docs:dev": "nextra dev",
    "check-all": "npm run lint && npm run type-check && npm run test"
  }
}
```

### **2. New Dependencies**
```json
{
  "dependencies": {
    "@radix-ui/react-*": "UI primitives",
    "@tanstack/react-query": "Server state management",
    "@tanstack/react-table": "Advanced tables",
    "class-variance-authority": "Component variants",
    "clsx": "Conditional classes",
    "cmdk": "Command palette",
    "framer-motion": "Animations",
    "next-themes": "Theme management",
    "recharts": "Charts and graphs",
    "sonner": "Toast notifications",
    "tailwind-merge": "Class merging",
    "tailwindcss-animate": "Tailwind animations",
    "zustand": "State management"
  }
}
```

### **3. Development Dependencies**
```json
{
  "devDependencies": {
    "@playwright/test": "E2E testing",
    "@storybook/*": "Component development",
    "@nextra/cli": "Documentation",
    "commitizen": "Commit standardization",
    "husky": "Git hooks",
    "jest": "Unit testing",
    "lint-staged": "Staged file linting",
    "prettier": "Code formatting",
    "standard-version": "Version management"
  }
}
```

## 📁 **โครงสร้างไฟล์ใหม่**

### **1. Configuration Files**
```
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Jest setup
├── playwright.config.ts    # Playwright configuration
├── .prettierrc            # Prettier configuration
├── commitlint.config.js   # Commit message rules
├── .storybook/            # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── nextra.config.ts       # Documentation configuration
└── theme.config.tsx       # Documentation theme
```

### **2. Git Hooks**
```
├── .husky/
│   ├── pre-commit         # Pre-commit hook
│   └── commit-msg         # Commit message hook
```

### **3. Enhanced Source Structure**
```
src/
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── validations.ts     # Zod schemas
│   ├── api.ts            # API client
│   └── constants.ts      # Application constants
├── hooks/
│   └── useApi.ts         # API hooks
├── components/ui/
│   ├── button.tsx        # Button component
│   ├── input.tsx         # Input component
│   ├── dialog.tsx        # Dialog component
│   ├── table.tsx         # Table components
│   └── index.ts          # UI exports
└── types/                # TypeScript types
```

## 🎨 **UI Component System**

### **1. Radix UI Components**
- ✅ **Button** - Accessible button with variants
- ✅ **Input** - Form input component
- ✅ **Dialog** - Modal dialog component
- ✅ **Table** - Data table components

### **2. Component Variants**
```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center...',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        // ... more variants
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
  }
)
```

## 🔄 **API Management System**

### **1. API Client**
```typescript
class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>>
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>
}
```

### **2. API Service Wrapper**
```typescript
class ApiService {
  static async request<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    options: {
      showSuccess?: boolean
      showError?: boolean
      successMessage?: string
      errorMessage?: string
    }
  ): Promise<T | null>
}
```

### **3. Custom Hooks**
```typescript
export function useCustomers() {
  // Returns customers, loading, error, and CRUD functions
}

export function useTechnicians() {
  // Returns technicians, loading, error, and CRUD functions
}

// ... more hooks for each entity
```

## 📊 **Validation System**

### **1. Zod Schemas**
```typescript
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
```

### **2. Form Validation**
- ✅ **Email validation** - Proper email format
- ✅ **Phone validation** - Thai phone number format
- ✅ **Password validation** - Minimum length and complexity
- ✅ **Required field validation** - Required field checking

## 🧪 **Testing Infrastructure**

### **1. Jest Configuration**
```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### **2. Playwright Configuration**
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

### **3. Storybook Configuration**
```typescript
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: { name: '@storybook/nextjs' },
}
```

## 📚 **Documentation System**

### **1. Nextra Documentation**
```typescript
export default defineConfig({
  title: 'AP Repair System',
  description: 'Bitcoin Mining Machine Repair Management System',
  theme: 'nextra-theme-docs',
  defaultShowCopyCode: true,
})
```

### **2. Storybook Documentation**
- ✅ **Component stories** - Interactive component examples
- ✅ **Documentation** - Component usage and props
- ✅ **Controls** - Interactive prop controls
- ✅ **Actions** - Event handling examples

## 🔧 **Development Workflow**

### **1. Pre-commit Hooks**
```bash
# Automatically runs on commit
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # TypeScript
```

### **2. Commit Standardization**
```bash
npm run commit        # Interactive commit message
# Follows conventional commits format
```

### **3. Quality Checks**
```bash
npm run check-all     # Run all quality checks
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run test:coverage # Generate coverage report
```

## 🚀 **Available Scripts**

### **Development**
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
```

### **Testing**
```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # Run E2E tests with UI
```

### **Code Quality**
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
npm run type-check    # Run TypeScript check
```

### **Documentation**
```bash
npm run storybook     # Start Storybook
npm run storybook:build # Build Storybook
npm run docs:dev      # Start documentation
npm run docs:build    # Build documentation
```

### **Database**
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database
```

### **Deployment**
```bash
npm run docker:build  # Build Docker image
npm run docker:run    # Run Docker container
npm run deploy:vercel # Deploy to Vercel
npm run deploy:railway # Deploy to Railway
```

## 💡 **ข้อดีของสภาพแวดล้อมใหม่**

### **1. Developer Experience**
- ✅ **Hot reloading** - Fast development feedback
- ✅ **Type safety** - Full TypeScript support
- ✅ **Code formatting** - Consistent code style
- ✅ **Linting** - Catch errors early
- ✅ **Testing** - Reliable code changes

### **2. Scalability**
- ✅ **Modular architecture** - Easy to extend
- ✅ **Component library** - Reusable components
- ✅ **State management** - Predictable state
- ✅ **API abstraction** - Clean data fetching
- ✅ **Validation** - Data integrity

### **3. Maintainability**
- ✅ **Documentation** - Clear usage examples
- ✅ **Testing** - Regression prevention
- ✅ **Code quality** - Consistent standards
- ✅ **Version control** - Clear change history
- ✅ **Automation** - Reduced manual work

### **4. Performance**
- ✅ **Bundle optimization** - Smaller bundles
- ✅ **Lazy loading** - Faster initial load
- ✅ **Caching** - Better user experience
- ✅ **Code splitting** - Efficient loading
- ✅ **Tree shaking** - Remove unused code

## 🎯 **การใช้งานในอนาคต**

### **1. การเพิ่มฟีเจอร์ใหม่**
```bash
# 1. สร้าง component ใหม่
# 2. เขียน test cases
# 3. สร้าง Storybook story
# 4. อัปเดต documentation
# 5. Commit ด้วย conventional format
```

### **2. การแก้ไขบั๊ก**
```bash
# 1. เขียน test case สำหรับบั๊ก
# 2. แก้ไขโค้ด
# 3. รัน tests เพื่อยืนยันการแก้ไข
# 4. อัปเดต documentation ถ้าจำเป็น
```

### **3. การเพิ่มโมดูลใหม่**
```bash
# 1. สร้าง API endpoints
# 2. สร้าง UI components
# 3. เพิ่ม validation schemas
# 4. เขียน tests
# 5. อัปเดต navigation
```

---

**วันที่ปรับปรุง**: 20 สิงหาคม 2025  
**สถานะ**: ✅ เสร็จสิ้น  
**เวอร์ชั่น**: 1.1.2  
**เป้าหมาย**: พร้อมสำหรับการพัฒนาระบบขนาดใหญ่ในอนาคต
