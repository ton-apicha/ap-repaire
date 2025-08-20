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
  static async request<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    options: {
      showSuccess?: boolean
      showError?: boolean
      successMessage?: string
      errorMessage?: string
    } = {}
  ): Promise<T | null> {
    const {
      showSuccess = true,
      showError = true,
      successMessage = 'Operation completed successfully',
      errorMessage = 'An error occurred',
    } = options

    try {
      const response = await requestFn()
      
      if (response.success && showSuccess) {
        toast.success(successMessage)
      }
      
      return response.data || null
    } catch (error) {
      if (showError) {
        const message = error instanceof Error ? error.message : errorMessage
        toast.error(message)
      }
      return null
    }
  }

  // Customers API
  static async getCustomers() {
    return this.request(
      () => apiClient.get('/api/customers'),
      { showError: true, errorMessage: 'Failed to fetch customers' }
    )
  }

  static async createCustomer(data: any) {
    return this.request(
      () => apiClient.post('/api/customers', data),
      { 
        showSuccess: true, 
        successMessage: 'Customer created successfully',
        showError: true, 
        errorMessage: 'Failed to create customer' 
      }
    )
  }

  static async updateCustomer(id: string, data: any) {
    return this.request(
      () => apiClient.put(`/api/customers/${id}`, data),
      { 
        showSuccess: true, 
        successMessage: 'Customer updated successfully',
        showError: true, 
        errorMessage: 'Failed to update customer' 
      }
    )
  }

  static async deleteCustomer(id: string) {
    return this.request(
      () => apiClient.delete(`/api/customers/${id}`),
      { 
        showSuccess: true, 
        successMessage: 'Customer deleted successfully',
        showError: true, 
        errorMessage: 'Failed to delete customer' 
      }
    )
  }

  // Technicians API
  static async getTechnicians() {
    return this.request(
      () => apiClient.get('/api/technicians'),
      { showError: true, errorMessage: 'Failed to fetch technicians' }
    )
  }

  static async createTechnician(data: any) {
    return this.request(
      () => apiClient.post('/api/technicians', data),
      { 
        showSuccess: true, 
        successMessage: 'Technician created successfully',
        showError: true, 
        errorMessage: 'Failed to create technician' 
      }
    )
  }

  static async updateTechnician(id: string, data: any) {
    return this.request(
      () => apiClient.put(`/api/technicians/${id}`, data),
      { 
        showSuccess: true, 
        successMessage: 'Technician updated successfully',
        showError: true, 
        errorMessage: 'Failed to update technician' 
      }
    )
  }

  static async deleteTechnician(id: string) {
    return this.request(
      () => apiClient.delete(`/api/technicians/${id}`),
      { 
        showSuccess: true, 
        successMessage: 'Technician deleted successfully',
        showError: true, 
        errorMessage: 'Failed to delete technician' 
      }
    )
  }

  // Work Orders API
  static async getWorkOrders() {
    return this.request(
      () => apiClient.get('/api/work-orders'),
      { showError: true, errorMessage: 'Failed to fetch work orders' }
    )
  }

  static async createWorkOrder(data: any) {
    return this.request(
      () => apiClient.post('/api/work-orders', data),
      { 
        showSuccess: true, 
        successMessage: 'Work order created successfully',
        showError: true, 
        errorMessage: 'Failed to create work order' 
      }
    )
  }

  static async updateWorkOrder(id: string, data: any) {
    return this.request(
      () => apiClient.put(`/api/work-orders/${id}`, data),
      { 
        showSuccess: true, 
        successMessage: 'Work order updated successfully',
        showError: true, 
        errorMessage: 'Failed to update work order' 
      }
    )
  }

  static async deleteWorkOrder(id: string) {
    return this.request(
      () => apiClient.delete(`/api/work-orders/${id}`),
      { 
        showSuccess: true, 
        successMessage: 'Work order deleted successfully',
        showError: true, 
        errorMessage: 'Failed to delete work order' 
      }
    )
  }

  // Miners API
  static async getMiners() {
    return this.request(
      () => apiClient.get('/api/miners'),
      { showError: true, errorMessage: 'Failed to fetch miners' }
    )
  }

  static async createMiner(data: any) {
    return this.request(
      () => apiClient.post('/api/miners', data),
      { 
        showSuccess: true, 
        successMessage: 'Miner model created successfully',
        showError: true, 
        errorMessage: 'Failed to create miner model' 
      }
    )
  }

  static async updateMiner(id: string, data: any) {
    return this.request(
      () => apiClient.put(`/api/miners/${id}`, data),
      { 
        showSuccess: true, 
        successMessage: 'Miner model updated successfully',
        showError: true, 
        errorMessage: 'Failed to update miner model' 
      }
    )
  }

  static async deleteMiner(id: string) {
    return this.request(
      () => apiClient.delete(`/api/miners/${id}`),
      { 
        showSuccess: true, 
        successMessage: 'Miner model deleted successfully',
        showError: true, 
        errorMessage: 'Failed to delete miner model' 
      }
    )
  }

  // Admin Users API
  static async getUsers() {
    return this.request(
      () => apiClient.get('/api/admin/users'),
      { showError: true, errorMessage: 'Failed to fetch users' }
    )
  }

  static async createUser(data: any) {
    return this.request(
      () => apiClient.post('/api/admin/users', data),
      { 
        showSuccess: true, 
        successMessage: 'User created successfully',
        showError: true, 
        errorMessage: 'Failed to create user' 
      }
    )
  }

  static async updateUser(id: string, data: any) {
    return this.request(
      () => apiClient.put(`/api/admin/users/${id}`, data),
      { 
        showSuccess: true, 
        successMessage: 'User updated successfully',
        showError: true, 
        errorMessage: 'Failed to update user' 
      }
    )
  }

  static async deleteUser(id: string) {
    return this.request(
      () => apiClient.delete(`/api/admin/users/${id}`),
      { 
        showSuccess: true, 
        successMessage: 'User deleted successfully',
        showError: true, 
        errorMessage: 'Failed to delete user' 
      }
    )
  }
}

// Export for use in components
export default ApiService
