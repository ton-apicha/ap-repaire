import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// POST /api/invoices/[id]/send - Send invoice
export async function POST(
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

    // Get invoice with customer info
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

    // Check if invoice is in draft status
    if (invoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Invoice is not in draft status' },
        { status: 400 }
      )
    }

    // Update invoice status to SENT
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'SENT',
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

    // TODO: Send email/SMS notification to customer
    // This would integrate with email/SMS service
    console.log(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customer.name}`)

    return NextResponse.json({
      message: 'Invoice sent successfully',
      invoice: updatedInvoice
    })
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    )
  }
}
