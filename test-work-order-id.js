// Test script for generateWorkId function
// Run with: node test-work-order-id.js

// Function to generate work order ID
function generateWorkId(workNumber) {
  // Get the current date
  const today = new Date()

  // Format the date as YYMMDD
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`

  // Format the work number as a 3-digit string with leading zeros
  const workNumberPart = workNumber.toString().padStart(3, '0')

  // Combine the parts to form the final ID
  const workId = `${datePart}${workNumberPart}`

  return workId
}

// Test cases
console.log('🧪 การทดสอบฟังก์ชัน generateWorkId')
console.log('=====================================')
console.log()

// Test with different work numbers
const testCases = [1, 10, 123, 999]

testCases.forEach(workNumber => {
  const workId = generateWorkId(workNumber)
  console.log(`📋 ใบงานที่ ${workNumber}: ${workId}`)
})

console.log()
console.log('📊 รายละเอียดรูปแบบ:')
console.log('   - วันที่: YYMMDD (ปี 2 หลัก + เดือน 2 หลัก + วัน 2 หลัก)')
console.log('   - ลำดับ: 3 หลัก (เติม 0 ข้างหน้า)')
console.log('   - ตัวอย่าง: 250821001 = วันที่ 21/08/2025, ใบงานที่ 1')
console.log()

// Show current date breakdown
const today = new Date()
const year = today.getFullYear().toString().slice(-2)
const month = (today.getMonth() + 1).toString().padStart(2, '0')
const day = today.getDate().toString().padStart(2, '0')

console.log('📅 วันที่ปัจจุบัน:')
console.log(`   ปี: ${today.getFullYear()} → ${year}`)
console.log(`   เดือน: ${today.getMonth() + 1} → ${month}`)
console.log(`   วัน: ${today.getDate()} → ${day}`)
console.log(`   รวม: ${year}${month}${day}`)
console.log()

// Test edge cases
console.log('🔍 การทดสอบกรณีพิเศษ:')
console.log(`   ใบงานที่ 0: ${generateWorkId(0)}`)
console.log(`   ใบงานที่ 1000: ${generateWorkId(1000)}`)
console.log(`   ใบงานที่ 9999: ${generateWorkId(9999)}`)
console.log()

console.log('✅ การทดสอบเสร็จสิ้น!')
