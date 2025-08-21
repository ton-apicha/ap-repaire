import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date, locale = 'th-TH'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date, locale = 'th-TH'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+66|66|0)[0-9]{8,9}$/
  return phoneRegex.test(phone)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }
  document.body.removeChild(textArea)
  return Promise.resolve()
}

/**
 * Generate work order ID based on current date and work number
 * Format: YYMMDD + 3-digit work number (e.g., 250821001)
 * @param workNumber - The work order number for the day
 * @returns Formatted work order ID
 */
export function generateWorkId(workNumber: number): string {
  // Get the current date
  const today = new Date()

  // Format the date as YYMMDD
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`

  // Format the work number as a 3-digit string with leading zeros
  const workNumberPart = workNumber.toString().padStart(3, '0')

  // Combine the parts to form the final ID
  const workId = `${datePart}${workNumberPart}`

  return workId
}

/**
 * Get today's date in YYYY-MM-DD format for comparison
 * @returns Today's date string
 */
export function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Count work orders for a specific date
 * @param workOrders - Array of work orders
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Number of work orders for the specified date
 */
export function countWorkOrdersForDate(workOrders: any[], dateString: string): number {
  return workOrders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
    return orderDate === dateString
  }).length
}

/**
 * Generate invoice number based on current date and invoice number
 * Format: INV + YYMMDD + 3-digit invoice number (e.g., INV250821001)
 * @param invoiceNumber - The invoice number for the day
 * @returns Formatted invoice number
 */
export function generateInvoiceNumber(invoiceNumber: number): string {
  // Get the current date
  const today = new Date()

  // Format the date as YYMMDD
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`

  // Format the invoice number as a 3-digit string with leading zeros
  const invoiceNumberPart = invoiceNumber.toString().padStart(3, '0')

  // Combine the parts to form the final invoice number
  const invoiceId = `INV${datePart}${invoiceNumberPart}`

  return invoiceId
}

/**
 * Calculate invoice totals
 * @param items - Array of invoice items
 * @param taxRate - Tax rate as percentage (0-100)
 * @param discountAmount - Discount amount
 * @returns Object with calculated totals
 */
export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number = 0,
  discountAmount: number = 0
) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)

  const taxAmount = (subtotal * taxRate) / 100
  const totalBeforeDiscount = subtotal + taxAmount
  const totalAmount = totalBeforeDiscount - discountAmount

  return {
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount: Math.max(0, totalAmount), // Ensure total is not negative
  }
}

/**
 * Calculate invoice balance
 * @param totalAmount - Total invoice amount
 * @param paidAmount - Amount already paid
 * @returns Balance amount
 */
export function calculateInvoiceBalance(totalAmount: number, paidAmount: number): number {
  return Math.max(0, totalAmount - paidAmount)
}

/**
 * Get invoice status based on due date and payment status
 * @param dueDate - Invoice due date
 * @param totalAmount - Total invoice amount
 * @param paidAmount - Amount already paid
 * @param currentStatus - Current invoice status
 * @returns Updated invoice status
 */
export function getInvoiceStatus(
  dueDate: Date,
  totalAmount: number,
  paidAmount: number,
  currentStatus: string
): string {
  const today = new Date()
  const isOverdue = today > dueDate
  const balance = calculateInvoiceBalance(totalAmount, paidAmount)

  if (currentStatus === 'CANCELLED') return 'CANCELLED'
  if (balance === 0) return 'PAID'
  if (isOverdue) return 'OVERDUE'
  if (paidAmount > 0 && balance > 0) return 'PARTIAL'
  if (currentStatus === 'SENT') return 'SENT'
  return 'DRAFT'
}



/**
 * Get payment method display name
 * @param method - Payment method enum value
 * @returns Display name
 */
export function getPaymentMethodDisplayName(method: string): string {
  const methodNames: Record<string, string> = {
    CASH: 'เงินสด',
    BANK_TRANSFER: 'โอนเงิน',
    CREDIT_CARD: 'บัตรเครดิต',
    DEBIT_CARD: 'บัตรเดบิต',
    CHECK: 'เช็ค',
    DIGITAL_WALLET: 'กระเป๋าเงินดิจิทัล',
    OTHER: 'อื่นๆ',
  }
  return methodNames[method] || method
}

/**
 * Get invoice status display name and color
 * @param status - Invoice status
 * @returns Object with display name and color
 */
export function getInvoiceStatusDisplay(status: string): { name: string; color: string } {
  const statusConfig: Record<string, { name: string; color: string }> = {
    DRAFT: { name: 'ร่าง', color: 'bg-gray-100 text-gray-800' },
    SENT: { name: 'ส่งแล้ว', color: 'bg-blue-100 text-blue-800' },
    PAID: { name: 'ชำระแล้ว', color: 'bg-green-100 text-green-800' },
    OVERDUE: { name: 'เกินกำหนด', color: 'bg-red-100 text-red-800' },
    CANCELLED: { name: 'ยกเลิก', color: 'bg-gray-100 text-gray-800' },
    PARTIAL: { name: 'ชำระบางส่วน', color: 'bg-yellow-100 text-yellow-800' },
  }
  return statusConfig[status] || { name: status, color: 'bg-gray-100 text-gray-800' }
}
