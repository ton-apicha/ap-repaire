'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import AuthGuard from '@/components/auth/AuthGuard'
import {
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CogIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CircleStackIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_management'
}

interface AuditLogFilters {
  startDate: string
  endDate: string
  userId: string
  action: string
  resource: string
  status: string
  severity: string
  category: string
}

export default function AuditLogsPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [filters, setFilters] = useState<AuditLogFilters>({
    startDate: '',
    endDate: '',
    userId: '',
    action: '',
    resource: '',
    status: '',
    severity: '',
    category: '',
  })
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    failedLogs: 0,
    criticalLogs: 0,
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadAuditLogs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [auditLogs, filters])

  const loadAuditLogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/audit-logs')
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.data)
        setStats(data.stats)
      } else {
        toast.error(t('admin.auditLogs.loadError'))
      }
    } catch (error) {
      console.error('Error loading audit logs:', error)
      toast.error(t('admin.auditLogs.loadError'))
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...auditLogs]

    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      )
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate + 'T23:59:59')
      )
    }

    if (filters.userId) {
      filtered = filtered.filter(log => 
        log.userId.toLowerCase().includes(filters.userId.toLowerCase())
      )
    }

    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filters.action.toLowerCase())
      )
    }

    if (filters.resource) {
      filtered = filtered.filter(log => 
        log.resource.toLowerCase().includes(filters.resource.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter(log => log.status === filters.status)
    }

    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity)
    }

    if (filters.category) {
      filtered = filtered.filter(log => log.category === filters.category)
    }

    setFilteredLogs(filtered)
  }

  const exportLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(t('admin.auditLogs.exportSuccess'))
      } else {
        toast.error(t('admin.auditLogs.exportError'))
      }
    } catch (error) {
      console.error('Error exporting logs:', error)
      toast.error(t('admin.auditLogs.exportError'))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <ShieldCheckIcon className="h-4 w-4" />
      case 'authorization':
        return <UserGroupIcon className="h-4 w-4" />
      case 'data_access':
        return <CircleStackIcon className="h-4 w-4" />
      case 'data_modification':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'system':
        return <ServerIcon className="h-4 w-4" />
      case 'user_management':
        return <UserIcon className="h-4 w-4" />
      default:
        return <CogIcon className="h-4 w-4" />
    }
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      userId: '',
      action: '',
      resource: '',
      status: '',
      severity: '',
      category: '',
    })
  }

  return (
    <AuthGuard requiredRole="ADMIN">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('admin.auditLogs.title')}
              </h1>
              <p className="text-gray-600">
                {t('admin.auditLogs.description')}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadAuditLogs}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                {isLoading ? t('admin.auditLogs.refreshing') : t('admin.auditLogs.refresh')}
              </button>
              <button
                onClick={exportLogs}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {t('admin.auditLogs.export')}
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.auditLogs.totalLogs')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.totalLogs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.auditLogs.todayLogs')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.todayLogs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.auditLogs.failedLogs')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.failedLogs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.auditLogs.criticalLogs')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.criticalLogs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('admin.auditLogs.filters')}
              </h2>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {t('admin.auditLogs.clearFilters')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.startDate')}
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.endDate')}
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.userId')}
                </label>
                <input
                  type="text"
                  value={filters.userId}
                  onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                  placeholder={t('admin.auditLogs.userIdPlaceholder')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.action')}
                </label>
                <input
                  type="text"
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  placeholder={t('admin.auditLogs.actionPlaceholder')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.resource')}
                </label>
                <input
                  type="text"
                  value={filters.resource}
                  onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
                  placeholder={t('admin.auditLogs.resourcePlaceholder')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{t('admin.auditLogs.allStatuses')}</option>
                  <option value="success">{t('admin.auditLogs.statusSuccess')}</option>
                  <option value="failed">{t('admin.auditLogs.statusFailed')}</option>
                  <option value="warning">{t('admin.auditLogs.statusWarning')}</option>
                  <option value="info">{t('admin.auditLogs.statusInfo')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.severity')}
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{t('admin.auditLogs.allSeverities')}</option>
                  <option value="critical">{t('admin.auditLogs.severityCritical')}</option>
                  <option value="high">{t('admin.auditLogs.severityHigh')}</option>
                  <option value="medium">{t('admin.auditLogs.severityMedium')}</option>
                  <option value="low">{t('admin.auditLogs.severityLow')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('admin.auditLogs.category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">{t('admin.auditLogs.allCategories')}</option>
                  <option value="authentication">{t('admin.auditLogs.categoryAuthentication')}</option>
                  <option value="authorization">{t('admin.auditLogs.categoryAuthorization')}</option>
                  <option value="data_access">{t('admin.auditLogs.categoryDataAccess')}</option>
                  <option value="data_modification">{t('admin.auditLogs.categoryDataModification')}</option>
                  <option value="system">{t('admin.auditLogs.categorySystem')}</option>
                  <option value="user_management">{t('admin.auditLogs.categoryUserManagement')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('admin.auditLogs.logs')} ({filteredLogs.length})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.timestamp')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.action')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.resource')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.severity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.category')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.auditLogs.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        {isLoading ? t('admin.auditLogs.loading') : t('admin.auditLogs.noLogs')}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {log.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.resource}
                          {log.resourceId && (
                            <span className="text-gray-500 ml-1">({log.resourceId})</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(log.status)}
                            <span className="ml-2 text-sm text-gray-900">
                              {t(`admin.auditLogs.status${log.status.charAt(0).toUpperCase() + log.status.slice(1)}`)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                            {t(`admin.auditLogs.severity${log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getCategoryIcon(log.category)}
                            <span className="ml-2 text-sm text-gray-900">
                              {t(`admin.auditLogs.category${log.category.charAt(0).toUpperCase() + log.category.slice(1)}`)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedLog(log)
                              setShowDetails(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {t('admin.auditLogs.viewDetails')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Log Details Modal */}
        {showDetails && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('admin.auditLogs.logDetails')}
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.timestamp')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.user')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.userName} ({selectedLog.userEmail})
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.action')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.action}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.resource')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.resource}
                      {selectedLog.resourceId && ` (ID: ${selectedLog.resourceId})`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.details')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.details}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.ipAddress')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('admin.auditLogs.userAgent')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    {t('admin.auditLogs.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </AuthGuard>
  )
}
