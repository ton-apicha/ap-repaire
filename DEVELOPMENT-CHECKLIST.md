# 📋 Development Checklist สำหรับนักพัฒนาใหม่

## 🎯 จุดประสงค์
เอกสารนี้สร้างขึ้นเพื่อช่วยนักพัฒนาใหม่ตรวจพบปัญหาได้อย่างแม่นยำและรวดเร็ว โดยเฉพาะปัญหาที่เกิดจาก:
- Tailwind CSS configuration
- API-Frontend integration
- Data fetching และ state management
- Component rendering issues

---

## ⚡ Quick Start Diagnostic

### 🔍 ขั้นตอนการตรวจสอบแรก (5 นาที)

```bash
# 1. ตรวจสอบ environment
node --version  # ควรเป็น v18+ 
npm --version

# 2. รัน diagnostic script
node scripts/diagnostic-health-check.js

# 3. ตรวจสอบ server status
curl -s http://localhost:3000/api/health
```

### 🚨 สัญญาณปัญหาที่พบบ่อย

| อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้เบื้องต้น |
|-------|-------------------|------------------|
| หน้าเว็บแสดง "Loading..." ตลอด | API ไม่ตอบสนอง หรือ data fetching ผิดพลาด | ตรวจสอบ Network tab ใน DevTools |
| CSS ไม่แสดงผล / สีผิด | Tailwind config ผิดพลาด | ตรวจสอบ `tailwind.config.js` |
| Error: "Cannot apply unknown utility class" | Tailwind CSS ไม่ได้ถูก compile | Restart dev server |
| API returns 401 Unauthorized | Authentication ถูก enable | ตรวจสอบ `.env.local` |
| Page แสดง "Error" แต่ไม่มีรายละเอียด | Frontend error handling | เปิด Browser Console |

---

## 📚 Environment Setup Checklist

### ✅ ไฟล์และโฟลเดอร์ที่จำเป็น

```
โครงสร้างโปรเจค:
├── .env.local                 ✅ ต้องมี environment variables
├── package.json               ✅ dependencies ครบถ้วน
├── tailwind.config.js         ✅ Tailwind configuration
├── tsconfig.json              ✅ TypeScript configuration
├── next.config.js             ✅ Next.js configuration
├── prisma/
│   ├── schema.prisma          ✅ Database schema
│   └── dev.db                 ✅ SQLite database file
├── src/
│   ├── app/                   ✅ Next.js 13+ app directory
│   ├── components/            ✅ React components
│   ├── lib/                   ✅ Utility libraries
│   └── utils/                 ✅ Helper functions
└── node_modules/              ✅ Dependencies installed
```

### 🔐 Environment Variables (.env.local)

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 📦 Dependencies Verification

```bash
# ตรวจสอบ dependencies สำคัญ
npm list next react react-dom @prisma/client tailwindcss

# ถ้าขาด dependencies
npm install next@latest react@latest react-dom@latest @prisma/client tailwindcss
```

---

## 🔍 Systematic Problem Diagnosis

### 1️⃣ Database Issues

```bash
# ตรวจสอบ database connection
npx prisma studio --port 5555

# ตรวจสอบ database schema
npx prisma generate
npx prisma migrate status

# Reset database (ใช้เมื่อจำเป็น)
npx prisma migrate reset --force
```

### 2️⃣ API Endpoint Testing

```bash
# ทดสอบ API endpoints
curl http://localhost:3000/api/customers
curl http://localhost:3000/api/invoices  
curl http://localhost:3000/api/payments
curl http://localhost:3000/api/health

# Expected Response Format:
# { "success": true, "data": [...] }
```

### 3️⃣ Frontend Component Testing

```bash
# รัน integration tests
node tests/integration/api-frontend-integration.test.js

# ตรวจสอบหน้าเว็บสำคัญ
curl -s http://localhost:3000/dashboard | grep -i "error\|loading"
curl -s http://localhost:3000/invoices | grep -i "error\|loading" 
curl -s http://localhost:3000/payments | grep -i "error\|loading"
```

### 4️⃣ Tailwind CSS Issues

```bash
# ตรวจสอบ Tailwind config
cat tailwind.config.js | grep -A 5 "content:"

# ตรวจสอบ CSS imports
grep -r "@tailwind" src/

# Expected in globals.css:
# @tailwind base;
# @tailwind components; 
# @tailwind utilities;
```

---

## 🐛 Common Issues และวิธีแก้

### Issue #1: "border-gray-300" CSS Error

**อาการ:** 
```
Error: Cannot apply unknown utility class `border-gray-300`
```

**สาเหตุ:** Tailwind CSS ไม่ถูก configure หรือ compile ถูกต้อง

**วิธีแก้:**
```bash
# 1. ตรวจสอบ tailwind.config.js
cat tailwind.config.js

# 2. Restart development server
pkill -f "npm run dev"
npm run dev

# 3. ถ้ายังไม่หาย, ลบ .next cache
rm -rf .next
npm run dev
```

### Issue #2: Frontend แสดง "Loading..." ตลอดเวลา

**อาการ:** หน้าเว็บแสดง Loading state แต่ไม่เปลี่ยน

**การตรวจสอบ:**
```bash
# 1. ตรวจสอบ API response
curl http://localhost:3000/api/payments

# 2. ตรวจสอบ browser console
# เปิด DevTools > Console tab

# 3. ตรวจสอบ Network tab
# เปิด DevTools > Network tab > reload page
```

