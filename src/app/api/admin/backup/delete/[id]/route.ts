import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

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

export async function DELETE(
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
    
    // Delete the backup file
    await fs.unlink(backupPath)
    
    // Remove from history
    const history = await loadHistory()
    const updatedHistory = history.filter((backup: any) => backup.id !== id)
    await saveHistory(updatedHistory)
    
    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting backup:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
