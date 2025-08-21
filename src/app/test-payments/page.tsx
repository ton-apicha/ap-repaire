'use client'

import React, { useState, useEffect } from 'react'

export default function TestPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log('🔍 Test: Fetching payments...')
        setLoading(true)
        const response = await fetch('/api/payments', {
          credentials: 'include'
        })
        console.log('📡 Test: Response status:', response.status)
        const data = await response.json()
        console.log('📦 Test: Response data:', data)
        
        if (data.success) {
          console.log('✅ Test: Success, setting payments:', data.data)
          setPayments(data.data || [])
        } else {
          console.log('❌ Test: Error from API:', data.error)
          setError(data.error || 'Failed to fetch payments')
        }
      } catch (err) {
        console.log('💥 Test: Fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        console.log('🏁 Test: Setting loading to false')
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  console.log('🎯 Test: Component rendered, loading:', loading, 'error:', error, 'payments count:', payments.length)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Payments Page</h1>
      <div className="mb-4">
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error || 'None'}</p>
        <p>Payments count: {payments.length}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Payments:</h2>
        {payments.map((payment: any) => (
          <div key={payment.id} className="border p-2 mb-2">
            <p>ID: {payment.id}</p>
            <p>Amount: {payment.amount}</p>
            <p>Method: {payment.paymentMethod}</p>
            <p>Invoice: {payment.invoice?.invoiceNumber}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

