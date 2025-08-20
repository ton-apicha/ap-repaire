'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
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
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Technician | 'workOrders' | 'hourlyRate'
    direction: 'asc' | 'desc'
  } | null>(null)
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
      const response = await fetch('/api/technicians')
      if (response.ok) {
        const data = await response.json()
        setTechnicians(data)
      } else {
        toast.error('Failed to fetch technicians')
      }
    } catch (error) {
      console.error('Error fetching technicians:', error)
      toast.error('Error fetching technicians')
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
        setTechnicians(prev => [newTechnician, ...prev])
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

  // Handle edit technician
  const handleEdit = (technician: Technician) => {
    setEditingTechnician(technician)
    setFormData({
      name: technician.name,
      email: technician.email || '',
      phone: technician.phone,
      speciality: technician.speciality || '',
      hourlyRate: technician.hourlyRate ? technician.hourlyRate.toString() : '',
      isActive: technician.isActive
    })
    setShowEditModal(true)
  }

  // Handle update technician
  const handleUpdate = async (e: React.FormEvent) => {
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
        setTechnicians(prev => prev.map(technician => 
          technician.id === editingTechnician.id ? updatedTechnician : technician
        ))
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

  // Handle delete technician
  const handleDelete = (technician: Technician) => {
    setTechnicianToDelete(technician)
    setShowDeleteModal(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!technicianToDelete) return

    try {
      const response = await fetch(`/api/technicians/${technicianToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTechnicians(prev => prev.filter(technician => technician.id !== technicianToDelete.id))
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

  // Sorting function
  const sortData = (data: Technician[]) => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'email':
          aValue = (a.email || '').toLowerCase()
          bValue = (b.email || '').toLowerCase()
          break
        case 'phone':
          aValue = a.phone
          bValue = b.phone
          break
        case 'speciality':
          aValue = (a.speciality || '').toLowerCase()
          bValue = (b.speciality || '').toLowerCase()
          break
        case 'hourlyRate':
          aValue = parseFloat(String(a.hourlyRate || '0')) || 0
          bValue = parseFloat(String(b.hourlyRate || '0')) || 0
          break
        case 'isActive':
          aValue = a.isActive ? 1 : 0
          bValue = b.isActive ? 1 : 0
          break
        case 'workOrders':
          aValue = a._count?.workOrders || 0
          bValue = b._count?.workOrders || 0
          break
        default:
          aValue = a[sortConfig.key]
          bValue = b[sortConfig.key]
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  // Handle sort
  const handleSort = (key: keyof Technician | 'workOrders' | 'hourlyRate') => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
  }

  // Get sort icon
  const getSortIcon = (key: keyof Technician | 'workOrders' | 'hourlyRate') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-blue-600" />
      : <ChevronDownIcon className="h-4 w-4 text-blue-600" />
  }

  const filteredTechnicians = technicians.filter(technician =>
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (technician.email && technician.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (technician.speciality && technician.speciality.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedTechnicians = sortData(filteredTechnicians)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('technicians.title')}</h1>
            <p className="mt-2 text-gray-600">{t('technicians.technicianList')}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('technicians.addTechnician')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Technicians Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('common.name')}</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('common.email')}</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('common.phone')}</span>
                      {getSortIcon('phone')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('speciality')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('technicians.speciality')}</span>
                      {getSortIcon('speciality')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('hourlyRate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('technicians.hourlyRate')}</span>
                      {getSortIcon('hourlyRate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('technicians.isActive')}</span>
                      {getSortIcon('isActive')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('workOrders')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('technicians.currentWorkOrders')}</span>
                      {getSortIcon('workOrders')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTechnicians.map((technician) => (
                  <tr key={technician.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(technician)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit technician"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(technician)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete technician"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {technician.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {technician.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {technician.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {technician.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {technician.speciality || 'No speciality'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {technician.hourlyRate ? `฿${technician.hourlyRate}/hr` : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        technician.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {technician.isActive ? t('common.yes') : t('common.no')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {technician._count?.workOrders || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTechnicians.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No technicians found</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Technician Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {t('technicians.addTechnician')}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('technicians.speciality')}
                    </label>
                    <select 
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="Bitmain Repair">{t('miners.bitmain')} Repair</option>
                      <option value="Whatsminer Repair">{t('miners.whatsminer')} Repair</option>
                      <option value="Avalon Repair">{t('miners.avalon')} Repair</option>
                      <option value="General Repair">General Repair</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('technicians.hourlyRate')} (฿)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      min="0"
                      step="10"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      {t('technicians.isActive')}
                    </label>
                  </div>
                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Technician Modal */}
        {showEditModal && editingTechnician && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Edit Technician
                    </h3>
                    <button
                      onClick={() => {
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
                      }}
                      className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('common.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('technicians.speciality')}
                    </label>
                    <select 
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="Bitmain Repair">{t('miners.bitmain')} Repair</option>
                      <option value="Whatsminer Repair">{t('miners.whatsminer')} Repair</option>
                      <option value="Avalon Repair">{t('miners.avalon')} Repair</option>
                      <option value="General Repair">General Repair</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('technicians.hourlyRate')} (฿)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      min="0"
                      step="10"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      {t('technicians.isActive')}
                    </label>
                  </div>
                  {/* Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
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
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      {t('common.update')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && technicianToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Delete Technician
                    </h3>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false)
                        setTechnicianToDelete(null)
                      }}
                      className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Confirm Deletion</h4>
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong className="text-gray-900">{technicianToDelete.name}</strong>?
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    This action cannot be undone. All associated data will be permanently removed.
                  </p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setTechnicianToDelete(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
