import { StateCreator } from 'zustand'
import { AppSettings } from '@/types'
import { dbUtils } from '@/lib/database'
import { DEFAULT_SETTINGS } from '@/constants'
import { PomodoroStore } from '../usePomodoro'

export interface SettingsSlice {
  settings: AppSettings

  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
  exportData: () => Promise<string>
  importData: (jsonData: string) => Promise<void>
}

export const createSettingsSlice: StateCreator<
  PomodoroStore,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: DEFAULT_SETTINGS,

  updateSettings: async (updates) => {
    try {
      const state = get()
      const newSettings = { ...state.settings, ...updates }

      await dbUtils.updateSettings(newSettings)
      set({ settings: newSettings })

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
})
