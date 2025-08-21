'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency, getInvoiceStatusDisplay } from '@/lib/utils'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { format } from 'date-fns'
import { th, enUS, zhCN } from 'date-fns/locale'

const dateLocales = { th, en: enUS, zh: zhCN }

export default function InvoicesPage() {
  const { t, language } = useLanguage()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/invoices', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.success) {
          setInvoices(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch invoices')
        }
      } catch (err) {
        setError('Failed to fetch invoices')
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoices()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedInvoices = React.useMemo(() => {
    let filtered = invoices || []

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((invoice: any) =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((invoice: any) => invoice.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a: any, b: any) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle nested object sorting
      if (sortField === 'customer') {
        aValue = a.customer?.name || ''
        bValue = b.customer?.name || ''
      }

      // Handle date sorting
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime()
        bValue = bValue.getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [invoices, searchTerm, statusFilter, sortField, sortDirection])

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'dd/MM/yyyy', { locale: dateLocales[language as keyof typeof dateLocales] })
  }

  if (loading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </Layout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </Layout>
      </AuthGuard>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('invoice.title')}</h1>
            <p className="mt-2 text-gray-600">{t('invoice.invoices')}</p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t('invoice.createInvoice')}
          </button>
        </div>

        {/* Search Bar */}
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
                <option value="DRAFT">{t('invoice.draft')}</option>
                <option value="SENT">{t('invoice.sent')}</option>
                <option value="PAID">{t('invoice.paid')}</option>
                <option value="OVERDUE">{t('invoice.overdue')}</option>
                <option value="PARTIAL">{t('invoice.partial')}</option>
                <option value="CANCELLED">{t('invoice.cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
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
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('invoiceNumber')}
                    >
                      {t('invoice.invoiceNumber')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('customer')}
                    >
                      {t('customers.title')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('issueDate')}
                    >
                      {t('invoice.issueDate')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('dueDate')}
                    >
                      {t('invoice.dueDate')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('totalAmount')}
                    >
                      {t('invoice.totalAmount')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('paidAmount')}
                    >
                      {t('invoice.paidAmount')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      {t('invoice.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">{t('invoice.noInvoices')}</p>
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {t('invoice.createFirstInvoice')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedInvoices.map((invoice: any) => {
                      const statusDisplay = getInvoiceStatusDisplay(invoice.status)
                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{invoice.customer?.name}</div>
                              <div className="text-sm text-gray-500">{invoice.customer?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(invoice.issueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(invoice.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(invoice.paidAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.color}`}>
                              {statusDisplay.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                {t('common.view')}
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                {t('invoice.send')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
