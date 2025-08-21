# 🛠️ Diagnostic Tools สำหรับ AP Repair System

## 📖 ภาพรวม

ชุดเครื่องมือตรวจวินิจฉัยที่ออกแบบมาเพื่อช่วยนักพัฒนาใหม่ตรวจพบและแก้ไขปัญหาได้อย่างรวดเร็วและแม่นยำ

## 🎯 เครื่องมือหลัก

### 1. 🔍 Diagnostic Health Check Script
**ไฟล์:** `scripts/diagnostic-health-check.js`

**วิธีใช้:**
```bash
node scripts/diagnostic-health-check.js
```

**ความสามารถ:**
- ✅ ตรวจสอบ environment และ dependencies
- ✅ ตรวจสอบ configuration files
- ✅ ทดสอบ database connection
- ✅ ทดสอบ API endpoints
- ✅ ตรวจสอบ frontend components
- ✅ ทดสอบ build process
- 📋 สร้าง detailed report และ quick-fix script

**ผลลัพธ์:**
- `DIAGNOSTIC-REPORT.json` - รายงานโดยละเอียด
- `quick-fix.sh` - สคริปต์แก้ไขอัตโนมัติ

### 2. 🏥 Frontend Health Check System
**ไฟล์:** `src/utils/frontendHealthCheck.ts`

**วิธีใช้:**
```javascript
import { useComponentHealth, frontendHealthChecker } from '@/utils/frontendHealthCheck';

// ใน React Component
const { healthStatus, isHealthy, issues } = useComponentHealth('PaymentsPage');

// Manual check
const health = frontendHealthChecker.checkComponentHealth('PaymentsPage');
```

**ความสามารถ:**
- 🔍 Real-time component health monitoring
- 🎯 DOM presence checking
- ⚡ Performance monitoring
- 🎨 Styling health checks
- ♿ Accessibility validation
- 📊 Memory usage tracking

### 3. 🧪 Integration Test Suite
**ไฟล์:** `tests/integration/api-frontend-integration.test.js`

**วิธีใช้:**
```bash
node tests/integration/api-frontend-integration.test.js
```

**ความสามารถ:**
- 🌐 API endpoint testing
- 📋 Data format validation
- 🖥️ Frontend page testing
- 🔗 API-Frontend integration testing
- ⚡ Performance testing
- 🚫 Error handling testing

**ผลลัพธ์:**
- `INTEGRATION-TEST-REPORT.json` - รายงานการทดสอบ
- `FIX-SUGGESTIONS.json` - คำแนะนำการแก้ไข

### 4. 🚨 Error Reporting System
**ไฟล์:** `src/utils/errorReporting.ts`

**วิธีใช้:**
```javascript
import { useErrorReporting, errorReporter } from '@/utils/errorReporting';

// ใน React Component
const { reportError, logInfo, getSystemHealth } = useErrorReporting();

// Manual reporting
errorReporter.reportApiError('/api/payments', 500, responseData);
errorReporter.reportRenderError('PaymentsPage', error);
```

**ความสามารถ:**
- 🎯 Automatic error capture
- 📊 Real-time error monitoring
- 🔍 Detailed error context
- 📈 Performance monitoring
- 💾 Error export and reporting
- 🎭 Observer pattern for real-time updates

### 5. 📊 Health Dashboard
**ไฟล์:** `src/components/diagnostics/HealthDashboard.tsx`

**วิธีใช้:**
```javascript
import HealthDashboard from '@/components/diagnostics/HealthDashboard';

// Add to your app
<HealthDashboard />
```

**ความสามารถ:**
- 📊 Real-time system health display
- 🎛️ Compact and expanded views
- 🔄 Auto-refresh capabilities
- 📤 Export functionality
- 🎨 Visual status indicators

## 🚀 Quick Start Guide

### เริ่มต้นใช้งาน (5 นาที)

1. **รัน Health Check แรก:**
```bash
node scripts/diagnostic-health-check.js
```

2. **ดูรายงาน:**
```bash
cat DIAGNOSTIC-REPORT.json | jq '.summary'
```

3. **รันการแก้ไขอัตโนมัติ (ถ้ามี):**
```bash
chmod +x quick-fix.sh
./quick-fix.sh
```

4. **รัน Integration Tests:**
```bash
node tests/integration/api-frontend-integration.test.js
```

5. **เพิ่ม Health Dashboard:**
```javascript
// ใน app/layout.tsx
import HealthDashboard from '@/components/diagnostics/HealthDashboard';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <HealthDashboard />
      </body>
    </html>
  );
}
```

## 🔧 การแก้ปัญหาทั่วไป

### ปัญหาที่พบบ่อยและวิธีแก้

#### 1. "border-gray-300" CSS Error
```bash
# ตรวจสอบ Tailwind config
node scripts/diagnostic-health-check.js | grep -i tailwind

# แก้ไข: สร้าง tailwind.config.js
cat > tailwind.config.js << EOF
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}
EOF
```

#### 2. Frontend แสดง "Loading..." ตลอด
```bash
# ตรวจสอบ API connectivity
node tests/integration/api-frontend-integration.test.js

# ดู detailed errors
cat INTEGRATION-TEST-REPORT.json | jq '.results.failed'
```

#### 3. API Returns "Unauthorized"
```bash
# ตรวจสอบ environment variables
grep -E "NEXTAUTH_SECRET|NEXTAUTH_URL" .env.local

# ตรวจสอบ authentication ใน API routes
grep -r "getServerSession" src/app/api/
```

