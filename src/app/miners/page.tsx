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

interface MinerModel {
  id: string
  brand: string
  model: string
  series: string
  hashRate: string
  power: string
  description: string
  isActive: boolean
}

export default function Miners() {
  const { t } = useLanguage()
  const [minerModels, setMinerModels] = useState<MinerModel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'brand' | 'model' | 'series' | 'hashRate' | 'power' | 'isActive'>('brand')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    series: '',
    hashRate: '',
    power: '',
    description: '',
    isActive: true
  })
  const [editingMiner, setEditingMiner] = useState<MinerModel | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [minerToDelete, setMinerToDelete] = useState<MinerModel | null>(null)

  useEffect(() => {
    fetchMinerModels()
  }, [])

  const fetchMinerModels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/miners')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMinerModels(data.data || [])
        } else {
          setError('Failed to fetch miner models')
        }
      } else {
        setError('Failed to fetch miner models')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/miners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newMinerModel = await response.json()
        setMinerModels(prev => [newMinerModel.data, ...prev])
        setShowAddModal(false)
        setFormData({
          brand: '',
          model: '',
          series: '',
          hashRate: '',
          power: '',
          description: '',
          isActive: true
        })
        toast.success('Miner model created successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create miner model')
      }
    } catch (error) {
      console.error('Error creating miner model:', error)
      toast.error('Error creating miner model')
    }
  }

  // Handle edit
  const handleEdit = (miner: MinerModel) => {
    setEditingMiner(miner)
    setFormData({
      brand: miner.brand,
      model: miner.model,
      series: miner.series,
      hashRate: miner.hashRate,
      power: miner.power,
      description: miner.description,
      isActive: miner.isActive
    })
    setShowEditModal(true)
  }

  // Handle edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingMiner) return
    
    try {
      const response = await fetch(`/api/miners/${editingMiner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedMiner = await response.json()
        setMinerModels(prev => prev.map(m => m.id === editingMiner.id ? updatedMiner.data : m))
        setShowEditModal(false)
        setEditingMiner(null)
        setFormData({
          brand: '',
          model: '',
          series: '',
          hashRate: '',
          power: '',
          description: '',
          isActive: true
        })
        toast.success('Miner model updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update miner model')
      }
    } catch (error) {
      console.error('Error updating miner model:', error)
      toast.error('Error updating miner model')
    }
  }

  // Handle delete
  const handleDelete = (miner: MinerModel) => {
    setMinerToDelete(miner)
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!minerToDelete) return
    
    try {
      const response = await fetch(`/api/miners/${minerToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMinerModels(prev => prev.filter(m => m.id !== minerToDelete.id))
        setShowDeleteModal(false)
        setMinerToDelete(null)
        toast.success('Miner model deleted successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete miner model')
      }
    } catch (error) {
      console.error('Error deleting miner model:', error)
      toast.error('Error deleting miner model')
    }
  }

  const handleSort = (field: 'brand' | 'model' | 'series' | 'hashRate' | 'power' | 'isActive') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filter and sort miner models
  const filteredAndSortedMinerModels = minerModels
    .filter(miner => {
      const matchesSearch = 
        miner.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        miner.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        miner.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
        miner.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = brandFilter === 'all' || miner.brand.toLowerCase() === brandFilter.toLowerCase()
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && miner.isActive) ||
        (statusFilter === 'inactive' && !miner.isActive)
      
      return matchesSearch && matchesBrand && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      if (sortField === 'brand') {
        aValue = a.brand
        bValue = b.brand
      } else if (sortField === 'model') {
        aValue = a.model
        bValue = b.model
      } else if (sortField === 'series') {
        aValue = a.series
        bValue = b.series
      } else if (sortField === 'hashRate') {
        aValue = a.hashRate
        bValue = b.hashRate
      } else if (sortField === 'power') {
        aValue = a.power
        bValue = b.power
      } else if (sortField === 'isActive') {
        aValue = a.isActive
        bValue = b.isActive
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
    return <ErrorState error={error} onRetry={fetchMinerModels} />
  }

  return (
    <PageTemplate
      title={t('miners.title')}
      description={t('miners.description')}
      showCreateButton={true}
      createButtonText={t('miners.addMinerModel')}
      onCreateClick={() => setShowAddModal(true)}
      itemCount={filteredAndSortedMinerModels.length}
      itemName={t('miners.itemName')}
    >
      {/* Filters */}
      <FilterSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('miners.searchPlaceholder')}
          />
          <FilterSelect
            value={brandFilter}
            onChange={setBrandFilter}
            options={[
              { value: 'all', label: t('miners.allBrands') },
              { value: 'bitmain', label: t('miners.bitmain') },
              { value: 'whatsminer', label: t('miners.whatsminer') },
              { value: 'avalon', label: t('miners.avalon') }
            ]}
            placeholder={t('miners.filterByBrand')}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: t('miners.allStatus') },
              { value: 'active', label: t('miners.active') },
              { value: 'inactive', label: t('miners.inactive') }
            ]}
            placeholder={t('miners.filterByStatus')}
          />
        </div>
      </FilterSection>

      {/* Miner Models Table */}
      <DataTable>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader
                field="brand"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('miners.brand')}
              </SortableHeader>
              <SortableHeader
                field="model"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('miners.model')}
              </SortableHeader>
              <SortableHeader
                field="series"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('miners.series')}
              </SortableHeader>
              <SortableHeader
                field="hashRate"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('miners.hashRate')}
              </SortableHeader>
              <SortableHeader
                field="power"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('miners.power')}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('miners.minerDescription')}
              </th>
              <SortableHeader
                field="isActive"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Status
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedMinerModels.length === 0 ? (
              <EmptyState
                message="No miner models found"
                actionText="Add Miner Model"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              filteredAndSortedMinerModels.map((miner) => (
                <tr key={miner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {miner.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {miner.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {miner.series}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {miner.hashRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {miner.power}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={miner.description}>
                      {miner.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      miner.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {miner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons>
                      <ActionButton onClick={() => handleEdit(miner)}>
                        Edit
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(miner)} variant="danger">
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

      {/* Add Miner Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Miner Model</h3>
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
                  <label className="block text-sm font-medium text-gray-700">Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a brand</option>
                    <option value="bitmain">Bitmain</option>
                    <option value="whatsminer">Whatsminer</option>
                    <option value="avalon">Avalon</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., S19 Pro"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Series</label>
                  <input
                    type="text"
                    name="series"
                    value={formData.series}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Antminer S19"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hash Rate *</label>
                    <input
                      type="text"
                      name="hashRate"
                      value={formData.hashRate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 110 TH/s"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Power *</label>
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 3250W"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Additional details about this miner model"
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
                    Add Miner Model
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Miner Model Modal */}
      {showEditModal && editingMiner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Miner Model</h3>
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
                  <label className="block text-sm font-medium text-gray-700">Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a brand</option>
                    <option value="bitmain">Bitmain</option>
                    <option value="whatsminer">Whatsminer</option>
                    <option value="avalon">Avalon</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., S19 Pro"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Series</label>
                  <input
                    type="text"
                    name="series"
                    value={formData.series}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Antminer S19"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hash Rate *</label>
                    <input
                      type="text"
                      name="hashRate"
                      value={formData.hashRate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 110 TH/s"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Power *</label>
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 3250W"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Additional details about this miner model"
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
                    Update Miner Model
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && minerToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Miner Model</h3>
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
                  Are you sure you want to delete <strong>{minerToDelete.brand} {minerToDelete.model}</strong>? This action cannot be undone.
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
