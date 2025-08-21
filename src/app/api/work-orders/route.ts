import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        customer: true,
        technician: true,
        minerModel: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: workOrders
    })
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      technicianId,
      minerModelId,
      serialNumber,
      issue,
      priority,
      estimatedCost,
    } = body

    // Generate order number
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    const todayOrders = await prisma.workOrder.count({
      where: {
        createdAt: {
          gte: new Date(year, date.getMonth(), date.getDate()),
          lt: new Date(year, date.getMonth(), date.getDate() + 1),
        },
      },
    })
    
    const orderNumber = `WO-${year}-${month}${day}-${String(todayOrders + 1).padStart(3, '0')}`

    // Get first user as createdBy (temporary solution)
    const firstUser = await prisma.user.findFirst()
    if (!firstUser) {
          return NextResponse.json(
      { success: false, error: 'No users found in database' },
      { status: 400 }
    )
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        orderNumber,
        customerId,
        technicianId,
        minerModelId,
        serialNumber,
        issue,
        priority: priority || 'MEDIUM',
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        status: 'PENDING',
        createdBy: firstUser.id,
      },
      include: {
        customer: true,
        technician: true,
        minerModel: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: workOrder
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}
