'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePayments } from '@/hooks/useApi'
import { formatCurrency, getPaymentMethodDisplayName } from '@/lib/utils'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { th, enUS, zhCN } from 'date-fns/locale'

const dateLocales = { th, en: enUS, zh: zhCN }

export default function PaymentsPage() {
  const { t, language } = useLanguage()
  const { payments, loading, error, fetchPayments } = usePayments()
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const [sortField, setSortField] = useState('paymentDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedPayments = React.useMemo(() => {
    let filtered = payments || []

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((payment: any) =>
        payment.invoice?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply payment method filter
    if (paymentMethodFilter && paymentMethodFilter !== 'all') {
      filtered = filtered.filter((payment: any) => payment.paymentMethod === paymentMethodFilter)
    }

    // Apply sorting
    filtered.sort((a: any, b: any) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle nested object sorting
      if (sortField === 'invoice') {
        aValue = a.invoice?.invoiceNumber || ''
        bValue = b.invoice?.invoiceNumber || ''
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
  }, [payments, searchTerm, paymentMethodFilter, sortField, sortDirection])

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
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('payment.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('payment.payments')}
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              {t('payment.createPayment')}
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Payment Method Filter */}
              <div className="w-full sm:w-48">
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('payment.paymentMethod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="CASH">{t('payment.cash')}</SelectItem>
                    <SelectItem value="BANK_TRANSFER">{t('payment.bankTransfer')}</SelectItem>
                    <SelectItem value="CREDIT_CARD">{t('payment.creditCard')}</SelectItem>
                    <SelectItem value="DEBIT_CARD">{t('payment.debitCard')}</SelectItem>
                    <SelectItem value="CHECK">{t('payment.check')}</SelectItem>
                    <SelectItem value="DIGITAL_WALLET">{t('payment.digitalWallet')}</SelectItem>
                    <SelectItem value="OTHER">{t('payment.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSort('invoice')}
                    >
                      {t('invoice.invoiceNumber')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSort('paymentDate')}
                    >
                      {t('payment.paymentDate')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSort('amount')}
                    >
                      {t('payment.amount')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSort('paymentMethod')}
                    >
                      {t('payment.paymentMethod')}
                    </TableHead>
                    <TableHead>{t('payment.reference')}</TableHead>
                    <TableHead>{t('customers.title')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <CreditCardIcon className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">{t('payment.noPayments')}</p>
                          <Button variant="outline" size="sm">
                            {t('payment.createPayment')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedPayments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.invoice?.invoiceNumber}
                        </TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getPaymentMethodDisplayName(payment.paymentMethod)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.reference || '-'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.invoice?.customer?.name}</div>
                            <div className="text-sm text-gray-500">{payment.invoice?.customer?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              {t('common.view')}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t('common.edit')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Layout>
  )
}
