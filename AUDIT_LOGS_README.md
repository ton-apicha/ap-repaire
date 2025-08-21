# Audit Logs System

## ภาพรวม

ระบบ Audit Logs เป็นฟีเจอร์ที่ช่วยในการติดตามและบันทึกกิจกรรมต่างๆ ของระบบ รวมถึงการกระทำของผู้ใช้ เพื่อความปลอดภัยและการตรวจสอบ

## คุณสมบัติหลัก

### 📊 การแสดงผลข้อมูล
- **ตาราง Logs**: แสดงรายการ audit logs ทั้งหมด
- **สถิติ**: แสดงจำนวน logs ทั้งหมด, logs วันนี้, logs ที่ล้มเหลว, logs ที่สำคัญ
- **การกรอง**: กรองข้อมูลตามวันที่, ผู้ใช้, การกระทำ, ทรัพยากร, สถานะ, ความรุนแรง, หมวดหมู่

### 🔍 การกรองและค้นหา
- **ช่วงวันที่**: กำหนดช่วงวันที่ที่ต้องการดู
- **ผู้ใช้**: กรองตาม User ID
- **การกระทำ**: กรองตามประเภทการกระทำ (LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW, EXPORT, IMPORT)
- **ทรัพยากร**: กรองตามทรัพยากรที่เกี่ยวข้อง (users, customers, work_orders, invoices, payments, technicians, miners, backup)
- **สถานะ**: กรองตามสถานะ (success, failed, warning, info)
- **ความรุนแรง**: กรองตามระดับความรุนแรง (critical, high, medium, low)
- **หมวดหมู่**: กรองตามหมวดหมู่ (authentication, authorization, data_access, data_modification, system, user_management)

### 📋 การจัดการข้อมูล
- **ดูรายละเอียด**: คลิกที่ปุ่ม "View Details" เพื่อดูรายละเอียดของ log
- **ส่งออก**: ส่งออกข้อมูลเป็นไฟล์ CSV
- **รีเฟรช**: อัพเดทข้อมูลล่าสุด

## การใช้งาน

### หน้า Admin
1. เข้าไปที่ `http://localhost:3000/admin`
2. คลิกที่ "Audit Logs" ในเมนูด้านซ้าย
3. ใช้ฟิลเตอร์ต่างๆ เพื่อค้นหาข้อมูลที่ต้องการ
4. คลิก "View Details" เพื่อดูรายละเอียด
5. คลิก "Export" เพื่อส่งออกข้อมูล

### API Endpoints

#### GET /api/admin/audit-logs
ดึงข้อมูล audit logs ทั้งหมด

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-1234567890-1",
      "timestamp": "2025-01-27T10:30:00.000Z",
      "userId": "1",
      "userName": "Admin User",
      "userEmail": "admin@example.com",
      "action": "LOGIN",
      "resource": "users",
      "resourceId": "id-123",
      "details": "LOGIN operation on users with additional details",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "status": "success",
      "severity": "low",
      "category": "authentication"
    }
  ],
  "stats": {
    "totalLogs": 150,
    "todayLogs": 5,
    "failedLogs": 3,
    "criticalLogs": 1
  }
}
```

#### POST /api/admin/audit-logs/export
ส่งออก audit logs เป็นไฟล์ CSV

**Request Body:**
```json
{
  "filters": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-27",
    "userId": "1",
    "action": "LOGIN",
    "resource": "users",
    "status": "success",
    "severity": "low",
    "category": "authentication"
  }
}
```

**Response:** ไฟล์ CSV ที่สามารถดาวน์โหลดได้

## โครงสร้างข้อมูล

### AuditLog Interface
```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_management';
}
```

### AuditLogFilters Interface
```typescript
interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  resource?: string;
  status?: string;
  severity?: string;
  category?: string;
}
```

## ไฟล์ที่เกี่ยวข้อง

### Frontend
- `src/app/admin/audit-logs/page.tsx` - หน้า Audit Logs หลัก

### Backend
- `src/app/api/admin/audit-logs/route.ts` - API สำหรับดึงข้อมูล audit logs
- `src/app/api/admin/audit-logs/export/route.ts` - API สำหรับส่งออกข้อมูล

### Utilities
- `src/utils/auditLogger.ts` - ฟังก์ชันสำหรับบันทึก audit logs

### Translations
- `src/locales/en.ts` - คำแปลภาษาอังกฤษ
- `src/locales/th.ts` - คำแปลภาษาไทย
- `src/locales/zh.ts` - คำแปลภาษาจีน

## การบันทึก Audit Logs

### ฟังก์ชันหลัก
```typescript
// บันทึก event ทั่วไป
logAuditEvent(event: AuditLogEntry)

// บันทึกการเข้าสู่ระบบ
logLogin(userId: string, userName: string, userEmail: string, success: boolean)

// บันทึกการออกจากระบบ
logLogout(userId: string, userName: string, userEmail: string)

// บันทึกการเข้าถึงข้อมูล
logDataAccess(userId: string, userName: string, resource: string, resourceId?: string)

// บันทึกการแก้ไขข้อมูล
logDataModification(userId: string, userName: string, action: string, resource: string, resourceId?: string)

