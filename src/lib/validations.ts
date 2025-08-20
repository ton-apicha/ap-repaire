import { z } from 'zod'

// User validation schemas
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Customer validation schemas
export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
})

// Technician validation schemas
export const technicianSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  speciality: z.string().optional(),
  hourlyRate: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Miner Model validation schemas
export const minerModelSchema = z.object({
  id: z.string().optional(),
  brand: z.enum(['Bitmain', 'Whatsminer', 'Avalon']),
  model: z.string().min(1, 'Model is required'),
  series: z.string().optional(),
  hashRate: z.string().min(1, 'Hash rate is required'),
  power: z.string().min(1, 'Power consumption is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Work Order validation schemas
export const workOrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  technicianId: z.string().min(1, 'Technician is required'),
  minerModelId: z.string().min(1, 'Miner model is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  issue: z.string().min(10, 'Issue description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  estimatedCost: z.number().min(0, 'Estimated cost must be positive').optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate
  }
  return true
}, {
  message: "Start date must be before end date",
  path: ["endDate"],
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

// Form schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Export types
export type User = z.infer<typeof userSchema>
export type Customer = z.infer<typeof customerSchema>
export type Technician = z.infer<typeof technicianSchema>
export type MinerModel = z.infer<typeof minerModelSchema>
export type WorkOrder = z.infer<typeof workOrderSchema>
export type SearchParams = z.infer<typeof searchSchema>
export type DateRange = z.infer<typeof dateRangeSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>
export type LoginForm = z.infer<typeof loginSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
