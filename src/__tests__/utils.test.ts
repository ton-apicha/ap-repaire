import { generateWorkId, getTodayDateString, countWorkOrdersForDate } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('generateWorkId', () => {
    it('should generate work ID with correct format', () => {
      const workId = generateWorkId(1)
      expect(workId).toMatch(/^\d{9}$/) // YYMMDD + 3-digit number
    })

    it('should generate sequential work IDs', () => {
      const workId1 = generateWorkId(1)
      const workId2 = generateWorkId(2)
      const workId10 = generateWorkId(10)
      
      expect(workId1).toHaveLength(9)
      expect(workId2).toHaveLength(9)
      expect(workId10).toHaveLength(9)
      
      // Extract the sequence number (last 3 digits)
      const seq1 = parseInt(workId1.slice(-3))
      const seq2 = parseInt(workId2.slice(-3))
      const seq10 = parseInt(workId10.slice(-3))
      
      expect(seq1).toBe(1)
      expect(seq2).toBe(2)
      expect(seq10).toBe(10)
    })
  })

  describe('getTodayDateString', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const today = getTodayDateString()
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      
      const date = new Date(today)
      const now = new Date()
      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })
  })

  describe('countWorkOrdersForDate', () => {
    it('should count work orders for specific date', () => {
      const mockWorkOrders = [
        { createdAt: '2025-01-15T10:00:00Z' },
        { createdAt: '2025-01-15T14:00:00Z' },
        { createdAt: '2025-01-16T10:00:00Z' },
        { createdAt: '2025-01-15T16:00:00Z' }
      ]
      
      const count = countWorkOrdersForDate(mockWorkOrders, '2025-01-15')
      expect(count).toBe(3)
    })

    it('should return 0 for date with no work orders', () => {
      const mockWorkOrders = [
        { createdAt: '2025-01-15T10:00:00Z' },
        { createdAt: '2025-01-16T10:00:00Z' }
      ]
      
      const count = countWorkOrdersForDate(mockWorkOrders, '2025-01-17')
      expect(count).toBe(0)
    })
  })
})
