import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { TimerSlice, createTimerSlice } from './slices/timerSlice'
import { TaskSlice, createTaskSlice } from './slices/taskSlice'
import { SettingsSlice, createSettingsSlice } from './slices/settingsSlice'
import { SessionSlice, createSessionSlice } from './slices/sessionSlice'
import { StatsSlice, createStatsSlice } from './slices/statsSlice'

export type PomodoroStore = TimerSlice &
  TaskSlice &
  SettingsSlice &
  SessionSlice &
  StatsSlice

export const usePomodoroStore = create<PomodoroStore>()(
  subscribeWithSelector((...a) => ({
    ...createTimerSlice(...a),
    ...createTaskSlice(...a),
    ...createSettingsSlice(...a),
    ...createSessionSlice(...a),
    ...createStatsSlice(...a),
  }))
)

// Load data on store creation
usePomodoroStore.getState().loadData()

// Fix: store interval in module scope to prevent leaks
let timerInterval: ReturnType<typeof setInterval> | null = null

usePomodoroStore.subscribe(
  (state) => state.timerState,
  (timerState) => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    if (timerState === 'running') {
      timerInterval = setInterval(() => {
        const currentState = usePomodoroStore.getState()
        if (currentState.timerState === 'running') {
          currentState.tick()
        } else {
          if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
          }
        }
      }, 1000)
    }
  }
)
