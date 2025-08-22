import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const UpdatePermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required').max(100, 'Permission name too long').optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  resource: z.string().optional(),
  action: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/permissions/[id] - Get permission by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const permission = await prisma.permission.findUnique({
      where: { id },
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
      }
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Transform data
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

    return NextResponse.json(transformedPermission)

  } catch (error) {
    console.error('Error fetching permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/permissions/[id] - Update permission
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = UpdatePermissionSchema.parse(body)

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id }
    })

    if (!existingPermission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Check if system permission (protect from editing critical fields)
    if (existingPermission.isSystem && (validatedData.name || validatedData.isActive === false)) {
      return NextResponse.json(
        { error: 'System permissions cannot be renamed or deactivated' },
        { status: 400 }
      )
    }

    // Check if new name already exists (if name is being changed)
    if (validatedData.name && validatedData.name !== existingPermission.name) {
      const nameExists = await prisma.permission.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Permission name already exists' },
          { status: 400 }
        )
      }
    }

    // Update permission
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.resource !== undefined) updateData.resource = validatedData.resource
    if (validatedData.action !== undefined) updateData.action = validatedData.action
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: updateData,
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
      id: updatedPermission.id,
      name: updatedPermission.name,
      description: updatedPermission.description || '',
      category: updatedPermission.category,
      resource: updatedPermission.resource,
      action: updatedPermission.action,
      isActive: updatedPermission.isActive,
      isSystem: updatedPermission.isSystem,
      roleCount: updatedPermission.rolePermissions.length,
      roles: updatedPermission.rolePermissions.map(rp => rp.role),
      createdAt: updatedPermission.createdAt.toISOString(),
      updatedAt: updatedPermission.updatedAt.toISOString(),
      createdBy: updatedPermission.createdByUser
    }

    return NextResponse.json(transformedPermission)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/permissions/[id] - Delete permission
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if permission exists
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: { select: { id: true } }
      }
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Check if system permission
    if (permission.isSystem) {
      return NextResponse.json(
        { error: 'System permissions cannot be deleted' },
        { status: 400 }
      )
    }

    // Check if permission is assigned to roles
    if (permission.rolePermissions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete permission assigned to roles' },
        { status: 400 }
      )
    }

    // Delete permission
    await prisma.permission.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Permission deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
