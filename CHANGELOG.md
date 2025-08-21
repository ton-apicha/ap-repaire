# 📝 Changelog - AP Repair System

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.2] - 2025-08-21 🚀

### ✅ Added
- **🧪 Testing Infrastructure**: Jest และ Playwright สำหรับ unit และ E2E testing
- **🎨 UI Component Library**: Radix UI components (Button, Input, Dialog, Table)
- **🔌 API Management**: API client และ service wrapper พร้อม comprehensive error handling
- **📏 Code Quality Tools**: Prettier, ESLint rules, และ validation tools
- **📚 Documentation**: ENVIRONMENT_STATUS.md และ comprehensive project docs
- **🪝 Custom React Hooks**: useApi hooks สำหรับทุก entity
- **✅ Validation System**: Zod schemas สำหรับ data validation
- **🛠️ Utility Functions**: รวมถึง work order ID generation system
- **📋 Constants Management**: Application constants และ configurations

### 🔧 Changed
- **📊 Table Sorting**: เพิ่มการเรียงลำดับในทุกตาราง (Customers, Technicians, Work Orders, Miners, Admin Users)
- **🔄 API Architecture**: ปรับปรุง API service layer ให้มี consistent error handling
- **🎯 TypeScript**: ปรับปรุง type safety และแก้ไข type mismatches
- **🏗️ Project Structure**: จัดระเบียบโครงสร้างโปรเจ็คให้ maintainable มากขึ้น

### 🐛 Fixed
- **✅ TypeScript Errors**: แก้ไข API service return type mismatches
- **✅ ESLint Issues**: แก้ไข import/export syntax และ code quality issues
- **✅ Jest Configuration**: ปรับปรุง configuration ให้ทำงานกับ Next.js 15
- **✅ Build Process**: แก้ไข production build issues
- **✅ Testing Setup**: Unit tests ทำงานได้สมบูรณ์ (5/5 tests passing)

### 📦 Dependencies
- **Added**: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- **Added**: @radix-ui/react-* components, class-variance-authority, clsx, tailwind-merge
- **Added**: zustand, @tanstack/react-query สำหรับ state management
- **Added**: prettier, commitizen, standard-version สำหรับ code quality

### 📁 New Files
```
├── ENVIRONMENT_STATUS.md            # สถานะสภาพแวดล้อมการพัฒนา
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest setup และ mocks
├── .prettierrc                      # Prettier configuration
├── src/__tests__/utils.test.ts      # Unit tests for utilities
├── src/lib/utils.ts                 # Utility functions
├── src/lib/validations.ts           # Zod validation schemas
├── src/lib/api.ts                   # API client และ services
├── src/lib/constants.ts             # Application constants
├── src/hooks/useApi.ts              # Custom API hooks
└── src/components/ui/               # Reusable UI components
```

### 📊 Statistics
- **📁 Total Files**: 400+ files
- **🧪 Test Coverage**: Unit tests implemented
- **✅ Build Status**: ✅ Passing
- **🔍 Code Quality**: 0 errors, 89 warnings (acceptable)
- **📦 Bundle Size**: Optimized for production

---

## [1.1.1] - 2025-08-20 🔧

### ✅ Added
- **📊 Table Sorting**: การเรียงลำดับข้อมูลในทุกตาราง

### 🔧 Changed
- **🎯 UX Improvement**: ย้ายคอลัมน์ "การดำเนินการ" ไปด้านหน้าสุดในทุกตาราง
- **📱 Better Accessibility**: ลดการเลื่อนสไลด์บาร์ไปด้านข้าง
- **🎨 UI Polish**: ปรับปรุงการเข้าถึงสำหรับผู้ใช้

### 📋 Modified Files
- `src/app/customers/page.tsx`
- `src/app/technicians/page.tsx`
- `src/app/work-orders/page.tsx`
- `src/app/miners/page.tsx`
- `src/app/admin/users/page.tsx`

---

## [1.1.0] - 2025-08-20 🎯

### ✅ Added
- **🔢 Work Order ID System**: ระบบสร้างหมายเลขใบงานอัตโนมัติ (YYMMDD + 3-digit)
- **🧪 Test Suites**: ระบบทดสอบอัตโนมัติสำหรับหน้า Admin
- **👥 User Management**: ระบบจัดการผู้ใช้ในหน้า Admin
- **🔧 Admin Dashboard**: ปรับปรุง Admin page ให้ครบถ้วน

### 🔧 Changed
- **🌐 Translation System**: แก้ไขปัญหาการแสดง `workOrders.status.COMPLETED` และ `workOrders.priority.HIGH`
- **🔍 Search Consistency**: ทำให้ Search Bar เหมือนกันทุกหน้า
- **📱 Responsive Tables**: เพิ่มความสามารถในการ scroll และ responsive design
- **🎨 UI/UX**: ปรับปรุงการแสดงผลและ user experience

