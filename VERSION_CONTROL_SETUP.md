# Version Control และ Environment Setup

## 🎯 **สถานะปัจจุบัน**

### **✅ Git Repository Status:**
- **Branch**: `main`
- **Commits**: 8 commits
- **Status**: Clean working tree
- **Ahead of origin**: 1 commit

### **📋 Commit History:**
1. `1a199b5` - Fix Dashboard issues: status/priority display and table scrolling
2. `501c092` - Add interactive GitHub upload script
3. `28bfac3` - Add GitHub upload script for easy deployment
4. `73487f9` - Add GitHub upload summary and project overview
5. `7695f32` - Add step-by-step GitHub upload guide
6. `6ff943a` - Add GitHub setup documentation and improve package scripts
7. `c72c4a3` - Initial commit: Complete Bitcoin mining repair management system
8. `a38eddd` - Initial commit from Create Next App

## 🚀 **การจัดการเวอร์ชั่นคอนโทรล**

### **1. สร้าง Version Tag**
```bash
# สร้าง version tag สำหรับ release
git tag -a v1.0.0 -m "Release v1.0.0: Complete Bitcoin mining repair system"

# Push tag ไปยัง remote
git push origin v1.0.0
```

### **2. สร้าง Release Branch**
```bash
# สร้าง release branch
git checkout -b release/v1.0.0

# Push release branch
git push -u origin release/v1.0.0
```

### **3. สร้าง Development Branch**
```bash
# สร้าง development branch
git checkout -b develop

# Push development branch
git push -u origin develop
```

## 🔧 **การจัดการ Environment**

### **1. Environment Variables**

#### **Development (.env.local):**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### **Production (.env.production):**
```env
# Database (ใช้ PostgreSQL หรือ MySQL)
DATABASE_URL="postgresql://username:password@localhost:5432/ap_repaire"

# NextAuth
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### **2. Environment Setup Scripts**

#### **Development Setup:**
```bash
# ติดตั้ง dependencies
npm install

# สร้าง database
npx prisma generate
npx prisma db push

# Seed ข้อมูล
npm run db:seed

# รัน development server
npm run dev
```

#### **Production Setup:**
```bash
# Build production
npm run build

# Start production server
npm start
```

## 📦 **Package.json Scripts**

### **Current Scripts:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "setup": "npm install && npm run db:generate && npm run db:push && npm run db:seed"
  }
}
```

### **Additional Scripts (แนะนำ):**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "docker:build": "docker build -t ap-repaire .",
    "docker:run": "docker run -p 3000:3000 ap-repaire",
    "deploy:vercel": "vercel --prod",
    "deploy:railway": "railway up"
  }
}
```

## 🐳 **Docker Configuration**

### **Dockerfile:**
```dockerfile
# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/ap_repaire
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ap_repaire
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔒 **Security Configuration**

### **1. Environment Variables Security**
- ✅ ใช้ `.env.local` สำหรับ development
- ✅ ใช้ environment variables สำหรับ production
- ✅ ไม่ commit sensitive data

### **2. Git Hooks (Husky)**
```bash
# ติดตั้ง husky
npm install --save-dev husky lint-staged

# ตั้งค่า pre-commit hook
npx husky add .husky/pre-commit "npm run pre-commit"
```

### **3. Lint Staged Configuration**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📋 **Deployment Configuration**

### **1. Vercel Configuration (vercel.json)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  }
}
```

### **2. Railway Configuration (railway.toml)**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
```

## 🚀 **GitHub Actions Workflow**

### **CI/CD Pipeline (.github/workflows/ci.yml):**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📊 **Project Structure**

```
ap-repaire/
├── 📄 README.md
├── 📄 package.json
├── 📄 .gitignore
├── 📄 .env.local
├── 📄 Dockerfile
├── 📄 docker-compose.yml
├── 📄 vercel.json
├── 📄 railway.toml
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 ci.yml
├── 📁 prisma/
│   ├── 📄 schema.prisma
│   └── 📄 seed.ts
├── 📁 src/
│   ├── 📁 app/
│   ├── 📁 components/
│   ├── 📁 contexts/
│   ├── 📁 lib/
│   ├── 📁 locales/
│   └── 📁 types/
└── 📄 *.md (Documentation files)
```

## 🎯 **Next Steps**

### **1. สร้าง Version Tag**
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Complete Bitcoin mining repair system"
git push origin v1.0.0
```

### **2. สร้าง GitHub Release**
1. ไปที่ GitHub repository
2. คลิก "Releases"
3. คลิก "Create a new release"
4. เลือก tag v1.0.0
5. เขียน release notes
6. Publish release

### **3. Setup CI/CD**
1. สร้าง GitHub Actions workflow
2. ตั้งค่า environment variables
3. ทดสอบ deployment

### **4. Production Deployment**
1. ตั้งค่า production environment
2. Deploy ไปยัง Vercel/Railway
3. ตั้งค่า custom domain (ถ้าต้องการ)

---

**วันที่สร้าง**: 20 สิงหาคม 2025  
**สถานะ**: ✅ พร้อมสำหรับ Version Control และ Deployment
