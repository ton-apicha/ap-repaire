import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const BACKUP_DIR = path.join(process.cwd(), 'backups')
const HISTORY_FILE = path.join(process.cwd(), 'data', 'backup-history.json')

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [BACKUP_DIR, path.dirname(HISTORY_FILE)]
  for (const dir of dirs) {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
    }
  }
}

// Load backup history
async function loadHistory() {
  try {
    const historyData = await fs.readFile(HISTORY_FILE, 'utf-8')
    return JSON.parse(historyData)
  } catch {
    return []
  }
}

// Save backup history
async function saveHistory(history: any[]) {
  await ensureDirectories()
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))
}

// Create database backup
async function createDatabaseBackup(backupId: string) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const backupPath = path.join(BACKUP_DIR, `${backupId}-database.sql`)
  
  try {
    // Create SQLite dump
    await execAsync(`sqlite3 "${dbPath}" .dump > "${backupPath}"`)
    return backupPath
  } catch (error) {
    console.error('Error creating database backup:', error)
    throw new Error('Failed to create database backup')
  }
}

// Create file backup
async function createFileBackup(backupId: string) {
  const filesToBackup = [
    'prisma/schema.prisma',
    'src/locales',
    'public',
    'data',
  ]
  
  const backupPath = path.join(BACKUP_DIR, `${backupId}-files`)
  
  try {
    await fs.mkdir(backupPath, { recursive: true })
    
    for (const filePath of filesToBackup) {
      const sourcePath = path.join(process.cwd(), filePath)
      const destPath = path.join(backupPath, filePath)
      
      try {
        const stats = await fs.stat(sourcePath)
        if (stats.isDirectory()) {
          await execAsync(`cp -r "${sourcePath}" "${destPath}"`)
        } else {
          await fs.copyFile(sourcePath, destPath)
        }
      } catch (error) {
        console.warn(`Warning: Could not backup ${filePath}:`, error)
      }
    }
    
    return backupPath
  } catch (error) {
    console.error('Error creating file backup:', error)
    throw new Error('Failed to create file backup')
  }
}

// Create ZIP archive
async function createZipArchive(backupId: string, files: string[]) {
  const zipPath = path.join(BACKUP_DIR, `${backupId}.zip`)
  
  try {
    const fileList = files.map(f => `"${f}"`).join(' ')
    await execAsync(`zip -r "${zipPath}" ${fileList}`)
    return zipPath
  } catch (error) {
    console.error('Error creating ZIP archive:', error)
    throw new Error('Failed to create ZIP archive')
  }
}

// Get file size
async function getFileSize(filePath: string) {
  try {
    const stats = await fs.stat(filePath)
    const sizeInBytes = stats.size
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
    return `${sizeInMB} MB`
  } catch {
    return '0 MB'
  }
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
    const { type = 'manual', includeFiles = true, includeDatabase = true } = body
    
    await ensureDirectories()
    
    const startTime = Date.now()
    const backupId = `backup-${Date.now()}`
    const backupFiles: string[] = []
    
    // Create database backup if requested
    if (includeDatabase) {
      const dbBackupPath = await createDatabaseBackup(backupId)
      backupFiles.push(dbBackupPath)
    }
    
    // Create file backup if requested
    if (includeFiles) {
      const fileBackupPath = await createFileBackup(backupId)
      backupFiles.push(fileBackupPath)
    }
    
    // Create ZIP archive
    const zipPath = await createZipArchive(backupId, backupFiles)
    const size = await getFileSize(zipPath)
    const duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`
    
    // Clean up individual backup files
    for (const file of backupFiles) {
      try {
        await fs.rm(file, { recursive: true, force: true })
      } catch (error) {
        console.warn('Warning: Could not clean up backup file:', file)
      }
    }
    
    // Update backup history
    const history = await loadHistory()
    const backupRecord = {
      id: backupId,
      timestamp: new Date().toISOString(),
      type,
      status: 'success',
      size,
      duration,
      description: `Backup created by ${session.user.name}`,
      files: backupFiles.length,
      zipPath,
    }
    
    history.unshift(backupRecord)
    await saveHistory(history)
    
    return NextResponse.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        id: backupId,
        size,
        duration,
        path: zipPath,
      }
    })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