### 🐛 Fixed
- **🔤 Text Display**: แก้ไขปัญหาสีตัวหนังสือใน input fields
- **📊 Dashboard**: แก้ไขปัญหาการแสดงผลตารางและ overflow
- **🌐 Language**: แก้ไขปัญหาการแปลภาษาในส่วนต่างๆ
- **🔗 Navigation**: แก้ไข User Management button ใน Admin page

### 📦 Technical Improvements
- **🔧 Helper Functions**: เพิ่มฟังก์ชัน `getStatusText()` และ `getPriorityText()`
- **📋 Status Support**: รองรับ status `WAITING_PARTS`
- **📱 Responsive Design**: ปรับปรุง responsive design
- **🧪 Automated Testing**: เพิ่มการทดสอบอัตโนมัติ

### 📁 New Files Added
- `test-display-issues.js` - ตรวจสอบปัญหาการแสดงผล
- `test-display-fixes.js` - ทดสอบการแก้ไข
- `DISPLAY_ISSUES_FIXES.md` - สรุปการแก้ไข
- `WORK_ORDER_ID_SYSTEM.md` - เอกสารระบบ Work Order ID
- `USER_MANAGEMENT_TESTING.md` - เอกสารการทดสอบ User Management

---

## [1.0.0] - 2025-08-19 🎉

### ✅ Added - Initial Release
- **🏠 Dashboard System**: ระบบแดชบอร์ดแสดงสถิติงานซ่อม
- **👥 Customer Management**: จัดการลูกค้า (CRUD operations)
- **🔧 Technician Management**: จัดการช่างซ่อม (CRUD operations)  
- **📋 Work Order System**: จัดการใบงานซ่อม (CRUD operations)
- **⚡ Miner Model Management**: จัดการรุ่นเครื่องขุด (CRUD operations)
- **🔐 Authentication**: ระบบ Authentication ด้วย NextAuth.js
- **🌐 Internationalization**: รองรับ 3 ภาษา (English, Thai, Chinese)
- **👑 Role-Based Access**: ระบบสิทธิ์ผู้ใช้ (ADMIN, MANAGER, TECHNICIAN, USER)

### 🛠️ Technical Stack
- **⚡ Framework**: Next.js 15.5.0 with App Router
- **⚛️ Frontend**: React 19.1.0
- **📘 Language**: TypeScript for type safety
- **🎨 Styling**: Tailwind CSS 4
- **🗄️ Database**: Prisma ORM
  - SQLite for development
  - PostgreSQL for production
- **🔐 Authentication**: NextAuth.js
- **🎯 Icons**: Heroicons, Lucide React

### 🎨 UI/UX Features
- **📱 Responsive Design**: ใช้งานได้ทุกขนาดหน้าจอ
- **🎨 Modern UI**: Interface ที่สวยงามและใช้งานง่าย
- **🌐 Multi-language**: สลับภาษาได้ทันที
- **🔍 Search & Filter**: ระบบค้นหาและกรองข้อมูล

### 📊 Core Features
- **📈 Real-time Statistics**: สถิติแบบ real-time
- **📋 Work Order Tracking**: ติดตามสถานะงานซ่อม
- **💰 Cost Management**: จัดการค่าใช้จ่าย
- **📅 Date Tracking**: ติดตามวันที่เริ่มและเสร็จสิ้นงาน
- **⚡ Miner Support**: รองรับ Bitmain, Whatsminer, Avalon

---

## 🔮 Upcoming Features

### 🚀 Planned for v1.2.0
- **📊 Advanced Analytics**: รายงานและกราฟขั้นสูง
- **📱 Mobile App**: แอปพลิเคชันมือถือ
- **🔔 Notification System**: ระบบแจ้งเตือน
- **📤 Export Features**: ส่งออกข้อมูลเป็น PDF/Excel
- **🔄 Backup System**: ระบบสำรองข้อมูลอัตโนมัติ

### 🎯 Long-term Goals
- **🤖 AI Integration**: ระบบ AI สำหรับวิเคราะห์ปัญหา
- **📈 Business Intelligence**: ระบบวิเคราะห์ธุรกิจ
- **🌐 Multi-tenant**: รองรับหลายบริษัท
- **⚡ Performance Optimization**: ปรับปรุงประสิทธิภาพ

---

## 📞 Support & Contributing

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/ton-apicha/ap-repaire/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/ton-apicha/ap-repaire/discussions)
- **📚 Documentation**: [Project Wiki](https://github.com/ton-apicha/ap-repaire/wiki)

---

*For more detailed information about each release, please check the corresponding release notes and documentation.*