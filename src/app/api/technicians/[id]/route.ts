import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET technician by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const technician = await prisma.technician.findUnique({
      where: { id },
      include: {
        workOrders: true,
      },
    })

    if (!technician) {
      return NextResponse.json(
        { error: 'Technician not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error fetching technician:', error)
    return NextResponse.json(
      { error: 'Failed to fetch technician' },
      { status: 500 }
    )
  }
}

// PUT update technician
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, email, phone, speciality, hourlyRate, isActive } = body

    const { id } = await params
    const technician = await prisma.technician.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        speciality,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        isActive,
      },
    })

    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error updating technician:', error)
    return NextResponse.json(
      { error: 'Failed to update technician' },
      { status: 500 }
    )
  }
}

// DELETE technician
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if technician has work orders
    const workOrders = await prisma.workOrder.findMany({
      where: { technicianId: id },
    })

    if (workOrders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete technician with existing work orders' },
        { status: 400 }
      )
    }

    await prisma.technician.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Technician deleted successfully' })
  } catch (error) {
    console.error('Error deleting technician:', error)
    return NextResponse.json(
      { error: 'Failed to delete technician' },
      { status: 500 }
    )
  }
}
