import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all data in parallel - simplified without isActive filters
    const [customers, technicians, workOrders, miners, invoices, payments] = await Promise.all([
      prisma.customer.findMany(),
      prisma.technician.findMany(),
      prisma.workOrder.findMany({
        include: {
          customer: true,
          technician: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.minerModel.findMany(),
      prisma.invoice.findMany(),
      prisma.payment.findMany()
    ])

    // Calculate stats
    const pendingWorkOrders = workOrders.filter(wo => wo.status === 'PENDING').length
    const completedWorkOrders = workOrders.filter(wo => wo.status === 'COMPLETED').length
    const totalRevenue = workOrders
      .filter(wo => wo.actualCost)
      .reduce((sum, wo) => sum + (wo.actualCost || 0), 0)

    const dashboardData = {
      stats: {
        totalCustomers: customers.length,
        totalTechnicians: technicians.length,
        totalWorkOrders: workOrders.length,
        totalMiners: miners.length,
        totalInvoices: invoices.length,
        totalPayments: payments.length,
        pendingWorkOrders,
        completedWorkOrders,
        totalRevenue
      },
      recentWorkOrders: workOrders.slice(0, 5),
      recentInvoices: invoices.slice(0, 5),
      recentPayments: payments.slice(0, 5)
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data'
      },
      { status: 500 }
    )
  }
}
