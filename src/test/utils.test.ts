import { describe, it, expect } from 'vitest'
import { formatTime, formatDuration, calculateProgress } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(59)).toBe('00:59')
      expect(formatTime(60)).toBe('01:00')
      expect(formatTime(1500)).toBe('25:00') // 25 minutes
      expect(formatTime(3661)).toBe('61:01') // 1 hour 1 minute 1 second
    })
  })

  describe('formatDuration', () => {
    it('should format minutes to human readable string', () => {
      expect(formatDuration(0)).toBe('0m')
      expect(formatDuration(30)).toBe('30m')
      expect(formatDuration(60)).toBe('1h')
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(120)).toBe('2h')
    })
  })

  describe('calculateProgress', () => {
    it('should calculate progress percentage', () => {
      expect(calculateProgress(1500, 1500)).toBe(0) // Full time left = 0% progress
      expect(calculateProgress(750, 1500)).toBe(50) // Half time left = 50% progress
      expect(calculateProgress(0, 1500)).toBe(100) // No time left = 100% progress
    })
  })
})
