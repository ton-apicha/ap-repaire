#!/usr/bin/env node

// Admin Test Suite Runner
// รัน test suite ทั้งหมดสำหรับหน้า Admin

const adminTestSuite = require('./admin.test.js');
const adminUsersTestSuite = require('./admin-users.test.js');

const testRunner = {
  name: 'Admin Test Suite Runner',
  version: '1.1.0',
  description: 'Comprehensive test runner for Admin pages',
  
  // Test Suites
  testSuites: [
    {
      name: 'Admin Page Test Suite',
      suite: adminTestSuite,
      description: 'Tests for main admin page functionality'
    },
    {
      name: 'Admin Users Page Test Suite', 
      suite: adminUsersTestSuite,
      description: 'Tests for user management functionality'
    }
  ],

  // Run All Test Suites
  runAllSuites: function() {
    console.log('🚀 Starting Admin Test Suite Runner');
    console.log('===================================');
    console.log(`Version: ${this.version}`);
    console.log(`Total Test Suites: ${this.testSuites.length}`);
    console.log(`Server URL: http://localhost:3007`);
    console.log('');
    console.log('📋 Prerequisites:');
    console.log('==================');
    console.log('1. Development server should be running on http://localhost:3007');
    console.log('2. Admin user should be available: admin@aprepair.com / admin123');
    console.log('3. Browser should be ready for manual testing');
    console.log('');
    console.log('🔧 Test Suites:');
    console.log('===============');
    console.log('');

    this.testSuites.forEach((testSuite, index) => {
      console.log(`${index + 1}. ${testSuite.name}`);
      console.log(`   Description: ${testSuite.description}`);
      console.log(`   Test Cases: ${testSuite.suite.testCases.length}`);
      console.log('');
    });

    console.log('─'.repeat(60));
    console.log('');

    // Run each test suite
    this.testSuites.forEach((testSuite, index) => {
      console.log(`🧪 Running Test Suite ${index + 1}/${this.testSuites.length}: ${testSuite.name}`);
      console.log('─'.repeat(60));
      console.log('');
      
      testSuite.suite.runAllTests();
      
      if (index < this.testSuites.length - 1) {
        console.log('─'.repeat(60));
        console.log('');
      }
    });

    console.log('─'.repeat(60));
    console.log('');
    this.generateMasterReport();
  },

  // Generate Master Report
  generateMasterReport: function() {
    console.log('📊 Master Test Report');
    console.log('=====================');
    console.log('');

    let totalTestCases = 0;
    let totalTests = 0;
    let totalPendingTests = 0;

    this.testSuites.forEach((testSuite, index) => {
      const suite = testSuite.suite;
      const testCases = suite.testCases.length;
      const tests = suite.testCases.reduce((sum, testCase) => sum + testCase.tests.length, 0);
      const pendingTests = suite.testCases.reduce((sum, testCase) => 
        sum + testCase.tests.filter(test => test.status === 'pending').length, 0);

      totalTestCases += testCases;
      totalTests += tests;
      totalPendingTests += pendingTests;

      console.log(`${index + 1}. ${testSuite.name}`);
      console.log(`   Test Cases: ${testCases}`);
      console.log(`   Total Tests: ${tests}`);
      console.log(`   Pending Tests: ${pendingTests}`);
      console.log('');
    });

    console.log('📈 Summary:');
    console.log('===========');
    console.log(`Total Test Suites: ${this.testSuites.length}`);
    console.log(`Total Test Cases: ${totalTestCases}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Total Pending Tests: ${totalPendingTests}`);
    console.log(`Ready for Manual Testing: ${totalPendingTests}`);
    console.log('');

    console.log('🎯 Manual Testing Instructions:');
    console.log('==============================');
    console.log('');
    console.log('1. Open browser and navigate to http://localhost:3007');
    console.log('2. Login with admin credentials: admin@aprepair.com / admin123');
    console.log('3. Navigate to Admin page: http://localhost:3007/admin');
    console.log('4. Follow the test cases below systematically:');
    console.log('');

    this.testSuites.forEach((testSuite, index) => {
      console.log(`📋 ${index + 1}. ${testSuite.name}:`);
      testSuite.suite.testCases.forEach((testCase, testIndex) => {
        console.log(`   ${index + 1}.${testIndex + 1} ${testCase.name} (${testCase.category})`);
        testCase.tests.forEach((test, subIndex) => {
          console.log(`      ${index + 1}.${testIndex + 1}.${subIndex + 1} ${test.name}`);
        });
      });
      console.log('');
    });

    console.log('✅ Test Suite Runner Complete!');
    console.log('');
    console.log('💡 Tips for Manual Testing:');
    console.log('============================');
    console.log('• Test one feature at a time');
    console.log('• Document any issues found');
    console.log('• Test on different screen sizes');
    console.log('• Test with different user roles');
    console.log('• Verify all translations work');
    console.log('• Check responsive design');
    console.log('');
  },

  // Run Specific Test Suite
  runSpecificSuite: function(suiteName) {
    const testSuite = this.testSuites.find(suite => 
      suite.name.toLowerCase().includes(suiteName.toLowerCase())
    );

    if (testSuite) {
      console.log(`🧪 Running Specific Test Suite: ${testSuite.name}`);
      console.log('─'.repeat(60));
      console.log('');
      testSuite.suite.runAllTests();
    } else {
      console.log(`❌ Test suite "${suiteName}" not found`);
      console.log('Available test suites:');
      this.testSuites.forEach((suite, index) => {
        console.log(`${index + 1}. ${suite.name}`);
      });
    }
  }
};

// Command line interface
if (process.argv.length > 2) {
  const command = process.argv[2];
  
  switch (command) {
    case 'all':
      testRunner.runAllSuites();
      break;
    case 'admin':
      testRunner.runSpecificSuite('Admin Page');
      break;
    case 'users':
      testRunner.runSpecificSuite('Admin Users');
      break;
    case 'help':
      console.log('Admin Test Suite Runner - Usage:');
      console.log('');
      console.log('  node run-admin-tests.js all    - Run all test suites');
      console.log('  node run-admin-tests.js admin  - Run admin page tests only');
      console.log('  node run-admin-tests.js users  - Run user management tests only');
      console.log('  node run-admin-tests.js help   - Show this help');
      console.log('');
      break;
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('Use "help" to see available commands');
      break;
  }
} else {
  // Default: run all tests
  testRunner.runAllSuites();
}

module.exports = testRunner;
