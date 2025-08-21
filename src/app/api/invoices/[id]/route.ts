import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateInvoiceSchema } from '@/lib/validations'
import { calculateInvoiceTotals, getInvoiceStatus } from '@/lib/utils'

// GET /api/invoices/[id] - Get specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            company: true,
            taxId: true,
          }
        },
        workOrder: {
          select: {
            id: true,
            orderNumber: true,
            issue: true,
            status: true,
          }
        },
        items: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        payments: {
          orderBy: {
            paymentDate: 'desc'
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const validatedData = updateInvoiceSchema.parse(body)

    // Get current invoice
    const currentInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true
      }
    })

    if (!currentInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.issueDate) {
      updateData.issueDate = validatedData.issueDate
    }
    if (validatedData.dueDate) {
      updateData.dueDate = validatedData.dueDate
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.terms !== undefined) {
      updateData.terms = validatedData.terms
    }

    // Handle items update if provided
    if (validatedData.items) {
      // Delete existing items
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id }
      })

      // Create new items
      updateData.items = {
        create: validatedData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          type: item.type,
        }))
      }

      // Recalculate totals
      const totals = calculateInvoiceTotals(
        validatedData.items,
        validatedData.taxRate || 0,
        validatedData.discountAmount || 0
      )

      updateData.subtotal = totals.subtotal
      updateData.taxAmount = totals.taxAmount
      updateData.discountAmount = totals.discountAmount
      updateData.totalAmount = totals.totalAmount
      updateData.balanceAmount = totals.totalAmount - currentInvoice.paidAmount
    } else if (validatedData.taxRate !== undefined || validatedData.discountAmount !== undefined) {
      // Recalculate totals with existing items
      const totals = calculateInvoiceTotals(
        currentInvoice.items,
        validatedData.taxRate || 0,
        validatedData.discountAmount || 0
      )

      updateData.subtotal = totals.subtotal
      updateData.taxAmount = totals.taxAmount
      updateData.discountAmount = totals.discountAmount
      updateData.totalAmount = totals.totalAmount
      updateData.balanceAmount = totals.totalAmount - currentInvoice.paidAmount
    }

    // Update status if provided
    if (validatedData.status) {
      updateData.status = validatedData.status
    } else {
      // Auto-update status based on payment and due date
      updateData.status = getInvoiceStatus(
        updateData.dueDate || currentInvoice.dueDate,
        updateData.totalAmount || currentInvoice.totalAmount,
        currentInvoice.paidAmount,
        currentInvoice.status
      )
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            company: true,
            taxId: true,
          }
        },
        workOrder: {
          select: {
            id: true,
            orderNumber: true,
            issue: true,
            status: true,
          }
        },
        items: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        payments: {
          orderBy: {
            paymentDate: 'desc'
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if invoice has payments
    const payments = await prisma.payment.findMany({
      where: { invoiceId: id }
    })

    if (payments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete invoice with payments' },
        { status: 400 }
      )
    }

    // Delete invoice (items will be deleted automatically due to cascade)
    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
