#!/usr/bin/env node

/**
 * Seed Users Script
 * Adds test users to the database for testing
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const testUsers = [
  {
    email: 'admin@aprepair.com',
    name: 'System Administrator',
    role: 'ADMIN',
    password: 'admin123'
  },
  {
    email: 'manager@aprepair.com',
    name: 'John Manager',
    role: 'MANAGER',
    password: 'manager123'
  },
  {
    email: 'tech1@aprepair.com',
    name: 'Mike Technician',
    role: 'TECHNICIAN',
    password: 'tech123'
  },
  {
    email: 'tech2@aprepair.com',
    name: 'Sarah Technician',
    role: 'TECHNICIAN',
    password: 'tech123'
  },
  {
    email: 'user1@aprepair.com',
    name: 'Alice User',
    role: 'USER',
    password: 'user123'
  },
  {
    email: 'user2@aprepair.com',
    name: 'Bob User',
    role: 'USER',
    password: 'user123'
  }
]

async function seedUsers() {
  console.log('🌱 Starting user seeding...')
  
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@aprepair.com' }
    })

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists, skipping...')
    } else {
      console.log('✅ Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: {
          email: 'admin@aprepair.com',
          name: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log('✅ Admin user created successfully')
    }

    // Create other test users
    for (const userData of testUsers.slice(1)) { // Skip admin (already handled)
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`⚠️ User ${userData.email} already exists, skipping...`)
      } else {
        console.log(`✅ Creating user: ${userData.email}`)
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            role: userData.role
          }
        })
        console.log(`✅ User ${userData.email} created successfully`)
      }
    }

    // Display all users
    console.log('\n📋 Current users in database:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
    })

    console.log('\n🎉 User seeding completed successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('Admin: admin@aprepair.com / admin123')
    console.log('Manager: manager@aprepair.com / manager123')
    console.log('Technician: tech1@aprepair.com / tech123')
    console.log('User: user1@aprepair.com / user123')

  } catch (error) {
    console.error('❌ Error seeding users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedUsers()
}

module.exports = { seedUsers, testUsers }
