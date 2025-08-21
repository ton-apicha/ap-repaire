import { NextResponse } from 'next/server'
import { checkSystemHealth, getSystemMetrics } from '@/utils/systemHealth'
import { logger } from '@/utils/logger'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Run health checks
    const healthResult = await checkSystemHealth()
    const metrics = getSystemMetrics()
    
    const duration = Date.now() - startTime
    
    logger.info('Health check API called', {
      status: healthResult.status,
      duration,
      checks: healthResult.checks.length
    })
    
    return NextResponse.json({
      success: true,
      data: {
        status: healthResult.status,
        timestamp: healthResult.timestamp,
        duration: healthResult.duration,
        checks: healthResult.checks,
        metrics,
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.2.0',
        environment: process.env.NODE_ENV || 'development'
      }
    })
  } catch (error) {
    logger.error('Health check API failed', error as Error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.2.0',
        environment: process.env.NODE_ENV || 'development'
      },
      { status: 500 }
    )
  }
}
