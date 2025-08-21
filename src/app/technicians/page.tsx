'use client'

import React, { useState, useEffect } from 'react'
import PageTemplate, { 
  FilterSection, 
  DataTable, 
  ActionButton, 
  ActionButtons, 
  SortableHeader, 
  SearchInput, 
  FilterSelect, 
  EmptyState, 
  LoadingSpinner, 
  ErrorState 
} from '@/components/ui/PageTemplate'
import { useLanguage } from '@/contexts/LanguageContext'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Technician {
  id: string
  name: string
  email: string | null
  phone: string
  speciality: string | null
  hourlyRate: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    workOrders: number
  }
}

export default function Technicians() {
  const { t } = useLanguage()
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'name' | 'email' | 'phone' | 'speciality' | 'hourlyRate' | 'isActive' | 'workOrders'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    hourlyRate: '',
    isActive: true
  })
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [technicianToDelete, setTechnicianToDelete] = useState<Technician | null>(null)

  // Fetch technicians from API
  const fetchTechnicians = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/technicians')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTechnicians(data.data || [])
        } else {
          setError('Failed to fetch technicians')
        }
      } else {
        setError('Failed to fetch technicians')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/technicians', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
        }),
      })

      if (response.ok) {
        const newTechnician = await response.json()
        setTechnicians(prev => [newTechnician.data, ...prev])
        setShowAddModal(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          speciality: '',
          hourlyRate: '',
          isActive: true
        })
        toast.success('Technician created successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create technician')
      }
    } catch (error) {
      console.error('Error creating technician:', error)
      toast.error('Error creating technician')
    }
  }

  // Handle edit
  const handleEdit = (technician: Technician) => {
    setEditingTechnician(technician)
    setFormData({
      name: technician.name,
      email: technician.email || '',
      phone: technician.phone,
      speciality: technician.speciality || '',
      hourlyRate: technician.hourlyRate?.toString() || '',
      isActive: technician.isActive
    })
    setShowEditModal(true)
  }

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingTechnician) return
    
    try {
      const response = await fetch(`/api/technicians/${editingTechnician.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
        }),
      })

      if (response.ok) {
        const updatedTechnician = await response.json()
        setTechnicians(prev => prev.map(t => t.id === editingTechnician.id ? updatedTechnician.data : t))
        setShowEditModal(false)
        setEditingTechnician(null)
        setFormData({
          name: '',
          email: '',
          phone: '',
          speciality: '',
          hourlyRate: '',
          isActive: true
        })
        toast.success('Technician updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update technician')
      }
    } catch (error) {
      console.error('Error updating technician:', error)
      toast.error('Error updating technician')
    }
  }

  // Handle delete
  const handleDelete = (technician: Technician) => {
    setTechnicianToDelete(technician)
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!technicianToDelete) return
    
    try {
      const response = await fetch(`/api/technicians/${technicianToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTechnicians(prev => prev.filter(t => t.id !== technicianToDelete.id))
        setShowDeleteModal(false)
        setTechnicianToDelete(null)
        toast.success('Technician deleted successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete technician')
      }
    } catch (error) {
      console.error('Error deleting technician:', error)
      toast.error('Error deleting technician')
    }
  }

  const handleSort = (field: 'name' | 'email' | 'phone' | 'speciality' | 'hourlyRate' | 'isActive' | 'workOrders') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter and sort technicians
  const filteredAndSortedTechnicians = technicians
    .filter(technician => {
      const matchesSearch = 
        technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technician.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technician.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technician.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && technician.isActive) ||
        (statusFilter === 'inactive' && !technician.isActive)
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      if (sortField === 'name') {
        aValue = a.name
        bValue = b.name
      } else if (sortField === 'email') {
        aValue = a.email || ''
        bValue = b.email || ''
      } else if (sortField === 'phone') {
        aValue = a.phone
        bValue = b.phone
      } else if (sortField === 'speciality') {
        aValue = a.speciality || ''
        bValue = b.speciality || ''
      } else if (sortField === 'hourlyRate') {
        aValue = a.hourlyRate || 0
        bValue = b.hourlyRate || 0
      } else if (sortField === 'isActive') {
        aValue = a.isActive
        bValue = b.isActive
      } else if (sortField === 'workOrders') {
        aValue = a._count?.workOrders || 0
        bValue = b._count?.workOrders || 0
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchTechnicians} />
  }

  return (
    <PageTemplate
      title={t('technicians.title')}
      description={t('technicians.description')}
      showCreateButton={true}
      createButtonText={t('technicians.addTechnician')}
      onCreateClick={() => setShowAddModal(true)}
      itemCount={filteredAndSortedTechnicians.length}
      itemName={t('technicians.itemName')}
    >
      {/* Filters */}
      <FilterSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('technicians.searchPlaceholder')}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: t('technicians.allStatus') },
              { value: 'active', label: t('technicians.active') },
              { value: 'inactive', label: t('technicians.inactive') }
            ]}
            placeholder={t('technicians.filterByStatus')}
          />
        </div>
      </FilterSection>

      {/* Technicians Table */}
      <DataTable>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader
                field="name"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('common.name')}
              </SortableHeader>
              <SortableHeader
                field="email"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('common.email')}
              </SortableHeader>
              <SortableHeader
                field="phone"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('common.phone')}
              </SortableHeader>
              <SortableHeader
                field="speciality"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('technicians.speciality')}
              </SortableHeader>
              <SortableHeader
                field="hourlyRate"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('technicians.hourlyRate')}
              </SortableHeader>
              <SortableHeader
                field="isActive"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('common.status')}
              </SortableHeader>
              <SortableHeader
                field="workOrders"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('technicians.currentWorkOrders')}
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTechnicians.length === 0 ? (
              <EmptyState
                message="No technicians found"
                actionText="Add Technician"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              filteredAndSortedTechnicians.map((technician) => (
                <tr key={technician.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {technician.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {technician.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {technician.speciality || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(technician.hourlyRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      technician.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {technician.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {technician._count?.workOrders || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons>
                      <ActionButton onClick={() => handleEdit(technician)}>
                        Edit
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(technician)} variant="danger">
                        Delete
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Technician</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Power Supply, Fan Repair"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Technician
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Technician Modal */}
      {showEditModal && editingTechnician && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Technician</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Power Supply, Fan Repair"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Technician
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && technicianToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Technician</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{technicianToDelete.name}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  )
}
