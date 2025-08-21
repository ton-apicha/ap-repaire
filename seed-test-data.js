import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...')

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('❌ No admin user found. Please run seed-users.js first.')
      return
    }

    // Create customers
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'บริษัท เอ็มไพร์ มายนิ่ง จำกัด',
          email: 'empire@example.com',
          phone: '0812345678',
          address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
          company: 'Empire Mining Co., Ltd.',
          taxId: '0123456789012',
          createdBy: adminUser.id
        }
      }),
      prisma.customer.create({
        data: {
          name: 'คุณสมชาย ใจดี',
          email: 'somchai@example.com',
          phone: '0898765432',
          address: '456 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
          createdBy: adminUser.id
        }
      })
    ])

    console.log('✅ Customers created:', customers.length)

    // Create technicians
    const technicians = await Promise.all([
      prisma.technician.create({
        data: {
          name: 'ช่างสมศักดิ์ มือทอง',
          email: 'somsak@example.com',
          phone: '0823456789',
          speciality: 'Power Supply, Motherboard',
          hourlyRate: 500,
          isActive: true,
          createdBy: adminUser.id
        }
      }),
      prisma.technician.create({
        data: {
          name: 'ช่างประยุทธ ใจเย็น',
          email: 'prayut@example.com',
          phone: '0834567890',
          speciality: 'Fan, Cooling System',
          hourlyRate: 450,
          isActive: true,
          createdBy: adminUser.id
        }
      })
    ])

    console.log('✅ Technicians created:', technicians.length)

    // Create miner models
    const minerModels = await Promise.all([
      prisma.minerModel.create({
        data: {
          brand: 'Bitmain',
          model: 'Antminer S19 XP',
          series: 'S19',
          hashRate: '140 TH/s',
          power: '3010W',
          description: 'Bitcoin mining machine with high efficiency',
          isActive: true
        }
      }),
      prisma.minerModel.create({
        data: {
          brand: 'Whatsminer',
          model: 'M50S',
          series: 'M50',
          hashRate: '126 TH/s',
          power: '3276W',
          description: 'Whatsminer Bitcoin mining machine',
          isActive: true
        }
      })
    ])

    console.log('✅ Miner models created:', minerModels.length)

    // Create work orders
    const workOrders = await Promise.all([
      prisma.workOrder.create({
        data: {
          orderNumber: 'WO-2025-0821-001',
          customerId: customers[0].id,
          technicianId: technicians[0].id,
          minerModelId: minerModels[0].id,
          serialNumber: 'BM2025001',
          issue: 'Power supply failure - ไม่สามารถเปิดเครื่องได้',
          diagnosis: 'Power supply unit เสียหาย ต้องเปลี่ยนใหม่',
          solution: 'เปลี่ยน power supply unit และทดสอบการทำงาน',
          status: 'COMPLETED',
          priority: 'HIGH',
          estimatedCost: 4000,
          actualCost: 4200,
          startDate: new Date('2025-08-20'),
          completedDate: new Date('2025-08-21'),
          notes: 'ลูกค้าต้องการให้ซ่อมด่วน',
          createdBy: adminUser.id
        }
      }),
      prisma.workOrder.create({
        data: {
          orderNumber: 'WO-2025-0821-002',
          customerId: customers[1].id,
          technicianId: technicians[1].id,
          minerModelId: minerModels[1].id,
          serialNumber: 'WM2025002',
          issue: 'Fan malfunction - เสียงดังผิดปกติ',
          diagnosis: 'Fan ใบพัดเสียหาย ต้องเปลี่ยนใหม่',
          solution: 'เปลี่ยน fan และทำความสะอาดระบบระบายความร้อน',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          estimatedCost: 1500,
          actualCost: null,
          startDate: new Date('2025-08-21'),
          completedDate: null,
          notes: 'รออะไหล่จากซัพพลายเออร์',
          createdBy: adminUser.id
        }
      })
    ])

    console.log('✅ Work orders created:', workOrders.length)

    // Create invoices
    const invoices = await Promise.all([
      prisma.invoice.create({
        data: {
          invoiceNumber: 'INV250821001',
          customerId: customers[0].id,
          workOrderId: workOrders[0].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-21'),
          subtotal: 4000,
          taxAmount: 280,
          discountAmount: 0,
          totalAmount: 4280,
          paidAmount: 0,
          balanceAmount: 4280,
          notes: 'ซ่อม Power Supply ที่เสียหาย',
          terms: 'ชำระภายใน 30 วัน',
          status: 'DRAFT',
          createdBy: adminUser.id,
          items: {
            create: [
              {
                description: 'ซ่อม Power Supply',
                quantity: 1,
                unitPrice: 2500,
                totalPrice: 2500,
                type: 'SERVICE'
              },
              {
                description: 'อะไหล่ Power Supply Unit',
                quantity: 1,
                unitPrice: 1500,
                totalPrice: 1500,
                type: 'PARTS'
              }
            ]
          }
        }
      }),
      prisma.invoice.create({
        data: {
          invoiceNumber: 'INV250821002',
          customerId: customers[1].id,
          workOrderId: workOrders[1].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-21'),
          subtotal: 1500,
          taxAmount: 105,
          discountAmount: 0,
          totalAmount: 1605,
          paidAmount: 0,
          balanceAmount: 1605,
          notes: 'เปลี่ยน Fan ที่เสียหาย',
          terms: 'ชำระภายใน 30 วัน',
          status: 'DRAFT',
          createdBy: adminUser.id,
          items: {
            create: [
              {
                description: 'ตรวจสอบและซ่อม Fan',
                quantity: 1,
                unitPrice: 800,
                totalPrice: 800,
                type: 'SERVICE'
              },
              {
                description: 'Fan ใหม่',
                quantity: 2,
                unitPrice: 300,
                totalPrice: 600,
                type: 'PARTS'
              }
            ]
          }
        }
      })
    ])

    console.log('✅ Invoices created:', invoices.length)

    // Create payments
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          invoiceId: invoices[0].id,
          amount: 2000,
          paymentDate: new Date('2025-08-22'),
          paymentMethod: 'BANK_TRANSFER',
          reference: 'TRX001',
          notes: 'ชำระบางส่วน'
        }
      })
    ])

    console.log('✅ Payments created:', payments.length)

    // Update invoice paid amount
    await prisma.invoice.update({
      where: { id: invoices[0].id },
      data: {
        paidAmount: 2000,
        balanceAmount: 2280,
        status: 'PARTIAL'
      }
    })

    console.log('🎉 Test data seeding completed successfully!')
    console.log('\n📋 Created data:')
    console.log(`   Customers: ${customers.length}`)
    console.log(`   Technicians: ${technicians.length}`)
    console.log(`   Miner Models: ${minerModels.length}`)
    console.log(`   Work Orders: ${workOrders.length}`)
    console.log(`   Invoices: ${invoices.length}`)
    console.log(`   Payments: ${payments.length}`)

  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedTestData()
  .then(() => {
    console.log('✅ Test data seeding completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test data seeding failed:', error)
    process.exit(1)
  })
