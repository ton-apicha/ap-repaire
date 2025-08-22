import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const UpdateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
})

// GET /api/admin/roles/[id] - Get role by ID
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

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        users: {
          select: { id: true, name: true, email: true }
        },
        createdByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Transform data
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description || '',
      isActive: role.isActive,
      isSystem: role.isSystem,
      permissions: role.rolePermissions.map(rp => rp.permission.name),
      userCount: role.users.length,
      users: role.users,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      createdBy: role.createdByUser
    }

    return NextResponse.json(transformedRole)

  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/roles/[id] - Update role
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
    const validatedData = UpdateRoleSchema.parse(body)

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
      include: { rolePermissions: true }
    })

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if system role (protect from editing critical fields)
    if (existingRole.isSystem && (validatedData.name || validatedData.isActive === false)) {
      return NextResponse.json(
        { error: 'System roles cannot be renamed or deactivated' },
        { status: 400 }
      )
    }

    // Check if new name already exists (if name is being changed)
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name: validatedData.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 400 }
        )
      }
    }

    // Update role
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive

    const updatedRole = await prisma.role.update({
      where: { id },
      data: updateData,
      include: {
        rolePermissions: {
          include: { permission: true }
        },
        users: { select: { id: true } },
        createdByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Update permissions if provided
    if (validatedData.permissions !== undefined) {
      // Remove existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: id }
      })

      // Add new permissions
      if (validatedData.permissions.length > 0) {
        const permissions = await prisma.permission.findMany({
          where: { name: { in: validatedData.permissions } }
        })

        await prisma.rolePermission.createMany({
          data: permissions.map(permission => ({
            roleId: id,
            permissionId: permission.id
          }))
        })
      }

      // Fetch updated role with new permissions
      const roleWithPermissions = await prisma.role.findUnique({
        where: { id },
        include: {
          rolePermissions: {
            include: { permission: true }
          },
          users: { select: { id: true } },
          createdByUser: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      if (roleWithPermissions) {
        const transformedRole = {
          id: roleWithPermissions.id,
          name: roleWithPermissions.name,
          description: roleWithPermissions.description || '',
          isActive: roleWithPermissions.isActive,
          isSystem: roleWithPermissions.isSystem,
          permissions: roleWithPermissions.rolePermissions.map(rp => rp.permission.name),
          userCount: roleWithPermissions.users.length,
          createdAt: roleWithPermissions.createdAt.toISOString(),
          updatedAt: roleWithPermissions.updatedAt.toISOString(),
          createdBy: roleWithPermissions.createdByUser
        }

        return NextResponse.json(transformedRole)
      }
    }

    // Transform response
    const transformedRole = {
      id: updatedRole.id,
      name: updatedRole.name,
      description: updatedRole.description || '',
      isActive: updatedRole.isActive,
      isSystem: updatedRole.isSystem,
      permissions: updatedRole.rolePermissions.map(rp => rp.permission.name),
      userCount: updatedRole.users.length,
      createdAt: updatedRole.createdAt.toISOString(),
      updatedAt: updatedRole.updatedAt.toISOString(),
      createdBy: updatedRole.createdByUser
    }

    return NextResponse.json(transformedRole)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/roles/[id] - Delete role
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

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        users: { select: { id: true } }
      }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if system role
    if (role.isSystem) {
      return NextResponse.json(
        { error: 'System roles cannot be deleted' },
        { status: 400 }
      )
    }

    // Check if role has users
    if (role.users.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role with assigned users' },
        { status: 400 }
      )
    }

    // Delete role (cascade will handle role_permissions)
    await prisma.role.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Role deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