**วิธีแก้:**
```javascript
// ตรวจสอบใน component code
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/payments', {
        credentials: 'include'  // สำคัญ! สำหรับ session
      });
      const data = await response.json();
      
      console.log('Response:', data); // Debug log
      
      if (data.success) {
        setData(data.data || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false); // สำคัญ! ต้องมี
    }
  };

  fetchData();
}, []);
```

### Issue #3: API Returns "Unauthorized"

**อาการ:** API endpoint ส่งกลับ 401 Unauthorized

**วิธีแก้:**
```bash
# 1. ตรวจสอบ .env.local
grep -E "NEXTAUTH_SECRET|NEXTAUTH_URL" .env.local

# 2. ถ้าต้องการ disable auth ชั่วคราว (development only)
# แก้ไขไฟล์ src/app/api/[endpoint]/route.ts
# Comment out authentication check:
/*
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
*/
```

### Issue #4: Data Format Mismatch

**อาการ:** `Cannot read properties of undefined` or `filter is not a function`

**สาเหตุ:** API response format ไม่ตรงกับที่ frontend คาดหวัง

**วิธีแก้:**
```javascript
// ในไฟล์ component, ตรวจสอบ data structure
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    
    console.log('API Response structure:', data);
    
    // ✅ Correct: Extract data array from response
    if (data.success && Array.isArray(data.data)) {
      setItems(data.data);
    }
    
    // ❌ Wrong: Use response directly
    // setItems(data); // This will cause "filter is not a function"
  };
}, []);
```

---

## 🚀 Performance Optimization Checklist

### Frontend Performance

- [ ] ใช้ `React.memo` สำหรับ components ที่ render บ่อย
- [ ] ใช้ `useMemo` และ `useCallback` สำหรับ expensive operations
- [ ] Lazy load components ที่ไม่จำเป็นต้องแสดงทันที
- [ ] Optimize images ด้วย Next.js Image component

### API Performance

- [ ] ใช้ database indexing สำหรับ queries ที่ใช้บ่อย
- [ ] Implement caching สำหรับ data ที่ไม่เปลี่ยนบ่อย
- [ ] ใช้ pagination สำหรับ large datasets
- [ ] Monitor API response times

---

## 🔧 Debug Tools และ Commands

### Development Tools

```bash
# Health check ทั้งระบบ
node scripts/diagnostic-health-check.js

# Frontend component health
# เพิ่มใน component:
import { useComponentHealth } from '@/utils/frontendHealthCheck';
const { healthStatus, recheckHealth } = useComponentHealth('PaymentsPage');

# Error reporting
import { useErrorReporting } from '@/utils/errorReporting';
const { reportError, logInfo } = useErrorReporting();
```

### Browser DevTools Shortcuts

| Action | Shortcut | Purpose |
|--------|----------|---------|
| Open DevTools | `F12` หรือ `Cmd+Opt+I` | General debugging |
| Console | `Cmd+Opt+J` | View logs and errors |
| Network | `Cmd+Opt+N` | Monitor API calls |
| Elements | `Cmd+Opt+C` | Inspect HTML/CSS |

### Database Management

```bash
# เปิด Prisma Studio
npx prisma studio --port 5555

# View database records
npx prisma db seed

# Reset และ recreate database
npx prisma migrate reset --force
```

---

## 📋 Pre-commit Checklist

ก่อน commit code ให้ตรวจสอบ:

### Code Quality
- [ ] `npm run lint` ผ่านโดยไม่มี errors
- [ ] `npm run type-check` ผ่านโดยไม่มี errors  
- [ ] `npm run test` ผ่านทุก test cases
- [ ] ไม่มี `console.log` ที่เหลือในโค้ด production

### Functionality
- [ ] ทุกหน้าโหลดได้ไม่แสดง "Loading..." ค้าง
- [ ] API endpoints ทั้งหมดตอบสนองถูกต้อง
- [ ] ไม่มี errors ใน browser console
- [ ] Database migrations ทำงานถูกต้อง

### Performance
- [ ] Page load time < 3 วินาที
- [ ] API response time < 500ms
- [ ] ไม่มี memory leaks
- [ ] CSS/JS bundle size เหมาะสม

---

## 🆘 Emergency Troubleshooting

เมื่อเจอปัญหาเร่งด่วน:

### 1. Quick Reset (2 นาที)
```bash
# Stop all processes
pkill -f "npm"

# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm install
npm run dev
```

### 2. Database Reset (3 นาที)
```bash
# Backup current data
cp prisma/dev.db prisma/dev.db.backup

# Reset database
npx prisma migrate reset --force

# Reseed data
npx prisma db seed
```

### 3. Complete Environment Reset (5 นาที)
```bash
# Run the comprehensive diagnostic
node scripts/diagnostic-health-check.js

# If it generates quick-fix.sh
chmod +x quick-fix.sh
./quick-fix.sh
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Debugging Tools
- Browser DevTools
- React Developer Tools
- Prisma Studio
- Next.js DevTools

### Community Support
- Stack Overflow
- Next.js GitHub Discussions
- Tailwind CSS Discord
- Prisma Community

---

## 🎯 Success Metrics

ระบบทำงานได้ดีเมื่อ:

- ✅ ทุกหน้าโหลดภายใน 3 วินาที
- ✅ API responses ภายใน 500ms
- ✅ ไม่มี console errors
- ✅ Tailwind CSS ทำงานถูกต้อง
- ✅ Database connectivity stable
- ✅ All integration tests pass

**จำไว้:** เมื่อเจอปัญหา ให้ดู Browser Console เป็นอันดับแรก แล้วตรวจสอบ Network tab ต่อ ปัญหาส่วนใหญ่จะปรากฏที่นี่!

