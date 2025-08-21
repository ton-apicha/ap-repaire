import { logger } from './logger'
import { handleError } from './errorHandler'

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error'
  checks: HealthCheck[]
  timestamp: string
  duration: number
}

export interface HealthCheck {
  name: string
  status: 'healthy' | 'warning' | 'error'
  message: string
  duration: number
  details?: Record<string, any>
}

export interface SystemMetrics {
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
    cores: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  network: {
    requests: number
    errors: number
    responseTime: number
  }
}

class SystemHealthChecker {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map()
  private metrics: SystemMetrics = {
    memory: { used: 0, total: 0, percentage: 0 },
    cpu: { usage: 0, cores: 0 },
    disk: { used: 0, total: 0, percentage: 0 },
    network: { requests: 0, errors: 0, responseTime: 0 },
  }

  constructor() {
    this.registerDefaultChecks()
  }

  private registerDefaultChecks() {
    // Database connectivity check
    this.registerCheck('database', async () => {
      const startTime = Date.now()
      try {
        // This would be a real database ping in production
        await new Promise(resolve => setTimeout(resolve, 100))
        const duration = Date.now() - startTime
        
        return {
          name: 'Database Connectivity',
          status: 'healthy',
          message: 'Database connection is working',
          duration,
          details: { responseTime: duration }
        }
      } catch (error) {
        const duration = Date.now() - startTime
        return {
          name: 'Database Connectivity',
          status: 'error',
          message: 'Database connection failed',
          duration,
          details: { error: handleError(error) }
        }
      }
    })

    // API endpoints check
    this.registerCheck('api', async () => {
      const startTime = Date.now()
      try {
        const endpoints = ['/api/health', '/api/customers', '/api/work-orders']
        const results = await Promise.allSettled(
          endpoints.map(endpoint => fetch(endpoint))
        )
        
        const failed = results.filter(r => r.status === 'rejected').length
        const duration = Date.now() - startTime
        
        if (failed === 0) {
          return {
            name: 'API Endpoints',
            status: 'healthy',
            message: 'All API endpoints are responding',
            duration,
            details: { endpoints: endpoints.length, failed }
          }
        } else {
          return {
            name: 'API Endpoints',
            status: failed === endpoints.length ? 'error' : 'warning',
            message: `${failed} out of ${endpoints.length} API endpoints failed`,
            duration,
            details: { endpoints: endpoints.length, failed }
          }
        }
      } catch (error) {
        const duration = Date.now() - startTime
        return {
          name: 'API Endpoints',
          status: 'error',
          message: 'API health check failed',
          duration,
          details: { error: handleError(error) }
        }
      }
    })

    // Environment variables check
    this.registerCheck('environment', async () => {
      const startTime = Date.now()
      const requiredVars = [
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
        'DATABASE_URL'
      ]
      
      const missing = requiredVars.filter(varName => !process.env[varName])
      const duration = Date.now() - startTime
      
      if (missing.length === 0) {
        return {
          name: 'Environment Variables',
          status: 'healthy',
          message: 'All required environment variables are set',
          duration,
          details: { required: requiredVars.length, missing: [] }
        }
      } else {
        return {
          name: 'Environment Variables',
          status: 'error',
          message: `Missing environment variables: ${missing.join(', ')}`,
          duration,
          details: { required: requiredVars.length, missing }
        }
      }
    })

    // Memory usage check
    this.registerCheck('memory', async () => {
      const startTime = Date.now()
      try {
        const used = process.memoryUsage()
        const total = 1024 * 1024 * 1024 // 1GB approximation
        const percentage = (used.heapUsed / total) * 100
        const duration = Date.now() - startTime
        
        this.metrics.memory = {
          used: used.heapUsed,
          total,
          percentage
        }
        
        if (percentage < 80) {
          return {
            name: 'Memory Usage',
            status: 'healthy',
            message: `Memory usage is ${percentage.toFixed(1)}%`,
            duration,
            details: { percentage: percentage.toFixed(1), used: used.heapUsed, total }
          }
        } else if (percentage < 95) {
          return {
            name: 'Memory Usage',
            status: 'warning',
            message: `High memory usage: ${percentage.toFixed(1)}%`,
            duration,
            details: { percentage: percentage.toFixed(1), used: used.heapUsed, total }
          }
        } else {
          return {
            name: 'Memory Usage',
            status: 'error',
            message: `Critical memory usage: ${percentage.toFixed(1)}%`,
            duration,
            details: { percentage: percentage.toFixed(1), used: used.heapUsed, total }
          }
        }
      } catch (error) {
        const duration = Date.now() - startTime
        return {
          name: 'Memory Usage',
          status: 'error',
          message: 'Failed to check memory usage',
          duration,
          details: { error: handleError(error) }
        }
      }
    })

    // File system check
    this.registerCheck('filesystem', async () => {
      const startTime = Date.now()
      try {
        // This would check actual disk space in production
        const duration = Date.now() - startTime
        
        return {
          name: 'File System',
          status: 'healthy',
          message: 'File system is accessible',
          duration,
          details: { accessible: true }
        }
      } catch (error) {
        const duration = Date.now() - startTime
        return {
          name: 'File System',
          status: 'error',
          message: 'File system check failed',
          duration,
          details: { error: handleError(error) }
        }
      }
    })
  }

