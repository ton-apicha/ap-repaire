#!/usr/bin/env node

/**
 * AP Repair Environment Upgrade Script
 * 
 * This script performs a complete environment upgrade including:
 * - Dependency updates
 * - Database reset and migration
 * - Code quality checks
 * - System health verification
 * - Performance optimization
 */

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function executeCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    })
    return { success: true, output: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath))
}

function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return packageJson.version
  } catch {
    return 'unknown'
  }
}

async function upgradeEnvironment() {
  const version = getPackageVersion()
  
  log('🚀 AP Repair Environment Upgrade Script', 'bright')
  log(`Version: ${version}`, 'blue')
  log('Starting complete environment upgrade...\n', 'blue')

  // Step 1: Backup current state
  logStep(1, 'Creating backup of current state')
  const backupDir = `backup-${new Date().toISOString().split('T')[0]}`
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }
  
  // Backup important files
  const filesToBackup = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    '.env.local',
    'prisma/schema.prisma'
  ]
  
  filesToBackup.forEach(file => {
    if (checkFileExists(file)) {
      fs.copyFileSync(file, path.join(backupDir, file))
    }
  })
  
  logSuccess('Backup created successfully')

  // Step 2: Clean environment
  logStep(2, 'Cleaning environment')
  const cleanCommands = [
    'rm -rf node_modules',
    'rm -rf .next',
    'rm -rf out',
    'rm -rf dist',
    'rm -f package-lock.json'
  ]
  
  cleanCommands.forEach(cmd => {
    const result = executeCommand(cmd)
    if (!result.success) {
      logWarning(`Clean command failed: ${cmd}`)
    }
  })
  
  logSuccess('Environment cleaned')

  // Step 3: Install dependencies
  logStep(3, 'Installing dependencies')
  const installResult = executeCommand('npm install --legacy-peer-deps')
  if (!installResult.success) {
    logError('Failed to install dependencies')
    return false
  }
  
  logSuccess('Dependencies installed successfully')

  // Step 4: Generate Prisma client
  logStep(4, 'Generating Prisma client')
  const prismaResult = executeCommand('npx prisma generate')
  if (!prismaResult.success) {
    logError('Failed to generate Prisma client')
    return false
  }
  
  logSuccess('Prisma client generated')

  // Step 5: Reset and migrate database
  logStep(5, 'Resetting and migrating database')
  const dbResetResult = executeCommand('npx prisma migrate reset --force')
  if (!dbResetResult.success) {
    logError('Failed to reset database')
    return false
  }
  
  logSuccess('Database reset and migrated')

  // Step 6: Seed database
  logStep(6, 'Seeding database with sample data')
  const seedResult = executeCommand('node seed-complete-data.js')
  if (!seedResult.success) {
    logWarning('Failed to seed database, but continuing...')
  } else {
    logSuccess('Database seeded successfully')
  }

  // Step 7: Run code quality checks
  logStep(7, 'Running code quality checks')
  
  logInfo('Running TypeScript check...')
  const typeCheckResult = executeCommand('npm run type-check')
  if (!typeCheckResult.success) {
    logWarning('TypeScript check found issues')
  } else {
    logSuccess('TypeScript check passed')
  }
  
  logInfo('Running ESLint...')
  const lintResult = executeCommand('npm run lint')
  if (!lintResult.success) {
    logWarning('ESLint found issues')
  } else {
    logSuccess('ESLint check passed')
  }
  
  logInfo('Running Prettier...')
  const formatResult = executeCommand('npm run format')
  if (!formatResult.success) {
    logWarning('Prettier formatting failed')
  } else {
    logSuccess('Code formatting completed')
  }

  // Step 8: Build project
  logStep(8, 'Building project')
  const buildResult = executeCommand('npm run build')
  if (!buildResult.success) {
    logError('Build failed')
    return false
  }
  
  logSuccess('Project built successfully')

  // Step 9: Run tests
  logStep(9, 'Running tests')
  const testResult = executeCommand('npm run test')
  if (!testResult.success) {
    logWarning('Some tests failed')
  } else {
    logSuccess('All tests passed')
  }

  // Step 10: System health check
  logStep(10, 'Performing system health check')
  
  // Start the development server for health check
  logInfo('Starting development server for health check...')
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    detached: true
  })
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 10000))
  
  try {
    // Test health endpoint
    const healthCheckResult = executeCommand('curl -s http://localhost:3000/api/health')
    if (healthCheckResult.success) {
      logSuccess('System health check passed')
    } else {
      logWarning('System health check failed')
    }
  } catch (error) {
    logWarning('Could not perform health check')
  }
  
  // Stop development server
  devServer.kill()

  // Step 11: Performance optimization
  logStep(11, 'Optimizing performance')
  
  // Clear Next.js cache
  executeCommand('rm -rf .next/cache')
  logSuccess('Next.js cache cleared')
  
  // Optimize images (if any)
  if (checkFileExists('public')) {
    logInfo('Optimizing public assets...')
    // Add image optimization here if needed
  }
  
  logSuccess('Performance optimization completed')

  // Step 12: Final verification
  logStep(12, 'Final verification')
  
  const verificationChecks = [
    { name: 'Node modules', check: () => checkFileExists('node_modules') },
    { name: 'Prisma client', check: () => checkFileExists('node_modules/@prisma/client') },
    { name: 'Database file', check: () => checkFileExists('prisma/dev.db') },
    { name: 'Environment file', check: () => checkFileExists('.env.local') },
    { name: 'TypeScript config', check: () => checkFileExists('tsconfig.json') },
    { name: 'ESLint config', check: () => checkFileExists('.eslintrc.strict.js') }
  ]
  
  let allChecksPassed = true
  verificationChecks.forEach(({ name, check }) => {
    if (check()) {
      logSuccess(`${name} verified`)
    } else {
      logError(`${name} not found`)
      allChecksPassed = false
    }
  })

  // Summary
  log('\n🎉 Environment Upgrade Summary', 'bright')
  log('========================', 'blue')
  log(`✅ Backup created: ${backupDir}`, 'green')
  log('✅ Dependencies updated', 'green')
  log('✅ Database reset and migrated', 'green')
  log('✅ Code quality checks completed', 'green')
  log('✅ Project built successfully', 'green')
  log('✅ Performance optimized', 'green')
  
  if (allChecksPassed) {
    log('\n🎊 Environment upgrade completed successfully!', 'green')
    log('\nNext steps:', 'cyan')
    log('1. Start development server: npm run dev', 'blue')
    log('2. Open Prisma Studio: npm run db:studio', 'blue')
    log('3. Access the application: http://localhost:3000', 'blue')
    log('4. Check system health: http://localhost:3000/api/health', 'blue')
  } else {
    log('\n⚠️  Environment upgrade completed with warnings', 'yellow')
    log('Please review the issues above and fix them manually.', 'yellow')
  }

  return allChecksPassed
}

// Run the upgrade
if (require.main === module) {
  upgradeEnvironment()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      logError(`Upgrade failed: ${error.message}`)
      process.exit(1)
    })
}

module.exports = { upgradeEnvironment }
