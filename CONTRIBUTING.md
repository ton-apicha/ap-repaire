# Contributing to AP Repair

ขอบคุณที่สนใจในการพัฒนาระบบ AP Repair! เอกสารนี้จะช่วยให้คุณเข้าใจวิธีการมีส่วนร่วมในการพัฒนาระบบ

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm หรือ yarn
- Git

### การตั้งค่าสภาพแวดล้อมการพัฒนา

1. **Fork และ Clone โปรเจค**
```bash
git clone https://github.com/YOUR_USERNAME/ap-repaire.git
cd ap-repaire
```

2. **ติดตั้ง Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **ตั้งค่าฐานข้อมูล**
```bash
npx prisma generate
npx prisma db push
```

4. **สร้างไฟล์ Environment**
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

## 📋 การพัฒนาฟีเจอร์ใหม่

### 1. สร้าง Branch ใหม่
```bash
git checkout -b feature/your-feature-name
```

### 2. พัฒนาฟีเจอร์
- ใช้ TypeScript สำหรับทุกไฟล์
- ใช้ Tailwind CSS สำหรับ styling
- ใช้ Radix UI components
- เขียน tests สำหรับฟีเจอร์ใหม่

### 3. การเพิ่มหน้าใหม่
1. สร้างไฟล์ใน `src/app/`
2. เพิ่มเมนูใน `src/components/layout/Sidebar.tsx`
3. เพิ่มคำแปลในไฟล์ locales
4. อัปเดต types ใน `src/types/index.ts`
5. เพิ่ม validation schema ใน `src/lib/validations.ts`
6. สร้าง API service ใน `src/lib/api.ts`

### 4. การเพิ่ม API Endpoints
1. สร้าง API route ใน `src/app/api/`
2. เพิ่ม service method ใน `src/lib/api.ts`
3. สร้าง custom hook ใน `src/hooks/useApi.ts`
4. เพิ่ม validation schema ใน `src/lib/validations.ts`

### 5. การเพิ่ม UI Components
1. สร้าง component ใหม่ใน `src/components/ui/`
2. ใช้ Radix UI primitives เป็นพื้นฐาน
3. ใช้ `class-variance-authority` สำหรับ variants
4. เพิ่มใน `src/components/ui/index.ts`

## 🧪 การทดสอบ

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Code Quality Checks
```bash
npm run lint
npm run type-check
npm run format
```

### Health Check
```bash
npm run health-check
```

## 📝 การ Commit

### Commit Message Format
ใช้ Conventional Commits format:
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: ฟีเจอร์ใหม่
- `fix`: แก้ไขบั๊ก
- `docs`: เอกสาร
- `style`: การจัดรูปแบบ (ไม่กระทบโค้ด)
- `refactor`: การปรับปรุงโค้ด
- `test`: เพิ่มหรือแก้ไข tests
- `chore`: การบำรุงรักษา

### ตัวอย่าง
```
feat(invoices): add invoice management system

- Add invoice CRUD operations
- Add invoice status management
- Add invoice calculation utilities

Closes #123
```

## 🔄 การ Submit Pull Request

### 1. Push ไปยัง Fork
```bash
git push origin feature/your-feature-name
```

### 2. สร้าง Pull Request
- ไปที่ GitHub repository ของคุณ
- คลิก "New Pull Request"
- เลือก branch ที่ต้องการ merge
- กรอกข้อมูลตาม template

### 3. Pull Request Template
```markdown
## 📋 Description
อธิบายการเปลี่ยนแปลงที่ทำ

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## 📸 Screenshots (ถ้ามี)
เพิ่ม screenshots ของการเปลี่ยนแปลง

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🏗️ โครงสร้างโปรเจค

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
├── components/            # React Components
│   ├── layout/           # Layout Components
│   ├── ui/               # UI Components (Radix UI)
│   ├── forms/            # Form Components
│   └── auth/             # Authentication Components
├── contexts/             # React Contexts
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities และ Configs
├── locales/              # ไฟล์แปลภาษา
├── types/                # TypeScript Types
└── utils/                # Utility Functions
```

## 🎨 Coding Standards

### TypeScript
- ใช้ strict mode
- กำหนด type ให้ชัดเจน
- ใช้ interface สำหรับ object types
- ใช้ enum สำหรับ constants

### React
- ใช้ functional components
- ใช้ hooks แทน class components
- ใช้ TypeScript สำหรับ props
- ใช้ proper naming conventions

### CSS/Styling
- ใช้ Tailwind CSS
- ใช้ CSS modules ถ้าจำเป็น
- ใช้ responsive design
- ใช้ consistent spacing

### Testing
- เขียน tests สำหรับทุกฟีเจอร์ใหม่
- ใช้ descriptive test names
- ครอบคลุม edge cases
- ใช้ proper mocking

## 🐛 การรายงานบั๊ก

### Bug Report Template
```markdown
## 🐛 Bug Description
อธิบายบั๊กที่พบ

## 🔄 Steps to Reproduce
1. ไปที่หน้า...
2. คลิกที่...
3. ดูข้อผิดพลาด...

## 📸 Expected vs Actual
**Expected**: ควรจะ...
**Actual**: แต่กลับ...

## 💻 Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.2.0]

## 📱 Additional Context
ข้อมูลเพิ่มเติมที่เกี่ยวข้อง
```

## 💡 การเสนอฟีเจอร์

### Feature Request Template
```markdown
## 💡 Feature Description
อธิบายฟีเจอร์ที่ต้องการ

## 🎯 Use Case
อธิบายว่าฟีเจอร์นี้จะช่วยแก้ปัญหาอะไร

## 💭 Proposed Solution
อธิบายวิธีที่คิดว่าจะทำ

## 🔄 Alternatives Considered
อธิบายทางเลือกอื่นที่คิดไว้

## 📱 Mockups/Screenshots (ถ้ามี)
เพิ่ม mockups หรือ screenshots
```

## 🤝 การสื่อสาร

### Channels
- **GitHub Issues**: สำหรับบั๊กและฟีเจอร์
- **GitHub Discussions**: สำหรับคำถามทั่วไป
- **Pull Requests**: สำหรับการพัฒนาร่วมกัน

### Guidelines
- ใช้ภาษาไทยหรือภาษาอังกฤษ
- ใช้ respectful language
- ให้ข้อมูลที่ครบถ้วน
- ตอบกลับในเวลาที่เหมาะสม

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Tools
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Jest](https://jestjs.io)
- [Playwright](https://playwright.dev)

## 🏆 Recognition

ผู้มีส่วนร่วมจะได้รับการยอมรับใน:
- README.md
- Release notes
- Contributors page

## 📄 License

โปรเจคนี้ใช้ MIT License - ดูรายละเอียดในไฟล์ LICENSE

---

ขอบคุณที่สนใจในการพัฒนาระบบ AP Repair! 🚀
