import { StateCreator } from 'zustand'
import { AppStats } from '@/types'
import { dbUtils } from '@/lib/database'
import { localStorageUtils } from '@/lib/storage'
import { DEFAULT_SETTINGS } from '@/constants'
import { PomodoroStore } from '../usePomodoro'

export interface StatsSlice {
  stats: AppStats

  calculateStats: () => void
  loadData: () => Promise<void>
}

export const createStatsSlice: StateCreator<
  PomodoroStore,
  [],
  [],
  StatsSlice
> = (set, get) => ({
  stats: {
    totalSessions: 0,
    totalFocusTime: 0,
    completedPomodoros: 0,
    completedTasks: 0,
    streak: 0,
  },

  calculateStats: () => {
    const state = get()
    const completedSessions = state.sessions.filter((s) => s.completed)
    const completedPomodoros = completedSessions.filter(
      (s) => s.mode === 'pomodoro'
    )
    const completedTasks = state.tasks.filter((t) => t.completed)

    const totalFocusTime = completedPomodoros.reduce(
      (total, session) => total + session.duration,
      0
    )

    // Calculate streak with O(1) Set lookups
    const sessionDates = new Set(
      completedPomodoros.map((s) => {
        const d = new Date(s.startTime)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      if (sessionDates.has(checkDate.getTime())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    set({
      stats: {
        totalSessions: completedSessions.length,
        totalFocusTime,
        completedPomodoros: completedPomodoros.length,
        completedTasks: completedTasks.length,
        streak,
        lastSessionDate: completedSessions[0]?.startTime,
      },
    })
  },

  loadData: async () => {
    try {
      const [tasks, sessions, settings] = await Promise.all([
        dbUtils.getTasks(),
        dbUtils.getSessions(),
        dbUtils.getSettings(),
      ])

      const currentTaskId = localStorageUtils.getItem(
        'currentTaskId',
        undefined
      )

      set({
        tasks,
        sessions,
        settings: settings || DEFAULT_SETTINGS,
        currentTaskId,
      })

      get().calculateStats()

      // Restore timer state from localStorage
      const startTime = localStorageUtils.getItem('timerStartTime', null)
      const initialTime = localStorageUtils.getItem('timerInitialTime', null)

      if (startTime && initialTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const timeLeft = Math.max(0, initialTime - elapsed)

        if (timeLeft > 0) {
          set({
            timerState: 'running',
            timeLeft,
            startTime,
          })
        } else {
          localStorageUtils.removeItem('timerStartTime')
          localStorageUtils.removeItem('timerInitialTime')
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      const fallbackSettings = localStorageUtils.getItem(
        'pomodoroSettings',
        DEFAULT_SETTINGS
      )
      set({ settings: fallbackSettings })
    }
  },
})
