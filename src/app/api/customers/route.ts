import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        workOrders: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, company, taxId } = body

    // Get first user as createdBy (temporary solution)
    const firstUser = await prisma.user.findFirst()
    if (!firstUser) {
          return NextResponse.json(
      { success: false, error: 'No users found in database' },
      { status: 400 }
    )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
        taxId,
        createdBy: firstUser.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: customer
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
