import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET work order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        technician: true,
        minerModel: true,
      },
    })

    if (!workOrder) {
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error('Error fetching work order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work order' },
      { status: 500 }
    )
  }
}

// PUT update work order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { status, actualCost, notes } = body

    const { id } = await params
    
    // Prepare update data
    const updateData: any = {
      status,
      notes: notes || undefined
    }
    
    // Handle actualCost
    if (actualCost !== undefined) {
      updateData.actualCost = actualCost ? parseFloat(actualCost) : null
    }
    
    // Handle completedDate
    if (status === 'COMPLETED') {
      updateData.completedDate = new Date()
    }

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        technician: true,
        minerModel: true,
      },
    })

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error('Error updating work order:', error)
    return NextResponse.json(
      { error: 'Failed to update work order' },
      { status: 500 }
    )
  }
}
