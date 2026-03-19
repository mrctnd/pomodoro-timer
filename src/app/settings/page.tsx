'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import { DEFAULT_SETTINGS } from '@/constants'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Settings } from 'lucide-react'
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
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col gap-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border/40 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your Chroniqo experience
            </p>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <TimerSettingsCard
              settings={settings.timer}
              onSave={handleSaveTimerSettings}
            />
            <AppearanceSettingsCard />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <SoundSettingsCard
              settings={settings.sound}
              onSave={handleSaveSoundSettings}
            />
            <NotificationSettingsCard
              settings={settings.notifications}
              onSave={handleSaveNotificationSettings}
            />
            <DataManagementCard
              onExport={exportData}
              onImport={importData}
              onReset={handleReset}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
