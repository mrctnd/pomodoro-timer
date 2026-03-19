'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import { DEFAULT_SETTINGS } from '@/constants'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { TimerSettingsCard } from '@/components/settings/TimerSettingsCard'
import { SoundSettingsCard } from '@/components/settings/SoundSettingsCard'
import { NotificationSettingsCard } from '@/components/settings/NotificationSettingsCard'
import { AppearanceSettingsCard } from '@/components/settings/AppearanceSettingsCard'
import { DataManagementCard } from '@/components/settings/DataManagementCard'

export default function SettingsPage() {
  const { settings, updateSettings, exportData, importData, resetTimer } =
    usePomodoroStore()

  const { setTheme } = useTheme()

  const handleSaveTimerSettings = async (
    timerSettings: typeof settings.timer
  ) => {
    await updateSettings({ timer: timerSettings })
    resetTimer()
  }

  const handleSaveSoundSettings = async (
    soundSettings: typeof settings.sound
  ) => {
    await updateSettings({ sound: soundSettings })
  }

  const handleSaveNotificationSettings = async (
    notificationSettings: typeof settings.notifications
  ) => {
    await updateSettings({ notifications: notificationSettings })
  }

  const handleReset = async () => {
    await updateSettings(DEFAULT_SETTINGS)
    setTheme(DEFAULT_SETTINGS.theme)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Pomodoro experience
          </p>
        </div>

        <TimerSettingsCard
          settings={settings.timer}
          onSave={handleSaveTimerSettings}
        />

        <SoundSettingsCard
          settings={settings.sound}
          onSave={handleSaveSoundSettings}
        />

        <NotificationSettingsCard
          settings={settings.notifications}
          onSave={handleSaveNotificationSettings}
        />

        <AppearanceSettingsCard />

        <DataManagementCard
          onExport={exportData}
          onImport={importData}
          onReset={handleReset}
        />
      </motion.div>
    </div>
  )
}
