import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  AppState,
  TimerMode,
  Task,
  PomodoroSession,
  AppSettings,
} from '@/types'
import { dbUtils, localStorageUtils } from '@/lib/database'

const DEFAULT_SETTINGS: AppSettings = {
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

interface PomodoroStore extends AppState {
  // Timer actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  switchMode: (mode: TimerMode) => void
  tick: () => void

  // Task actions
  addTask: (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (tasks: Task[]) => Promise<void>
  setCurrentTask: (taskId?: string) => void

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>

  // Session actions
  completeSession: () => Promise<void>

  // Data actions
  loadData: () => Promise<void>
  exportData: () => Promise<string>
  importData: (jsonData: string) => Promise<void>

  // Stats calculations
  calculateStats: () => void
}

export const usePomodoroStore = create<PomodoroStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentMode: 'pomodoro',
    timeLeft: 25 * 60, // 25 minutes in seconds
    timerState: 'idle',
    currentTaskId: undefined,
    settings: DEFAULT_SETTINGS,
    tasks: [],
    sessions: [],
    stats: {
      totalSessions: 0,
      totalFocusTime: 0,
      completedPomodoros: 0,
      completedTasks: 0,
      streak: 0,
    },
    startTime: undefined,

    // Timer actions
    startTimer: () => {
      const state = get()
      const now = Date.now()

      set({
        timerState: 'running',
        startTime: now,
      })

      // Save start time to localStorage for background accuracy
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

      // Use epoch-based timing for accuracy
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

    // Task actions
    addTask: async (taskData) => {
      try {
        const state = get()
        const newTask: Task = {
          id: crypto.randomUUID(),
          ...taskData,
          completed: false,
          pomodoroCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          order: state.tasks.length,
        }

        await dbUtils.addTask(newTask)
        set({ tasks: [...state.tasks, newTask] })
      } catch (error) {
        console.error('Failed to add task:', error)
        throw error
      }
    },

    updateTask: async (id, updates) => {
      try {
        await dbUtils.updateTask(id, updates)
        const state = get()
        set({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: Date.now() }
              : task
          ),
        })
      } catch (error) {
        console.error('Failed to update task:', error)
        throw error
      }
    },

    deleteTask: async (id) => {
      try {
        await dbUtils.deleteTask(id)
        const state = get()
        set({
          tasks: state.tasks.filter((task) => task.id !== id),
          currentTaskId:
            state.currentTaskId === id ? undefined : state.currentTaskId,
        })
      } catch (error) {
        console.error('Failed to delete task:', error)
        throw error
      }
    },

    reorderTasks: async (reorderedTasks) => {
      try {
        await dbUtils.reorderTasks(reorderedTasks)
        set({ tasks: reorderedTasks })
      } catch (error) {
        console.error('Failed to reorder tasks:', error)
        throw error
      }
    },

    setCurrentTask: (taskId) => {
      set({ currentTaskId: taskId })
      localStorageUtils.setItem('currentTaskId', taskId)
    },

    // Settings actions
    updateSettings: async (updates) => {
      try {
        const state = get()
        const newSettings = { ...state.settings, ...updates }

        await dbUtils.updateSettings(newSettings)
        set({ settings: newSettings })

        // Update timer duration if timer settings changed
        if (updates.timer) {
          const currentDuration = newSettings.timer[state.currentMode] * 60
          if (state.timerState === 'idle') {
            set({ timeLeft: currentDuration })
          }
        }
      } catch (error) {
        console.error('Failed to update settings:', error)
        throw error
      }
    },

    // Session actions
    completeSession: async () => {
      try {
        const state = get()

        // Create session record
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

        // Update task pomodoro count if applicable
        if (state.currentTaskId && state.currentMode === 'pomodoro') {
          const task = state.tasks.find((t) => t.id === state.currentTaskId)
          if (task) {
            await get().updateTask(state.currentTaskId, {
              pomodoroCount: task.pomodoroCount + 1,
            })
          }
        }

        // Auto-switch to next mode if enabled
        let nextMode: TimerMode = state.currentMode
        if (state.currentMode === 'pomodoro') {
          const completedPomodoros =
            state.sessions.filter((s) => s.mode === 'pomodoro' && s.completed)
              .length + 1
          const shouldLongBreak =
            completedPomodoros % state.settings.timer.longBreakInterval === 0
          nextMode = shouldLongBreak ? 'longBreak' : 'shortBreak'
        } else {
          nextMode = 'pomodoro'
        }

        get().switchMode(nextMode)

        // Auto-start next session if enabled
        const shouldAutoStart =
          state.currentMode === 'pomodoro'
            ? state.settings.timer.autoStartBreaks
            : state.settings.timer.autoStartPomodoros

        if (shouldAutoStart) {
          setTimeout(() => get().startTimer(), 1000)
        }

        // Refresh sessions and calculate stats
        const sessions = await dbUtils.getSessions()
        set({ sessions })
        get().calculateStats()
      } catch (error) {
        console.error('Failed to complete session:', error)
      }
    },

    // Data actions
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
            // Timer expired while away
            localStorageUtils.removeItem('timerStartTime')
            localStorageUtils.removeItem('timerInitialTime')
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback to localStorage
        const fallbackSettings = localStorageUtils.getItem(
          'pomodoroSettings',
          DEFAULT_SETTINGS
        )
        set({ settings: fallbackSettings })
      }
    },

    exportData: async () => {
      try {
        return await dbUtils.exportData()
      } catch (error) {
        console.error('Failed to export data:', error)
        throw error
      }
    },

    importData: async (jsonData) => {
      try {
        await dbUtils.importData(jsonData)
        await get().loadData()
      } catch (error) {
        console.error('Failed to import data:', error)
        throw error
      }
    },

    // Stats calculations
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

      // Calculate streak (consecutive days with at least one pomodoro)
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)

        const hasSessionOnDate = completedPomodoros.some((session) => {
          const sessionDate = new Date(session.startTime)
          sessionDate.setHours(0, 0, 0, 0)
          return sessionDate.getTime() === checkDate.getTime()
        })

        if (hasSessionOnDate) {
          streak++
        } else if (i > 0) {
          // Allow for today to not have sessions yet
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
  }))
)

// Load data on store creation
usePomodoroStore.getState().loadData()

// Subscribe to timer state changes to handle ticking
usePomodoroStore.subscribe(
  (state) => state.timerState,
  (timerState) => {
    if (timerState === 'running') {
      const interval = setInterval(() => {
        const currentState = usePomodoroStore.getState()
        if (currentState.timerState === 'running') {
          currentState.tick()
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  }
)