## 📋 Best Practices

### 🔄 การใช้งานประจำ

1. **รัน Health Check ก่อน coding session:**
```bash
node scripts/diagnostic-health-check.js
```

2. **Monitor errors ระหว่าง development:**
```javascript
// เพิ่มใน component หลัก
const { getSystemHealth } = useErrorReporting();
console.log('System Health:', getSystemHealth());
```

3. **รัน Integration Tests ก่อน commit:**
```bash
node tests/integration/api-frontend-integration.test.js
```

### 📊 Performance Monitoring

```javascript
// ใน component ที่ต้องการ monitor
import { useComponentHealth } from '@/utils/frontendHealthCheck';

function PaymentsPage() {
  const { healthStatus, recheckHealth } = useComponentHealth('PaymentsPage');
  
  // Auto-recheck when component updates
  useEffect(() => {
    if (healthStatus?.issues.length > 0) {
      console.warn('Component issues detected:', healthStatus.issues);
    }
  }, [healthStatus]);
  
  return (
    <div data-component="PaymentsPage">
      {/* Your component content */}
    </div>
  );
}
```

### 🚨 Error Handling

```javascript
// ใน API calls
import { useErrorReporting } from '@/utils/errorReporting';

const { reportApiError } = useErrorReporting();

const fetchData = async () => {
  try {
    const response = await fetch('/api/payments');
    if (!response.ok) {
      reportApiError('/api/payments', response.status, await response.json());
    }
    return await response.json();
  } catch (error) {
    reportApiError('/api/payments', 0, null, { error: error.message });
    throw error;
  }
};
```

## 📈 Advanced Usage

### Custom Health Checks

```javascript
// สร้าง custom health check
import { frontendHealthChecker } from '@/utils/frontendHealthCheck';

frontendHealthChecker.registerComponent('CustomComponent');

// Custom monitoring
setInterval(() => {
  const health = frontendHealthChecker.checkComponentHealth('CustomComponent');
  if (health.status === 'error') {
    // Handle critical issues
    console.error('Critical component error:', health.issues);
  }
}, 10000);
```

### Error Analytics

```javascript
// Export error data for analysis
import { errorReporter } from '@/utils/errorReporting';

const errorReport = errorReporter.exportErrorReport();
console.log('Error trends:', {
  totalErrors: errorReport.summary.totalErrors,
  criticalErrors: errorReport.summary.criticalErrors,
  apiErrors: errorReport.summary.apiErrors
});
```

### Custom Integration Tests

```javascript
// เพิ่ม custom test ใน integration suite
const customTests = [
  {
    name: 'Custom API Test',
    test: async () => {
      const response = await fetch('/api/custom-endpoint');
      return response.ok;
    }
  }
];
```

## 🤝 Contributing

### เพิ่ม Health Check ใหม่

1. **เพิ่มใน diagnostic script:**
```javascript
// ใน scripts/diagnostic-health-check.js
checkCustomFeature() {
  // Your custom check logic
  if (customCondition) {
    this.addPassed('Custom', 'Feature working correctly');
  } else {
    this.addIssue('Custom', 'Feature not working', 'Fix suggestion');
  }
}
```

2. **เพิ่มใน integration tests:**
```javascript
// ใน tests/integration/api-frontend-integration.test.js
async testCustomIntegration() {
  // Your custom integration test
}
```

### เพิ่ม Error Type ใหม่

```javascript
// ใน src/utils/errorReporting.ts
reportCustomError(customData: any): string {
  return this.reportError({
    type: 'custom',
    severity: 'medium',
    message: `Custom error: ${customData.message}`,
    metadata: customData,
    tags: ['custom-error']
  });
}
```

## 📚 API Reference

### DiagnosticHealthChecker Methods
- `checkEnvironment()` - ตรวจสอบ environment
- `checkConfiguration()` - ตรวจสอบ config files
- `checkDatabase()` - ตรวจสอบ database
- `checkServer()` - ตรวจสอบ server และ API
- `checkFrontend()` - ตรวจสอบ frontend components
- `generateReport()` - สร้างรายงาน

### FrontendHealthChecker Methods
- `registerComponent(name)` - ลงทะเบียน component
- `checkComponentHealth(name)` - ตรวจสอบ component health
- `startMonitoring(interval)` - เริ่ม monitoring
- `getHealthSummary()` - ดู summary

### ErrorReportingSystem Methods
- `reportError(data)` - รายงาน error
- `reportApiError(endpoint, status, data)` - รายงาน API error
- `reportRenderError(component, error)` - รายงาน render error
- `getSystemHealth()` - ดูสถานะระบบ
- `exportErrorReport()` - export รายงาน

## 🆘 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. **ตรวจสอบ DEVELOPMENT-CHECKLIST.md**
2. **รัน diagnostic script และดู report**
3. **เปิด browser console เพื่อดู errors**
4. **ตรวจสอบ Network tab สำหรับ API issues**

จำไว้: **เครื่องมือเหล่านี้ออกแบบมาเพื่อช่วยคุณ ไม่ใช่เพื่อแทนที่การเข้าใจโค้ด!** ใช้เป็นจุดเริ่มต้นในการแก้ปัญหา แล้วขุดลึกเพื่อเข้าใจสาเหตุที่แท้จริง

