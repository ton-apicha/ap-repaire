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
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2))
}

// Restore database from backup
async function restoreDatabase(backupId: string) {
  const backupPath = path.join(BACKUP_DIR, `${backupId}.zip`)
  const extractPath = path.join(BACKUP_DIR, `temp-${backupId}`)
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  
  try {
    // Extract backup
    await execAsync(`unzip -o "${backupPath}" -d "${extractPath}"`)
    
    // Find database backup file
    const dbBackupFile = path.join(extractPath, `${backupId}-database.sql`)
    
    if (await fs.access(dbBackupFile).then(() => true).catch(() => false)) {
      // Restore database
      await execAsync(`sqlite3 "${dbPath}" < "${dbBackupFile}"`)
    }
    
    // Clean up
    await fs.rm(extractPath, { recursive: true, force: true })
    
    return true
  } catch (error) {
    console.error('Error restoring database:', error)
    // Clean up on error
    try {
      await fs.rm(extractPath, { recursive: true, force: true })
    } catch {}
    throw new Error('Failed to restore database')
  }
}

// Restore files from backup
async function restoreFiles(backupId: string) {
  const backupPath = path.join(BACKUP_DIR, `${backupId}.zip`)
  const extractPath = path.join(BACKUP_DIR, `temp-${backupId}`)
  
  try {
    // Extract backup
    await execAsync(`unzip -o "${backupPath}" -d "${extractPath}"`)
    
    // Find files backup directory
    const filesBackupDir = path.join(extractPath, `${backupId}-files`)
    
    if (await fs.access(filesBackupDir).then(() => true).catch(() => false)) {
      // Restore files
      const filesToRestore = [
        'src/locales',
        'public',
        'data',
      ]
      
      for (const filePath of filesToRestore) {
        const sourcePath = path.join(filesBackupDir, filePath)
        const destPath = path.join(process.cwd(), filePath)
        
        try {
          const stats = await fs.stat(sourcePath)
          if (stats.isDirectory()) {
            await execAsync(`cp -r "${sourcePath}" "${destPath}"`)
          } else {
            await fs.copyFile(sourcePath, destPath)
          }
        } catch (error) {
          console.warn(`Warning: Could not restore ${filePath}:`, error)
        }
      }
    }
    
    // Clean up
    await fs.rm(extractPath, { recursive: true, force: true })
    
    return true
  } catch (error) {
    console.error('Error restoring files:', error)
    // Clean up on error
    try {
      await fs.rm(extractPath, { recursive: true, force: true })
    } catch {}
    throw new Error('Failed to restore files')
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const backupPath = path.join(BACKUP_DIR, `${id}.zip`)
    
    // Check if backup file exists
    try {
      await fs.access(backupPath)
    } catch {
      return NextResponse.json(
        { success: false, message: 'Backup file not found' },
        { status: 404 }
      )
    }
    
    // Load backup history to get backup details
    const history = await loadHistory()
    const backup = history.find((b: any) => b.id === id)
    
    if (!backup) {
      return NextResponse.json(
        { success: false, message: 'Backup not found in history' },
        { status: 404 }
      )
    }
    
    // Restore database if it was included in backup
    if (backup.files > 0) {
      await restoreDatabase(id)
    }
    
    // Restore files if they were included in backup
    if (backup.files > 0) {
      await restoreFiles(id)
    }
    
    // Update backup history with restore info
    const updatedHistory = history.map((b: any) => {
      if (b.id === id) {
        return {
          ...b,
          lastRestored: new Date().toISOString(),
          restoredBy: session.user.name,
        }
      }
      return b
    })
    
    await saveHistory(updatedHistory)
    
    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully'
    })
  } catch (error) {
    console.error('Error restoring backup:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
