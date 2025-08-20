'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import AuthGuard from '@/components/auth/AuthGuard'
import { useRouter } from 'next/navigation'
import {
  UsersIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
  BellIcon,
  CpuChipIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon,
  KeyIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  LinkIcon,
  ComputerDesktopIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const adminFeatures = [
  {
    name: 'userManagement',
    title: 'admin.userManagement',
    description: 'admin.userManagement',
    icon: UsersIcon,
    href: '/admin/users',
    color: 'bg-blue-500',
    category: 'management',
  },
  {
    name: 'roleManagement',
    title: 'admin.roleManagement',
    description: 'admin.roleManagement',
    icon: ShieldCheckIcon,
    href: '/admin/roles',
    color: 'bg-indigo-500',
    category: 'management',
  },
  {
    name: 'permissions',
    title: 'admin.permissions',
    description: 'admin.permissions',
    icon: KeyIcon,
    href: '/admin/permissions',
    color: 'bg-purple-500',
    category: 'management',
  },
  {
    name: 'systemSettings',
    title: 'admin.systemSettings',
    description: 'admin.systemSettings',
    icon: Cog6ToothIcon,
    href: '/admin/settings',
    color: 'bg-green-500',
    category: 'system',
  },
  {
    name: 'notifications',
    title: 'admin.notifications',
    description: 'admin.notifications',
    icon: BellIcon,
    href: '/admin/notifications',
    color: 'bg-yellow-500',
    category: 'system',
  },
  {
    name: 'emailSettings',
    title: 'admin.emailSettings',
    description: 'admin.emailSettings',
    icon: EnvelopeIcon,
    href: '/admin/email-settings',
    color: 'bg-pink-500',
    category: 'system',
  },
  {
    name: 'smsSettings',
    title: 'admin.smsSettings',
    description: 'admin.smsSettings',
    icon: ChatBubbleLeftRightIcon,
    href: '/admin/sms-settings',
    color: 'bg-teal-500',
    category: 'system',
  },
  {
    name: 'apiSettings',
    title: 'admin.apiSettings',
    description: 'admin.apiSettings',
    icon: CodeBracketIcon,
    href: '/admin/api-settings',
    color: 'bg-orange-500',
    category: 'system',
  },
  {
    name: 'integrations',
    title: 'admin.integrations',
    description: 'admin.integrations',
    icon: LinkIcon,
    href: '/admin/integrations',
    color: 'bg-cyan-500',
    category: 'system',
  },
  {
    name: 'webhooks',
    title: 'admin.webhooks',
    description: 'admin.webhooks',
    icon: GlobeAltIcon,
    href: '/admin/webhooks',
    color: 'bg-emerald-500',
    category: 'system',
  },
  {
    name: 'monitoring',
    title: 'admin.monitoring',
    description: 'admin.monitoring',
    icon: ComputerDesktopIcon,
    href: '/admin/monitoring',
    color: 'bg-red-500',
    category: 'monitoring',
  },
  {
    name: 'performance',
    title: 'admin.performance',
    description: 'admin.performance',
    icon: ChartPieIcon,
    href: '/admin/performance',
    color: 'bg-violet-500',
    category: 'monitoring',
  },
  {
    name: 'analytics',
    title: 'admin.analytics',
    description: 'admin.analytics',
    icon: PresentationChartLineIcon,
    href: '/admin/analytics',
    color: 'bg-rose-500',
    category: 'monitoring',
  },
  {
    name: 'systemHealth',
    title: 'admin.systemHealth',
    description: 'admin.systemHealth',
    icon: ServerIcon,
    href: '/admin/system-health',
    color: 'bg-slate-500',
    category: 'monitoring',
  },
  {
    name: 'reports',
    title: 'admin.reports',
    description: 'admin.reports',
    icon: ChartBarIcon,
    href: '/admin/reports',
    color: 'bg-purple-500',
    category: 'data',
  },
  {
    name: 'auditLogs',
    title: 'admin.auditLogs',
    description: 'admin.auditLogs',
    icon: EyeIcon,
    href: '/admin/audit-logs',
    color: 'bg-amber-500',
    category: 'data',
  },
  {
    name: 'logs',
    title: 'admin.logs',
    description: 'admin.logs',
    icon: DocumentTextIcon,
    href: '/admin/logs',
    color: 'bg-red-500',
    category: 'data',
  },
  {
    name: 'dataExport',
    title: 'admin.dataExport',
    description: 'admin.dataExport',
    icon: ArrowDownTrayIcon,
    href: '/admin/data-export',
    color: 'bg-green-500',
    category: 'data',
  },
  {
    name: 'dataImport',
    title: 'admin.dataImport',
    description: 'admin.dataImport',
    icon: ArrowUpTrayIcon,
    href: '/admin/data-import',
    color: 'bg-blue-500',
    category: 'data',
  },
  {
    name: 'backup',
    title: 'admin.backup',
    description: 'admin.backup',
    icon: ArchiveBoxIcon,
    href: '/admin/backup',
    color: 'bg-yellow-500',
    category: 'data',
  },
  {
    name: 'maintenance',
    title: 'admin.maintenance',
    description: 'admin.maintenance',
    icon: WrenchScrewdriverIcon,
    href: '/admin/maintenance',
    color: 'bg-gray-500',
    category: 'system',
  },
]

const systemStatus = [
  {
    name: 'database',
    label: 'admin.database',
    status: 'online',
    icon: CircleStackIcon,
    color: 'green',
    details: 'SQLite - Connected',
  },
  {
    name: 'server',
    label: 'admin.server',
    status: 'online',
    icon: ServerIcon,
    color: 'green',
    details: 'Next.js - Running',
  },
  {
    name: 'backup',
    label: 'admin.backupStatus',
    status: 'normal',
    icon: ArchiveBoxIcon,
    color: 'green',
    details: 'Last backup: 2 hours ago',
  },
  {
    name: 'security',
    label: 'admin.security',
    status: 'normal',
    icon: ShieldCheckIcon,
    color: 'green',
    details: 'All systems secure',
  },
]

const resourceUsage = [
  {
    name: 'diskSpace',
    label: 'admin.diskSpace',
    value: '45%',
    color: 'green',
    icon: CircleStackIcon,
  },
  {
    name: 'memoryUsage',
    label: 'admin.memoryUsage',
    value: '32%',
    color: 'green',
    icon: CpuChipIcon,
  },
  {
    name: 'cpuUsage',
    label: 'admin.cpuUsage',
    value: '18%',
    color: 'green',
    icon: ServerIcon,
  },
  {
    name: 'networkStatus',
    label: 'admin.networkStatus',
    value: '100%',
    color: 'green',
    icon: GlobeAltIcon,
  },
]

export default function Admin() {
  const { t } = useLanguage()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [systemStats, setSystemStats] = useState({
    uptime: '2 days, 14 hours',
    responseTime: '45ms',
    errorRate: '0.1%',
    activeUsers: 3,
    totalSessions: 12,
    dataUsage: '2.3 GB',
    bandwidth: '1.2 MB/s',
  })

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'management', name: 'User Management' },
    { id: 'system', name: 'System Settings' },
    { id: 'monitoring', name: 'Monitoring & Analytics' },
    { id: 'data', name: 'Data & Reports' },
  ]

  const filteredFeatures = selectedCategory === 'all' 
    ? adminFeatures 
    : adminFeatures.filter(feature => feature.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
      case 'offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
      case 'error':
      case 'offline':
        return <XCircleIcon className="h-4 w-4 text-red-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const getResourceColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600'
      case 'yellow':
        return 'text-yellow-600'
      case 'red':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <AuthGuard requiredRole="ADMIN">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
            <p className="mt-2 text-gray-600">{t('admin.description')}</p>
          </div>

          {/* System Status Overview */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.systemStatus')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStatus.map((item) => (
                <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{t(item.label)}</p>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(item.status)}
                        <span className={`ml-1 text-sm ${getStatusColor(item.status)}`}>
                          {t(`admin.${item.status}`)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Usage */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.resourceUsage')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resourceUsage.map((item) => (
                <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className={`h-8 w-8 ${getResourceColor(item.color)}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{t(item.label)}</p>
                      <p className={`text-lg font-semibold ${getResourceColor(item.color)}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.uptime')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.uptime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.responseTime')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.responseTime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.errorRate')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.errorRate}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.activeUsers')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.activeUsers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.totalSessions')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.totalSessions}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.dataUsage')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.dataUsage}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('admin.bandwidth')}</p>
                <p className="text-lg font-semibold text-gray-900">{systemStats.bandwidth}</p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Admin Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => router.push(feature.href)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`flex-shrink-0 rounded-md p-3 ${feature.color}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {t(feature.title)}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      {t(feature.description)}
                    </p>
                    <button 
                      onClick={() => router.push(feature.href)}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.quickActions')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                {t('admin.createBackup')}
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                {t('admin.generateReport')}
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                {t('admin.systemConfig')}
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                {t('admin.maintenance')}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
