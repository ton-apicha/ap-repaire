'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import AuthGuard from '@/components/auth/AuthGuard'
import toast from 'react-hot-toast'
import {
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  isSystem: boolean
  createdBy?: {
    id: string
    name: string
    email: string
  }
}

// Available permissions based on actual API
const availablePermissions = [
  { id: 'user_management', name: 'User Management', description: 'Manage users and their accounts' },
  { id: 'role_management', name: 'Role Management', description: 'Manage roles and permissions' },
  { id: 'permission_management', name: 'Permission Management', description: 'Manage system permissions' },
  { id: 'system_settings', name: 'System Settings', description: 'Configure system settings' },
  { id: 'backup_management', name: 'Backup Management', description: 'Manage system backups' },
  { id: 'audit_logs', name: 'Audit Logs', description: 'View system audit logs' },
  { id: 'work_orders_manage', name: 'Work Orders (Manage)', description: 'Create and manage work orders' },
  { id: 'work_orders_view', name: 'Work Orders (View)', description: 'View work orders only' },
  { id: 'customers_manage', name: 'Customers (Manage)', description: 'Manage customer information' },
  { id: 'customers_view', name: 'Customers (View)', description: 'View customer information only' },
  { id: 'technicians_manage', name: 'Technicians (Manage)', description: 'Manage technician information' },
  { id: 'technicians_view', name: 'Technicians (View)', description: 'View technician information only' },
  { id: 'miners_manage', name: 'Miners (Manage)', description: 'Manage miner models and inventory' },
  { id: 'miners_view', name: 'Miners (View)', description: 'View miner information only' },
  { id: 'invoices_manage', name: 'Invoices (Manage)', description: 'Create and manage invoices' },
  { id: 'invoices_view', name: 'Invoices (View)', description: 'View invoices only' },
  { id: 'payments_manage', name: 'Payments (Manage)', description: 'Manage payment processing' },
  { id: 'payments_view', name: 'Payments (View)', description: 'View payment information only' },
  { id: 'reports_view', name: 'Reports (View)', description: 'View system reports' },
  { id: 'analytics_view', name: 'Analytics (View)', description: 'View analytics and insights' },
]

export default function AdminRoles() {
  const { t } = useLanguage()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  })
  const [expandedPermissions, setExpandedPermissions] = useState(false)

  // Mock data for roles
  const mockRoles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      isSystem: true,
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with most permissions',
      permissions: ['user_management', 'system_settings', 'reports'],
      userCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      isSystem: false,
    },
    {
      id: '3',
      name: 'Manager',
      description: 'Management access with team oversight',
      permissions: ['work_orders', 'customers', 'reports'],
      userCount: 8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      isSystem: false,
    },
    {
      id: '4',
      name: 'Technician',
      description: 'Technical work order management',
      permissions: ['work_orders', 'miners'],
      userCount: 15,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      isSystem: false,
    },
    {
      id: '5',
      name: 'User',
      description: 'Basic user access',
      permissions: ['view_work_orders', 'view_invoices'],
      userCount: 25,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      isSystem: false,
    },
  ]

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching roles from API...')
      const response = await fetch('/api/admin/roles')
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 API Response data:', data)
      console.log('📋 Roles count:', data.roles?.length || 0)
      
      setRoles(data.roles || [])
    } catch (error) {
      console.error('❌ Error fetching roles:', error)
      toast.error('Failed to load roles')
      // Fallback to mock data if API fails
      setRoles(mockRoles)
    } finally {
      setLoading(false)
      console.log('✅ Fetch roles completed')
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const filteredRoles = roles.filter((role) => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.description.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super admin':
        return 'bg-red-100 text-red-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'technician':
        return 'bg-green-100 text-green-800'
      case 'user':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleSelectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: availablePermissions.map(p => p.id)
    }))
  }

  const handleClearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }))
  }

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        userCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isSystem: false,
      }

      setRoles([newRole, ...roles])
      setShowAddModal(false)
      setFormData({
        name: '',
        description: '',
        permissions: [],
      })
      toast.success('Role created successfully')
    } catch (error: any) {
      console.error('Error creating role:', error)
      toast.error(error.message || 'Failed to create role')
    }
  }

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    try {
      const updatedRole: Role = {
        ...selectedRole,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        updatedAt: new Date().toISOString(),
      }

      setRoles(roles.map(role => 
        role.id === selectedRole.id ? updatedRole : role
      ))
      setShowEditModal(false)
      setSelectedRole(null)
      setFormData({
        name: '',
        description: '',
        permissions: [],
      })
      toast.success('Role updated successfully')
    } catch (error: any) {
      console.error('Error updating role:', error)
      toast.error(error.message || 'Failed to update role')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    if (role.isSystem) {
      toast.error('Cannot delete system roles')
      return
    }

    if (!confirm('Are you sure you want to delete this role?')) {
      return
    }

    try {
      setRoles(roles.filter(role => role.id !== roleId))
      toast.success('Role deleted successfully')
    } catch (error: any) {
      console.error('Error deleting role:', error)
      toast.error(error.message || 'Failed to delete role')
    }
  }

  const openEditModal = (role: Role) => {
    if (role.isSystem) {
      toast.error('System roles cannot be edited')
      return
    }
    
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setShowEditModal(true)
  }

  const PermissionSelector = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Permissions
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleSelectAllPermissions}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleClearAllPermissions}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
        <div className="space-y-2">
          {availablePermissions.map((permission) => (
            <label key={permission.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission.id)}
                onChange={() => handlePermissionToggle(permission.id)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                <div className="text-xs text-gray-500">{permission.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Selected: {formData.permissions.length} of {availablePermissions.length} permissions
      </div>
    </div>
  )

  return (
    <AuthGuard requiredRole="ADMIN">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('admin.roleManagement')}</h1>
              <p className="mt-2 text-gray-600">{t('admin.roleManagementDescription')}</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {t('admin.addRole')}
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('admin.searchRoles')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                {t('admin.totalRoles')}: {roles.length}
              </div>
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{t('admin.loadingRoles')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.role')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.description')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.permissions')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.users')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.lastUpdated')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(role)}
                              className={`${role.isSystem ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'}`}
                              disabled={role.isSystem}
                              title={role.isSystem ? 'System roles cannot be edited' : 'Edit role'}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className={`${role.isSystem ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                              disabled={role.isSystem}
                              title={role.isSystem ? 'System roles cannot be deleted' : 'Delete role'}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {role.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {role.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {role.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {permission}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                              <UserGroupIcon className="h-4 w-4 mr-1" />
                              {role.userCount}
                            </span>
                            {role.isSystem && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                System
                              </span>
                            )}
                            {!role.isActive && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(role.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.createdBy ? (
                            <div>
                              <div className="font-medium text-gray-900">{role.createdBy.name}</div>
                              <div className="text-xs text-gray-500">{role.createdBy.email}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">System</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRoles.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500">
                    No roles found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Role Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
              
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Add New Role
                      </h3>
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAddRole} className="px-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <PermissionSelector />

                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Add Role
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Role Modal */}
          {showEditModal && selectedRole && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
              
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Edit Role: {selectedRole.name}
                      </h3>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleEditRole} className="px-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <PermissionSelector />

                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        Update Role
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}
