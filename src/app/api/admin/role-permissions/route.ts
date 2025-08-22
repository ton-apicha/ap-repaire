import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const AssignPermissionSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionId: z.string().min(1, 'Permission ID is required'),
})

const BulkAssignSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionIds: z.array(z.string()).min(1, 'At least one permission is required'),
})

const BulkUpdateRolePermissionsSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  permissionIds: z.array(z.string()),
})

// GET /api/admin/role-permissions - Get all role-permission relationships
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
    const roleId = searchParams.get('roleId')
    const permissionId = searchParams.get('permissionId')
    const format = searchParams.get('format') // 'matrix' for matrix view

    const where: any = {}
    if (roleId) where.roleId = roleId
    if (permissionId) where.permissionId = permissionId

    if (format === 'matrix') {
      // Return matrix format for easy visualization
      const [roles, permissions, rolePermissions] = await Promise.all([
        prisma.role.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' }
        }),
        prisma.permission.findMany({
          where: { isActive: true },
          orderBy: [{ category: 'asc' }, { name: 'asc' }]
        }),
        prisma.rolePermission.findMany({
          include: {
            role: { select: { id: true, name: true } },
            permission: { select: { id: true, name: true, category: true } }
          }
        })
      ])

      // Create matrix structure
      const matrix = roles.map(role => ({
        role: {
          id: role.id,
          name: role.name,
          description: role.description,
          isSystem: role.isSystem
        },
        permissions: permissions.map(permission => {
          const hasPermission = rolePermissions.some(
            rp => rp.roleId === role.id && rp.permissionId === permission.id
          )
          return {
            id: permission.id,
            name: permission.name,
            category: permission.category,
            hasPermission
          }
        })
      }))

      return NextResponse.json({
        matrix,
        categories: [...new Set(permissions.map(p => p.category))],
        totalRoles: roles.length,
        totalPermissions: permissions.length,
        totalAssignments: rolePermissions.length
      })
    }

    // Regular list format
    const rolePermissions = await prisma.rolePermission.findMany({
      where,
      include: {
        role: {
          select: { id: true, name: true, description: true, isSystem: true }
        },
        permission: {
          select: { id: true, name: true, description: true, category: true, isSystem: true }
        }
      },
      orderBy: [
        { role: { name: 'asc' } },
        { permission: { category: 'asc' } },
        { permission: { name: 'asc' } }
      ]
    })

    const transformedData = rolePermissions.map(rp => ({
      id: rp.id,
      roleId: rp.roleId,
      permissionId: rp.permissionId,
      role: rp.role,
      permission: rp.permission,
      createdAt: rp.createdAt.toISOString()
    }))

    return NextResponse.json({
      rolePermissions: transformedData,
      total: rolePermissions.length
    })

  } catch (error) {
    console.error('Error fetching role-permissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/role-permissions - Assign permission to role
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
    const action = body.action || 'assign' // 'assign', 'bulk-assign', 'bulk-update'

    if (action === 'bulk-update') {
      // Replace all permissions for a role
      const validatedData = BulkUpdateRolePermissionsSchema.parse(body)

      // Verify role exists
      const role = await prisma.role.findUnique({
        where: { id: validatedData.roleId }
      })

      if (!role) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      // Check if it's a system role
      if (role.isSystem) {
        return NextResponse.json(
          { error: 'Cannot modify permissions for system roles' },
          { status: 400 }
        )
      }

      // Verify all permissions exist
      const permissions = await prisma.permission.findMany({
        where: { id: { in: validatedData.permissionIds } }
      })

      if (permissions.length !== validatedData.permissionIds.length) {
        return NextResponse.json(
          { error: 'One or more permissions not found' },
          { status: 404 }
        )
      }

      // Remove all existing permissions for this role
      await prisma.rolePermission.deleteMany({
        where: { roleId: validatedData.roleId }
      })

      // Add new permissions
      if (validatedData.permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
          data: validatedData.permissionIds.map(permissionId => ({
            roleId: validatedData.roleId,
            permissionId
          }))
        })
      }

      // Return updated role with permissions
      const updatedRole = await prisma.role.findUnique({
        where: { id: validatedData.roleId },
        include: {
          rolePermissions: {
            include: {
              permission: { select: { id: true, name: true, category: true } }
            }
          }
        }
      })

      return NextResponse.json({
        message: 'Role permissions updated successfully',
        role: {
          id: updatedRole!.id,
          name: updatedRole!.name,
          permissions: updatedRole!.rolePermissions.map(rp => rp.permission)
        }
      })

    } else if (action === 'bulk-assign') {
      // Assign multiple permissions to a role
      const validatedData = BulkAssignSchema.parse(body)

      // Verify role exists
      const role = await prisma.role.findUnique({
        where: { id: validatedData.roleId }
      })

      if (!role) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      // Verify all permissions exist
      const permissions = await prisma.permission.findMany({
        where: { id: { in: validatedData.permissionIds } }
      })

      if (permissions.length !== validatedData.permissionIds.length) {
        return NextResponse.json(
          { error: 'One or more permissions not found' },
          { status: 404 }
        )
      }

      // Check for existing assignments
      const existingAssignments = await prisma.rolePermission.findMany({
        where: {
          roleId: validatedData.roleId,
          permissionId: { in: validatedData.permissionIds }
        }
      })

      const existingPermissionIds = existingAssignments.map(ea => ea.permissionId)
      const newPermissionIds = validatedData.permissionIds.filter(
        id => !existingPermissionIds.includes(id)
      )

      if (newPermissionIds.length === 0) {
        return NextResponse.json(
          { error: 'All permissions are already assigned to this role' },
          { status: 400 }
        )
      }

      // Create new assignments
      await prisma.rolePermission.createMany({
        data: newPermissionIds.map(permissionId => ({
          roleId: validatedData.roleId,
          permissionId
        }))
      })

      return NextResponse.json({
        message: `${newPermissionIds.length} permissions assigned successfully`,
        assignedCount: newPermissionIds.length,
        skippedCount: existingPermissionIds.length
      })

    } else {
      // Single assignment
      const validatedData = AssignPermissionSchema.parse(body)

      // Check if assignment already exists
      const existingAssignment = await prisma.rolePermission.findFirst({
        where: {
          roleId: validatedData.roleId,
          permissionId: validatedData.permissionId
        }
      })

      if (existingAssignment) {
        return NextResponse.json(
          { error: 'Permission already assigned to this role' },
          { status: 400 }
        )
      }

      // Verify role and permission exist
      const [role, permission] = await Promise.all([
        prisma.role.findUnique({ where: { id: validatedData.roleId } }),
        prisma.permission.findUnique({ where: { id: validatedData.permissionId } })
      ])

      if (!role) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      if (!permission) {
        return NextResponse.json(
          { error: 'Permission not found' },
          { status: 404 }
        )
      }

      // Create assignment
      const rolePermission = await prisma.rolePermission.create({
        data: {
          roleId: validatedData.roleId,
          permissionId: validatedData.permissionId
        },
        include: {
          role: { select: { id: true, name: true } },
          permission: { select: { id: true, name: true, category: true } }
        }
      })

      return NextResponse.json({
        id: rolePermission.id,
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
        role: rolePermission.role,
        permission: rolePermission.permission,
        createdAt: rolePermission.createdAt.toISOString()
      }, { status: 201 })
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error assigning permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/role-permissions - Remove permission from role
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')
    const permissionId = searchParams.get('permissionId')
    const id = searchParams.get('id') // Direct rolePermission ID

    if (id) {
      // Delete by rolePermission ID
      const rolePermission = await prisma.rolePermission.findUnique({
        where: { id },
        include: {
          role: { select: { isSystem: true } }
        }
      })

      if (!rolePermission) {
        return NextResponse.json(
          { error: 'Role-permission assignment not found' },
          { status: 404 }
        )
      }

      if (rolePermission.role.isSystem) {
        return NextResponse.json(
          { error: 'Cannot modify permissions for system roles' },
          { status: 400 }
        )
      }

      await prisma.rolePermission.delete({ where: { id } })

    } else if (roleId && permissionId) {
      // Delete by role and permission IDs
      const rolePermission = await prisma.rolePermission.findFirst({
        where: { roleId, permissionId },
        include: {
          role: { select: { isSystem: true } }
        }
      })

      if (!rolePermission) {
        return NextResponse.json(
          { error: 'Role-permission assignment not found' },
          { status: 404 }
        )
      }

      if (rolePermission.role.isSystem) {
        return NextResponse.json(
          { error: 'Cannot modify permissions for system roles' },
          { status: 400 }
        )
      }

      await prisma.rolePermission.delete({
        where: { id: rolePermission.id }
      })

    } else {
      return NextResponse.json(
        { error: 'Either id or both roleId and permissionId are required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Permission removed from role successfully'
    })

  } catch (error) {
    console.error('Error removing permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
