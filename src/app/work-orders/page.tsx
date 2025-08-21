'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { generateWorkId, getTodayDateString, countWorkOrdersForDate } from '@/lib/utils'

interface WorkOrder {
  id: string
  orderNumber: string
  status: string
  priority: string
  issue: string
  serialNumber: string
  estimatedCost: number | null
  actualCost: number | null
  createdAt: string
  customer: {
    id: string
    name: string
  }
  technician: {
    id: string
    name: string
  }
  minerModel: {
    id: string
    brand: string
    model: string
  }
}

interface Customer {
  id: string
  name: string
}

interface Technician {
  id: string
  name: string
}

interface MinerModel {
  id: string
  brand: string
  model: string
}

export default function WorkOrders() {
  const { t } = useLanguage()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [minerModels, setMinerModels] = useState<MinerModel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'orderNumber' | 'customerName' | 'technicianName' | 'status' | 'priority' | 'createdAt'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [formData, setFormData] = useState({
    customerId: '',
    technicianId: '',
    minerModelId: '',
    serialNumber: '',
    issue: '',
    priority: 'MEDIUM',
    estimatedCost: ''
  })
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  // Update generated order number when modal opens
  useEffect(() => {
    if (showAddModal) {
      const todayWorkOrderCount = getTodayWorkOrderCount()
      const nextWorkOrderNumber = todayWorkOrderCount + 1
      const newOrderNumber = generateWorkId(nextWorkOrderNumber)
      setGeneratedOrderNumber(newOrderNumber)
    }
  }, [showAddModal, workOrders])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [workOrdersRes, customersRes, techniciansRes, minerModelsRes] = await Promise.all([
        fetch('/api/work-orders'),
        fetch('/api/customers'),
        fetch('/api/technicians'),
        fetch('/api/miners')
      ])

      const workOrdersData = await workOrdersRes.json()
      const customersData = await customersRes.json()
      const techniciansData = await techniciansRes.json()
      const minerModelsData = await minerModelsRes.json()

      if (workOrdersData.success) {
        setWorkOrders(workOrdersData.data || [])
      } else {
        setError('Failed to fetch work orders')
      }

      if (customersData.success) {
        setCustomers(customersData.data || [])
      }

      if (techniciansData.success) {
        setTechnicians(techniciansData.data || [])
      }

      if (minerModelsData.success) {
        setMinerModels(minerModelsData.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getTodayWorkOrderCount = () => {
    const today = getTodayDateString()
    return countWorkOrdersForDate(workOrders, today)
  }

  const handleSort = (field: 'orderNumber' | 'customerName' | 'technicianName' | 'status' | 'priority' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'WAITING_PARTS': 'bg-orange-100 text-orange-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
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

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = workOrders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.technician?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.issue.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      if (sortField === 'orderNumber') {
        aValue = a.orderNumber
        bValue = b.orderNumber
      } else if (sortField === 'customerName') {
        aValue = a.customer?.name || ''
        bValue = b.customer?.name || ''
      } else if (sortField === 'technicianName') {
        aValue = a.technician?.name || ''
        bValue = b.technician?.name || ''
      } else if (sortField === 'status') {
        aValue = a.status
        bValue = b.status
      } else if (sortField === 'priority') {
        aValue = a.priority
        bValue = b.priority
      } else if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleView = (workOrder: WorkOrder) => {
    window.open(`/work-orders/${workOrder.id}`, '_blank')
  }

  const handleEdit = (workOrder: WorkOrder) => {
    // TODO: Implement edit functionality
    console.log('Edit work order:', workOrder.id)
    toast('Edit functionality coming soon!')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />
  }

  return (
    <PageTemplate
      title="Work Orders"
      description="Manage repair work orders"
      showCreateButton={true}
      createButtonText="Create Work Order"
      onCreateClick={() => setShowAddModal(true)}
      itemCount={filteredAndSortedWorkOrders.length}
      itemName="work orders"
    >
      {/* Filters */}
      <FilterSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search work orders..."
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'WAITING_PARTS', label: 'Waiting Parts' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' }
            ]}
            placeholder="Filter by status"
          />
          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { value: 'all', label: 'All Priority' },
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'URGENT', label: 'Urgent' }
            ]}
            placeholder="Filter by priority"
          />
        </div>
      </FilterSection>

      {/* Work Orders Table */}
      <DataTable>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader
                field="orderNumber"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.orderNumber')}
              </SortableHeader>
              <SortableHeader
                field="customerName"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.customer')}
              </SortableHeader>
              <SortableHeader
                field="technicianName"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.technician')}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('workOrders.minerModel')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('workOrders.issue')}
              </th>
              <SortableHeader
                field="status"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.status')}
              </SortableHeader>
              <SortableHeader
                field="priority"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.priority')}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('workOrders.estimatedCost')}
              </th>
              <SortableHeader
                field="createdAt"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.startDate')}
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedWorkOrders.length === 0 ? (
              <EmptyState
                message={t('workOrders.noWorkOrders')}
                actionText={t('workOrders.addWorkOrder')}
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              filteredAndSortedWorkOrders.map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workOrder.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{workOrder.customer?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{workOrder.technician?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workOrder.minerModel ? (
                      <div>
                        <div className="font-medium">{workOrder.minerModel.brand}</div>
                        <div className="text-sm text-gray-500">{workOrder.minerModel.model}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={workOrder.issue}>
                      {workOrder.issue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workOrder.status)}`}>
                      {workOrder.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(workOrder.priority)}`}>
                      {workOrder.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(workOrder.estimatedCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(workOrder.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons>
                      <ActionButton onClick={() => handleView(workOrder)}>
                        View
                      </ActionButton>
                      <ActionButton onClick={() => handleEdit(workOrder)}>
                        Edit
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>

      {/* Add Work Order Modal - Keep existing modal code */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Work Order</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Generated Order Number:</strong> {generatedOrderNumber}
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer *</label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Technician *</label>
                    <select
                      value={formData.technicianId}
                      onChange={(e) => setFormData({...formData, technicianId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a technician</option>
                      {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {technician.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Miner Model *</label>
                    <select
                      value={formData.minerModelId}
                      onChange={(e) => setFormData({...formData, minerModelId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a miner model</option>
                      {minerModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.brand} - {model.model}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <input
                      type="text"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter serial number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Issue Description *</label>
                  <textarea
                    value={formData.issue}
                    onChange={(e) => setFormData({...formData, issue: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe the issue..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimatedCost}
                      onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
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
                    Create Work Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  )
}
