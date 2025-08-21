/**
 * API-Frontend Integration Test Suite
 * สำหรับตรวจสอบการทำงานร่วมกันระหว่าง API และ Frontend
 * 
 * Created: 2025-01-27
 * Purpose: ช่วยตรวจพบปัญหาการเชื่อมต่อแบบครอบคลุม
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntegrationTestSuite {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      totalTests: 0,
      duration: 0
    };
    this.startTime = Date.now();
    this.baseUrl = 'http://localhost:3000';
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const defaultOptions = {
        method: 'GET',
        timeout: 5000,
        ...options
      };

      const curlCommand = [
        'curl',
        '-s',
        '-w', '"HTTPSTATUS:%{http_code}"',
        '-H', '"Content-Type: application/json"',
        '-X', defaultOptions.method
      ];

      if (defaultOptions.data) {
        curlCommand.push('-d', `'${JSON.stringify(defaultOptions.data)}'`);
      }

      curlCommand.push(`"${this.baseUrl}${endpoint}"`);

      const result = execSync(curlCommand.join(' '), { 
        timeout: defaultOptions.timeout,
        encoding: 'utf8'
      });

      const statusMatch = result.match(/HTTPSTATUS:(\d+)$/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 0;
      const body = result.replace(/HTTPSTATUS:\d+$/, '');

      return {
        status,
        data: body ? JSON.parse(body) : null,
        success: status >= 200 && status < 300
      };
    } catch (error) {
      return {
        status: 0,
        data: null,
        success: false,
        error: error.message
      };
    }
  }

  async checkPageContent(path, expectedContent) {
    try {
      const result = execSync(`curl -s "${this.baseUrl}${path}"`, { 
        timeout: 5000,
        encoding: 'utf8'
      });

      return {
        success: result.includes(expectedContent),
        content: result,
        hasLoading: result.includes('Loading'),
        hasError: result.includes('Error') || result.includes('error')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 1. API Endpoint Tests
  async testApiEndpoints() {
    this.log('\n🔍 Testing API Endpoints...', 'info');
    
    const endpoints = [
      { path: '/api/customers', method: 'GET', expectAuth: false },
      { path: '/api/work-orders', method: 'GET', expectAuth: false },
      { path: '/api/invoices', method: 'GET', expectAuth: false },
      { path: '/api/payments', method: 'GET', expectAuth: false },
      { path: '/api/miners', method: 'GET', expectAuth: false },
      { path: '/api/health', method: 'GET', expectAuth: false }
    ];

    for (const endpoint of endpoints) {
      this.results.totalTests++;
      
      try {
        const response = await this.makeRequest(endpoint.path, { method: endpoint.method });
        
        if (response.success || (endpoint.expectAuth && response.status === 401)) {
          this.results.passed.push({
            test: `API ${endpoint.method} ${endpoint.path}`,
            status: response.status,
            message: 'Endpoint responding correctly'
          });
          this.log(`✅ ${endpoint.path} - Status: ${response.status}`, 'success');
        } else {
          this.results.failed.push({
            test: `API ${endpoint.method} ${endpoint.path}`,
            status: response.status,
            error: response.error || 'Unexpected response',
            solution: 'Check API route implementation and server status'
          });
          this.log(`❌ ${endpoint.path} - Status: ${response.status}`, 'error');
        }
      } catch (error) {
        this.results.failed.push({
          test: `API ${endpoint.method} ${endpoint.path}`,
          error: error.message,
          solution: 'Ensure development server is running'
        });
        this.log(`❌ ${endpoint.path} - Error: ${error.message}`, 'error');
      }
    }
  }

  // 2. API Data Format Tests
  async testApiDataFormats() {
    this.log('\n🔍 Testing API Data Formats...', 'info');
    
    const dataEndpoints = [
      { path: '/api/customers', expectedFormat: { success: true, data: 'array' } },
      { path: '/api/invoices', expectedFormat: { success: true, data: 'array' } },
      { path: '/api/payments', expectedFormat: { success: true, data: 'array' } }
    ];

    for (const endpoint of dataEndpoints) {
      this.results.totalTests++;
      
      try {
        const response = await this.makeRequest(endpoint.path);
        
        if (response.success && response.data) {
          const data = response.data;
          
          // Check response format
          if (data.success === true && Array.isArray(data.data)) {
            this.results.passed.push({
              test: `Data format ${endpoint.path}`,
              message: 'Correct response format with success and data array'
            });
            this.log(`✅ ${endpoint.path} - Correct data format`, 'success');
          } else {
            this.results.failed.push({
              test: `Data format ${endpoint.path}`,
              error: 'Invalid response format',
              actual: typeof data,
              expected: '{ success: true, data: [...] }',
              solution: 'Update API to return standardized format'
            });
            this.log(`❌ ${endpoint.path} - Invalid data format`, 'error');
          }
        } else {
          this.results.warnings.push({
            test: `Data format ${endpoint.path}`,
            message: 'Could not verify data format due to API error'
          });
        }
      } catch (error) {
        this.results.failed.push({
          test: `Data format ${endpoint.path}`,
          error: error.message
        });
      }
    }
  }

  // 3. Frontend Page Tests
  async testFrontendPages() {
    this.log('\n🔍 Testing Frontend Pages...', 'info');
    
    const pages = [
      { path: '/', expectedContent: 'AP Repair', name: 'Home' },
      { path: '/dashboard', expectedContent: 'Dashboard', name: 'Dashboard' },
      { path: '/customers', expectedContent: 'Customers', name: 'Customers' },
      { path: '/work-orders', expectedContent: 'Work Orders', name: 'Work Orders' },
      { path: '/invoices', expectedContent: 'Invoices', name: 'Invoices' },
      { path: '/payments', expectedContent: 'Payments', name: 'Payments' },
      { path: '/miners', expectedContent: 'Miner', name: 'Miners' }
    ];

    for (const page of pages) {
      this.results.totalTests++;
      
      try {
        const pageResult = await this.checkPageContent(page.path, page.expectedContent);
        
        if (pageResult.success) {
          // Check for common issues
          if (pageResult.hasLoading) {
            this.results.warnings.push({
              test: `Frontend ${page.name}`,
              message: 'Page shows Loading state - may indicate data fetching issues',
              solution: 'Check API connectivity and data fetching logic'
            });
            this.log(`⚠️ ${page.path} - Contains Loading state`, 'warning');
          } else if (pageResult.hasError) {
            this.results.failed.push({
              test: `Frontend ${page.name}`,
              error: 'Page shows Error state',
              solution: 'Check API responses and error handling'
            });
            this.log(`❌ ${page.path} - Contains Error state`, 'error');
          } else {
            this.results.passed.push({
              test: `Frontend ${page.name}`,
              message: 'Page loads correctly'
            });
            this.log(`✅ ${page.path} - Page loads correctly`, 'success');
          }
        } else {
          this.results.failed.push({
            test: `Frontend ${page.name}`,
            error: pageResult.error || 'Expected content not found',
            solution: 'Check page component and routing'
          });
          this.log(`❌ ${page.path} - Failed to load`, 'error');
        }
      } catch (error) {
        this.results.failed.push({
          test: `Frontend ${page.name}`,
          error: error.message
        });
      }
    }
  }

  // 4. API-Frontend Integration Tests
  async testApiIntegration() {
    this.log('\n🔍 Testing API-Frontend Integration...', 'info');
    
    const integrationTests = [
      {
        name: 'Customers Page Data Loading',
        apiEndpoint: '/api/customers',
        frontendPage: '/customers',
        checkDataBinding: true
      },
      {
        name: 'Invoices Page Data Loading', 
        apiEndpoint: '/api/invoices',
        frontendPage: '/invoices',
        checkDataBinding: true
      },
      {
        name: 'Payments Page Data Loading',
        apiEndpoint: '/api/payments', 
        frontendPage: '/payments',
        checkDataBinding: true
      }
    ];

    for (const test of integrationTests) {
      this.results.totalTests++;
      
      try {
        // First check API
        const apiResponse = await this.makeRequest(test.apiEndpoint);
        
        if (!apiResponse.success) {
          this.results.failed.push({
            test: test.name,
            error: 'API endpoint not working',
            solution: 'Fix API endpoint first'
          });
          continue;
        }

        // Check if API returns data
        const hasData = apiResponse.data && apiResponse.data.data && apiResponse.data.data.length > 0;
        
        // Then check frontend
        const pageResult = await this.checkPageContent(test.frontendPage, '');
        
        if (hasData && pageResult.hasLoading) {
          this.results.failed.push({
            test: test.name,
            error: 'API has data but frontend shows Loading',
            solution: 'Check data fetching logic in frontend component'
          });
          this.log(`❌ ${test.name} - Data exists but frontend loading`, 'error');
        } else if (hasData && pageResult.hasError) {
          this.results.failed.push({
            test: test.name,
            error: 'API has data but frontend shows Error',
            solution: 'Check error handling and data parsing in frontend'
          });
          this.log(`❌ ${test.name} - Data exists but frontend error`, 'error');
        } else if (hasData && !pageResult.hasLoading && !pageResult.hasError) {
          this.results.passed.push({
            test: test.name,
            message: 'API data successfully displayed in frontend'
          });
          this.log(`✅ ${test.name} - Integration working`, 'success');
        } else if (!hasData) {
          this.results.warnings.push({
            test: test.name,
            message: 'No data available to test integration',
            solution: 'Add sample data to test data flow'
          });
          this.log(`⚠️ ${test.name} - No data to test`, 'warning');
        }
        
      } catch (error) {
        this.results.failed.push({
          test: test.name,
          error: error.message
        });
      }
    }
  }

  // 5. Performance Tests
  async testPerformance() {
    this.log('\n🔍 Testing Performance...', 'info');
    
    const performanceTests = [
      { endpoint: '/api/customers', name: 'Customers API' },
      { endpoint: '/api/invoices', name: 'Invoices API' },
      { endpoint: '/api/payments', name: 'Payments API' }
    ];

    for (const test of performanceTests) {
      this.results.totalTests++;
      
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(test.endpoint);
        const duration = Date.now() - startTime;
        
        if (response.success) {
          if (duration > 2000) {
            this.results.warnings.push({
              test: `Performance ${test.name}`,
              message: `Slow response time: ${duration}ms`,
              solution: 'Optimize database queries and add caching'
            });
            this.log(`⚠️ ${test.name} - Slow (${duration}ms)`, 'warning');
          } else {
            this.results.passed.push({
              test: `Performance ${test.name}`,
              message: `Good response time: ${duration}ms`
            });
            this.log(`✅ ${test.name} - Fast (${duration}ms)`, 'success');
          }
        }
      } catch (error) {
        this.results.failed.push({
          test: `Performance ${test.name}`,
          error: error.message
        });
      }
    }
  }

  // 6. Error Handling Tests
  async testErrorHandling() {
    this.log('\n🔍 Testing Error Handling...', 'info');
    
    const errorTests = [
      { endpoint: '/api/nonexistent', expectedStatus: 404, name: 'Non-existent API endpoint' },
      { endpoint: '/nonexistent-page', expectedStatus: 404, name: 'Non-existent page' }
    ];

    for (const test of errorTests) {
      this.results.totalTests++;
      
      try {
        const response = await this.makeRequest(test.endpoint);
        
        if (response.status === test.expectedStatus) {
          this.results.passed.push({
            test: `Error Handling ${test.name}`,
            message: `Correctly returns ${test.expectedStatus}`
          });
          this.log(`✅ ${test.name} - Correct error response`, 'success');
        } else {
          this.results.failed.push({
            test: `Error Handling ${test.name}`,
            error: `Expected ${test.expectedStatus}, got ${response.status}`,
            solution: 'Implement proper error handling'
          });
          this.log(`❌ ${test.name} - Wrong error response`, 'error');
        }
      } catch (error) {
        this.results.warnings.push({
          test: `Error Handling ${test.name}`,
          message: 'Could not test error handling'
        });
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    const endTime = Date.now();
    this.results.duration = (endTime - this.startTime) / 1000;

    this.log('\n📊 INTEGRATION TEST REPORT', 'info');
    this.log('='.repeat(50), 'info');
    this.log(`Duration: ${this.results.duration}s`, 'info');
    this.log(`Total Tests: ${this.results.totalTests}`, 'info');
    this.log(`✅ Passed: ${this.results.passed.length}`, 'success');
    this.log(`⚠️ Warnings: ${this.results.warnings.length}`, 'warning');
    this.log(`❌ Failed: ${this.results.failed.length}`, 'error');

    // Detailed failure analysis
    if (this.results.failed.length > 0) {
      this.log('\n🔍 FAILED TESTS ANALYSIS:', 'error');
      for (const failure of this.results.failed) {
        this.log(`❌ ${failure.test}`, 'error');
        this.log(`   Error: ${failure.error}`, 'error');
        if (failure.solution) {
          this.log(`   Solution: ${failure.solution}`, 'info');
        }
      }
    }

    // Write detailed report
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${this.results.duration}s`,
      summary: {
        total: this.results.totalTests,
        passed: this.results.passed.length,
        warnings: this.results.warnings.length,
        failed: this.results.failed.length,
        successRate: `${Math.round((this.results.passed.length / this.results.totalTests) * 100)}%`
      },
      results: this.results
    };

    fs.writeFileSync('INTEGRATION-TEST-REPORT.json', JSON.stringify(report, null, 2));
    this.log('\n📋 Detailed report saved to: INTEGRATION-TEST-REPORT.json', 'info');

    // Generate fix suggestions
    this.generateFixSuggestions();

    return this.results.failed.length === 0;
  }

  generateFixSuggestions() {
    const suggestions = [];
    
    // Analyze common failure patterns
    const apiFailures = this.results.failed.filter(f => f.test.includes('API'));
    const frontendFailures = this.results.failed.filter(f => f.test.includes('Frontend'));
    const integrationFailures = this.results.failed.filter(f => f.test.includes('Integration') || f.test.includes('Data Loading'));

    if (apiFailures.length > frontendFailures.length) {
      suggestions.push({
        priority: 'high',
        category: 'API',
        issue: 'Multiple API endpoints failing',
        suggestion: 'Check if development server is running and database is connected'
      });
    }

    if (frontendFailures.length > 0) {
      suggestions.push({
        priority: 'medium',
        category: 'Frontend',
        issue: 'Frontend pages not loading correctly',
        suggestion: 'Check component rendering and routing configuration'
      });
    }

    if (integrationFailures.length > 0) {
      suggestions.push({
        priority: 'high',
        category: 'Integration',
        issue: 'API-Frontend data flow issues',
        suggestion: 'Check data fetching logic and response format handling'
      });
    }

    if (suggestions.length > 0) {
      this.log('\n💡 FIX SUGGESTIONS:', 'info');
      for (const suggestion of suggestions) {
        this.log(`${suggestion.priority.toUpperCase()}: ${suggestion.suggestion}`, 'warning');
      }

      fs.writeFileSync('FIX-SUGGESTIONS.json', JSON.stringify(suggestions, null, 2));
    }
  }

  // Main test runner
  async runAllTests() {
    this.log('🚀 Starting Comprehensive Integration Tests...', 'info');
    this.log('='.repeat(60), 'info');

    await this.testApiEndpoints();
    await this.testApiDataFormats();
    await this.testFrontendPages();
    await this.testApiIntegration();
    await this.testPerformance();
    await this.testErrorHandling();

    const success = this.generateReport();

    if (success) {
      this.log('\n🎉 All integration tests passed!', 'success');
    } else {
      this.log('\n⚡ Some tests failed. Please review the report.', 'warning');
    }

    return success;
  }
}

// Execute if run directly
if (require.main === module) {
  const testSuite = new IntegrationTestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = IntegrationTestSuite;

