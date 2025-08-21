export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
  trace?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  filePath?: string
  maxFileSize?: number
  maxFiles?: number
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = LogLevel[entry.level]
    const message = entry.message
    const context = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? ` | Error: ${entry.error.message}` : ''
    const trace = entry.trace ? ` | Trace: ${entry.trace}` : ''

    return `[${timestamp}] ${level}: ${message}${context}${error}${trace}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      trace: error?.stack,
    }

    const formattedMessage = this.formatMessage(entry)

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage)
          break
      }
    }

    // In production, you might want to send logs to a service like CloudWatch, Loggly, etc.
    if (process.env.NODE_ENV === 'production' && this.config.enableFile) {
      // Example: write to file or send to log service
      console.log('Production logging would happen here:', formattedMessage)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // Convenience methods for common logging patterns
  logAPIRequest(method: string, url: string, status: number, duration: number, context?: Record<string, unknown>): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    const message = `${method} ${url} - ${status} (${duration}ms)`
    this.log(level, message, context)
  }

  logDatabaseQuery(operation: string, table: string, duration: number, context?: Record<string, unknown>): void {
    const message = `DB ${operation} on ${table} (${duration}ms)`
    this.log(LogLevel.DEBUG, message, context)
  }

  logUserAction(userId: string, action: string, resource: string, context?: Record<string, unknown>): void {
    const message = `User ${userId} performed ${action} on ${resource}`
    this.log(LogLevel.INFO, message, context)
  }

  logSecurityEvent(event: string, userId?: string, context?: Record<string, unknown>): void {
    const message = `Security: ${event}${userId ? ` by user ${userId}` : ''}`
    this.log(LogLevel.WARN, message, context)
  }

  logPerformance(operation: string, duration: number, threshold: number = 1000, context?: Record<string, unknown>): void {
    const level = duration > threshold ? LogLevel.WARN : LogLevel.DEBUG
    const message = `Performance: ${operation} took ${duration}ms`
    this.log(level, message, context)
  }
}

// Create default logger instance
export const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
})

// Create specialized loggers
export const apiLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: true,
})

export const dbLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: true,
})

export const securityLogger = new Logger({
  level: LogLevel.WARN,
  enableConsole: true,
  enableFile: true,
})

export const performanceLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: true,
})

// Export Logger class for custom instances
export { Logger }

// Convenience functions
export function logAPI(method: string, url: string, status: number, duration: number, context?: Record<string, unknown>): void {
  apiLogger.logAPIRequest(method, url, status, duration, context)
}

export function logDB(operation: string, table: string, duration: number, context?: Record<string, unknown>): void {
  dbLogger.logDatabaseQuery(operation, table, duration, context)
}

export function logSecurity(event: string, userId?: string, context?: Record<string, unknown>): void {
  securityLogger.logSecurityEvent(event, userId, context)
}

export function logPerformance(operation: string, duration: number, threshold?: number, context?: Record<string, unknown>): void {
  performanceLogger.logPerformance(operation, duration, threshold, context)
}
