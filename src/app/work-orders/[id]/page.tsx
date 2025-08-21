'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
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
  notes: string | null
  createdAt: string
  completedAt: string | null
  customer: {
    id: string
    name: string
    phone: string
    email: string | null
  }
  technician: {
    id: string
    name: string
    phone: string
  }
  minerModel: {
    id: string
    brand: string
    model: string
    hashRate: string
  }
}

const statusConfig = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
  WAITING_PARTS: { color: 'bg-orange-100 text-orange-800', icon: ClockIcon },
}

const priorityConfig = {
  LOW: { color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800' },
  HIGH: { color: 'bg-orange-100 text-orange-800' },
  URGENT: { color: 'bg-red-100 text-red-800' },
}

export default function WorkOrderDetail() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    actualCost: '',
    notes: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchWorkOrder()
    }
  }, [params.id])

  const fetchWorkOrder = async () => {
    try {
      const response = await fetch(`/api/work-orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setWorkOrder(data)
        setUpdateData({
          status: data.status,
          actualCost: data.actualCost?.toString() || '',
          notes: data.notes || ''
        })
      } else {
        toast.error('Failed to fetch work order')
      }
    } catch (error) {
      console.error('Error fetching work order:', error)
      toast.error('Error fetching work order')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const response = await fetch(`/api/work-orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updateData,
          actualCost: updateData.actualCost ? parseFloat(updateData.actualCost) : null
        }),
      })

      if (response.ok) {
        const updatedWorkOrder = await response.json()
        setWorkOrder(updatedWorkOrder)
        setShowUpdateModal(false)
        toast.success('Work order updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update work order')
      }
    } catch (error) {
      console.error('Error updating work order:', error)
      toast.error('Error updating work order')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!workOrder) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Work Order Not Found</h2>
          <p className="mt-2 text-gray-600">The work order you're looking for doesn't exist.</p>
        </div>
      </Layout>
    )
  }

  const StatusIcon = statusConfig[workOrder.status as keyof typeof statusConfig]?.icon || ClockIcon
  const statusInfo = statusConfig[workOrder.status as keyof typeof statusConfig]
  const priorityInfo = priorityConfig[workOrder.priority as keyof typeof priorityConfig]

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workOrder.orderNumber}</h1>
              <p className="text-gray-600">Work Order Details</p>
            </div>
          </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-lg ${statusInfo?.color} border`}>
          <div className="flex items-center space-x-3">
            <StatusIcon className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Status: {getStatusText(workOrder.status)}</h3>
              <p className="text-sm opacity-75">
                Created: {new Date(workOrder.createdAt).toLocaleDateString()}
                {workOrder.completedAt && ` • Completed: ${new Date(workOrder.completedAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{workOrder.customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{workOrder.customer.phone}</p>
              </div>
              {workOrder.customer.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{workOrder.customer.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Technician Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technician Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{workOrder.technician.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{workOrder.technician.phone}</p>
              </div>
            </div>
          </div>

          {/* Equipment Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Brand & Model</label>
                <p className="text-gray-900">
                  {workOrder.minerModel ? `${workOrder.minerModel.brand} ${workOrder.minerModel.model}` : 'ไม่ระบุ'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hash Rate</label>
                <p className="text-gray-900">
                  {workOrder.minerModel ? workOrder.minerModel.hashRate : 'ไม่ระบุ'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Serial Number</label>
                <p className="text-gray-900">{workOrder.serialNumber}</p>
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Estimated Cost</label>
                <p className="text-gray-900">
                  {workOrder.estimatedCost ? `฿${workOrder.estimatedCost.toLocaleString()}` : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Actual Cost</label>
                <p className="text-gray-900">
                  {workOrder.actualCost ? `฿${workOrder.actualCost.toLocaleString()}` : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo?.color}`}>
                  {getPriorityText(workOrder.priority)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{workOrder.issue}</p>
        </div>

        {/* Notes */}
        {workOrder.notes && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{workOrder.notes}</p>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"></div>
            
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Update Work Order Status
                    </h3>
                    <button
                      onClick={() => setShowUpdateModal(false)}
                      className="rounded-full p-1 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={updateData.status}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="PENDING">{t('workOrders.status.pending')}</option>
                      <option value="IN_PROGRESS">{t('workOrders.status.inProgress')}</option>
                      <option value="WAITING_PARTS">{t('workOrders.status.waitingParts')}</option>
                      <option value="COMPLETED">{t('workOrders.status.completed')}</option>
                      <option value="CANCELLED">{t('workOrders.status.cancelled')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Actual Cost (฿)
                    </label>
                    <input
                      type="number"
                      name="actualCost"
                      value={updateData.actualCost}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, actualCost: e.target.value }))}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={updateData.notes}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'Update'}
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
