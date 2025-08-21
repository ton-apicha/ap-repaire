import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        workOrders: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: technicians
    })
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technicians' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, speciality, hourlyRate, isActive } = body

    // Get first user as createdBy (temporary solution)
    const firstUser = await prisma.user.findFirst()
    if (!firstUser) {
          return NextResponse.json(
      { success: false, error: 'No users found in database' },
      { status: 400 }
    )
    }

    const technician = await prisma.technician.create({
      data: {
        name,
        email,
        phone,
        speciality,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        isActive: isActive ?? true,
        createdBy: firstUser.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: technician
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating technician:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create technician' },
      { status: 500 }
    )
  }
}
