#!/usr/bin/env node

/**
 * Comprehensive Diagnostic Health Check System
 * สำหรับตรวจสอบปัญหาแบบครอบคลุมและแม่นยำ
 * 
 * Created: 2025-01-27
 * Purpose: ช่วยนักพัฒนาใหม่ตรวจพบปัญหาได้ตรงจุด
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class DiagnosticHealthChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  addIssue(category, description, solution) {
    this.issues.push({ category, description, solution, timestamp: new Date().toISOString() });
    this.log(`❌ ${category}: ${description}`, 'error');
  }

  addWarning(category, description, recommendation) {
    this.warnings.push({ category, description, recommendation, timestamp: new Date().toISOString() });
    this.log(`⚠️ ${category}: ${description}`, 'warning');
  }

  addPassed(category, description) {
    this.passed.push({ category, description, timestamp: new Date().toISOString() });
    this.log(`✅ ${category}: ${description}`, 'success');
  }

  // 1. ตรวจสอบ Environment และ Dependencies
  checkEnvironment() {
    this.log('🔍 Checking Environment & Dependencies...', 'info');
    
    try {
      // Node.js version
      const nodeVersion = process.version;
      if (nodeVersion < 'v18.0.0') {
        this.addWarning('Environment', `Node.js version ${nodeVersion} detected`, 'Consider upgrading to Node.js 18+ for better compatibility');
      } else {
        this.addPassed('Environment', `Node.js ${nodeVersion} is compatible`);
      }

      // Package.json existence
      if (!fs.existsSync('package.json')) {
        this.addIssue('Environment', 'package.json not found', 'Run npm init or ensure you are in the correct directory');
        return;
      }
      this.addPassed('Environment', 'package.json found');

      // Node modules
      if (!fs.existsSync('node_modules')) {
        this.addIssue('Environment', 'node_modules not found', 'Run: npm install');
        return;
      }
      this.addPassed('Environment', 'node_modules directory exists');

      // Essential dependencies
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const essentialDeps = ['next', 'react', 'react-dom', '@prisma/client'];
      
      for (const dep of essentialDeps) {
        if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
          this.addIssue('Dependencies', `Missing essential dependency: ${dep}`, `Run: npm install ${dep}`);
        } else {
          this.addPassed('Dependencies', `${dep} is installed`);
        }
      }

    } catch (error) {
      this.addIssue('Environment', `Error checking environment: ${error.message}`, 'Check file permissions and directory structure');
    }
  }

  // 2. ตรวจสอบ Configuration Files
  checkConfiguration() {
    this.log('🔍 Checking Configuration Files...', 'info');

    const configFiles = [
      { file: '.env.local', required: true, description: 'Environment variables' },
      { file: 'next.config.js', required: false, description: 'Next.js configuration' },
      { file: 'tailwind.config.js', required: true, description: 'Tailwind CSS configuration' },
      { file: 'tsconfig.json', required: true, description: 'TypeScript configuration' },
      { file: 'prisma/schema.prisma', required: true, description: 'Prisma schema' }
    ];

    for (const config of configFiles) {
      if (fs.existsSync(config.file)) {
        this.addPassed('Configuration', `${config.file} exists`);
        
        // Specific checks for important config files
        if (config.file === '.env.local') {
          this.checkEnvFile();
        } else if (config.file === 'tailwind.config.js') {
          this.checkTailwindConfig();
        }
      } else if (config.required) {
        this.addIssue('Configuration', `Missing required file: ${config.file}`, `Create ${config.file} with proper ${config.description}`);
      } else {
        this.addWarning('Configuration', `Optional file missing: ${config.file}`, `Consider creating ${config.file} for ${config.description}`);
      }
    }
  }

  checkEnvFile() {
    try {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
      
      for (const varName of requiredVars) {
        if (!envContent.includes(varName)) {
          this.addIssue('Environment Variables', `Missing ${varName} in .env.local`, `Add ${varName}=your_value to .env.local`);
        } else {
          this.addPassed('Environment Variables', `${varName} is configured`);
        }
      }
    } catch (error) {
      this.addIssue('Environment Variables', 'Cannot read .env.local', 'Check file permissions');
    }
  }

  checkTailwindConfig() {
    try {
      const tailwindContent = fs.readFileSync('tailwind.config.js', 'utf8');
      
      // Check for content paths
      if (tailwindContent.includes('./src/**/*.{js,ts,jsx,tsx}')) {
        this.addPassed('Tailwind CSS', 'Content paths configured correctly');
      } else {
        this.addWarning('Tailwind CSS', 'Content paths may be misconfigured', 'Ensure Tailwind scans your source files');
      }

      // Check for plugins
      if (tailwindContent.includes('@tailwindcss/forms') || tailwindContent.includes('@tailwindcss/typography')) {
        this.addPassed('Tailwind CSS', 'Useful plugins detected');
      }
    } catch (error) {
      this.addWarning('Tailwind CSS', 'Cannot analyze tailwind.config.js', 'Check file syntax');
    }
  }

  // 3. ตรวจสอบ Database
  checkDatabase() {
    this.log('🔍 Checking Database Connection...', 'info');

    try {
      // Check if database file exists (SQLite)
      if (fs.existsSync('prisma/dev.db')) {
        this.addPassed('Database', 'SQLite database file exists');
      } else {
        this.addWarning('Database', 'Database file not found', 'Run: npx prisma migrate dev');
      }

      // Check Prisma client generation
      if (fs.existsSync('node_modules/.prisma/client')) {
        this.addPassed('Database', 'Prisma client is generated');
      } else {
        this.addIssue('Database', 'Prisma client not generated', 'Run: npx prisma generate');
      }

      // Test database connection
      this.testDatabaseConnection();

    } catch (error) {
      this.addIssue('Database', `Database check failed: ${error.message}`, 'Check Prisma configuration and run migrations');
    }
  }

  async testDatabaseConnection() {
    try {
      // Try to import and test Prisma client
      const { execSync } = require('child_process');
      execSync('node -e "const { PrismaClient } = require(\'@prisma/client\'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log(\'Database connected\'); prisma.$disconnect(); }).catch(console.error);"', 
        { timeout: 5000, stdio: 'pipe' });
      this.addPassed('Database', 'Database connection successful');
    } catch (error) {
      this.addIssue('Database', 'Cannot connect to database', 'Check DATABASE_URL and run: npx prisma migrate dev');
    }
  }

  // 4. ตรวจสอบ Server และ API
  async checkServer() {
    this.log('🔍 Checking Server & API Endpoints...', 'info');

    const serverUrl = 'http://localhost:3000';
    const apiEndpoints = [
      '/api/customers',
      '/api/work-orders', 
      '/api/invoices',
      '/api/payments',
      '/api/health'
    ];

    // Check if server is running
    try {
      const { execSync } = require('child_process');
      const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { timeout: 3000 });
      const statusCode = result.toString().trim();
      
      if (statusCode === '200') {
        this.addPassed('Server', 'Development server is running');
        
        // Test API endpoints
        for (const endpoint of apiEndpoints) {
          await this.testApiEndpoint(serverUrl + endpoint);
        }
      } else {
        this.addIssue('Server', 'Development server not responding', 'Run: npm run dev');
      }
    } catch (error) {
      this.addIssue('Server', 'Cannot reach development server', 'Start the server with: npm run dev');
    }
  }

  async testApiEndpoint(url) {
    try {
      const { execSync } = require('child_process');
      const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, { timeout: 3000 });
      const statusCode = result.toString().trim();
      
      if (statusCode === '200') {
        this.addPassed('API', `${url} is responding`);
      } else if (statusCode === '401') {
        this.addWarning('API', `${url} requires authentication`, 'This is expected for secured endpoints');
      } else {
        this.addIssue('API', `${url} returned status ${statusCode}`, 'Check API route implementation');
      }
    } catch (error) {
      this.addIssue('API', `${url} is not accessible`, 'Check route exists and server is running');
    }
  }

  // 5. ตรวจสอบ Frontend Components
  checkFrontend() {
    this.log('🔍 Checking Frontend Components...', 'info');

    const componentPaths = [
      'src/app/dashboard',
      'src/app/customers', 
      'src/app/work-orders',
      'src/app/invoices',
      'src/app/payments',
      'src/components/layout',
      'src/contexts'
    ];

    for (const componentPath of componentPaths) {
      if (fs.existsSync(componentPath)) {
        this.addPassed('Frontend', `${componentPath} exists`);
        this.checkComponentSyntax(componentPath);
      } else {
        this.addIssue('Frontend', `Missing component directory: ${componentPath}`, 'Create the required component structure');
      }
    }

    // Check for common frontend issues
    this.checkTailwindUsage();
    this.checkImportPaths();
  }

  checkComponentSyntax(componentPath) {
    try {
      // Find all .tsx and .ts files in the component path
      const files = this.getAllFiles(componentPath, ['.tsx', '.ts']);
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common syntax issues
        if (content.includes('border-gray-300') && !content.includes('@apply')) {
          this.addWarning('Tailwind CSS', `Potential Tailwind class issue in ${file}`, 'Ensure Tailwind CSS is properly configured');
        }
        
        // Check for proper React imports
        if (content.includes('useState') && !content.includes("import React") && !content.includes("from 'react'")) {
          this.addIssue('React', `Missing React import in ${file}`, "Add: import React, { useState } from 'react'");
        }
      }
    } catch (error) {
      this.addWarning('Frontend', `Error checking ${componentPath}`, error.message);
    }
  }

  checkTailwindUsage() {
    // Check if Tailwind directives are in CSS
    const possibleCssFiles = ['src/app/globals.css', 'styles/globals.css', 'src/styles/globals.css'];
    let tailwindFound = false;
    
    for (const cssFile of possibleCssFiles) {
      if (fs.existsSync(cssFile)) {
        const content = fs.readFileSync(cssFile, 'utf8');
        if (content.includes('@tailwind base') && content.includes('@tailwind components') && content.includes('@tailwind utilities')) {
          this.addPassed('Tailwind CSS', 'Tailwind directives found in CSS');
          tailwindFound = true;
          break;
        }
      }
    }
    
    if (!tailwindFound) {
      this.addIssue('Tailwind CSS', 'Tailwind directives not found', 'Add @tailwind base; @tailwind components; @tailwind utilities; to your main CSS file');
    }
  }

  checkImportPaths() {
    // Check if path aliases are working
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths && tsConfig.compilerOptions.paths['@/*']) {
        this.addPassed('TypeScript', 'Path aliases configured');
      } else {
        this.addWarning('TypeScript', 'Path aliases not configured', 'Configure @/* alias in tsconfig.json for cleaner imports');
      }
    } catch (error) {
      this.addWarning('TypeScript', 'Cannot check path aliases', 'Ensure tsconfig.json is valid');
    }
  }

  getAllFiles(dir, extensions = []) {
    let files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllFiles(fullPath, extensions));
      } else if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // 6. ตรวจสอบ Build Process
  checkBuild() {
    this.log('🔍 Checking Build Process...', 'info');

    try {
      // Test TypeScript compilation
      execSync('npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      this.addPassed('Build', 'TypeScript compilation successful');
    } catch (error) {
      this.addIssue('Build', 'TypeScript compilation failed', 'Fix TypeScript errors: npx tsc --noEmit');
    }

    try {
      // Test ESLint
      execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { stdio: 'pipe', timeout: 30000 });
      this.addPassed('Build', 'ESLint passed');
    } catch (error) {
      this.addWarning('Build', 'ESLint issues found', 'Fix linting errors: npx eslint . --fix');
    }
  }

  // 7. Generate Report
  generateReport() {
    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000;

    this.log('\n📊 DIAGNOSTIC HEALTH CHECK REPORT', 'info');
    this.log('='.repeat(50), 'info');
    this.log(`Duration: ${duration}s`, 'info');
    this.log(`✅ Passed: ${this.passed.length}`, 'success');
    this.log(`⚠️ Warnings: ${this.warnings.length}`, 'warning');
    this.log(`❌ Issues: ${this.issues.length}`, 'error');

    // Write detailed report to file
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      summary: {
        passed: this.passed.length,
        warnings: this.warnings.length,
        issues: this.issues.length
      },
      details: {
        passed: this.passed,
        warnings: this.warnings,
        issues: this.issues
      }
    };

    fs.writeFileSync('DIAGNOSTIC-REPORT.json', JSON.stringify(report, null, 2));
    this.log('\n📋 Detailed report saved to: DIAGNOSTIC-REPORT.json', 'info');

    // Generate quick fix script
    this.generateQuickFixScript();

    return this.issues.length === 0;
  }

  generateQuickFixScript() {
    let fixScript = '#!/bin/bash\n';
    fixScript += '# Auto-generated Quick Fix Script\n';
    fixScript += '# Generated on: ' + new Date().toISOString() + '\n\n';

    for (const issue of this.issues) {
      if (issue.solution.startsWith('Run:')) {
        const command = issue.solution.replace('Run: ', '');
        fixScript += `echo "Fixing: ${issue.description}"\n`;
        fixScript += `${command}\n\n`;
      }
    }

    if (this.issues.length > 0) {
      fs.writeFileSync('quick-fix.sh', fixScript);
      fs.chmodSync('quick-fix.sh', '755');
      this.log('🔧 Quick fix script generated: ./quick-fix.sh', 'info');
    }
  }

  // Main execution
  async run() {
    this.log('🚀 Starting Comprehensive Diagnostic Health Check...', 'info');
    this.log('='.repeat(60), 'info');

    this.checkEnvironment();
    this.checkConfiguration();
    this.checkDatabase();
    await this.checkServer();
    this.checkFrontend();
    this.checkBuild();

    const success = this.generateReport();

    if (success) {
      this.log('\n🎉 All checks passed! Your environment is healthy.', 'success');
    } else {
      this.log('\n⚡ Issues found. Please review the report and run quick-fix.sh if available.', 'warning');
    }

    return success;
  }
}

// Execute if run directly
if (require.main === module) {
  const checker = new DiagnosticHealthChecker();
  checker.run().catch(console.error);
}

module.exports = DiagnosticHealthChecker;

