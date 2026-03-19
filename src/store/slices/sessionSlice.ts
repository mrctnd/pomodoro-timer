import { StateCreator } from 'zustand'
import { PomodoroSession, TimerMode } from '@/types'
import { dbUtils } from '@/lib/database'
import { PomodoroStore } from '../usePomodoro'

export interface SessionSlice {
  sessions: PomodoroSession[]

  completeSession: () => Promise<void>
}

export const createSessionSlice: StateCreator<
  PomodoroStore,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  sessions: [],

  completeSession: async () => {
    try {
      const state = get()

      const session: Omit<PomodoroSession, 'id'> = {
        taskId: state.currentTaskId,
        mode: state.currentMode,
        duration: state.settings.timer[state.currentMode],
        startTime: state.startTime || Date.now(),
        endTime: Date.now(),
        completed: true,
        createdAt: Date.now(),
      }

      await dbUtils.addSession(session)

      if (state.currentTaskId && state.currentMode === 'pomodoro') {
        const task = state.tasks.find((t) => t.id === state.currentTaskId)
        if (task) {
          await get().updateTask(state.currentTaskId, {
            pomodoroCount: task.pomodoroCount + 1,
          })
        }
      }

      // Refresh sessions from DB for accurate count
      const sessions = await dbUtils.getSessions()
      set({ sessions })

      // Determine next mode based on refreshed data
      let nextMode: TimerMode = state.currentMode
      if (state.currentMode === 'pomodoro') {
        const completedPomodoros = sessions.filter(
          (s) => s.mode === 'pomodoro' && s.completed
        ).length
        const shouldLongBreak =
          completedPomodoros % state.settings.timer.longBreakInterval === 0
        nextMode = shouldLongBreak ? 'longBreak' : 'shortBreak'
      } else {
        nextMode = 'pomodoro'
      }

      get().switchMode(nextMode)

      const shouldAutoStart =
        state.currentMode === 'pomodoro'
          ? state.settings.timer.autoStartBreaks
          : state.settings.timer.autoStartPomodoros

      if (shouldAutoStart) {
        setTimeout(() => get().startTimer(), 1000)
      }

      get().calculateStats()
    } catch (error) {
      console.error('Failed to complete session:', error)
    }
  },
})
