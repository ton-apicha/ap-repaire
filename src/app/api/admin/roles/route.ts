import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schemas
const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional().default([]),
})

const UpdateRoleSchema = CreateRoleSchema.partial()

// GET /api/admin/roles - Get all roles
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
        isActive !== null ? { isActive: isActive === 'true' } : {},
      ]
    }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          },
          users: {
            select: { id: true }
          },
          createdByUser: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.role.count({ where })
    ])

    // Transform data to match frontend interface
    const transformedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      isActive: role.isActive,
      isSystem: role.isSystem,
      permissions: role.rolePermissions.map(rp => rp.permission.name),
      userCount: role.users.length,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      createdBy: role.createdByUser
    }))

    return NextResponse.json({
      roles: transformedRoles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/roles - Create new role
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
    const validatedData = CreateRoleSchema.parse(body)

    // Check if role name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: validatedData.name }
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
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

    // Create role
    const role = await prisma.role.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        isActive: validatedData.isActive,
        createdBy: user.id,
      },
      include: {
        users: { select: { id: true } },
        rolePermissions: {
          include: { permission: true }
        },
        createdByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Add permissions if provided
    if (validatedData.permissions && validatedData.permissions.length > 0) {
      const permissions = await prisma.permission.findMany({
        where: { name: { in: validatedData.permissions } }
      })

      await prisma.rolePermission.createMany({
        data: permissions.map(permission => ({
          roleId: role.id,
          permissionId: permission.id
        }))
      })
    }

    // Transform response
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description || '',
      isActive: role.isActive,
      isSystem: role.isSystem,
      permissions: role.rolePermissions.map(rp => rp.permission.name),
      userCount: role.users.length,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      createdBy: role.createdByUser
    }

    return NextResponse.json(transformedRole, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
