import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

const AUDIT_LOGS_FILE = path.join(process.cwd(), 'data', 'audit-logs.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load audit logs
async function loadAuditLogs() {
  try {
    await ensureDataDir()
    const logsData = await fs.readFile(AUDIT_LOGS_FILE, 'utf-8')
    return JSON.parse(logsData)
  } catch {
    // Return sample data if file doesn't exist
    return generateSampleAuditLogs()
  }
}

// Generate sample audit logs for demonstration
function generateSampleAuditLogs() {
  const sampleLogs = []
  const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'IMPORT']
  const resources = ['users', 'customers', 'work_orders', 'invoices', 'payments', 'technicians', 'miners', 'backup']
  const statuses = ['success', 'failed', 'warning', 'info']
  const severities = ['low', 'medium', 'high', 'critical']
  const categories = ['authentication', 'authorization', 'data_access', 'data_modification', 'system', 'user_management']
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@example.com' },
    { id: '2', name: 'John Doe', email: 'john@example.com' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com' },
  ]

  // Generate logs for the last 30 days
  for (let i = 0; i < 150; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const resource = resources[Math.floor(Math.random() * resources.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    // Generate timestamp within last 30 days
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30))
    timestamp.setHours(Math.floor(Math.random() * 24))
    timestamp.setMinutes(Math.floor(Math.random() * 60))
    timestamp.setSeconds(Math.floor(Math.random() * 60))

    sampleLogs.push({
      id: `log-${Date.now()}-${i}`,
      timestamp: timestamp.toISOString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action,
      resource,
      resourceId: Math.random() > 0.5 ? `id-${Math.floor(Math.random() * 1000)}` : undefined,
      details: `${action} operation on ${resource}${Math.random() > 0.5 ? ' with additional details' : ''}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      status,
      severity,
      category,
    })
  }

  // Sort by timestamp (newest first)
  return sampleLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Calculate statistics
function calculateStats(logs: any[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const todayLogs = logs.filter(log => new Date(log.timestamp) >= today).length
  const failedLogs = logs.filter(log => log.status === 'failed').length
  const criticalLogs = logs.filter(log => log.severity === 'critical').length

  return {
    totalLogs: logs.length,
    todayLogs,
    failedLogs,
    criticalLogs,
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const logs = await loadAuditLogs()
    const stats = calculateStats(logs)
    
    return NextResponse.json({
      success: true,
      data: logs,
      stats
    })
  } catch (error) {
    console.error('Error loading audit logs:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
