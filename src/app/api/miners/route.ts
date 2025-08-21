import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const minerModels = await prisma.minerModel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: minerModels
    })
  } catch (error) {
    console.error('Error fetching miner models:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch miner models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand, model, series, hashRate, power, description, isActive } = body

    const minerModel = await prisma.minerModel.create({
      data: {
        brand,
        model,
        series,
        hashRate,
        power,
        description,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({
      success: true,
      data: minerModel
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating miner model:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create miner model' },
      { status: 500 }
    )
  }
}