// บันทึกเหตุการณ์ระบบ
logSystemEvent(event: string, details: string, severity: 'critical' | 'high' | 'medium' | 'low')

// บันทึกการจัดการผู้ใช้
logUserManagement(userId: string, userName: string, action: string, targetUserId?: string)
```

### ตัวอย่างการใช้งาน
```typescript
import { logLogin, logDataAccess, logSystemEvent } from '@/utils/auditLogger'

// บันทึกการเข้าสู่ระบบ
logLogin('1', 'Admin User', 'admin@example.com', true)

// บันทึกการเข้าถึงข้อมูล
logDataAccess('1', 'Admin User', 'customers', 'customer-123')

// บันทึกเหตุการณ์ระบบ
logSystemEvent('BACKUP_CREATED', 'Manual backup created successfully', 'low')
```

## ความปลอดภัย

### การตรวจสอบสิทธิ์
- เฉพาะ ADMIN users เท่านั้นที่สามารถเข้าถึง Audit Logs ได้
- การตรวจสอบ session และ role ในทุก API endpoints

### การป้องกันข้อมูล
- ข้อมูล IP Address และ User Agent ถูกบันทึกเพื่อการตรวจสอบ
- การเข้ารหัสข้อมูลที่สำคัญ
- การลบข้อมูลอัตโนมัติตามนโยบาย retention

## การติดตั้งและตั้งค่า

### 1. สร้างไฟล์ข้อมูล
```bash
mkdir -p data
touch data/audit-logs.json
```

### 2. เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ)
```json
[]
```

### 3. ตรวจสอบสิทธิ์
```bash
chmod 644 data/audit-logs.json
```

## การตรวจสอบและแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. ไม่พบข้อมูล Audit Logs
- ตรวจสอบว่าไฟล์ `data/audit-logs.json` มีอยู่
- ตรวจสอบสิทธิ์การเข้าถึงไฟล์
- ตรวจสอบว่า API endpoints ทำงานได้

#### 2. ไม่สามารถส่งออกข้อมูลได้
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ตรวจสอบสิทธิ์การเขียนไฟล์
- ตรวจสอบขนาดข้อมูล (ไม่ควรเกิน 10MB)

#### 3. ฟิลเตอร์ไม่ทำงาน
- ตรวจสอบรูปแบบวันที่ (YYYY-MM-DD)
- ตรวจสอบการสะกดชื่อฟิลด์
- ตรวจสอบ console errors

### การ Debug
```bash
# ตรวจสอบ logs
tail -f logs/audit.log

# ตรวจสอบ API
curl -v http://localhost:3000/api/admin/audit-logs

# ตรวจสอบไฟล์ข้อมูล
cat data/audit-logs.json | jq '.'
```

## การพัฒนาต่อ

### ฟีเจอร์ที่อาจเพิ่มในอนาคต
- **Real-time Notifications**: แจ้งเตือนเมื่อมี critical events
- **Advanced Analytics**: กราฟและสถิติเชิงลึก
- **Automated Alerts**: ตั้งค่าการแจ้งเตือนอัตโนมัติ
- **Integration**: เชื่อมต่อกับระบบ monitoring อื่นๆ
- **Retention Policies**: นโยบายการเก็บข้อมูลอัตโนมัติ
- **Search**: การค้นหาข้อมูลขั้นสูง
- **Export Formats**: รองรับรูปแบบไฟล์อื่นๆ (JSON, XML)

### การปรับปรุงประสิทธิภาพ
- **Pagination**: แบ่งหน้าเพื่อลดเวลาโหลด
- **Caching**: ใช้ Redis เพื่อ cache ข้อมูล
- **Indexing**: สร้าง index สำหรับการค้นหา
- **Compression**: บีบอัดข้อมูลเพื่อประหยัดพื้นที่

## การทดสอบ

### Unit Tests
```bash
npm test -- --testPathPattern=audit
```

### Integration Tests
```bash
npm run test:integration -- audit-logs
```

### Manual Testing
1. ทดสอบการเข้าสู่ระบบและออกจากระบบ
2. ทดสอบการสร้าง/แก้ไข/ลบข้อมูล
3. ทดสอบการกรองข้อมูล
4. ทดสอบการส่งออกข้อมูล
5. ทดสอบการดูรายละเอียด

## การบำรุงรักษา

### การสำรองข้อมูล
- สำรองไฟล์ `data/audit-logs.json` เป็นประจำ
- ใช้ระบบ backup ที่มีอยู่

### การลบข้อมูลเก่า
- ตั้งค่าการลบข้อมูลอัตโนมัติตาม retention policy
- ตรวจสอบขนาดไฟล์เป็นประจำ

### การอัพเดท
- อัพเดท dependencies เป็นประจำ
- ตรวจสอบ security patches
- ทดสอบฟีเจอร์ใหม่ก่อน deploy

---

**หมายเหตุ**: ระบบ Audit Logs นี้เป็นส่วนหนึ่งของระบบจัดการงานซ่อมเครื่องขุดบิดคอยน์ AP Repair และได้รับการออกแบบให้ทำงานร่วมกับระบบอื่นๆ ได้อย่างสมบูรณ์
