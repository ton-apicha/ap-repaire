'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

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
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WorkOrder | 'customerName' | 'technicianName' | 'minerModelName' | 'estimatedCost'
    direction: 'asc' | 'desc'
  } | null>(null)
  const [formData, setFormData] = useState({
    customerId: '',
    technicianId: '',
    minerModelId: '',
    serialNumber: '',
    issue: '',
    priority: 'MEDIUM',
    estimatedCost: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
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

      setWorkOrders(workOrdersData)
      setCustomers(customersData)
      setTechnicians(techniciansData)
      setMinerModels(minerModelsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null
        }),
      })

      if (response.ok) {
        const newWorkOrder = await response.json()
        setWorkOrders(prev => [newWorkOrder, ...prev])
        setShowAddModal(false)
        setFormData({
          customerId: '',
          technicianId: '',
          minerModelId: '',
          serialNumber: '',
          issue: '',
          priority: 'MEDIUM',
          estimatedCost: ''
        })
        toast.success('Work order created successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create work order')
      }
    } catch (error) {
      console.error('Error creating work order:', error)
      toast.error('Error creating work order')
    }
  }

  // Sorting function
  const sortData = (data: WorkOrder[]) => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortConfig.key) {
        case 'orderNumber':
          aValue = a.orderNumber.toLowerCase()
          bValue = b.orderNumber.toLowerCase()
          break
        case 'customerName':
          aValue = a.customer.name.toLowerCase()
          bValue = b.customer.name.toLowerCase()
          break
        case 'technicianName':
          aValue = a.technician.name.toLowerCase()
          bValue = b.technician.name.toLowerCase()
          break
        case 'minerModelName':
          aValue = `${a.minerModel.brand} ${a.minerModel.model}`.toLowerCase()
          bValue = `${b.minerModel.brand} ${b.minerModel.model}`.toLowerCase()
          break
        case 'issue':
          aValue = a.issue.toLowerCase()
          bValue = b.issue.toLowerCase()
          break
        case 'status':
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case 'priority':
          aValue = a.priority.toLowerCase()
          bValue = b.priority.toLowerCase()
          break
        case 'estimatedCost':
          aValue = a.estimatedCost || 0
          bValue = b.estimatedCost || 0
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
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
  const handleSort = (key: keyof WorkOrder | 'customerName' | 'technicianName' | 'minerModelName' | 'estimatedCost') => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
  }

  // Get sort icon
  const getSortIcon = (key: keyof WorkOrder | 'customerName' | 'technicianName' | 'minerModelName' | 'estimatedCost') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-blue-600" />
      : <ChevronDownIcon className="h-4 w-4 text-blue-600" />
  }

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.minerModel.brand} ${order.minerModel.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const sortedWorkOrders = sortData(filteredWorkOrders)

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase()
    switch (priorityLower) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return t('workOrders.status.pending')
      case 'in_progress':
        return t('workOrders.status.inProgress')
      case 'completed':
        return t('workOrders.status.completed')
      case 'cancelled':
        return t('workOrders.status.cancelled')
      case 'waiting_parts':
        return t('workOrders.status.waitingParts')
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    const priorityLower = priority.toLowerCase()
    switch (priorityLower) {
      case 'low':
        return t('workOrders.priority.low')
      case 'medium':
        return t('workOrders.priority.medium')
      case 'high':
        return t('workOrders.priority.high')
      case 'urgent':
        return t('workOrders.priority.urgent')
      default:
        return priority
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('workOrders.title')}</h1>
            <p className="mt-2 text-gray-600">{t('workOrders.workOrderList')}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('workOrders.addWorkOrder')}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">{t('common.all')}</option>
                <option value="pending">{t('workOrders.status.pending')}</option>
                <option value="in_progress">{t('workOrders.status.inProgress')}</option>
                <option value="waiting_parts">{t('workOrders.status.waitingParts')}</option>
                <option value="completed">{t('workOrders.status.completed')}</option>
                <option value="cancelled">{t('workOrders.status.cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('orderNumber')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.orderNumber')}</span>
                      {getSortIcon('orderNumber')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.customer')}</span>
                      {getSortIcon('customerName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('technicianName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.technician')}</span>
                      {getSortIcon('technicianName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('minerModelName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.minerModel')}</span>
                      {getSortIcon('minerModelName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('issue')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.issue')}</span>
                      {getSortIcon('issue')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('common.status')}</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('common.priority')}</span>
                      {getSortIcon('priority')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('estimatedCost')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('workOrders.estimatedCost')}</span>
                      {getSortIcon('estimatedCost')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No work orders found
                    </td>
                  </tr>
                ) : (
                  sortedWorkOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/work-orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.technician.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.minerModel.brand} {order.minerModel.model}</div>
                        <div className="text-xs text-gray-400">{order.serialNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                        {getPriorityText(order.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ฿{order.estimatedCost?.toLocaleString()}
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>

        {/* Add Work Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
            
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {t('workOrders.addWorkOrder')}
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

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('workOrders.customer')}
                      </label>
                      <select
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">{t('common.select')}</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('workOrders.technician')}
                      </label>
                      <select
                        name="technicianId"
                        value={formData.technicianId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">{t('common.select')}</option>
                        {technicians.map((technician) => (
                          <option key={technician.id} value={technician.id}>
                            {technician.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('workOrders.minerModel')}
                      </label>
                      <select
                        name="minerModelId"
                        value={formData.minerModelId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">{t('common.select')}</option>
                        {minerModels.map((miner) => (
                          <option key={miner.id} value={miner.id}>
                            {miner.brand} {miner.model}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('workOrders.serialNumber')}
                      </label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('common.priority')}
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="LOW">{t('workOrders.priority.low')}</option>
                        <option value="MEDIUM">{t('workOrders.priority.medium')}</option>
                        <option value="HIGH">{t('workOrders.priority.high')}</option>
                        <option value="URGENT">{t('workOrders.priority.urgent')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t('workOrders.estimatedCost')}
                      </label>
                      <input
                        type="number"
                        name="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('workOrders.issue')}
                    </label>
                    <textarea
                      name="issue"
                      value={formData.issue}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
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
      </div>
    </Layout>
  )
}
