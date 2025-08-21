import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextRouter } from 'next/router'
import { Session } from 'next-auth'

// Mock Next.js router
export const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
}

// Mock session
export const mockSession: Session = {
  user: {
    id: '1',
    email: 'admin@aprepair.com',
    name: 'Admin User',
    role: 'ADMIN',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockCustomer = (overrides = {}) => ({
  id: '1',
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '+1234567890',
  address: '123 Test St',
  company: 'Test Company',
  taxId: '123456789',
  notes: 'Test notes',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '1',
  ...overrides,
})

export const createMockTechnician = (overrides = {}) => ({
  id: '1',
  name: 'Test Technician',
  email: 'tech@example.com',
  phone: '+1234567890',
  specialization: 'Mining Equipment',
  experience: 5,
  hourlyRate: 50,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '1',
  ...overrides,
})

export const createMockMinerModel = (overrides = {}) => ({
  id: '1',
  brand: 'Bitmain',
  model: 'Antminer S19',
  series: 'S19',
  hashRate: '95 TH/s',
  power: '3250W',
  description: 'Efficient Bitcoin miner',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockWorkOrder = (overrides = {}) => ({
  id: '1',
  orderNumber: 'WO-001',
  customerId: '1',
  technicianId: '1',
  minerModelId: '1',
  serialNumber: 'SN123456',
  issue: 'Fan not working properly',
  status: 'PENDING' as const,
  priority: 'MEDIUM' as const,
  estimatedHours: 2,
  actualHours: null,
  notes: 'Test work order',
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '1',
  customer: createMockCustomer(),
  technician: createMockTechnician(),
  minerModel: createMockMinerModel(),
  ...overrides,
})

export const createMockInvoice = (overrides = {}) => ({
  id: '1',
  invoiceNumber: 'INV-001',
  customerId: '1',
  workOrderId: '1',
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  status: 'DRAFT' as const,
  subtotal: 100,
  tax: 7,
  discount: 0,
  total: 107,
  notes: 'Test invoice',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '1',
  customer: createMockCustomer(),
  workOrder: createMockWorkOrder(),
  items: [
    {
      id: '1',
      description: 'Fan replacement',
      quantity: 1,
      unitPrice: 50,
      discount: 0,
      total: 50,
    },
    {
      id: '2',
      description: 'Labor',
      quantity: 2,
      unitPrice: 25,
      discount: 0,
      total: 50,
    },
  ],
  ...overrides,
})

export const createMockPayment = (overrides = {}) => ({
  id: '1',
  invoiceId: '1',
  amount: 107,
  method: 'BANK_TRANSFER' as const,
  reference: 'REF123',
  notes: 'Test payment',
  paymentDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  invoice: createMockInvoice(),
  ...overrides,
})

// Custom render function with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    router = mockRouter,
    session = mockSession,
    ...renderOptions
  } = {}
) {
  // Add any providers here if needed
  return render(ui, {
    ...renderOptions,
  })
}

// Custom test utilities
export const testUtils = {
  // Wait for element to be in document
  waitForElement: (selector: string) => {
    return new Promise<void>((resolve) => {
      const checkElement = () => {
        const element = document.querySelector(selector)
        if (element) {
          resolve()
        } else {
          setTimeout(checkElement, 100)
        }
      }
      checkElement()
    })
  },

  // Wait for element to be removed
  waitForElementToBeRemoved: (selector: string) => {
    return new Promise<void>((resolve) => {
      const checkElement = () => {
        const element = document.querySelector(selector)
        if (!element) {
          resolve()
        } else {
          setTimeout(checkElement, 100)
        }
      }
      checkElement()
    })
  },

  // Wait for text to appear
  waitForText: (text: string) => {
    return new Promise<void>((resolve) => {
      const checkText = () => {
        const element = document.querySelector(`*:contains("${text}")`)
        if (element) {
          resolve()
        } else {
          setTimeout(checkText, 100)
        }
      }
      checkText()
    })
  },

  // Wait for text to disappear
  waitForTextToDisappear: (text: string) => {
    return new Promise<void>((resolve) => {
      const checkText = () => {
        const element = document.querySelector(`*:contains("${text}")`)
        if (!element) {
          resolve()
        } else {
          setTimeout(checkText, 100)
        }
      }
      checkText()
    })
  },

  // Fill form fields
  fillForm: async (fields: Record<string, string>) => {
    const user = userEvent.setup()
    
    for (const [name, value] of Object.entries(fields)) {
      const field = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`) as HTMLInputElement
      if (field) {
        await user.clear(field)
        await user.type(field, value)
      }
    }
  },

  // Submit form
  submitForm: async () => {
    const user = userEvent.setup()
    const submitButton = document.querySelector('button[type="submit"], button:contains("Submit"), button:contains("Save"), button:contains("Create"), button:contains("Update")') as HTMLButtonElement
    if (submitButton) {
      await user.click(submitButton)
    }
  },

  // Select option from dropdown
  selectOption: async (label: string, option: string) => {
    const user = userEvent.setup()
    const select = document.querySelector(`select[aria-label*="${label}"], select[name*="${label}"]`) as HTMLSelectElement
    if (select) {
      await user.selectOptions(select, option)
    }
  },

  // Check checkbox
  checkCheckbox: async (label: string) => {
    const user = userEvent.setup()
    const checkbox = document.querySelector(`input[type="checkbox"][aria-label*="${label}"]`) as HTMLInputElement
    if (checkbox) {
      await user.click(checkbox)
    }
  },

  // Click button by text
  clickButton: async (text: string) => {
    const user = userEvent.setup()
    const button = document.querySelector(`button:contains("${text}")`) as HTMLButtonElement
    if (button) {
      await user.click(button)
    }
  },

  // Click link by text
  clickLink: async (text: string) => {
    const user = userEvent.setup()
    const link = document.querySelector(`a:contains("${text}")`) as HTMLAnchorElement
    if (link) {
      await user.click(link)
    }
  },

  // Search for text
  searchFor: async (text: string) => {
    const user = userEvent.setup()
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[aria-label*="search"]') as HTMLInputElement
    if (searchInput) {
      await user.clear(searchInput)
      await user.type(searchInput, text)
    }
  },

  // Sort by column
  sortByColumn: async (columnName: string) => {
    const user = userEvent.setup()
    const columnHeader = document.querySelector(`th:contains("${columnName}")`) as HTMLTableCellElement
    if (columnHeader) {
      await user.click(columnHeader)
    }
  },

  // Filter by value
  filterBy: async (filterName: string, value: string) => {
    const user = userEvent.setup()
    const filterSelect = document.querySelector(`select[aria-label*="${filterName}"]`) as HTMLSelectElement
    if (filterSelect) {
      await user.selectOptions(filterSelect, value)
    }
  },
}

// Mock API responses
export const mockAPIResponses = {
  success: <T>(data: T) => ({ success: true, data }),
  error: (message: string) => ({ success: false, error: message }),
  list: <T>(items: T[]) => ({ success: true, data: items }),
  paginated: <T>(items: T[], total: number, page: number, limit: number) => ({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  }),
}

// Mock fetch function
export const mockFetch = (response: any) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(response),
  })
}

// Mock fetch with error
export const mockFetchError = (status: number, message: string) => {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ error: message }),
  })
}

// Test constants
export const TEST_CONSTANTS = {
  TIMEOUTS: {
    SHORT: 1000,
    MEDIUM: 3000,
    LONG: 5000,
  },
  DELAYS: {
    SHORT: 100,
    MEDIUM: 500,
    LONG: 1000,
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 100,
}

// Test helpers
export const testHelpers = {
  // Retry function
  retry: async <T>(
    fn: () => Promise<T>,
    attempts: number = TEST_CONSTANTS.RETRY_ATTEMPTS,
    delay: number = TEST_CONSTANTS.RETRY_DELAY
  ): Promise<T> => {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === attempts - 1) throw error
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Retry failed')
  },

  // Wait for condition
  waitForCondition: async (
    condition: () => boolean,
    timeout: number = TEST_CONSTANTS.TIMEOUTS.MEDIUM
  ): Promise<void> => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      if (condition()) return
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error('Condition not met within timeout')
  },

  // Mock console methods
  mockConsole: () => {
    const originalConsole = { ...console }
    
    beforeEach(() => {
      console.log = jest.fn()
      console.warn = jest.fn()
      console.error = jest.fn()
      console.info = jest.fn()
      console.debug = jest.fn()
    })
    
    afterEach(() => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
      console.info = originalConsole.info
      console.debug = originalConsole.debug
    })
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {}
    
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn((key: string) => store[key] || null),
          setItem: jest.fn((key: string, value: string) => {
            store[key] = value
          }),
          removeItem: jest.fn((key: string) => {
            delete store[key]
          }),
          clear: jest.fn(() => {
            Object.keys(store).forEach(key => delete store[key])
          }),
        },
        writable: true,
      })
    })
  },

  // Mock sessionStorage
  mockSessionStorage: () => {
    const store: Record<string, string> = {}
    
    beforeEach(() => {
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn((key: string) => store[key] || null),
          setItem: jest.fn((key: string, value: string) => {
            store[key] = value
          }),
          removeItem: jest.fn((key: string) => {
            delete store[key]
          }),
          clear: jest.fn(() => {
            Object.keys(store).forEach(key => delete store[key])
          }),
        },
        writable: true,
      })
    })
  },
}
