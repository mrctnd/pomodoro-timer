export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

export type TimerState = 'idle' | 'running' | 'paused'

export interface TimerSettings {
  pomodoro: number // minutes
  shortBreak: number // minutes
  longBreak: number // minutes
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number // number of pomodoros before long break
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  pomodoroCount: number
  estimatedPomodoros: number
  tags: string[]
  createdAt: number
  updatedAt: number
  order: number
}

export interface PomodoroSession {
  id: string
  taskId?: string
  mode: TimerMode
  duration: number // minutes
  startTime: number
  endTime?: number
  completed: boolean
  createdAt: number
}

export interface AppSettings {
  timer: TimerSettings
  sound: {
    enabled: boolean
    startSound: string
    endSound: string
    volume: number
  }
  notifications: {
    enabled: boolean
    desktop: boolean
  }
  theme: 'light' | 'dark' | 'system'
  focusMode: boolean
  language: 'en' | 'tr'
}

export interface AppStats {
  totalSessions: number
  totalFocusTime: number // minutes
  completedPomodoros: number
  completedTasks: number
  streak: number
  lastSessionDate?: number
}

export interface AppState {
  currentMode: TimerMode
  timeLeft: number // seconds
  timerState: TimerState
  currentTaskId?: string
  settings: AppSettings
  tasks: Task[]
  sessions: PomodoroSession[]
  stats: AppStats
  startTime?: number
}
