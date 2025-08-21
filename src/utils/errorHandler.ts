export interface ErrorInfo {
  message: string
  code?: string
  status?: number
  timestamp: string
  stack?: string
  context?: Record<string, unknown>
}

export class AppError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly timestamp: string
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status: number = 500,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.timestamp = new Date().toISOString()
    this.context = context
  }

  toJSON(): ErrorInfo {
    return {
      message: this.message,
      code: this.code,
      status: this.status,
      timestamp: this.timestamp,
      stack: this.stack,
      context: this.context,
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', 401, context)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, unknown>) {
    super(message, 'AUTHORIZATION_ERROR', 403, context)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: Record<string, unknown>) {
    super(message, 'NOT_FOUND_ERROR', 404, context)
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'DATABASE_ERROR', 500, context)
    this.name = 'DatabaseError'
  }
}

export class APIError extends AppError {
  constructor(message: string, status: number = 500, context?: Record<string, unknown>) {
    super(message, 'API_ERROR', status, context)
    this.name = 'APIError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function handleError(error: unknown): ErrorInfo {
  if (isAppError(error)) {
    return error.toJSON()
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: 500,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    }
  }

  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
    status: 500,
    timestamp: new Date().toISOString(),
  }
}

export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorInfo = handleError(error)
  
  console.error('🚨 Error occurred:', {
    ...errorInfo,
    context,
  })

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context })
    console.error('Production error logging would happen here')
  }
}

export function createErrorHandler(context?: Record<string, unknown>) {
  return (error: unknown) => {
    logError(error, context)
    return handleError(error)
  }
}

export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`)
  }
  return value
}

export function validateString(
  value: unknown,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`)
  }

  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters`)
  }

  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters`)
  }

  return value
}

export function validateEmail(email: unknown): string {
  const emailString = validateString(email, 'Email')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(emailString)) {
    throw new ValidationError('Invalid email format')
  }

  return emailString
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }

  if (min !== undefined && value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`)
  }

  if (max !== undefined && value > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`)
  }

  return value
}

export function validateArray<T>(
  value: unknown,
  fieldName: string,
  validator?: (item: unknown) => T
): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`)
  }

  if (validator) {
    return value.map((item, index) => {
      try {
        return validator(item)
      } catch (error) {
        throw new ValidationError(`${fieldName}[${index}]: ${error instanceof Error ? error.message : 'Invalid item'}`)
      }
    })
  }

  return value as T[]
}

export function validateObject<T>(
  value: unknown,
  fieldName: string,
  schema: Record<string, (val: unknown) => any>
): T {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError(`${fieldName} must be an object`)
  }

  const result: Record<string, any> = {}
  const valueObj = value as Record<string, unknown>

  for (const [key, validator] of Object.entries(schema)) {
    try {
      result[key] = validator(valueObj[key])
    } catch (error) {
      throw new ValidationError(`${fieldName}.${key}: ${error instanceof Error ? error.message : 'Invalid value'}`)
    }
  }

  return result as T
}
