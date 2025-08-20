#!/usr/bin/env node

/**
 * Test Script for User Management
 * Tests the complete user management functionality
 */

const BASE_URL = 'http://localhost:3007'

// Test data
const testUsers = [
  {
    email: 'manager@aprepair.com',
    name: 'John Manager',
    role: 'MANAGER',
    password: 'password123'
  },
  {
    email: 'tech1@aprepair.com',
    name: 'Mike Technician',
    role: 'TECHNICIAN',
    password: 'password123'
  },
  {
    email: 'tech2@aprepair.com',
    name: 'Sarah Technician',
    role: 'TECHNICIAN',
    password: 'password123'
  },
  {
    email: 'user1@aprepair.com',
    name: 'Alice User',
    role: 'USER',
    password: 'password123'
  }
]

class UserManagementTester {
  constructor() {
    this.createdUsers = []
    this.testResults = []
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
    console.log(`${prefix} [${timestamp}] ${message}`)
  }

  async testResult(testName, success, details = '') {
    this.testResults.push({ testName, success, details })
    if (success) {
      await this.log(`PASS: ${testName}`, 'success')
    } else {
      await this.log(`FAIL: ${testName} - ${details}`, 'error')
    }
  }

  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      const data = await response.json().catch(() => ({}))
      return { response, data }
    } catch (error) {
      return { response: null, data: { error: error.message } }
    }
  }

  async testCreateUsers() {
    await this.log('🧪 Testing User Creation...')
    
    for (const userData of testUsers) {
      const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
      })

      if (response && response.ok) {
        this.createdUsers.push(data)
        await this.testResult(
          `Create User: ${userData.email}`,
          true,
          `Created user with ID: ${data.id}`
        )
      } else {
        await this.testResult(
          `Create User: ${userData.email}`,
          false,
          data.error || 'Unknown error'
        )
      }
    }
  }

  async testGetUsers() {
    await this.log('🧪 Testing Get Users...')
    
    const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users`)
    
    if (response && response.ok) {
      await this.testResult(
        'Get Users List',
        true,
        `Retrieved ${data.length} users`
      )
      
      // Check if our created users are in the list
      for (const createdUser of this.createdUsers) {
        const found = data.find(u => u.id === createdUser.id)
        await this.testResult(
          `User in List: ${createdUser.email}`,
          !!found,
          found ? 'User found in list' : 'User not found in list'
        )
      }
    } else {
      await this.testResult(
        'Get Users List',
        false,
        data.error || 'Unknown error'
      )
    }
  }

  async testUpdateUser() {
    if (this.createdUsers.length === 0) {
      await this.log('⚠️ No users to update, skipping update test')
      return
    }

    await this.log('🧪 Testing User Update...')
    
    const userToUpdate = this.createdUsers[0]
    const updateData = {
      name: 'Updated Name',
      role: 'MANAGER'
    }

    const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users/${userToUpdate.id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })

    if (response && response.ok) {
      await this.testResult(
        `Update User: ${userToUpdate.email}`,
        true,
        `Updated user name to: ${data.name}`
      )
    } else {
      await this.testResult(
        `Update User: ${userToUpdate.email}`,
        false,
        data.error || 'Unknown error'
      )
    }
  }

  async testDeleteUser() {
    if (this.createdUsers.length === 0) {
      await this.log('⚠️ No users to delete, skipping delete test')
      return
    }

    await this.log('🧪 Testing User Deletion...')
    
    const userToDelete = this.createdUsers[this.createdUsers.length - 1]

    const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users/${userToDelete.id}`, {
      method: 'DELETE'
    })

    if (response && response.ok) {
      await this.testResult(
        `Delete User: ${userToDelete.email}`,
        true,
        'User deleted successfully'
      )
      // Remove from our list
      this.createdUsers = this.createdUsers.filter(u => u.id !== userToDelete.id)
    } else {
      await this.testResult(
        `Delete User: ${userToDelete.email}`,
        false,
        data.error || 'Unknown error'
      )
    }
  }

  async testValidation() {
    await this.log('🧪 Testing Validation...')
    
    // Test duplicate email
    if (this.createdUsers.length > 0) {
      const existingUser = this.createdUsers[0]
      const duplicateData = {
        email: existingUser.email,
        name: 'Duplicate User',
        role: 'USER',
        password: 'password123'
      }

      const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users`, {
        method: 'POST',
        body: JSON.stringify(duplicateData)
      })

      await this.testResult(
        'Duplicate Email Validation',
        !response.ok && data.error === 'Email already exists',
        response.ok ? 'Duplicate email was accepted (should be rejected)' : 'Duplicate email correctly rejected'
      )
    }

    // Test missing required fields
    const invalidData = {
      email: 'test@example.com',
      // Missing name, role, password
    }

    const { response, data } = await this.makeRequest(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      body: JSON.stringify(invalidData)
    })

    await this.testResult(
      'Required Fields Validation',
      !response.ok && data.error === 'Missing required fields',
      response.ok ? 'Invalid data was accepted (should be rejected)' : 'Invalid data correctly rejected'
    )
  }

  async runAllTests() {
    await this.log('🚀 Starting User Management Tests...')
    await this.log(`Base URL: ${BASE_URL}`)
    await this.log('')

    try {
      await this.testCreateUsers()
      await this.log('')
      
      await this.testGetUsers()
      await this.log('')
      
      await this.testUpdateUser()
      await this.log('')
      
      await this.testValidation()
      await this.log('')
      
      await this.testDeleteUser()
      await this.log('')
      
    } catch (error) {
      await this.log(`Test execution failed: ${error.message}`, 'error')
    }

    await this.generateReport()
  }

  async generateReport() {
    await this.log('📊 Test Results Summary')
    await this.log('=' * 50)
    
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.success).length
    const failedTests = totalTests - passedTests
    
    await this.log(`Total Tests: ${totalTests}`)
    await this.log(`Passed: ${passedTests}`, passedTests > 0 ? 'success' : 'info')
    await this.log(`Failed: ${failedTests}`, failedTests > 0 ? 'error' : 'info')
    await this.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
    
    if (failedTests > 0) {
      await this.log('')
      await this.log('❌ Failed Tests:')
      this.testResults
        .filter(r => !r.success)
        .forEach(r => this.log(`  - ${r.testName}: ${r.details}`, 'error'))
    }
    
    await this.log('')
    await this.log('✅ Test execution completed!')
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new UserManagementTester()
  tester.runAllTests().catch(console.error)
}

module.exports = UserManagementTester
