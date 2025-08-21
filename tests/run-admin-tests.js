#!/usr/bin/env node

// Admin Test Suite Runner
// รัน test suite ทั้งหมดสำหรับหน้า Admin

import { execSync } from 'child_process'
import path from 'path'

console.log('🧪 Running Admin Test Suite...')

try {
  // Run admin page tests
  console.log('\n📋 Testing Admin Page...')
  execSync('node tests/admin.test.js', { stdio: 'inherit' })
  
  // Run admin users page tests
  console.log('\n👥 Testing Admin Users Page...')
  execSync('node tests/admin-users.test.js', { stdio: 'inherit' })
  
  console.log('\n✅ All admin tests completed successfully!')
} catch (error) {
  console.error('\n❌ Test execution failed:', error.message)
  process.exit(1)
}
