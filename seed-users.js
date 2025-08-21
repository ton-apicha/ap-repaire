#!/usr/bin/env node

/**
 * Seed Users Script
 * Adds test users to the database for testing
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeding...')

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists, skipping...')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 12)
    
    const managerUser = await prisma.user.create({
      data: {
        email: 'manager@example.com',
        name: 'System Manager',
        password: managerPassword,
        role: 'MANAGER'
      }
    })

    console.log('✅ Manager user created:', managerUser.email)

    // Create technician user
    const technicianPassword = await bcrypt.hash('tech123', 12)
    
    const technicianUser = await prisma.user.create({
      data: {
        email: 'tech@example.com',
        name: 'System Technician',
        password: technicianPassword,
        role: 'TECHNICIAN'
      }
    })

    console.log('✅ Technician user created:', technicianUser.email)

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12)
    
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        role: 'USER'
      }
    })

    console.log('✅ Regular user created:', regularUser.email)

    console.log('🎉 User seeding completed successfully!')
    console.log('\n📋 Created users:')
    console.log('   Admin: admin@example.com / admin123')
    console.log('   Manager: manager@example.com / manager123')
    console.log('   Technician: tech@example.com / tech123')
    console.log('   User: user@example.com / user123')

  } catch (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedUsers()
  .then(() => {
    console.log('✅ Seeding completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
