'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import AuthGuard from '@/components/auth/AuthGuard'
import {
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
  ServerIcon,
  DocumentTextIcon,
  CpuChipIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface BackupConfig {
  autoBackup: boolean
  backupInterval: number // hours
  retentionDays: number
  includeFiles: boolean
  includeDatabase: boolean
  cloudBackup: boolean
  cloudProvider: string
}

interface BackupHistory {
  id: string
  timestamp: string
  type: 'manual' | 'auto'
  status: 'success' | 'failed' | 'in_progress'
  size: string
  duration: string
  description: string
}

export default function BackupPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    autoBackup: true,
    backupInterval: 24,
    retentionDays: 30,
    includeFiles: true,
    includeDatabase: true,
    cloudBackup: false,
    cloudProvider: 'local',
  })
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([])
  const [systemStats, setSystemStats] = useState({
    lastBackup: '',
    nextBackup: '',
    totalBackups: 0,
    totalSize: '0 MB',
    successRate: 100,
  })

  useEffect(() => {
    loadBackupData()
  }, [])

  const loadBackupData = async () => {
    try {
      // Load backup configuration
      const configResponse = await fetch('/api/admin/backup/config')
      if (configResponse.ok) {
        const config = await configResponse.json()
        setBackupConfig(config.data)
      }

      // Load backup history
      const historyResponse = await fetch('/api/admin/backup/history')
      if (historyResponse.ok) {
        const history = await historyResponse.json()
        setBackupHistory(history.data)
      }

      // Load system stats
      const statsResponse = await fetch('/api/admin/backup/stats')
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setSystemStats(stats.data)
      }
    } catch (error) {
      console.error('Error loading backup data:', error)
      toast.error(t('admin.backup.loadError'))
    }
  }

  const createBackup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/backup/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'manual',
          includeFiles: backupConfig.includeFiles,
          includeDatabase: backupConfig.includeDatabase,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(t('admin.backup.createSuccess'))
        loadBackupData() // Reload data
      } else {
        const error = await response.json()
        toast.error(error.message || t('admin.backup.createError'))
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error(t('admin.backup.createError'))
    } finally {
      setIsLoading(false)
    }
  }

  const restoreBackup = async (backupId: string) => {
    if (!confirm(t('admin.backup.restoreConfirm'))) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/backup/restore/${backupId}`, {
        method: 'POST',
      })

      if (response.ok) {
        toast.success(t('admin.backup.restoreSuccess'))
        loadBackupData()
      } else {
        const error = await response.json()
        toast.error(error.message || t('admin.backup.restoreError'))
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      toast.error(t('admin.backup.restoreError'))
    } finally {
      setIsLoading(false)
    }
  }

  const downloadBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup/download/${backupId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${backupId}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(t('admin.backup.downloadSuccess'))
      } else {
        toast.error(t('admin.backup.downloadError'))
      }
    } catch (error) {
      console.error('Error downloading backup:', error)
      toast.error(t('admin.backup.downloadError'))
    }
  }

  const deleteBackup = async (backupId: string) => {
    if (!confirm(t('admin.backup.deleteConfirm'))) return

    try {
      const response = await fetch(`/api/admin/backup/delete/${backupId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success(t('admin.backup.deleteSuccess'))
        loadBackupData()
      } else {
        const error = await response.json()
        toast.error(error.message || t('admin.backup.deleteError'))
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      toast.error(t('admin.backup.deleteError'))
    }
  }

  const updateConfig = async () => {
    try {
      const response = await fetch('/api/admin/backup/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupConfig),
      })

      if (response.ok) {
        toast.success(t('admin.backup.configUpdateSuccess'))
      } else {
        const error = await response.json()
        toast.error(error.message || t('admin.backup.configUpdateError'))
      }
    } catch (error) {
      console.error('Error updating config:', error)
      toast.error(t('admin.backup.configUpdateError'))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <AuthGuard requiredRole="ADMIN">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('admin.backup.title')}
              </h1>
              <p className="text-gray-600">
                {t('admin.backup.description')}
              </p>
            </div>
            <button
              onClick={createBackup}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ArchiveBoxIcon className="h-4 w-4 mr-2" />
              {isLoading ? t('admin.backup.creating') : t('admin.backup.create')}
            </button>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.backup.lastBackup')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemStats.lastBackup || t('admin.backup.never')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.backup.nextBackup')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemStats.nextBackup || t('admin.backup.notScheduled')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <ArchiveBoxIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.backup.totalBackups')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemStats.totalBackups}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <CpuChipIcon className="h-8 w-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {t('admin.backup.successRate')}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {systemStats.successRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backup Configuration */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.backup.configuration')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {t('admin.backup.autoBackup')}
                  </label>
                  <input
                    type="checkbox"
                    checked={backupConfig.autoBackup}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      autoBackup: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('admin.backup.backupInterval')} (hours)
                  </label>
                  <input
                    type="number"
                    value={backupConfig.backupInterval}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      backupInterval: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="1"
                    max="168"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('admin.backup.retentionDays')}
                  </label>
                  <input
                    type="number"
                    value={backupConfig.retentionDays}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      retentionDays: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {t('admin.backup.includeFiles')}
                  </label>
                  <input
                    type="checkbox"
                    checked={backupConfig.includeFiles}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      includeFiles: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {t('admin.backup.includeDatabase')}
                  </label>
                  <input
                    type="checkbox"
                    checked={backupConfig.includeDatabase}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      includeDatabase: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {t('admin.backup.cloudBackup')}
                  </label>
                  <input
                    type="checkbox"
                    checked={backupConfig.cloudBackup}
                    onChange={(e) => setBackupConfig({
                      ...backupConfig,
                      cloudBackup: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <button
                  onClick={updateConfig}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t('admin.backup.saveConfig')}
                </button>
              </div>
            </div>

            {/* Backup History */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.backup.history')}
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {backupHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('admin.backup.noHistory')}
                  </p>
                ) : (
                  backupHistory.map((backup) => (
                    <div key={backup.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(backup.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {backup.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(backup.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                            {t(`admin.backup.status.${backup.status}`)}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => downloadBackup(backup.id)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title={t('admin.backup.download')}
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => restoreBackup(backup.id)}
                              className="p-1 text-gray-400 hover:text-green-600"
                              title={t('admin.backup.restore')}
                            >
                              <ArrowUpTrayIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteBackup(backup.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title={t('admin.backup.delete')}
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{backup.size}</span>
                        <span>{backup.duration}</span>
                        <span className="capitalize">{backup.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
