import fs from 'fs/promises'
import path from 'path'

const AUDIT_LOGS_FILE = path.join(process.cwd(), 'data', 'audit-logs.json')

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_management'
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load existing audit logs
async function loadAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    await ensureDataDir()
    const logsData = await fs.readFile(AUDIT_LOGS_FILE, 'utf-8')
    return JSON.parse(logsData)
  } catch {
    return []
  }
}

// Save audit logs
async function saveAuditLogs(logs: AuditLogEntry[]) {
  await ensureDataDir()
  await fs.writeFile(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2))
}

// Get client IP address from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Get user agent from request
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}

// Determine severity based on action and status
function determineSeverity(action: string, status: string, category: string): 'low' | 'medium' | 'high' | 'critical' {
  // Critical actions
  if (action === 'DELETE' || action === 'RESTORE' || action === 'SYSTEM_SHUTDOWN') {
    return 'critical'
  }
  
  // High severity actions
  if (action === 'UPDATE' || action === 'CREATE' || action === 'LOGIN_FAILED') {
    return 'high'
  }
  
  // Medium severity actions
  if (action === 'VIEW' || action === 'EXPORT' || action === 'IMPORT') {
    return 'medium'
  }
  
  // Low severity actions
  if (action === 'LOGIN' || action === 'LOGOUT' || action === 'SEARCH') {
    return 'low'
  }
  
  // Failed operations are higher severity
  if (status === 'failed') {
    return 'high'
  }
  
  return 'low'
}

// Main audit logging function
export async function logAuditEvent(params: {
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning' | 'info'
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_management'
}): Promise<void> {
  try {
    const logs = await loadAuditLogs()
    
    const severity = determineSeverity(params.action, params.status, params.category)
    
    const auditEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      status: params.status,
      severity,
      category: params.category,
    }
    
    logs.unshift(auditEntry) // Add to beginning of array
    
    // Keep only last 10000 logs to prevent file from growing too large
    if (logs.length > 10000) {
      logs.splice(10000)
    }
    
    await saveAuditLogs(logs)
  } catch (error) {
    console.error('Error logging audit event:', error)
    // Don't throw error to prevent breaking the main application flow
  }
}

// Convenience functions for common audit events
export async function logLogin(userId: string, userName: string, userEmail: string, ipAddress: string, userAgent: string, success: boolean) {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action: success ? 'LOGIN' : 'LOGIN_FAILED',
    resource: 'authentication',
    details: success ? 'User logged in successfully' : 'Failed login attempt',
    ipAddress,
    userAgent,
    status: success ? 'success' : 'failed',
    category: 'authentication',
  })
}

export async function logLogout(userId: string, userName: string, userEmail: string, ipAddress: string, userAgent: string) {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action: 'LOGOUT',
    resource: 'authentication',
    details: 'User logged out',
    ipAddress,
    userAgent,
    status: 'success',
    category: 'authentication',
  })
}

export async function logDataAccess(userId: string, userName: string, userEmail: string, action: string, resource: string, resourceId: string, ipAddress: string, userAgent: string, success: boolean) {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action,
    resource,
    resourceId,
    details: `${action} operation on ${resource} ${resourceId}`,
    ipAddress,
    userAgent,
    status: success ? 'success' : 'failed',
    category: 'data_access',
  })
}

export async function logDataModification(userId: string, userName: string, userEmail: string, action: string, resource: string, resourceId: string, ipAddress: string, userAgent: string, success: boolean, details?: string) {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action,
    resource,
    resourceId,
    details: details || `${action} operation on ${resource} ${resourceId}`,
    ipAddress,
    userAgent,
    status: success ? 'success' : 'failed',
    category: 'data_modification',
  })
}

export async function logSystemEvent(userId: string, userName: string, userEmail: string, action: string, resource: string, details: string, ipAddress: string, userAgent: string, status: 'success' | 'failed' | 'warning' | 'info') {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action,
    resource,
    details,
    ipAddress,
    userAgent,
    status,
    category: 'system',
  })
}

export async function logUserManagement(userId: string, userName: string, userEmail: string, action: string, resource: string, resourceId: string, ipAddress: string, userAgent: string, success: boolean, details?: string) {
  await logAuditEvent({
    userId,
    userName,
    userEmail,
    action,
    resource,
    resourceId,
    details: details || `${action} operation on ${resource} ${resourceId}`,
    ipAddress,
    userAgent,
    status: success ? 'success' : 'failed',
    category: 'user_management',
  })
}

// Export function for use in API routes
export async function logAuditFromRequest(
  request: Request,
  user: { id: string; name: string; email: string },
  action: string,
  resource: string,
  resourceId?: string,
  details?: string,
  status: 'success' | 'failed' | 'warning' | 'info' = 'success',
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'user_management' = 'data_access'
) {
  const ipAddress = getClientIP(request)
  const userAgent = getUserAgent(request)
  
  await logAuditEvent({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    action,
    resource,
    resourceId,
    details: details || `${action} operation on ${resource}`,
    ipAddress,
    userAgent,
    status,
    category,
  })
}
