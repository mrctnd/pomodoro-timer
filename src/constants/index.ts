import { AppSettings } from '@/types'

export const DEFAULT_SETTINGS: AppSettings = {
  timer: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
  },
  sound: {
    enabled: true,
    startSound: 'click',
    endSound: 'bell',
    volume: 0.5,
  },
  notifications: {
    enabled: true,
    desktop: true,
  },
  theme: 'system',
  focusMode: false,
  language: 'en',
}

export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
] as const

export const NOTIFICATION_AUTO_CLOSE_MS = 5000
export const NOTIFICATION_ICON = '/icon-192x192.png'
export const NOTIFICATION_BADGE = '/icon-72x72.png'
