# การตั้งค่า GitHub Repository

## 🎯 **ขั้นตอนการอัปโหลดโปรเจคขึ้น GitHub**

### **1. สร้าง Repository บน GitHub**

1. เปิดเบราว์เซอร์ไปที่ https://github.com
2. คลิกปุ่ม "New" หรือ "+" เพื่อสร้าง repository ใหม่
3. ตั้งชื่อ repository เช่น:
   - `ap-repaire`
   - `bitcoin-mining-repair-system`
   - `mining-repair-management`
4. เลือก "Public" หรือ "Private" ตามต้องการ
5. **อย่า** เลือก "Add a README file" เพราะเรามีแล้ว
6. คลิก "Create repository"

### **2. เชื่อมต่อกับ GitHub Repository**

แทนที่ `YOUR_USERNAME` ด้วยชื่อผู้ใช้ GitHub ของคุณ:

```bash
# ลบ remote เดิม (ถ้ามี)
git remote remove origin

# เพิ่ม remote ใหม่
git remote add origin https://github.com/YOUR_USERNAME/ap-repaire.git

# ตรวจสอบ remote
git remote -v
```

### **3. อัปโหลดไคลเอนต์**

```bash
# ตั้งชื่อ branch เป็น main
git branch -M main

# อัปโหลดไปยัง GitHub
git push -u origin main
```

### **4. ตรวจสอบการอัปโหลด**

1. ไปที่ repository URL ของคุณ
2. ตรวจสอบว่าไฟล์ทั้งหมดถูกอัปโหลดแล้ว
3. ตรวจสอบ README.md แสดงผลถูกต้อง

## 🔧 **การตั้งค่าเพิ่มเติม**

### **1. ตั้งค่า Git Config (ถ้ายังไม่ได้ตั้ง)**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### **2. สร้าง Branch ใหม่สำหรับการพัฒนา**

```bash
# สร้าง branch ใหม่
git checkout -b feature/new-feature

# ทำการเปลี่ยนแปลง
# ...

# Commit การเปลี่ยนแปลง
git add .
git commit -m "Add new feature"

# Push branch ใหม่
git push -u origin feature/new-feature
```

### **3. การ Merge Pull Request**

1. ไปที่ GitHub repository
2. คลิก "Compare & pull request"
3. เขียนคำอธิบายการเปลี่ยนแปลง
4. คลิก "Create pull request"
5. คลิก "Merge pull request"

## 📋 **โครงสร้าง Repository**

```
ap-repaire/
├── README.md                    # คำอธิบายโปรเจค
├── package.json                 # Dependencies
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React Components
│   ├── contexts/               # React Contexts
│   ├── lib/                    # Utilities
│   ├── locales/                # Translation files
│   └── types/                  # TypeScript types
├── .gitignore                  # Git ignore rules
└── *.md                        # Documentation files
```

## 🚀 **การ Deploy**

### **1. Vercel (แนะนำ)**

1. ไปที่ https://vercel.com
2. เชื่อมต่อกับ GitHub repository
3. ตั้งค่า Environment Variables:
   ```
   DATABASE_URL=your-database-url
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
4. Deploy

### **2. Netlify**

1. ไปที่ https://netlify.com
2. เชื่อมต่อกับ GitHub repository
3. ตั้งค่า Build Command: `npm run build`
4. ตั้งค่า Publish Directory: `.next`
5. Deploy

### **3. Railway**

1. ไปที่ https://railway.app
2. เชื่อมต่อกับ GitHub repository
3. ตั้งค่า Environment Variables
4. Deploy

## 🔐 **การรักษาความปลอดภัย**

### **1. Environment Variables**

อย่าอัปโหลดไฟล์ `.env.local` ขึ้น GitHub:

```bash
# ตรวจสอบ .gitignore
cat .gitignore | grep env
```

### **2. Database**

สำหรับ Production ควรใช้:
- PostgreSQL (Railway, Supabase)
- MySQL (PlanetScale)
- MongoDB (MongoDB Atlas)

### **3. Authentication**

ตั้งค่า NextAuth ให้เหมาะสมกับ Production:

```env
NEXTAUTH_SECRET=your-very-secure-secret
NEXTAUTH_URL=https://your-domain.com
```

## 📝 **การอัปเดตโค้ด**

### **1. การทำงานประจำวัน**

```bash
# ดึงโค้ดล่าสุด
git pull origin main

# สร้าง branch ใหม่สำหรับงาน
git checkout -b feature/your-feature

# ทำการเปลี่ยนแปลง
# ...

# Commit และ Push
git add .
git commit -m "Add your feature"
git push -u origin feature/your-feature
```

### **2. การ Merge กลับ main**

```bash
# กลับไป main branch
git checkout main

# ดึงโค้ดล่าสุด
git pull origin main

# Merge feature branch
git merge feature/your-feature

# Push ไป GitHub
git push origin main
```

## 🎯 **สรุป**

1. ✅ **สร้าง Repository** บน GitHub
2. ✅ **เชื่อมต่อ Remote** ด้วย URL ที่ถูกต้อง
3. ✅ **Push โค้ด** ขึ้น GitHub
4. ✅ **ตรวจสอบ** การอัปโหลด
5. ✅ **ตั้งค่า Deploy** (ถ้าต้องการ)

**โปรเจคพร้อมใช้งานบน GitHub!** 🚀

---

**วันที่สร้าง**: 20 สิงหาคม 2025  
**สถานะ**: ✅ พร้อมอัปโหลด GitHub
