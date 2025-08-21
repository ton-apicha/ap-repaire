import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

const HISTORY_FILE = path.join(process.cwd(), 'data', 'backup-history.json')
const CONFIG_FILE = path.join(process.cwd(), 'data', 'backup-config.json')

// Load backup history
async function loadHistory() {
  try {
    const historyData = await fs.readFile(HISTORY_FILE, 'utf-8')
    return JSON.parse(historyData)
  } catch {
    return []
  }
}

// Load backup configuration
async function loadConfig() {
  try {
    const configData = await fs.readFile(CONFIG_FILE, 'utf-8')
    return JSON.parse(configData)
  } catch {
    return {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
    }
  }
}

// Calculate total size from backup history
function calculateTotalSize(history: any[]) {
  let totalBytes = 0
  for (const backup of history) {
    if (backup.size) {
      const sizeStr = backup.size.toString()
      const match = sizeStr.match(/(\d+\.?\d*)\s*MB/)
      if (match) {
        totalBytes += parseFloat(match[1]) * 1024 * 1024
      }
    }
  }
  return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
}

// Calculate success rate
function calculateSuccessRate(history: any[]) {
  if (history.length === 0) return 100
  
  const successful = history.filter(backup => backup.status === 'success').length
  return Math.round((successful / history.length) * 100)
}

// Get next backup time
function getNextBackupTime(lastBackupTime: string, intervalHours: number) {
  if (!lastBackupTime) return null
  
  const lastBackup = new Date(lastBackupTime)
  const nextBackup = new Date(lastBackup.getTime() + (intervalHours * 60 * 60 * 1000))
  return nextBackup.toISOString()
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

    const history = await loadHistory()
    const config = await loadConfig()
    
    // Get last backup time
    const lastBackup = history.length > 0 ? history[0].timestamp : null
    
    // Calculate statistics
    const stats = {
      lastBackup: lastBackup ? new Date(lastBackup).toLocaleString() : '',
      nextBackup: lastBackup ? getNextBackupTime(lastBackup, config.backupInterval) : '',
      totalBackups: history.length,
      totalSize: calculateTotalSize(history),
      successRate: calculateSuccessRate(history),
      autoBackupEnabled: config.autoBackup,
      backupInterval: config.backupInterval,
      retentionDays: config.retentionDays,
    }
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error loading backup stats:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
