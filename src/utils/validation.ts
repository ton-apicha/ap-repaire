import { z } from 'zod'
import { ValidationError } from './errorHandler'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
export const urlSchema = z.string().url('Invalid URL format')

// User validation schemas
export const userSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'USER']),
  isActive: z.boolean().default(true),
})

export const userCreateSchema = userSchema.extend({
  password: passwordSchema,
})

export const userUpdateSchema = userSchema.partial().extend({
  password: passwordSchema.optional(),
})

// Customer validation schemas
export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().max(500, 'Address too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  taxId: z.string().max(20, 'Tax ID too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  isActive: z.boolean().default(true),
})

export const customerCreateSchema = customerSchema.extend({
  createdBy: z.string().uuid('Invalid user ID'),
})

export const customerUpdateSchema = customerSchema.partial()

// Technician validation schemas
export const technicianSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  specialization: z.string().max(100, 'Specialization too long').optional(),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience too high').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate cannot be negative').optional(),
  isActive: z.boolean().default(true),
})

export const technicianCreateSchema = technicianSchema.extend({
  createdBy: z.string().uuid('Invalid user ID'),
})

export const technicianUpdateSchema = technicianSchema.partial()

// Miner Model validation schemas
export const minerModelSchema = z.object({
  brand: z.string().min(1, 'Brand is required').max(50, 'Brand too long'),
  model: z.string().min(1, 'Model is required').max(100, 'Model too long'),
  series: z.string().max(50, 'Series too long').optional(),
  hashRate: z.string().min(1, 'Hash rate is required').max(50, 'Hash rate too long'),
  power: z.string().min(1, 'Power consumption is required').max(50, 'Power consumption too long'),
  description: z.string().max(500, 'Description too long').optional(),
  isActive: z.boolean().default(true),
})

export const minerModelCreateSchema = minerModelSchema
export const minerModelUpdateSchema = minerModelSchema.partial()

// Work Order validation schemas
export const workOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required').max(50, 'Order number too long'),
  customerId: z.string().uuid('Invalid customer ID'),
  technicianId: z.string().uuid('Invalid technician ID').optional(),
  minerModelId: z.string().uuid('Invalid miner model ID').optional(),
  serialNumber: z.string().max(100, 'Serial number too long').optional(),
  issue: z.string().min(10, 'Issue description must be at least 10 characters').max(1000, 'Issue description too long'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimatedHours: z.number().min(0, 'Estimated hours cannot be negative').max(1000, 'Estimated hours too high').optional(),
  actualHours: z.number().min(0, 'Actual hours cannot be negative').max(1000, 'Actual hours too high').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  completedAt: z.date().optional(),
})

export const workOrderCreateSchema = workOrderSchema.extend({
  createdBy: z.string().uuid('Invalid user ID'),
})

export const workOrderUpdateSchema = workOrderSchema.partial()

// Invoice validation schemas
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000, 'Quantity too high'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative').max(1000000, 'Unit price too high'),
  discount: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').optional(),
})

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number too long'),
  customerId: z.string().uuid('Invalid customer ID'),
  workOrderId: z.string().uuid('Invalid work order ID').optional(),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  tax: z.number().min(0, 'Tax cannot be negative').optional(),
  discount: z.number().min(0, 'Discount cannot be negative').optional(),
  total: z.number().min(0, 'Total cannot be negative'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  items: z.array(invoiceItemSchema).min(1, 'Invoice must have at least one item'),
})

export const invoiceCreateSchema = invoiceSchema.extend({
  createdBy: z.string().uuid('Invalid user ID'),
})

export const invoiceUpdateSchema = invoiceSchema.partial()

// Payment validation schemas
export const paymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'OTHER']),
  reference: z.string().max(100, 'Reference too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  paymentDate: z.date(),
})

export const paymentCreateSchema = paymentSchema
export const paymentUpdateSchema = paymentSchema.partial()

// API Response validation schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  })

// Pagination validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
})

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  filters: z.record(z.string(), z.any()).optional(),
})

// Generic validation function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = (error as any).errors?.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Validation failed'
      throw new ValidationError(`Validation failed: ${messages}`)
    }
    throw error
  }
}

// Safe validation function that returns null instead of throwing
export function validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data)
  } catch {
    return null
  }
}

// Partial validation for updates
export function validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
  try {
    return (schema as any).partial().parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = (error as any).errors?.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Validation failed'
      throw new ValidationError(`Validation failed: ${messages}`)
    }
    throw error
  }
}

// Type exports for use in other files
export type User = z.infer<typeof userSchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>

export type Customer = z.infer<typeof customerSchema>
export type CustomerCreate = z.infer<typeof customerCreateSchema>
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>

export type Technician = z.infer<typeof technicianSchema>
export type TechnicianCreate = z.infer<typeof technicianCreateSchema>
export type TechnicianUpdate = z.infer<typeof technicianUpdateSchema>

export type MinerModel = z.infer<typeof minerModelSchema>
export type MinerModelCreate = z.infer<typeof minerModelCreateSchema>
export type MinerModelUpdate = z.infer<typeof minerModelUpdateSchema>

export type WorkOrder = z.infer<typeof workOrderSchema>
export type WorkOrderCreate = z.infer<typeof workOrderCreateSchema>
export type WorkOrderUpdate = z.infer<typeof workOrderUpdateSchema>

export type Invoice = z.infer<typeof invoiceSchema>
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>

export type InvoiceItem = z.infer<typeof invoiceItemSchema>

export type Payment = z.infer<typeof paymentSchema>
export type PaymentCreate = z.infer<typeof paymentCreateSchema>
export type PaymentUpdate = z.infer<typeof paymentUpdateSchema>

export type Pagination = z.infer<typeof paginationSchema>
export type Search = z.infer<typeof searchSchema>
