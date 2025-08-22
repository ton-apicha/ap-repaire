import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const CreatePermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required').max(100, 'Permission name too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  resource: z.string().optional(),
  action: z.string().optional(),
  isActive: z.boolean().default(true),
})

const UpdatePermissionSchema = CreatePermissionSchema.partial()

// GET /api/admin/permissions - Get all permissions
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for testing
    /*
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        category ? { category } : {},
        isActive !== null ? { isActive: isActive === 'true' } : {},
      ]
    }

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        include: {
          rolePermissions: {
            include: {
              role: {
                select: { id: true, name: true }
              }
            }
          },
          createdByUser: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.permission.count({ where })
    ])

    // Transform data to match frontend interface
    const transformedPermissions = permissions.map(permission => ({
      id: permission.id,
      name: permission.name,
      description: permission.description || '',
      category: permission.category,
      resource: permission.resource,
      action: permission.action,
      isActive: permission.isActive,
      isSystem: permission.isSystem,
      roleCount: permission.rolePermissions.length,
      roles: permission.rolePermissions.map(rp => rp.role),
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
      createdBy: permission.createdByUser
    }))

    return NextResponse.json({
      permissions: transformedPermissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/permissions - Create new permission
export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication for testing
    /*
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    const body = await request.json()
    const validatedData = CreatePermissionSchema.parse(body)

    // Check if permission name already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name: validatedData.name }
    })

    if (existingPermission) {
      return NextResponse.json(
        { error: 'Permission name already exists' },
        { status: 400 }
      )
    }

    // Get user ID from session
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email! }
    // })
    const user = null // Commented out for now

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create permission
    const permission = await prisma.permission.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        resource: validatedData.resource,
        action: validatedData.action,
        isActive: validatedData.isActive,
        createdBy: user.id,
      },
      include: {
        rolePermissions: {
          include: {
            role: { select: { id: true, name: true } }
          }
        },
        createdByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Transform response
    const transformedPermission = {
      id: permission.id,
      name: permission.name,
      description: permission.description || '',
      category: permission.category,
      resource: permission.resource,
      action: permission.action,
      isActive: permission.isActive,
      isSystem: permission.isSystem,
      roleCount: permission.rolePermissions.length,
      roles: permission.rolePermissions.map(rp => rp.role),
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
      createdBy: permission.createdByUser
    }

    return NextResponse.json(transformedPermission, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
