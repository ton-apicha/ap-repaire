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
          
          options.onSuccess?.(response.data)
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
