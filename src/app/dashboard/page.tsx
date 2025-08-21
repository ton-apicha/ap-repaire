'use client'

import React, { useState, useEffect } from 'react'
import PageTemplate, { ActionButtons, ActionButton, LoadingSpinner, ErrorState } from '@/components/ui/PageTemplate'
import AuthGuard from '@/components/auth/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  UsersIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
    totalWorkOrders: 0,
    totalMiners: 0,
    pendingWorkOrders: 0,
    completedWorkOrders: 0,
    totalRevenue: 0
  })
  const [recentWorkOrders, setRecentWorkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      // Fetch all data in parallel
      const [customersRes, techniciansRes, workOrdersRes, minersRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/technicians'),
        fetch('/api/work-orders'),
        fetch('/api/miners')
      ])

      const customersData = await customersRes.json()
      const techniciansData = await techniciansRes.json()
      const workOrdersData = await workOrdersRes.json()
      const minersData = await minersRes.json()

      // Extract data from API responses
      const customers = customersData.success ? customersData.data || [] : []
      const technicians = techniciansData.success ? techniciansData.data || [] : []
      const workOrders = workOrdersData.success ? workOrdersData.data || [] : []
      const miners = minersData.success ? minersData.data || [] : []

      // Calculate stats
      const pendingWorkOrders = workOrders.filter((wo: any) => wo.status === 'PENDING').length
      const completedWorkOrders = workOrders.filter((wo: any) => wo.status === 'COMPLETED').length
      const totalRevenue = workOrders
        .filter((wo: any) => wo.actualCost)
        .reduce((sum: number, wo: any) => sum + (wo.actualCost || 0), 0)

      setStats({
        totalCustomers: customers.length,
        totalTechnicians: technicians.length,
        totalWorkOrders: workOrders.length,
        totalMiners: miners.length,
        pendingWorkOrders,
        completedWorkOrders,
        totalRevenue
      })

      // Get recent work orders (last 5) with customer data
      const recentOrders = workOrders.slice(0, 5).map((order: any) => ({
        ...order,
        customer: customers.find((c: any) => c.id === order.customerId) || null
      }))
      setRecentWorkOrders(recentOrders)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
      // Set default values on error
      setStats({
        totalCustomers: 0,
        totalTechnicians: 0,
        totalWorkOrders: 0,
        totalMiners: 0,
        pendingWorkOrders: 0,
        completedWorkOrders: 0,
        totalRevenue: 0
      })
      setRecentWorkOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800'
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

  const handleView = (id: string) => {
    window.location.href = `/work-orders/${id}`
  }

  const handleEdit = (id: string) => {
    window.location.href = `/work-orders/${id}?edit=true`
  }

  if (loading) {
    return (
      <AuthGuard>
        <PageTemplate
          title={t('dashboard.title')}
          description={t('dashboard.overview')}
          showCreateButton={false}
        >
          <LoadingSpinner />
        </PageTemplate>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <PageTemplate
          title={t('dashboard.title')}
          description={t('dashboard.overview')}
          showCreateButton={false}
        >
          <ErrorState error={error} onRetry={fetchDashboardData} />
        </PageTemplate>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <PageTemplate
        title={t('dashboard.title')}
        description={t('dashboard.overview')}
        showCreateButton={false}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.totalCustomers')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalCustomers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.totalTechnicians')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalTechnicians}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.totalWorkOrders')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalWorkOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-purple-500">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.totalRevenue')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ฿{stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Work Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('dashboard.recentWorkOrders')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('workOrders.orderNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('workOrders.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('workOrders.issue')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.priority')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No work orders found
                    </td>
                  </tr>
                ) : (
                  recentWorkOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {order.issue || 'N/A'}
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
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ActionButtons>
                          <ActionButton onClick={() => handleView(order.id)}>
                            <EyeIcon className="h-4 w-4" />
                            View
                          </ActionButton>
                          <ActionButton onClick={() => handleEdit(order.id)}>
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageTemplate>
    </AuthGuard>
  )
}
