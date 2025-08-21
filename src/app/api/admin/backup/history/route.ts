import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'

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
    
    // Sort by timestamp (newest first)
    const sortedHistory = history.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: sortedHistory
    })
  } catch (error) {
    console.error('Error loading backup history:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
