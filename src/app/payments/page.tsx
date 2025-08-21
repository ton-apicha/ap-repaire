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
import { useLanguage } from '@/contexts/LanguageContext'

interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMethod: string
  reference?: string
  notes?: string
  invoice?: {
    id: string
    invoiceNumber: string
    customer?: {
      id: string
      name: string
      email: string
    }
  }
}

export default function PaymentsPage() {
  const { t } = useLanguage()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [sortField, setSortField] = useState<'paymentDate' | 'amount' | 'invoiceNumber'>('paymentDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [createFormData, setCreateFormData] = useState({
    invoiceId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    reference: '',
    notes: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  // Fetch payments data
  useEffect(() => {
    fetchPayments()
    fetchInvoices()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payments', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setPayments(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch payments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
    }
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!createFormData.invoiceId || !createFormData.amount) {
      alert('Please fill in required fields')
      return
    }

    try {
      setIsCreating(true)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          invoiceId: createFormData.invoiceId,
          amount: parseFloat(createFormData.amount),
          paymentDate: createFormData.paymentDate,
          paymentMethod: createFormData.paymentMethod,
          reference: createFormData.reference || undefined,
          notes: createFormData.notes || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateForm(false)
        setCreateFormData({
          invoiceId: '',
          amount: '',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'CASH',
          reference: '',
          notes: ''
        })
        fetchPayments() // Refresh the list
      } else {
        alert(data.error || 'Failed to create payment')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  // Filter and sort payments
  const filteredAndSortedPayments = payments
    .filter(payment => {
      const matchesSearch = 
        payment.invoice?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesMethod = paymentMethodFilter === 'all' || payment.paymentMethod === paymentMethodFilter
      
      return matchesSearch && matchesMethod
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      if (sortField === 'paymentDate') {
        aValue = new Date(a.paymentDate)
        bValue = new Date(b.paymentDate)
      } else if (sortField === 'amount') {
        aValue = a.amount
        bValue = b.amount
      } else if (sortField === 'invoiceNumber') {
        aValue = a.invoice?.invoiceNumber || ''
        bValue = b.invoice?.invoiceNumber || ''
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field: 'paymentDate' | 'amount' | 'invoiceNumber') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'CASH': 'bg-green-100 text-green-800',
      'BANK_TRANSFER': 'bg-blue-100 text-blue-800',
      'CREDIT_CARD': 'bg-purple-100 text-purple-800',
      'DEBIT_CARD': 'bg-yellow-100 text-yellow-800',
      'CHECK': 'bg-gray-100 text-gray-800',
      'DIGITAL_WALLET': 'bg-indigo-100 text-indigo-800',
      'OTHER': 'bg-red-100 text-red-800'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowViewModal(true)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortDirection === 'asc' ? (
      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (loading) {
    return (
      <PageTemplate
        title={t('payment.title')}
        description={t('payment.payments')}
        showCreateButton={false}
      >
        <LoadingSpinner />
      </PageTemplate>
    )
  }

  if (error) {
    return (
      <PageTemplate
        title={t('payment.title')}
        description={t('payment.payments')}
        showCreateButton={false}
      >
        <ErrorState error={error} onRetry={fetchPayments} />
      </PageTemplate>
    )
  }

  return (
    <PageTemplate
      title={t('payment.title')}
      description={t('payment.payments')}
      showCreateButton={true}
      createButtonText={t('payment.createPayment')}
      onCreateClick={() => setShowCreateForm(true)}
      itemCount={filteredAndSortedPayments.length}
      itemName="payments"
    >

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <select 
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="CASH">{t('invoice.cash')}</option>
                  <option value="BANK_TRANSFER">{t('invoice.bankTransfer')}</option>
                  <option value="CREDIT_CARD">{t('invoice.creditCard')}</option>
                  <option value="DEBIT_CARD">{t('invoice.debitCard')}</option>
                  <option value="CHECK">{t('invoice.check')}</option>
                  <option value="DIGITAL_WALLET">{t('invoice.digitalWallet')}</option>
                  <option value="OTHER">{t('invoice.otherPayment')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setPaymentMethodFilter('all')
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('common.clearFilters')}
                </button>
                <button
                  onClick={() => fetchPayments()}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('invoiceNumber')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        {t('invoice.invoiceNumber')}
                        <SortIcon field="invoiceNumber" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('paymentDate')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        {t('payment.paymentDate')}
                        <SortIcon field="paymentDate" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('amount')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        {t('payment.amount')}
                        <SortIcon field="amount" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payment.paymentMethod')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('payment.reference')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('workOrders.customer')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <p className="text-gray-500">
                            {searchTerm || paymentMethodFilter !== 'all' 
                              ? 'No payments match your filters' 
                              : 'No payments found'
                            }
                          </p>
                          <button 
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Create Payment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.invoice?.invoiceNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.reference || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{payment.invoice?.customer?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{payment.invoice?.customer?.email || ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleView(payment)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View
                            </button>
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

      {/* Create Payment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Payment</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreatePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice *</label>
                  <select
                    value={createFormData.invoiceId}
                    onChange={(e) => setCreateFormData({...createFormData, invoiceId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select an invoice</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.customer?.name} (${invoice.totalAmount})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.amount}
                    onChange={(e) => setCreateFormData({...createFormData, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                  <input
                    type="date"
                    value={createFormData.paymentDate}
                    onChange={(e) => setCreateFormData({...createFormData, paymentDate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    value={createFormData.paymentMethod}
                    onChange={(e) => setCreateFormData({...createFormData, paymentMethod: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="CHECK">Check</option>
                    <option value="DIGITAL_WALLET">Digital Wallet</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference</label>
                  <input
                    type="text"
                    value={createFormData.reference}
                    onChange={(e) => setCreateFormData({...createFormData, reference: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Transaction reference"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={createFormData.notes}
                    onChange={(e) => setCreateFormData({...createFormData, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Additional notes"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.invoice?.invoiceNumber || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPayment.paymentDate)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.paymentMethod.replace('_', ' ')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.reference || 'No reference'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.invoice?.customer?.name || 'Unknown'}</p>
                  {selectedPayment.invoice?.customer?.email && (
                    <p className="text-sm text-gray-500">{selectedPayment.invoice.customer.email}</p>
                  )}
                </div>
                
                {selectedPayment.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  )
}
