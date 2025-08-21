import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createPaymentSchema } from '@/lib/validations'
import { calculateInvoiceBalance, getInvoiceStatus } from '@/lib/utils'

// GET /api/payments - Get all payments
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
    const invoiceId = searchParams.get('invoiceId')
    const paymentMethod = searchParams.get('paymentMethod')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Build where clause
    const where: any = {}
    
    if (invoiceId) {
      where.invoiceId = invoiceId
    }
    
    if (paymentMethod) {
      where.paymentMethod = paymentMethod
    }
    
    if (dateFrom || dateTo) {
      where.paymentDate = {}
      if (dateFrom) {
        where.paymentDate.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.paymentDate.lte = new Date(dateTo)
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: payments
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createPaymentSchema.parse(body)

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: validatedData.invoiceId },
      include: {
        payments: true
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if payment amount exceeds balance
    const currentBalance = calculateInvoiceBalance(invoice.totalAmount, invoice.paidAmount)
    if (validatedData.amount > currentBalance) {
      return NextResponse.json(
        { error: 'Payment amount exceeds invoice balance' },
        { status: 400 }
      )
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        invoiceId: validatedData.invoiceId,
        amount: validatedData.amount,
        paymentDate: validatedData.paymentDate || new Date(),
        paymentMethod: validatedData.paymentMethod,
        reference: validatedData.reference,
        notes: validatedData.notes,
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    // Update invoice paid amount and status
    const newPaidAmount = invoice.paidAmount + validatedData.amount
    const newBalance = calculateInvoiceBalance(invoice.totalAmount, newPaidAmount)
    const newStatus = getInvoiceStatus(
      invoice.dueDate,
      invoice.totalAmount,
      newPaidAmount,
      invoice.status
    )

    await prisma.invoice.update({
      where: { id: validatedData.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalance,
        status: newStatus as any,
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
