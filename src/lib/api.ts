import { toast } from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// API wrapper with error handling and toast notifications
export class ApiService {
  // Customers API
  static async getCustomers(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/api/customers')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch customers'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async createCustomer(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/api/customers', data)
      toast.success('Customer created successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create customer'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async updateCustomer(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/api/customers/${id}`, data)
      toast.success('Customer updated successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async deleteCustomer(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/api/customers/${id}`)
      toast.success('Customer deleted successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Technicians API
  static async getTechnicians(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/api/technicians')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch technicians'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async createTechnician(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/api/technicians', data)
      toast.success('Technician created successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create technician'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async updateTechnician(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/api/technicians/${id}`, data)
      toast.success('Technician updated successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update technician'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async deleteTechnician(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/api/technicians/${id}`)
      toast.success('Technician deleted successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete technician'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Work Orders API
  static async getWorkOrders(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/api/work-orders')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch work orders'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async createWorkOrder(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/api/work-orders', data)
      toast.success('Work order created successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create work order'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async updateWorkOrder(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/api/work-orders/${id}`, data)
      toast.success('Work order updated successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update work order'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async deleteWorkOrder(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/api/work-orders/${id}`)
      toast.success('Work order deleted successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete work order'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Miners API
  static async getMiners(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/api/miners')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch miners'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async createMiner(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/api/miners', data)
      toast.success('Miner created successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create miner'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async updateMiner(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/api/miners/${id}`, data)
      toast.success('Miner updated successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update miner'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async deleteMiner(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/api/miners/${id}`)
      toast.success('Miner deleted successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete miner'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Users API
  static async getUsers(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/api/admin/users')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async createUser(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/api/admin/users', data)
      toast.success('User created successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/api/admin/users/${id}`, data)
      toast.success('User updated successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete(`/api/admin/users/${id}`)
      toast.success('User deleted successfully')
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user'
      toast.error(message)
      return { success: false, error: message }
    }
  }
}

// Export for use in components
export default ApiService
