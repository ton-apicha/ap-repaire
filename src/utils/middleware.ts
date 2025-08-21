import { NextRequest, NextResponse } from 'next/server'
import { logger, logAPI, logSecurity } from './logger'
import { handleError, AuthenticationError, AuthorizationError } from './errorHandler'

export interface MiddlewareConfig {
  enableLogging: boolean
  enableSecurity: boolean
  enableRateLimit: boolean
  rateLimitWindow: number
  rateLimitMax: number
}

const defaultConfig: MiddlewareConfig = {
  enableLogging: true,
  enableSecurity: true,
  enableRateLimit: true,
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // 100 requests per window
}

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function createMiddleware(config: Partial<MiddlewareConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  return async function middleware(request: NextRequest) {
    const startTime = Date.now()
    const { pathname, search } = request.nextUrl
    const method = request.method
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown'

    try {
      // Rate limiting
      if (finalConfig.enableRateLimit) {
        const rateLimitResult = await checkRateLimit(ip, finalConfig)
        if (!rateLimitResult.allowed) {
          logSecurity('Rate limit exceeded', undefined, { ip, pathname, method })
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
          )
        }
      }

      // Security checks
      if (finalConfig.enableSecurity) {
        const securityResult = await checkSecurity(request)
        if (!securityResult.allowed) {
          logSecurity('Security check failed', undefined, { 
            ip, 
            pathname, 
            method, 
            reason: securityResult.reason 
          })
          return NextResponse.json(
            { success: false, error: securityResult.reason },
            { status: securityResult.status }
          )
        }
      }

      // Continue to the next middleware or handler
      const response = NextResponse.next()

      // Add security headers
      if (finalConfig.enableSecurity) {
        addSecurityHeaders(response)
      }

      // Logging
      if (finalConfig.enableLogging) {
        const duration = Date.now() - startTime
        logAPI(method, `${pathname}${search}`, 200, duration, {
          ip,
          userAgent,
          pathname,
        })
      }

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      const errorInfo = handleError(error)
      
      logger.error('Middleware error', error as Error, {
        ip,
        pathname,
        method,
        duration,
        error: errorInfo,
      })

      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

async function checkRateLimit(ip: string, config: MiddlewareConfig): Promise<{ allowed: boolean }> {
  const now = Date.now()
  const key = `rate_limit:${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.rateLimitWindow,
    })
    return { allowed: true }
  }

  if (record.count >= config.rateLimitMax) {
    return { allowed: false }
  }

  // Increment count
  record.count++
  rateLimitStore.set(key, record)
  return { allowed: true }
}

async function checkSecurity(request: NextRequest): Promise<{ 
  allowed: boolean; reason?: string; status?: number 
}> {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''

  // Block suspicious user agents
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return { 
      allowed: false, 
      reason: 'Suspicious user agent', 
      status: 403 
    }
  }

  // Block suspicious paths
  const suspiciousPaths = [
    /\.\./,
    /\/etc\//,
    /\/proc\//,
    /\/sys\//,
    /\/var\//,
    /\/tmp\//,
    /\/root\//,
    /\/home\//,
  ]

  if (suspiciousPaths.some(pattern => pattern.test(pathname))) {
    return { 
      allowed: false, 
      reason: 'Suspicious path', 
      status: 403 
    }
  }

  // Block suspicious query parameters
  const suspiciousParams = ['eval', 'exec', 'system', 'shell', 'cmd']
  const url = new URL(request.url)
  
  for (const param of suspiciousParams) {
    if (url.searchParams.has(param)) {
      return { 
        allowed: false, 
        reason: 'Suspicious query parameter', 
        status: 403 
      }
    }
  }

  return { allowed: true }
}

function addSecurityHeaders(response: NextResponse): void {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
}

// Error handling middleware
export function errorHandler(error: unknown, request: NextRequest) {
  const errorInfo = handleError(error)
  
  logger.error('API Error', error as Error, {
    url: request.url,
    method: request.method,
    error: errorInfo,
  })

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : errorInfo.message

  return NextResponse.json(
    { success: false, error: message },
    { status: errorInfo.status || 500 }
  )
}

// Authentication middleware
export function requireAuth(request: NextRequest) {
  // This is a simplified version - in a real app, you'd check JWT tokens, sessions, etc.
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Authentication required')
  }

  // Validate token here
  const token = authHeader.substring(7)
  
  // For now, just check if token exists
  if (!token) {
    throw new AuthenticationError('Invalid token')
  }

  return { token }
}

// Authorization middleware
export function requireRole(allowedRoles: string[]) {
  return (request: NextRequest) => {
    // This is a simplified version - in a real app, you'd decode the JWT and check roles
    const authResult = requireAuth(request)
    
    // For now, just check if user has any role
    // In a real app, you'd check the actual role from the token
    const userRole = 'ADMIN' // This would come from the decoded token
    
    if (!allowedRoles.includes(userRole)) {
      throw new AuthorizationError('Insufficient permissions')
    }

    return { ...authResult, role: userRole }
  }
}

// Validation middleware
export function validateRequest<T>(schema: any) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      throw new Error(`Validation failed: ${error}`)
    }
  }
}

// Performance monitoring middleware
export function performanceMonitor(request: NextRequest) {
  const startTime = Date.now()
  
  return {
    end: () => {
      const duration = Date.now() - startTime
      if (duration > 1000) { // Log slow requests
        logger.warn('Slow request detected', {
          url: request.url,
          method: request.method,
          duration,
        })
      }
    }
  }
}
