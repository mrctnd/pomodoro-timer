'use client'

import { useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import {
  Clock,
  Volume2,
  Bell,
  Palette,
  Download,
  Upload,
  Save,
  RotateCcw,
} from 'lucide-react'
import { downloadFile, readFile } from '@/lib/utils'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { settings, updateSettings, exportData, importData, resetTimer } =
    usePomodoroStore()

  const { theme, setTheme } = useTheme()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Local state for timer settings
  const [timerSettings, setTimerSettings] = useState(settings.timer)
  const [soundSettings, setSoundSettings] = useState(settings.sound)
  const [notificationSettings, setNotificationSettings] = useState(
    settings.notifications
  )

  const handleSaveTimerSettings = async () => {
    try {
      await updateSettings({ timer: timerSettings })
      resetTimer() // Reset current timer with new durations
      toast.success('Timer settings saved')
    } catch {
      toast.error('Failed to save timer settings')
    }
  }

  const handleSaveSoundSettings = async () => {
    try {
      await updateSettings({ sound: soundSettings })
      toast.success('Sound settings saved')
    } catch {
      toast.error('Failed to save sound settings')
    }
  }

  const handleSaveNotificationSettings = async () => {
    try {
      await updateSettings({ notifications: notificationSettings })
      toast.success('Notification settings saved')
    } catch {
      toast.error('Failed to save notification settings')
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const data = await exportData()
      downloadFile(
        data,
        `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`
      )
      toast.success('Data exported successfully')
    } catch {
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = async () => {
    setIsImporting(true)
    try {
      const fileContent = await readFile()
      await importData(fileContent)
      toast.success('Data imported successfully')
      // Refresh settings from store
      setTimerSettings(settings.timer)
      setSoundSettings(settings.sound)
      setNotificationSettings(settings.notifications)
    } catch {
      toast.error('Failed to import data. Please check the file format.')
    } finally {
      setIsImporting(false)
    }
  }

  const resetToDefaults = async () => {
    const defaultSettings = {
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
      theme: 'system' as const,
      focusMode: false,
      language: 'en' as const,
    }

    try {
      await updateSettings(defaultSettings)
      setTimerSettings(defaultSettings.timer)
      setSoundSettings(defaultSettings.sound)
      setNotificationSettings(defaultSettings.notifications)
      setTheme(defaultSettings.theme)
      toast.success('Settings reset to defaults')
    } catch {
      toast.error('Failed to reset settings')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Pomodoro experience
          </p>
        </div>

        {/* Timer Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Timer</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pomodoro-duration">
                Focus Duration (minutes)
              </Label>
              <Input
                id="pomodoro-duration"
                type="number"
                min="1"
                max="120"
                value={timerSettings.pomodoro}
                onChange={(e) =>
                  setTimerSettings({
                    ...timerSettings,
                    pomodoro: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-break-duration">
                Short Break (minutes)
              </Label>
              <Input
                id="short-break-duration"
                type="number"
                min="1"
                max="60"
                value={timerSettings.shortBreak}
                onChange={(e) =>
                  setTimerSettings({
                    ...timerSettings,
                    shortBreak: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break-duration">Long Break (minutes)</Label>
              <Input
                id="long-break-duration"
                type="number"
                min="1"
                max="120"
                value={timerSettings.longBreak}
                onChange={(e) =>
                  setTimerSettings({
                    ...timerSettings,
                    longBreak: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
              <Switch
                id="auto-start-breaks"
                checked={timerSettings.autoStartBreaks}
                onCheckedChange={(checked) =>
                  setTimerSettings({
                    ...timerSettings,
                    autoStartBreaks: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-pomodoros">
                Auto-start focus sessions
              </Label>
              <Switch
                id="auto-start-pomodoros"
                checked={timerSettings.autoStartPomodoros}
                onCheckedChange={(checked) =>
                  setTimerSettings({
                    ...timerSettings,
                    autoStartPomodoros: checked,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="long-break-interval">
              Long break interval (pomodoros)
            </Label>
            <Select
              value={timerSettings.longBreakInterval.toString()}
              onValueChange={(value) =>
                setTimerSettings({
                  ...timerSettings,
                  longBreakInterval: Number(value),
                })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Every 2 pomodoros</SelectItem>
                <SelectItem value="3">Every 3 pomodoros</SelectItem>
                <SelectItem value="4">Every 4 pomodoros</SelectItem>
                <SelectItem value="5">Every 5 pomodoros</SelectItem>
                <SelectItem value="6">Every 6 pomodoros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveTimerSettings}>
              <Save className="w-4 h-4 mr-2" />
              Save Timer Settings
            </Button>
          </div>
        </Card>

        {/* Sound Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Volume2 className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Sound</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Enable sounds</Label>
              <Switch
                id="sound-enabled"
                checked={soundSettings.enabled}
                onCheckedChange={(checked) =>
                  setSoundSettings({
                    ...soundSettings,
                    enabled: checked,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={soundSettings.volume}
                onChange={(e) =>
                  setSoundSettings({
                    ...soundSettings,
                    volume: Number(e.target.value),
                  })
                }
                disabled={!soundSettings.enabled}
              />
              <div className="text-sm text-muted-foreground">
                {Math.round(soundSettings.volume * 100)}%
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSoundSettings}>
              <Save className="w-4 h-4 mr-2" />
              Save Sound Settings
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-enabled">
                Enable notifications
              </Label>
              <Switch
                id="notifications-enabled"
                checked={notificationSettings.enabled}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    enabled: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications">
                Desktop notifications
              </Label>
              <Switch
                id="desktop-notifications"
                checked={notificationSettings.desktop}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    desktop: checked,
                  })
                }
                disabled={!notificationSettings.enabled}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveNotificationSettings}>
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>

              <Button
                onClick={handleImportData}
                disabled={isImporting}
                variant="outline"
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium text-destructive">Danger Zone</h3>
              <Button
                onClick={resetToDefaults}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Settings
              </Button>
              <p className="text-sm text-muted-foreground">
                This will reset all settings to their default values. Your tasks
                and session data will remain intact.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
