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
import { formatCurrency, getInvoiceStatusDisplay } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useLanguage } from '@/contexts/LanguageContext'

export default function InvoicesPage() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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
    return format(dateObj, 'dd/MM/yyyy', { locale: enUS })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <PageTemplate
      title={t('invoice.title')}
      description={t('invoice.invoices')}
      showCreateButton={true}
      createButtonText={t('invoice.createInvoice')}
      onCreateClick={() => console.log('Create invoice clicked')}
      itemCount={filteredAndSortedInvoices.length}
      itemName="invoices"
    >
      {/* Filters */}
      <FilterSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('invoice.searchInvoices')}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: t('common.all') },
              { value: 'DRAFT', label: t('invoice.draft') },
              { value: 'SENT', label: t('invoice.sent') },
              { value: 'PAID', label: t('invoice.paid') },
              { value: 'OVERDUE', label: t('invoice.overdue') },
              { value: 'PARTIAL', label: t('invoice.partial') },
              { value: 'CANCELLED', label: t('invoice.cancelled') }
            ]}
            placeholder={t('invoice.filterByStatus')}
          />
        </div>
      </FilterSection>

      {/* Invoices Table */}
      <DataTable>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader
                field="invoiceNumber"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.invoiceNumber')}
              </SortableHeader>
              <SortableHeader
                field="customer"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('workOrders.customer')}
              </SortableHeader>
              <SortableHeader
                field="issueDate"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.issueDate')}
              </SortableHeader>
              <SortableHeader
                field="dueDate"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.dueDate')}
              </SortableHeader>
              <SortableHeader
                field="totalAmount"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.totalAmount')}
              </SortableHeader>
              <SortableHeader
                field="paidAmount"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.paidAmount')}
              </SortableHeader>
              <SortableHeader
                field="status"
                currentSort={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t('invoice.status')}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedInvoices.length === 0 ? (
              <EmptyState
                message={t('invoice.noInvoices')}
                actionText={t('invoice.createInvoice')}
                onAction={() => console.log('Create invoice clicked')}
              />
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
                      <ActionButtons>
                        <ActionButton onClick={() => console.log('View invoice:', invoice.id)}>
                          {t('common.view')}
                        </ActionButton>
                        <ActionButton onClick={() => console.log('Edit invoice:', invoice.id)}>
                          {t('common.edit')}
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </DataTable>
    </PageTemplate>
  )
}
