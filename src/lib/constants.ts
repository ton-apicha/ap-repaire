// Application Constants
export const APP_NAME = 'AP Repair System'
export const APP_VERSION = '1.1.2'
export const APP_DESCRIPTION = 'Bitcoin Mining Machine Repair Management System'

// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007'
export const API_TIMEOUT = 30000 // 30 seconds

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  USER: 'USER',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.TECHNICIAN]: 'Technician',
  [USER_ROLES.USER]: 'User',
} as const

// Work Order Status
export const WORK_ORDER_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_PARTS: 'WAITING_PARTS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export const WORK_ORDER_STATUS_LABELS = {
  [WORK_ORDER_STATUS.PENDING]: 'Pending',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'In Progress',
  [WORK_ORDER_STATUS.WAITING_PARTS]: 'Waiting for Parts',
  [WORK_ORDER_STATUS.COMPLETED]: 'Completed',
  [WORK_ORDER_STATUS.CANCELLED]: 'Cancelled',
} as const

// Work Order Priority
export const WORK_ORDER_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const

export const WORK_ORDER_PRIORITY_LABELS = {
  [WORK_ORDER_PRIORITY.LOW]: 'Low',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'Medium',
  [WORK_ORDER_PRIORITY.HIGH]: 'High',
  [WORK_ORDER_PRIORITY.URGENT]: 'Urgent',
} as const

// Miner Brands
export const MINER_BRANDS = {
  BITMAIN: 'Bitmain',
  WHATSMINER: 'Whatsminer',
  AVALON: 'Avalon',
} as const

export const MINER_BRAND_LABELS = {
  [MINER_BRANDS.BITMAIN]: 'Bitmain',
  [MINER_BRANDS.WHATSMINER]: 'Whatsminer',
  [MINER_BRANDS.AVALON]: 'Avalon',
} as const

// Status Colors
export const STATUS_COLORS = {
  [WORK_ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [WORK_ORDER_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [WORK_ORDER_STATUS.WAITING_PARTS]: 'bg-orange-100 text-orange-800',
  [WORK_ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [WORK_ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
} as const

export const PRIORITY_COLORS = {
  [WORK_ORDER_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [WORK_ORDER_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
  [WORK_ORDER_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [WORK_ORDER_PRIORITY.URGENT]: 'bg-red-100 text-red-800',
} as const

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'bg-red-100 text-red-800',
  [USER_ROLES.MANAGER]: 'bg-blue-100 text-blue-800',
  [USER_ROLES.TECHNICIAN]: 'bg-green-100 text-green-800',
  [USER_ROLES.USER]: 'bg-gray-100 text-gray-800',
} as const

// Navigation
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'HomeIcon',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN, USER_ROLES.USER],
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: 'UsersIcon',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN],
  },
  {
    name: 'Technicians',
    href: '/technicians',
    icon: 'WrenchScrewdriverIcon',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    name: 'Work Orders',
    href: '/work-orders',
    icon: 'ClipboardDocumentListIcon',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN],
  },
  {
    name: 'Miners',
    href: '/miners',
    icon: 'CpuChipIcon',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: 'Cog6ToothIcon',
    roles: [USER_ROLES.ADMIN],
  },
] as const

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+66|66|0)[0-9]{8,9}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  SERIAL_NUMBER_MIN_LENGTH: 1,
  ISSUE_MIN_LENGTH: 10,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: 'yyyy-MM-dd HH:mm:ss',
} as const

// Currency
export const CURRENCY = {
  CODE: 'THB',
  SYMBOL: '฿',
  LOCALE: 'th-TH',
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5,
} as const

// Cache
export const CACHE_KEYS = {
  CUSTOMERS: 'customers',
  TECHNICIANS: 'technicians',
  WORK_ORDERS: 'work-orders',
  MINERS: 'miners',
  USERS: 'users',
  DASHBOARD_STATS: 'dashboard-stats',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  LANGUAGE: 'ap-repair-language',
  THEME: 'ap-repair-theme',
  USER_PREFERENCES: 'ap-repair-user-preferences',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Record created successfully.',
  UPDATED: 'Record updated successfully.',
  DELETED: 'Record deleted successfully.',
  SAVED: 'Changes saved successfully.',
  UPLOADED: 'File uploaded successfully.',
} as const
