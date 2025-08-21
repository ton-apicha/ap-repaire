import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

const BACKUP_DIR = path.join(process.cwd(), 'backups')

export async function GET(
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
    
    // Read the backup file
    const backupFile = await fs.readFile(backupPath)
    
    // Return the file as a download
    return new NextResponse(backupFile as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="backup-${id}.zip"`,
      },
    })
  } catch (error) {
    console.error('Error downloading backup:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
