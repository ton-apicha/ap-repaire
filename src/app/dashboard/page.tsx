'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  UsersIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'totalCustomers', value: '0', icon: UsersIcon, color: 'bg-blue-500' },
  { name: 'totalTechnicians', value: '0', icon: WrenchScrewdriverIcon, color: 'bg-green-500' },
  { name: 'pendingWorkOrders', value: '0', icon: ClockIcon, color: 'bg-yellow-500' },
  { name: 'completedWorkOrders', value: '0', icon: CheckCircleIcon, color: 'bg-green-600' },
  { name: 'totalRevenue', value: '$0', icon: CurrencyDollarIcon, color: 'bg-purple-500' },
  { name: 'activeWorkOrders', value: '0', icon: ClipboardDocumentListIcon, color: 'bg-indigo-500' },
]

const recentWorkOrders = [
  {
    id: '1',
    orderNumber: 'WO-001',
    customer: 'John Doe',
    issue: 'Power supply failure',
    status: 'pending',
    priority: 'high',
    date: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: 'WO-002',
    customer: 'Jane Smith',
    issue: 'Fan malfunction',
    status: 'inProgress',
    priority: 'medium',
    date: '2024-01-14',
  },
]

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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [customersRes, techniciansRes, workOrdersRes, minersRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/technicians'),
        fetch('/api/work-orders'),
        fetch('/api/miners')
      ])

      const customers = await customersRes.json()
      const technicians = await techniciansRes.json()
      const workOrders = await workOrdersRes.json()
      const miners = await minersRes.json()

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
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="mt-2 text-gray-600">{t('dashboard.overview')}</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        )}

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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
              </div>
      </Layout>
    </AuthGuard>
  )
}
