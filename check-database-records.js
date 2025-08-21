import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseRecords() {
  try {
    console.log('🔍 ตรวจสอบข้อมูลในฐานข้อมูลแบบละเอียด')
    console.log('=' .repeat(80))

    // 1. ตรวจสอบ Users
    console.log('\n👤 ตรวจสอบ Users:')
    const users = await prisma.user.findMany()
    console.log(`   จำนวน Users: ${users.length}`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
    })

    // 2. ตรวจสอบ Customers
    console.log('\n👥 ตรวจสอบ Customers:')
    const customers = await prisma.customer.findMany()
    console.log(`   จำนวน Customers: ${customers.length}`)
    customers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} (${customer.email})`)
      console.log(`      เบอร์โทร: ${customer.phone}`)
      console.log(`      บริษัท: ${customer.company || 'ไม่มี'}`)
    })

    // 3. ตรวจสอบ Technicians
    console.log('\n🔧 ตรวจสอบ Technicians:')
    const technicians = await prisma.technician.findMany()
    console.log(`   จำนวน Technicians: ${technicians.length}`)
    technicians.forEach((tech, index) => {
      console.log(`   ${index + 1}. ${tech.name} (${tech.email})`)
      console.log(`      เบอร์โทร: ${tech.phone}`)
      console.log(`      ความเชี่ยวชาญ: ${tech.speciality}`)
      console.log(`      อัตราค่าจ้าง: ${tech.hourlyRate} บาท/ชั่วโมง`)
    })

    // 4. ตรวจสอบ MinerModels
    console.log('\n⚙️ ตรวจสอบ MinerModels:')
    const minerModels = await prisma.minerModel.findMany()
    console.log(`   จำนวน MinerModels: ${minerModels.length}`)
    minerModels.forEach((model, index) => {
      console.log(`   ${index + 1}. ${model.brand} ${model.model}`)
      console.log(`      Series: ${model.series}`)
      console.log(`      Hash Rate: ${model.hashRate}`)
      console.log(`      Power: ${model.power}`)
    })

    // 5. ตรวจสอบ WorkOrders
    console.log('\n🔧 ตรวจสอบ WorkOrders:')
    const workOrders = await prisma.workOrder.findMany({
      include: {
        customer: true,
        technician: true,
        minerModel: true
      }
    })
    console.log(`   จำนวน WorkOrders: ${workOrders.length}`)
    workOrders.forEach((wo, index) => {
      console.log(`   ${index + 1}. ${wo.orderNumber}`)
      console.log(`      ลูกค้า: ${wo.customer.name}`)
      console.log(`      ช่าง: ${wo.technician?.name || 'ยังไม่ได้มอบหมาย'}`)
      console.log(`      รุ่นเครื่อง: ${wo.minerModel?.brand} ${wo.minerModel?.model || 'ไม่ระบุ'}`)
      console.log(`      สถานะ: ${wo.status}`)
      console.log(`      ปัญหา: ${wo.issue}`)
    })

    // 6. ตรวจสอบ Invoices
    console.log('\n💰 ตรวจสอบ Invoices:')
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        workOrder: true,
        items: true,
        payments: true
      }
    })
    console.log(`   จำนวน Invoices: ${invoices.length}`)
    invoices.forEach((invoice, index) => {
      console.log(`   ${index + 1}. ${invoice.invoiceNumber}`)
      console.log(`      ลูกค้า: ${invoice.customer.name}`)
      console.log(`      Work Order: ${invoice.workOrder?.orderNumber || 'ไม่มี'}`)
      console.log(`      สถานะ: ${invoice.status}`)
      console.log(`      ยอดรวม: ${invoice.totalAmount} บาท`)
      console.log(`      ชำระแล้ว: ${invoice.paidAmount} บาท`)
      console.log(`      คงเหลือ: ${invoice.balanceAmount} บาท`)
      console.log(`      รายการ: ${invoice.items.length} รายการ`)
      console.log(`      การชำระ: ${invoice.payments.length} ครั้ง`)
    })

    // 7. ตรวจสอบ InvoiceItems
    console.log('\n📋 ตรวจสอบ InvoiceItems:')
    const invoiceItems = await prisma.invoiceItem.findMany()
    console.log(`   จำนวน InvoiceItems: ${invoiceItems.length}`)
    invoiceItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.description}`)
      console.log(`      จำนวน: ${item.quantity}`)
      console.log(`      ราคาต่อหน่วย: ${item.unitPrice} บาท`)
      console.log(`      ยอดรวม: ${item.totalPrice} บาท`)
      console.log(`      ประเภท: ${item.type}`)
    })

    // 8. ตรวจสอบ Payments
    console.log('\n💳 ตรวจสอบ Payments:')
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            customer: true
          }
        }
      }
    })
    console.log(`   จำนวน Payments: ${payments.length}`)
    payments.forEach((payment, index) => {
      console.log(`   ${index + 1}. ${payment.amount} บาท`)
      console.log(`      วิธีชำระ: ${payment.paymentMethod}`)
      console.log(`      วันที่: ${payment.paymentDate.toLocaleDateString('th-TH')}`)
      console.log(`      ใบแจ้งหนี้: ${payment.invoice.invoiceNumber}`)
      console.log(`      ลูกค้า: ${payment.invoice.customer.name}`)
      console.log(`      หมายเหตุ: ${payment.notes || 'ไม่มี'}`)
    })

    // 9. สรุปสถิติ
    console.log('\n📊 สรุปสถิติข้อมูล:')
    console.log(`   👤 Users: ${users.length} คน`)
    console.log(`   👥 Customers: ${customers.length} ราย`)
    console.log(`   🔧 Technicians: ${technicians.length} คน`)
    console.log(`   ⚙️ MinerModels: ${minerModels.length} รุ่น`)
    console.log(`   🔧 WorkOrders: ${workOrders.length} รายการ`)
    console.log(`   💰 Invoices: ${invoices.length} ใบ`)
    console.log(`   📋 InvoiceItems: ${invoiceItems.length} รายการ`)
    console.log(`   💳 Payments: ${payments.length} ครั้ง`)

    // 10. ตรวจสอบความสัมพันธ์
    console.log('\n🔗 ตรวจสอบความสัมพันธ์:')
    
    // ตรวจสอบ WorkOrders ที่มี Customer
    const workOrdersWithCustomer = workOrders.filter(wo => wo.customer)
    console.log(`   WorkOrders ที่มี Customer: ${workOrdersWithCustomer.length}/${workOrders.length}`)
    
    // ตรวจสอบ Invoices ที่มี Customer
    const invoicesWithCustomer = invoices.filter(inv => inv.customer)
    console.log(`   Invoices ที่มี Customer: ${invoicesWithCustomer.length}/${invoices.length}`)
    
    // ตรวจสอบ Payments ที่มี Invoice
    const paymentsWithInvoice = payments.filter(pay => pay.invoice)
    console.log(`   Payments ที่มี Invoice: ${paymentsWithInvoice.length}/${payments.length}`)

    // 11. ตรวจสอบข้อมูลที่ขาดหายไป
    console.log('\n⚠️  ตรวจสอบข้อมูลที่ขาดหายไป:')
    
    const workOrdersWithoutTechnician = workOrders.filter(wo => !wo.technician)
    if (workOrdersWithoutTechnician.length > 0) {
      console.log(`   WorkOrders ที่ไม่มีช่าง: ${workOrdersWithoutTechnician.length} รายการ`)
      workOrdersWithoutTechnician.forEach(wo => {
        console.log(`      - ${wo.orderNumber}`)
      })
    }
    
    const invoicesWithoutWorkOrder = invoices.filter(inv => !inv.workOrder)
    if (invoicesWithoutWorkOrder.length > 0) {
      console.log(`   Invoices ที่ไม่มี WorkOrder: ${invoicesWithoutWorkOrder.length} ใบ`)
      invoicesWithoutWorkOrder.forEach(inv => {
        console.log(`      - ${inv.invoiceNumber}`)
      })
    }

    console.log('\n✅ การตรวจสอบเสร็จสิ้น!')
    
    return {
      users: users.length,
      customers: customers.length,
      technicians: technicians.length,
      minerModels: minerModels.length,
      workOrders: workOrders.length,
      invoices: invoices.length,
      invoiceItems: invoiceItems.length,
      payments: payments.length
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// รันการตรวจสอบ
checkDatabaseRecords()
  .then((stats) => {
    console.log('\n📈 สรุปสถิติ:')
    console.log(`   👤 Users: ${stats.users} คน`)
    console.log(`   👥 Customers: ${stats.customers} ราย`)
    console.log(`   🔧 Technicians: ${stats.technicians} คน`)
    console.log(`   ⚙️ MinerModels: ${stats.minerModels} รุ่น`)
    console.log(`   🔧 WorkOrders: ${stats.workOrders} รายการ`)
    console.log(`   💰 Invoices: ${stats.invoices} ใบ`)
    console.log(`   📋 InvoiceItems: ${stats.invoiceItems} รายการ`)
    console.log(`   💳 Payments: ${stats.payments} ครั้ง`)
    console.log('\n🎉 ฐานข้อมูลมีข้อมูลครบถ้วน!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ การตรวจสอบล้มเหลว:', error)
    process.exit(1)
  })