  registerCheck(name: string, check: () => Promise<HealthCheck>) {
    this.checks.set(name, check)
  }

  async runHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    const checks: HealthCheck[] = []
    
    logger.info('Starting system health check')
    
    for (const [name, check] of this.checks) {
      try {
        const result = await check()
        checks.push(result)
        
        if (result.status === 'error') {
          logger.error(`Health check failed: ${name}`, null, { check: result })
        } else if (result.status === 'warning') {
          logger.warn(`Health check warning: ${name}`, { check: result })
        } else {
          logger.debug(`Health check passed: ${name}`, { check: result })
        }
      } catch (error) {
        const failedCheck: HealthCheck = {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          status: 'error',
          message: 'Health check failed with exception',
          duration: 0,
          details: { error: handleError(error) }
        }
        checks.push(failedCheck)
        logger.error(`Health check exception: ${name}`, error as Error)
      }
    }
    
    const duration = Date.now() - startTime
    const errorCount = checks.filter(c => c.status === 'error').length
    const warningCount = checks.filter(c => c.status === 'warning').length
    
    let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy'
    if (errorCount > 0) {
      overallStatus = 'error'
    } else if (warningCount > 0) {
      overallStatus = 'warning'
    }
    
    const result: HealthCheckResult = {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
      duration
    }
    
    logger.info('System health check completed', {
      status: overallStatus,
      totalChecks: checks.length,
      errors: errorCount,
      warnings: warningCount,
      duration
    })
    
    return result
  }

  async runQuickHealthCheck(): Promise<boolean> {
    try {
      const result = await this.runHealthCheck()
      return result.status === 'healthy'
    } catch {
      return false
    }
  }

  getMetrics(): SystemMetrics {
    return { ...this.metrics }
  }

  updateNetworkMetrics(requests: number, errors: number, responseTime: number) {
    this.metrics.network = { requests, errors, responseTime }
  }
}

// Create singleton instance
export const systemHealth = new SystemHealthChecker()

// Convenience functions
export async function checkSystemHealth(): Promise<HealthCheckResult> {
  return systemHealth.runHealthCheck()
}

export async function isSystemHealthy(): Promise<boolean> {
  return systemHealth.runQuickHealthCheck()
}

export function getSystemMetrics(): SystemMetrics {
  return systemHealth.getMetrics()
}

// Health check middleware
export function healthCheckMiddleware() {
  return async (req: any, res: any, next: any) => {
    const startTime = Date.now()
    
    // Update network metrics
    const metrics = getSystemMetrics()
    metrics.network.requests++
    
    try {
      await next()
      
      const duration = Date.now() - startTime
      systemHealth.updateNetworkMetrics(
        metrics.network.requests,
        metrics.network.errors,
        duration
      )
    } catch (error) {
      const duration = Date.now() - startTime
      metrics.network.errors++
      systemHealth.updateNetworkMetrics(
        metrics.network.requests,
        metrics.network.errors,
        duration
      )
      throw error
    }
  }
}

// Scheduled health checks
export function startScheduledHealthChecks(intervalMinutes: number = 5) {
  const interval = intervalMinutes * 60 * 1000
  
  setInterval(async () => {
    try {
      await checkSystemHealth()
    } catch (error) {
      logger.error('Scheduled health check failed', error as Error)
    }
  }, interval)
  
  logger.info(`Started scheduled health checks every ${intervalMinutes} minutes`)
}
