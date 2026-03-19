import { StateCreator } from 'zustand'
import { TimerMode } from '@/types'
import { localStorageUtils } from '@/lib/storage'
import { PomodoroStore } from '../usePomodoro'

export interface TimerSlice {
  currentMode: TimerMode
  timeLeft: number
  timerState: 'idle' | 'running' | 'paused'
  startTime?: number

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  switchMode: (mode: TimerMode) => void
  tick: () => void
}

export const createTimerSlice: StateCreator<
  PomodoroStore,
  [],
  [],
  TimerSlice
> = (set, get) => ({
  currentMode: 'pomodoro',
  timeLeft: 25 * 60,
  timerState: 'idle',
  startTime: undefined,

  startTimer: () => {
    const state = get()
    const now = Date.now()

    set({
      timerState: 'running',
      startTime: now,
    })

    localStorageUtils.setItem('timerStartTime', now)
    localStorageUtils.setItem('timerInitialTime', state.timeLeft)
  },

  pauseTimer: () => {
    set({ timerState: 'paused' })
    localStorageUtils.removeItem('timerStartTime')
    localStorageUtils.removeItem('timerInitialTime')
  },

  resetTimer: () => {
    const state = get()
    const duration = state.settings.timer[state.currentMode] * 60

    set({
      timerState: 'idle',
      timeLeft: duration,
      startTime: undefined,
    })

    localStorageUtils.removeItem('timerStartTime')
    localStorageUtils.removeItem('timerInitialTime')
  },

  switchMode: (mode: TimerMode) => {
    const state = get()
    const duration = state.settings.timer[mode] * 60

    set({
      currentMode: mode,
      timeLeft: duration,
      timerState: 'idle',
      startTime: undefined,
    })

    localStorageUtils.removeItem('timerStartTime')
    localStorageUtils.removeItem('timerInitialTime')
  },

  tick: () => {
    const state = get()

    if (state.timerState !== 'running') return

    if (state.startTime) {
      const startTime = localStorageUtils.getItem(
        'timerStartTime',
        state.startTime
      )
      const initialTime = localStorageUtils.getItem(
        'timerInitialTime',
        state.timeLeft
      )
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const newTimeLeft = Math.max(0, initialTime - elapsed)

      set({ timeLeft: newTimeLeft })

      if (newTimeLeft === 0) {
        get().completeSession()
      }
    }
  },
})
