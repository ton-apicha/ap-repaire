import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Utility functions
function generateInvoiceNumber(invoiceNumber) {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`
  const invoiceNumberPart = invoiceNumber.toString().padStart(3, '0')
  return `INV${datePart}${invoiceNumberPart}`
}

function calculateInvoiceTotals(items, taxRate = 0, discountAmount = 0) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const totalBeforeDiscount = subtotal + taxAmount
  const totalAmount = totalBeforeDiscount - discountAmount
  return {
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount: Math.max(0, totalAmount),
  }
}

async function seedInvoices() {
  try {
    console.log('🌱 Starting invoice seeding...')

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('❌ No admin user found. Please run seed-users.js first.')
      return
    }

    // Get customers
    const customers = await prisma.customer.findMany()
    if (customers.length === 0) {
      console.log('❌ No customers found. Please create some customers first.')
      return
    }

    // Get work orders
    const workOrders = await prisma.workOrder.findMany()
    if (workOrders.length === 0) {
      console.log('❌ No work orders found. Please create some work orders first.')
      return
    }

    // Create sample invoices
    const sampleInvoices = [
      {
        customerId: customers[0].id,
        workOrderId: workOrders[0].id,
        issueDate: new Date('2025-08-20'),
        dueDate: new Date('2025-09-20'),
        items: [
          {
            description: 'ซ่อม Power Supply',
            quantity: 1,
            unitPrice: 2500,
            type: 'SERVICE'
          },
          {
            description: 'อะไหล่ Power Supply Unit',
            quantity: 1,
            unitPrice: 1500,
            type: 'PARTS'
          }
        ],
        notes: 'ซ่อม Power Supply ที่เสียหาย',
        terms: 'ชำระภายใน 30 วัน'
      },
      {
        customerId: customers[0].id,
        workOrderId: workOrders[1]?.id,
        issueDate: new Date('2025-08-21'),
        dueDate: new Date('2025-09-21'),
        items: [
          {
            description: 'ตรวจสอบและซ่อม Fan',
            quantity: 1,
            unitPrice: 800,
            type: 'SERVICE'
          },
          {
            description: 'Fan ใหม่',
            quantity: 2,
            unitPrice: 300,
            type: 'PARTS'
          }
        ],
        notes: 'เปลี่ยน Fan ที่เสียหาย',
        terms: 'ชำระภายใน 30 วัน'
      }
    ]

    for (let i = 0; i < sampleInvoices.length; i++) {
      const invoiceData = sampleInvoices[i]
      
      // Generate invoice number
      const todayInvoices = await prisma.invoice.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
          },
        },
      })
      
      const invoiceNumber = generateInvoiceNumber(todayInvoices + i + 1)

      // Calculate totals
      const totals = calculateInvoiceTotals(invoiceData.items, 7, 0) // 7% tax

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          customerId: invoiceData.customerId,
          workOrderId: invoiceData.workOrderId,
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
          paidAmount: 0,
          balanceAmount: totals.totalAmount,
          notes: invoiceData.notes,
          terms: invoiceData.terms,
          status: 'DRAFT',
          createdBy: adminUser.id,
          items: {
            create: invoiceData.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              type: item.type,
            }))
          }
        },
        include: {
          customer: true,
          workOrder: true,
          items: true
        }
      })

      console.log(`✅ Invoice created: ${invoice.invoiceNumber} - ${invoice.customer.name}`)
    }

    console.log('🎉 Invoice seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding invoices:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding function
seedInvoices()
  .then(() => {
    console.log('✅ Invoice seeding completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Invoice seeding failed:', error)
    process.exit(1)
  })
