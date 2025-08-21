import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

const AUDIT_LOGS_FILE = path.join(process.cwd(), 'data', 'audit-logs.json')

// Load audit logs
async function loadAuditLogs() {
  try {
    const logsData = await fs.readFile(AUDIT_LOGS_FILE, 'utf-8')
    return JSON.parse(logsData)
  } catch {
    return []
  }
}

// Apply filters to logs
function applyFilters(logs: any[], filters: any) {
  let filtered = [...logs]

  if (filters.startDate) {
    filtered = filtered.filter(log => 
      new Date(log.timestamp) >= new Date(filters.startDate)
    )
  }

  if (filters.endDate) {
    filtered = filtered.filter(log => 
      new Date(log.timestamp) <= new Date(filters.endDate + 'T23:59:59')
    )
  }

  if (filters.userId) {
    filtered = filtered.filter(log => 
      log.userId.toLowerCase().includes(filters.userId.toLowerCase())
    )
  }

  if (filters.action) {
    filtered = filtered.filter(log => 
      log.action.toLowerCase().includes(filters.action.toLowerCase())
    )
  }

  if (filters.resource) {
    filtered = filtered.filter(log => 
      log.resource.toLowerCase().includes(filters.resource.toLowerCase())
    )
  }

  if (filters.status) {
    filtered = filtered.filter(log => log.status === filters.status)
  }

  if (filters.severity) {
    filtered = filtered.filter(log => log.severity === filters.severity)
  }

  if (filters.category) {
    filtered = filtered.filter(log => log.category === filters.category)
  }

  return filtered
}

// Convert logs to CSV format
function convertToCSV(logs: any[]) {
  const headers = [
    'ID',
    'Timestamp',
    'User ID',
    'User Name',
    'User Email',
    'Action',
    'Resource',
    'Resource ID',
    'Details',
    'IP Address',
    'User Agent',
    'Status',
    'Severity',
    'Category'
  ]

  const csvRows = [headers.join(',')]

  for (const log of logs) {
    const row = [
      log.id,
      `"${new Date(log.timestamp).toLocaleString()}"`,
      log.userId,
      `"${log.userName}"`,
      `"${log.userEmail}"`,
      log.action,
      log.resource,
      log.resourceId || '',
      `"${log.details}"`,
      log.ipAddress,
      `"${log.userAgent}"`,
      log.status,
      log.severity,
      log.category
    ]
    csvRows.push(row.join(','))
  }

  return csvRows.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const filters = body || {}

    const logs = await loadAuditLogs()
    const filteredLogs = applyFilters(logs, filters)
    const csvData = convertToCSV(filteredLogs)

    // Return CSV file
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
