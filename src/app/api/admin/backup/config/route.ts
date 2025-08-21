import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'backup-config.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load backup configuration
async function loadConfig() {
  try {
    await ensureDataDir()
    const configData = await fs.readFile(CONFIG_FILE, 'utf-8')
    return JSON.parse(configData)
  } catch {
    // Return default config if file doesn't exist
    return {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
      includeFiles: true,
      includeDatabase: true,
      cloudBackup: false,
      cloudProvider: 'local',
    }
  }
}

// Save backup configuration
async function saveConfig(config: any) {
  await ensureDataDir()
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
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

    const config = await loadConfig()
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error loading backup config:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    
    // Validate configuration
    const config = {
      autoBackup: Boolean(body.autoBackup),
      backupInterval: Math.max(1, Math.min(168, parseInt(body.backupInterval) || 24)),
      retentionDays: Math.max(1, Math.min(365, parseInt(body.retentionDays) || 30)),
      includeFiles: Boolean(body.includeFiles),
      includeDatabase: Boolean(body.includeDatabase),
      cloudBackup: Boolean(body.cloudBackup),
      cloudProvider: body.cloudProvider || 'local',
    }

    await saveConfig(config)
    
    return NextResponse.json({
      success: true,
      message: 'Backup configuration updated successfully',
      data: config
    })
  } catch (error) {
    console.error('Error updating backup config:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
