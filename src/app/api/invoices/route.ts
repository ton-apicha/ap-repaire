import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createInvoiceSchema } from '@/lib/validations'
import { generateInvoiceNumber, calculateInvoiceTotals } from '@/lib/utils'

// GET /api/invoices - Get all invoices
export async function GET(request: NextRequest) {
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (customerId) {
      where.customerId = customerId
    }
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        workOrder: {
          select: {
            id: true,
            orderNumber: true,
          }
        },
        items: true,
        payments: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: invoices
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    
    // Validate input
    const validatedData = createInvoiceSchema.parse(body)
    
    // Generate invoice number
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()
    
    const todayInvoices = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(year, month, day),
          lt: new Date(year, month, day + 1),
        },
      },
    })
    
    const invoiceNumber = generateInvoiceNumber(todayInvoices + 1)

    // Calculate totals
    const totals = calculateInvoiceTotals(
      validatedData.items,
      validatedData.taxRate || 0,
      validatedData.discountAmount || 0
    )

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: validatedData.customerId,
        workOrderId: validatedData.workOrderId,
        issueDate: validatedData.issueDate,
        dueDate: validatedData.dueDate,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.totalAmount,
        paidAmount: 0,
        balanceAmount: totals.totalAmount,
        notes: validatedData.notes,
        terms: validatedData.terms,
        status: 'DRAFT',
        createdBy: 'cmelbwjx20000a1sj4srxcys0', // TEMPORARILY HARDCODED FOR TESTING
        items: {
          create: validatedData.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            type: item.type,
          }))
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        workOrder: {
          select: {
            id: true,
            orderNumber: true,
          }
        },
        items: true,
        payments: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: invoice
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
