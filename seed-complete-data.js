import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ฟังก์ชันสำหรับสร้างเลข Work Order
function generateWorkId(workNumber) {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`
  const workNumberPart = workNumber.toString().padStart(3, '0')
  return `${datePart}${workNumberPart}`
}

// ฟังก์ชันสำหรับสร้างเลข Invoice
function generateInvoiceNumber() {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`
  const timePart = Date.now().toString().slice(-3)
  return `INV${datePart}${timePart}`
}

async function seedCompleteData() {
  try {
    console.log('🌱 เริ่มเพิ่มข้อมูลตัวอย่างให้ครบถ้วน...')

    // 1. ตรวจสอบและสร้าง Admin User
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('👤 สร้าง Admin User...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log('✅ สร้าง Admin User สำเร็จ')
    } else {
      console.log('✅ พบ Admin User แล้ว')
    }

    // 2. สร้างลูกค้าเพิ่มเติม
    console.log('\n👥 สร้างลูกค้าเพิ่มเติม...')
    
    const customers = await Promise.all([
      prisma.customer.upsert({
        where: { email: 'empire@example.com' },
        update: {},
        create: {
          name: 'บริษัท เอ็มไพร์ มายนิ่ง จำกัด',
          email: 'empire@example.com',
          phone: '0812345678',
          address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
          company: 'Empire Mining Co., Ltd.',
          taxId: '0123456789012',
          createdBy: adminUser.id
        }
      }),
      prisma.customer.upsert({
        where: { email: 'somchai@example.com' },
        update: {},
        create: {
          name: 'คุณสมชาย ใจดี',
          email: 'somchai@example.com',
          phone: '0898765432',
          address: '456 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
          createdBy: adminUser.id
        }
      }),
      prisma.customer.upsert({
        where: { email: 'test.customer@example.com' },
        update: {},
        create: {
          name: 'คุณทดสอบ ลูกค้าใหม่',
          email: 'test.customer@example.com',
          phone: '0812345678',
          address: '123 ถนนทดสอบ แขวงทดสอบ เขทดสอบ กรุงเทพฯ 10110',
          company: 'บริษัท ทดสอบ จำกัด',
          taxId: '1234567890123',
          createdBy: adminUser.id
        }
      }),
      prisma.customer.upsert({
        where: { email: 'mining@example.com' },
        update: {},
        create: {
          name: 'บริษัท มายนิ่ง เทค จำกัด',
          email: 'mining@example.com',
          phone: '0823456789',
          address: '789 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
          company: 'Mining Tech Co., Ltd.',
          taxId: '9876543210987',
          createdBy: adminUser.id
        }
      }),
      prisma.customer.upsert({
        where: { email: 'crypto@example.com' },
        update: {},
        create: {
          name: 'คุณคริปโต ฟาร์ม',
          email: 'crypto@example.com',
          phone: '0834567890',
          address: '321 ถนนลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
          company: 'Crypto Farm',
          taxId: '5556667778889',
          createdBy: adminUser.id
        }
      })
    ])

    console.log(`✅ สร้างลูกค้า ${customers.length} รายสำเร็จ`)

    // 3. สร้างช่างเทคนิคเพิ่มเติม
    console.log('\n🔧 สร้างช่างเทคนิคเพิ่มเติม...')
    
    const technicians = await Promise.all([
      prisma.technician.upsert({
        where: { email: 'somsak@example.com' },
        update: {},
        create: {
          name: 'ช่างสมศักดิ์ มือทอง',
          email: 'somsak@example.com',
          phone: '0823456789',
          speciality: 'Power Supply, Motherboard, GPU',
          hourlyRate: 500,
          isActive: true,
          createdBy: adminUser.id
        }
      }),
      prisma.technician.upsert({
        where: { email: 'prayut@example.com' },
        update: {},
        create: {
          name: 'ช่างประยุทธ ใจเย็น',
          email: 'prayut@example.com',
          phone: '0834567890',
          speciality: 'Fan, Cooling System, Maintenance',
          hourlyRate: 450,
          isActive: true,
          createdBy: adminUser.id
        }
      }),
      prisma.technician.upsert({
        where: { email: 'somkiat@example.com' },
        update: {},
        create: {
          name: 'ช่างสมเกียรติ มืออาชีพ',
          email: 'somkiat@example.com',
          phone: '0845678901',
          speciality: 'Software, Firmware, Network',
          hourlyRate: 600,
          isActive: true,
          createdBy: adminUser.id
        }
      })
    ])

    console.log(`✅ สร้างช่างเทคนิค ${technicians.length} คนสำเร็จ`)

    // 4. สร้าง Miner Models เพิ่มเติม
    console.log('\n⚙️ สร้าง Miner Models เพิ่มเติม...')
    
    const minerModels = await Promise.all([
      prisma.minerModel.upsert({
        where: { 
          id: 'bitmain-s19-xp'
        },
        update: {},
        create: {
          id: 'bitmain-s19-xp',
          brand: 'Bitmain',
          model: 'Antminer S19 XP',
          series: 'S19',
          hashRate: '140 TH/s',
          power: '3010W',
          description: 'Bitcoin mining machine with high efficiency',
          isActive: true
        }
      }),
      prisma.minerModel.upsert({
        where: { 
          id: 'whatsminer-m50s'
        },
        update: {},
        create: {
          id: 'whatsminer-m50s',
          brand: 'Whatsminer',
          model: 'M50S',
          series: 'M50',
          hashRate: '126 TH/s',
          power: '3276W',
          description: 'Whatsminer Bitcoin mining machine',
          isActive: true
        }
      }),
      prisma.minerModel.upsert({
        where: { 
          id: 'bitmain-s19-pro'
        },
        update: {},
        create: {
          id: 'bitmain-s19-pro',
          brand: 'Bitmain',
          model: 'Antminer S19 Pro',
          series: 'S19',
          hashRate: '110 TH/s',
          power: '3250W',
          description: 'Bitmain S19 Pro Bitcoin miner',
          isActive: true
        }
      }),
      prisma.minerModel.upsert({
        where: { 
          id: 'avalon-a1246'
        },
        update: {},
        create: {
          id: 'avalon-a1246',
          brand: 'Avalon',
          model: 'A1246',
          series: 'A12',
          hashRate: '90 TH/s',
          power: '3420W',
          description: 'Avalon Bitcoin mining machine',
          isActive: true
        }
      })
    ])

    console.log(`✅ สร้าง Miner Models ${minerModels.length} รุ่นสำเร็จ`)

    // 5. สร้าง Work Orders เพิ่มเติม
    console.log('\n🔧 สร้าง Work Orders เพิ่มเติม...')
    
    const workOrders = await Promise.all([
      prisma.workOrder.upsert({
        where: { orderNumber: 'WO-2025-0821-001' },
        update: {},
        create: {
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
      prisma.workOrder.upsert({
        where: { orderNumber: 'WO-2025-0821-002' },
        update: {},
        create: {
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
      }),
      prisma.workOrder.upsert({
        where: { orderNumber: '250821003' },
        update: {},
        create: {
          orderNumber: '250821003',
          customerId: customers[2].id,
          technicianId: technicians[0].id,
          minerModelId: minerModels[2].id,
          serialNumber: 'TEST-' + Date.now(),
          issue: 'เครื่องขุดไม่สามารถเปิดได้ - ไฟไม่ติด มีเสียงดังผิดปกติ',
          diagnosis: 'Power Supply Unit เสียหาย - ไฟไม่เข้าระบบ มีกลิ่นไหม้',
          solution: 'เปลี่ยน Power Supply Unit ใหม่ ทดสอบระบบทั้งหมด ทำความสะอาดพัดลม',
          status: 'COMPLETED',
          priority: 'HIGH',
          estimatedCost: 3500,
          actualCost: 4200,
          startDate: new Date('2025-08-21'),
          completedDate: new Date('2025-08-21'),
          notes: 'ลูกค้าต้องการให้ตรวจสอบด่วน เครื่องหยุดทำงานกะทันหัน',
          createdBy: adminUser.id
        }
      }),
      prisma.workOrder.upsert({
        where: { orderNumber: '250821004' },
        update: {},
        create: {
          orderNumber: '250821004',
          customerId: customers[3].id,
          technicianId: technicians[2].id,
          minerModelId: minerModels[3].id,
          serialNumber: 'AV2025003',
          issue: 'Software error - ไม่สามารถเชื่อมต่อเครือข่ายได้',
          diagnosis: 'Firmware เก่า ต้องอัปเดตใหม่',
          solution: 'อัปเดต firmware และตั้งค่าเครือข่ายใหม่',
          status: 'PENDING',
          priority: 'LOW',
          estimatedCost: 800,
          actualCost: null,
          startDate: null,
          completedDate: null,
          notes: 'รอการยืนยันจากลูกค้า',
          createdBy: adminUser.id
        }
      }),
      prisma.workOrder.upsert({
        where: { orderNumber: '250821005' },
        update: {},
        create: {
          orderNumber: '250821005',
          customerId: customers[4].id,
          technicianId: technicians[1].id,
          minerModelId: minerModels[0].id,
          serialNumber: 'BM2025004',
          issue: 'Overheating - อุณหภูมิสูงเกินไป',
          diagnosis: 'ระบบระบายความร้อนอุดตัน ต้องทำความสะอาด',
          solution: 'ทำความสะอาดพัดลมและระบบระบายความร้อน',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          estimatedCost: 1200,
          actualCost: 1100,
          startDate: new Date('2025-08-20'),
          completedDate: new Date('2025-08-21'),
          notes: 'ลูกค้าพอใจกับการซ่อม',
          createdBy: adminUser.id
        }
      })
    ])

    console.log(`✅ สร้าง Work Orders ${workOrders.length} รายการสำเร็จ`)

    // 6. สร้าง Invoices เพิ่มเติม
    console.log('\n💰 สร้าง Invoices เพิ่มเติม...')
    
    const invoices = await Promise.all([
      prisma.invoice.upsert({
        where: { invoiceNumber: 'INV250821001' },
        update: {},
        create: {
          invoiceNumber: 'INV250821001',
          customerId: customers[0].id,
          workOrderId: workOrders[0].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-21'),
          subtotal: 4000,
          taxAmount: 280,
          discountAmount: 0,
          totalAmount: 4280,
          paidAmount: 2000,
          balanceAmount: 2280,
          notes: 'ซ่อม Power Supply ที่เสียหาย',
          terms: 'ชำระภายใน 30 วัน',
          status: 'PARTIAL',
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
      prisma.invoice.upsert({
        where: { invoiceNumber: 'INV250821002' },
        update: {},
        create: {
          invoiceNumber: 'INV250821002',
          customerId: customers[1].id,
          workOrderId: workOrders[1].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-21'),
          subtotal: 1500,
          taxAmount: 105,
          discountAmount: 0,
          totalAmount: 1605,
          paidAmount: 1605,
          balanceAmount: 0,
          notes: 'เปลี่ยน Fan ที่เสียหาย',
          terms: 'ชำระภายใน 30 วัน',
          status: 'PAID',
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
      }),
      prisma.invoice.upsert({
        where: { invoiceNumber: 'INV250821960' },
        update: {},
        create: {
          invoiceNumber: 'INV250821960',
          customerId: customers[2].id,
          workOrderId: workOrders[2].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-20'),
          subtotal: 4200,
          taxAmount: 294,
          discountAmount: 0,
          totalAmount: 4494,
          paidAmount: 0,
          balanceAmount: 4494,
          notes: 'ซ่อม Power Supply Unit ที่เสียหาย',
          terms: 'ชำระภายใน 30 วัน',
          status: 'DRAFT',
          createdBy: adminUser.id,
          items: {
            create: [
              {
                description: 'ค่าบริการตรวจสอบและวินิจฉัย',
                quantity: 1,
                unitPrice: 800,
                totalPrice: 800,
                type: 'SERVICE'
              },
              {
                description: 'ค่าแรงช่างซ่อม (2 ชั่วโมง)',
                quantity: 2,
                unitPrice: 500,
                totalPrice: 1000,
                type: 'LABOR'
              },
              {
                description: 'Power Supply Unit (PSU) 3250W',
                quantity: 1,
                unitPrice: 2200,
                totalPrice: 2200,
                type: 'PARTS'
              },
              {
                description: 'ค่าทำความสะอาดและบำรุงรักษา',
                quantity: 1,
                unitPrice: 200,
                totalPrice: 200,
                type: 'SERVICE'
              }
            ]
          }
        }
      }),
      prisma.invoice.upsert({
        where: { invoiceNumber: 'INV250821003' },
        update: {},
        create: {
          invoiceNumber: 'INV250821003',
          customerId: customers[4].id,
          workOrderId: workOrders[4].id,
          issueDate: new Date('2025-08-21'),
          dueDate: new Date('2025-09-21'),
          subtotal: 1100,
          taxAmount: 77,
          discountAmount: 0,
          totalAmount: 1177,
          paidAmount: 1177,
          balanceAmount: 0,
          notes: 'ทำความสะอาดระบบระบายความร้อน',
          terms: 'ชำระภายใน 30 วัน',
          status: 'PAID',
          createdBy: adminUser.id,
          items: {
            create: [
              {
                description: 'ทำความสะอาดระบบระบายความร้อน',
                quantity: 1,
                unitPrice: 800,
                totalPrice: 800,
                type: 'SERVICE'
              },
              {
                description: 'สารทำความสะอาดและอุปกรณ์',
                quantity: 1,
                unitPrice: 300,
                totalPrice: 300,
                type: 'PARTS'
              }
            ]
          }
        }
      })
    ])

    console.log(`✅ สร้าง Invoices ${invoices.length} ใบสำเร็จ`)

    // 7. สร้าง Payments เพิ่มเติม
    console.log('\n💳 สร้าง Payments เพิ่มเติม...')
    
    const payments = await Promise.all([
      prisma.payment.upsert({
        where: { 
          id: 'payment-1'
        },
        update: {},
        create: {
          id: 'payment-1',
          invoiceId: invoices[0].id,
          amount: 2000,
          paymentDate: new Date('2025-08-22'),
          paymentMethod: 'BANK_TRANSFER',
          reference: 'TRX001',
          notes: 'ชำระบางส่วน'
        }
      }),
      prisma.payment.upsert({
        where: { 
          id: 'payment-2'
        },
        update: {},
        create: {
          id: 'payment-2',
          invoiceId: invoices[1].id,
          amount: 802,
          paymentDate: new Date('2025-08-21'),
          paymentMethod: 'BANK_TRANSFER',
          reference: 'TRX547957',
          notes: 'ชำระเงินงวดที่ 1 (50%)'
        }
      }),
      prisma.payment.upsert({
        where: { 
          id: 'payment-3'
        },
        update: {},
        create: {
          id: 'payment-3',
          invoiceId: invoices[1].id,
          amount: 803,
          paymentDate: new Date('2025-08-21'),
          paymentMethod: 'CASH',
          reference: null,
          notes: 'ชำระเงินงวดสุดท้าย (ครบถ้วน)'
        }
      }),
      prisma.payment.upsert({
        where: { 
          id: 'payment-4'
        },
        update: {},
        create: {
          id: 'payment-4',
          invoiceId: invoices[3].id,
          amount: 1177,
          paymentDate: new Date('2025-08-22'),
          paymentMethod: 'CREDIT_CARD',
          reference: 'CC123456',
          notes: 'ชำระครบถ้วน'
        }
      })
    ])

    console.log(`✅ สร้าง Payments ${payments.length} ครั้งสำเร็จ`)

    // 8. สรุปข้อมูล
    console.log('\n📊 สรุปข้อมูลที่สร้าง:')
    console.log(`   👥 ลูกค้า: ${customers.length} ราย`)
    console.log(`   🔧 ช่างเทคนิค: ${technicians.length} คน`)
    console.log(`   ⚙️ Miner Models: ${minerModels.length} รุ่น`)
    console.log(`   🔧 Work Orders: ${workOrders.length} รายการ`)
    console.log(`   💰 Invoices: ${invoices.length} ใบ`)
    console.log(`   💳 Payments: ${payments.length} ครั้ง`)

    console.log('\n🎉 เพิ่มข้อมูลตัวอย่างเสร็จสิ้น!')
    console.log('\n📋 ข้อมูลสำหรับทดสอบ:')
    console.log('   🔐 Login: admin@example.com / admin123')
    console.log('   🌐 URL: http://localhost:3001')

    return {
      customers: customers.length,
      technicians: technicians.length,
      minerModels: minerModels.length,
      workOrders: workOrders.length,
      invoices: invoices.length,
      payments: payments.length
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// รันการเพิ่มข้อมูล
seedCompleteData()
  .then((stats) => {
    console.log('\n✅ การเพิ่มข้อมูลเสร็จสิ้น')
    console.log('📈 สรุปสถิติ:')
    console.log(`   ลูกค้า: ${stats.customers} ราย`)
    console.log(`   ช่างเทคนิค: ${stats.technicians} คน`)
    console.log(`   Miner Models: ${stats.minerModels} รุ่น`)
    console.log(`   Work Orders: ${stats.workOrders} รายการ`)
    console.log(`   Invoices: ${stats.invoices} ใบ`)
    console.log(`   Payments: ${stats.payments} ครั้ง`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ การเพิ่มข้อมูลล้มเหลว:', error)
    process.exit(1)
  })
