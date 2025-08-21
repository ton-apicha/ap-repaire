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
import { toast } from 'react-hot-toast'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface WorkOrder {
  id: string
  orderNumber: string
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  type: 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER'
}

interface CreateInvoiceForm {
  customerId: string
  workOrderId: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  notes: string
  terms: string
  taxRate: number
  discountAmount: number
}

export default function InvoicesPage() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState<CreateInvoiceForm>({
    customerId: '',
    workOrderId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0, type: 'SERVICE' }],
    notes: '',
    terms: '',
    taxRate: 7,
    discountAmount: 0
  })

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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers', {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setCustomers(data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err)
      }
    }

    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('/api/work-orders', {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setWorkOrders(data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch work orders:', err)
      }
    }

    fetchCustomers()
    fetchWorkOrders()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCreateInvoice = async () => {
    try {
      setCreateLoading(true)
      
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('invoice.createSuccess') || 'Invoice created successfully')
        setInvoices(prev => [data.data, ...prev])
        setShowCreateModal(false)
        resetForm()
      } else {
        toast.error(data.error || 'Failed to create invoice')
      }
    } catch (err) {
      toast.error('Failed to create invoice')
    } finally {
      setCreateLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      workOrderId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, type: 'SERVICE' }],
      notes: '',
      terms: '',
      taxRate: 7,
      discountAmount: 0
    })
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, type: 'SERVICE' }]
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * formData.taxRate) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - formData.discountAmount
  }

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowViewModal(true)
  }

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setFormData({
      customerId: invoice.customerId,
      workOrderId: invoice.workOrderId || '',
      issueDate: invoice.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : '',
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
      items: invoice.items || [{ description: '', quantity: 1, unitPrice: 0, type: 'SERVICE' }],
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      taxRate: invoice.taxRate || 7,
      discountAmount: invoice.discountAmount || 0
    })
    setShowEditModal(true)
  }

  const handleUpdateInvoice = async () => {
    try {
      setUpdateLoading(true)
      
      const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('invoice.updateSuccess') || 'Invoice updated successfully')
        setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? data.data : inv))
        setShowEditModal(false)
        setSelectedInvoice(null)
        resetForm()
      } else {
        toast.error(data.error || 'Failed to update invoice')
      }
    } catch (err) {
      toast.error('Failed to update invoice')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm(t('invoice.confirmDelete') || 'Are you sure you want to delete this invoice?')) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('invoice.deleteSuccess') || 'Invoice deleted successfully')
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId))
      } else {
        toast.error(data.error || 'Failed to delete invoice')
      }
    } catch (err) {
      toast.error('Failed to delete invoice')
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
    <>
      <PageTemplate
        title={t('invoice.title')}
        description={t('invoice.invoices')}
        showCreateButton={true}
        createButtonText={t('invoice.createInvoice')}
        onCreateClick={() => setShowCreateModal(true)}
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
                  onAction={() => setShowCreateModal(true)}
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
                          <ActionButton onClick={() => handleViewInvoice(invoice)}>
                            {t('common.view')}
                          </ActionButton>
                          <ActionButton onClick={() => handleEditInvoice(invoice)}>
                            {t('common.edit')}
                          </ActionButton>
                          <ActionButton 
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            variant="danger"
                          >
                            {t('common.delete')}
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('invoice.createInvoice')}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workOrders.customer')} *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">{t('common.selectCustomer')}</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workOrders.workOrder')}
                    </label>
                    <select
                      value={formData.workOrderId}
                      onChange={(e) => setFormData(prev => ({ ...prev, workOrderId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('common.selectWorkOrder')}</option>
                      {workOrders.map(workOrder => (
                        <option key={workOrder.id} value={workOrder.id}>
                          {workOrder.orderNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.issueDate')} *
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.dueDate')} *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      {t('invoice.items')}
                    </h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      {t('invoice.addItem')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder={t('invoice.itemDescription')}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={item.type}
                            onChange={(e) => updateItem(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="SERVICE">{t('invoice.service')}</option>
                            <option value="PARTS">{t('invoice.parts')}</option>
                            <option value="LABOR">{t('invoice.labor')}</option>
                            <option value="OTHER">{t('invoice.other')}</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder={t('invoice.quantity')}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder={t('invoice.unitPrice')}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('invoice.taxRate')} (%)
                      </label>
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('invoice.discountAmount')}
                      </label>
                      <input
                        type="number"
                        value={formData.discountAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-right">
                    <div className="text-sm text-gray-600">
                      {t('invoice.subtotal')}: {formatCurrency(calculateSubtotal())}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('invoice.tax')}: {formatCurrency(calculateTax())}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('invoice.discount')}: -{formatCurrency(formData.discountAmount)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {t('invoice.total')}: {formatCurrency(calculateTotal())}
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.notes')}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.terms')}
                    </label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateInvoice}
                    disabled={createLoading || !formData.customerId || formData.items.some(item => !item.description)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createLoading ? t('common.creating') : t('invoice.createInvoice')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('invoice.invoiceDetails')} - {selectedInvoice.invoiceNumber}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('invoice.invoiceDetails')}</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>{t('invoice.invoiceNumber')}:</strong> {selectedInvoice.invoiceNumber}</div>
                      <div><strong>{t('invoice.issueDate')}:</strong> {formatDate(selectedInvoice.issueDate)}</div>
                      <div><strong>{t('invoice.dueDate')}:</strong> {formatDate(selectedInvoice.dueDate)}</div>
                      <div><strong>{t('invoice.status')}:</strong> {getInvoiceStatusDisplay(selectedInvoice.status).name}</div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('invoice.customerInfo')}</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>{t('common.name')}:</strong> {selectedInvoice.customer?.name}</div>
                      <div><strong>{t('common.email')}:</strong> {selectedInvoice.customer?.email}</div>
                      <div><strong>{t('common.phone')}:</strong> {selectedInvoice.customer?.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t('invoice.items')}</h4>
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('invoice.description')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('invoice.quantity')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('invoice.unitPrice')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('invoice.totalPrice')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedInvoice.items?.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm text-gray-900">{item.description}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="space-y-2 text-right">
                  <div className="text-sm text-gray-600">
                    {t('invoice.subtotal')}: {formatCurrency(selectedInvoice.subtotal)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('invoice.tax')}: {formatCurrency(selectedInvoice.taxAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('invoice.discount')}: -{formatCurrency(selectedInvoice.discountAmount)}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {t('invoice.total')}: {formatCurrency(selectedInvoice.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('invoice.paidAmount')}: {formatCurrency(selectedInvoice.paidAmount)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {t('invoice.balanceAmount')}: {formatCurrency(selectedInvoice.balanceAmount)}
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              {(selectedInvoice.notes || selectedInvoice.terms) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInvoice.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('invoice.notes')}</h4>
                      <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                    </div>
                  )}
                  {selectedInvoice.terms && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('invoice.terms')}</h4>
                      <p className="text-sm text-gray-600">{selectedInvoice.terms}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('invoice.editInvoice')} - {selectedInvoice.invoiceNumber}
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workOrders.customer')} *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">{t('common.selectCustomer')}</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workOrders.workOrder')}
                    </label>
                    <select
                      value={formData.workOrderId}
                      onChange={(e) => setFormData(prev => ({ ...prev, workOrderId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('common.selectWorkOrder')}</option>
                      {workOrders.map(workOrder => (
                        <option key={workOrder.id} value={workOrder.id}>
                          {workOrder.orderNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.issueDate')} *
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.dueDate')} *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      {t('invoice.items')}
                    </h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      {t('invoice.addItem')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder={t('invoice.itemDescription')}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <select
                            value={item.type}
                            onChange={(e) => updateItem(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="SERVICE">{t('invoice.service')}</option>
                            <option value="PARTS">{t('invoice.parts')}</option>
                            <option value="LABOR">{t('invoice.labor')}</option>
                            <option value="OTHER">{t('invoice.other')}</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder={t('invoice.quantity')}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder={t('invoice.unitPrice')}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('invoice.taxRate')} (%)
                      </label>
                      <input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('invoice.discountAmount')}
                      </label>
                      <input
                        type="number"
                        value={formData.discountAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-right">
                    <div className="text-sm text-gray-600">
                      {t('invoice.subtotal')}: {formatCurrency(calculateSubtotal())}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('invoice.tax')}: {formatCurrency(calculateTax())}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('invoice.discount')}: -{formatCurrency(formData.discountAmount)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {t('invoice.total')}: {formatCurrency(calculateTotal())}
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.notes')}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('invoice.terms')}
                    </label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateInvoice}
                    disabled={updateLoading || !formData.customerId || formData.items.some(item => !item.description)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? t('common.updating') : t('invoice.updateInvoice')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
