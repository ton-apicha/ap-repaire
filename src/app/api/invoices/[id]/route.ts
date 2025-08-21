import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateInvoiceSchema } from '@/lib/validations'
import { calculateInvoiceTotals } from '@/lib/utils'

// GET /api/invoices/[id] - Get specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
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

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    const validatedData = updateInvoiceSchema.parse(body)
    
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Calculate totals if items are provided
    let totals = null
    if (validatedData.items) {
      totals = calculateInvoiceTotals(
        validatedData.items,
        validatedData.taxRate || existingInvoice.taxAmount || 0,
        validatedData.discountAmount || existingInvoice.discountAmount || 0
      )
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(validatedData.issueDate && { issueDate: validatedData.issueDate }),
        ...(validatedData.dueDate && { dueDate: validatedData.dueDate }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.terms !== undefined && { terms: validatedData.terms }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(totals && {
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
          balanceAmount: totals.totalAmount - existingInvoice.paidAmount,
        }),
        ...(validatedData.items && {
          items: {
            deleteMany: {},
            create: validatedData.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              type: item.type,
            }))
          }
        })
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
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Check if invoice has payments (prevent deletion if it has payments)
    if (existingInvoice.payments && existingInvoice.payments.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete invoice with existing payments' },
        { status: 400 }
      )
    }

    // Delete invoice (this will cascade delete items due to foreign key constraints)
    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}