import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import ApiService, { ApiResponse } from '@/lib/api'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  showSuccess?: boolean
  showError?: boolean
  successMessage?: string
  errorMessage?: string
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (requestFn: () => Promise<ApiResponse<T>>) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await requestFn()
        
        if (response.success) {
          setState(prev => ({ ...prev, data: response.data || null, loading: false }))
          
          if (options.showSuccess !== false) {
            toast.success(options.successMessage || 'Operation completed successfully')
          }
          
          if (response.data) {
            options.onSuccess?.(response.data)
          }
        } else {
          const errorMessage = response.error || options.errorMessage || 'An error occurred'
          setState(prev => ({ ...prev, error: errorMessage, loading: false }))
          
          if (options.showError !== false) {
            toast.error(errorMessage)
          }
          
          options.onError?.(errorMessage)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState(prev => ({ ...prev, error: errorMessage, loading: false }))
        
        if (options.showError !== false) {
          toast.error(errorMessage)
        }
        
        options.onError?.(errorMessage)
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specific API hooks
export function useCustomers() {
  const { data: customers, loading, error, execute, reset } = useApi()

  const fetchCustomers = useCallback(() => {
    return execute(() => ApiService.getCustomers())
  }, [execute])

  const createCustomer = useCallback((data: any) => {
    return execute(() => ApiService.createCustomer(data))
  }, [execute])

  const updateCustomer = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateCustomer(id, data))
  }, [execute])

  const deleteCustomer = useCallback((id: string) => {
    return execute(() => ApiService.deleteCustomer(id))
  }, [execute])

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    reset,
  }
}

export function useTechnicians() {
  const { data: technicians, loading, error, execute, reset } = useApi()

  const fetchTechnicians = useCallback(() => {
    return execute(() => ApiService.getTechnicians())
  }, [execute])

  const createTechnician = useCallback((data: any) => {
    return execute(() => ApiService.createTechnician(data))
  }, [execute])

  const updateTechnician = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateTechnician(id, data))
  }, [execute])

  const deleteTechnician = useCallback((id: string) => {
    return execute(() => ApiService.deleteTechnician(id))
  }, [execute])

  return {
    technicians,
    loading,
    error,
    fetchTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    reset,
  }
}

export function useWorkOrders() {
  const { data: workOrders, loading, error, execute, reset } = useApi()

  const fetchWorkOrders = useCallback(() => {
    return execute(() => ApiService.getWorkOrders())
  }, [execute])

  const createWorkOrder = useCallback((data: any) => {
    return execute(() => ApiService.createWorkOrder(data))
  }, [execute])

  const updateWorkOrder = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateWorkOrder(id, data))
  }, [execute])

  const deleteWorkOrder = useCallback((id: string) => {
    return execute(() => ApiService.deleteWorkOrder(id))
  }, [execute])

  return {
    workOrders,
    loading,
    error,
    fetchWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    reset,
  }
}

export function useMiners() {
  const { data: miners, loading, error, execute, reset } = useApi()

  const fetchMiners = useCallback(() => {
    return execute(() => ApiService.getMiners())
  }, [execute])

  const createMiner = useCallback((data: any) => {
    return execute(() => ApiService.createMiner(data))
  }, [execute])

  const updateMiner = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateMiner(id, data))
  }, [execute])

  const deleteMiner = useCallback((id: string) => {
    return execute(() => ApiService.deleteMiner(id))
  }, [execute])

  return {
    miners,
    loading,
    error,
    fetchMiners,
    createMiner,
    updateMiner,
    deleteMiner,
    reset,
  }
}

export function useUsers() {
  const { data: users, loading, error, execute, reset } = useApi()

  const fetchUsers = useCallback(() => {
    return execute(() => ApiService.getUsers())
  }, [execute])

  const createUser = useCallback((data: any) => {
    return execute(() => ApiService.createUser(data))
  }, [execute])

  const updateUser = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateUser(id, data))
  }, [execute])

  const deleteUser = useCallback((id: string) => {
    return execute(() => ApiService.deleteUser(id))
  }, [execute])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    reset,
  }
}

// Invoice hooks
export function useInvoices() {
  const { data: invoices, loading, error, execute, reset } = useApi()

  const fetchInvoices = useCallback(() => {
    return execute(() => ApiService.getInvoices())
  }, [execute])

  const createInvoice = useCallback((data: any) => {
    return execute(() => ApiService.createInvoice(data))
  }, [execute])

  const updateInvoice = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updateInvoice(id, data))
  }, [execute])

  const deleteInvoice = useCallback((id: string) => {
    return execute(() => ApiService.deleteInvoice(id))
  }, [execute])

  const sendInvoice = useCallback((id: string) => {
    return execute(() => ApiService.sendInvoice(id))
  }, [execute])

  const generateInvoicePDF = useCallback((id: string) => {
    return execute(() => ApiService.generateInvoicePDF(id))
  }, [execute])

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    generateInvoicePDF,
    reset,
  }
}

export function useInvoice(id?: string) {
  const { data: invoice, loading, error, execute, reset } = useApi()

  const fetchInvoice = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.getInvoice(id))
  }, [execute, id])

  const updateInvoice = useCallback((data: any) => {
    if (!id) return
    return execute(() => ApiService.updateInvoice(id, data))
  }, [execute, id])

  const deleteInvoice = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.deleteInvoice(id))
  }, [execute, id])

  const sendInvoice = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.sendInvoice(id))
  }, [execute, id])

  const generateInvoicePDF = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.generateInvoicePDF(id))
  }, [execute, id])

  return {
    invoice,
    loading,
    error,
    fetchInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    generateInvoicePDF,
    reset,
  }
}

// Payment hooks
export function usePayments() {
  const { data: payments, loading, error, execute, reset } = useApi()

  const fetchPayments = useCallback(() => {
    return execute(() => ApiService.getPayments())
  }, [execute])

  const createPayment = useCallback((data: any) => {
    return execute(() => ApiService.createPayment(data))
  }, [execute])

  const updatePayment = useCallback((id: string, data: any) => {
    return execute(() => ApiService.updatePayment(id, data))
  }, [execute])

  const deletePayment = useCallback((id: string) => {
    return execute(() => ApiService.deletePayment(id))
  }, [execute])

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
    reset,
  }
}

export function usePayment(id?: string) {
  const { data: payment, loading, error, execute, reset } = useApi()

  const fetchPayment = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.getPayment(id))
  }, [execute, id])

  const updatePayment = useCallback((data: any) => {
    if (!id) return
    return execute(() => ApiService.updatePayment(id, data))
  }, [execute, id])

  const deletePayment = useCallback(() => {
    if (!id) return
    return execute(() => ApiService.deletePayment(id))
  }, [execute, id])

  return {
    payment,
    loading,
    error,
    fetchPayment,
    updatePayment,
    deletePayment,
    reset,
  }
}
