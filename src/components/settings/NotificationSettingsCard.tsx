'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Save } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationSettings {
  enabled: boolean
  desktop: boolean
}

interface NotificationSettingsCardProps {
  settings: NotificationSettings
  onSave: (settings: NotificationSettings) => Promise<void>
}

export function NotificationSettingsCard({
  settings,
  onSave,
}: NotificationSettingsCardProps) {
  const [local, setLocal] = useState(settings)

  useEffect(() => {
    setLocal(settings)
  }, [settings])

  const handleSave = async () => {
    try {
      await onSave(local)
      toast.success('Notification settings saved')
    } catch {
      toast.error('Failed to save notification settings')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-enabled">Enable notifications</Label>
          <Switch
            id="notifications-enabled"
            checked={local.enabled}
            onCheckedChange={(checked) =>
              setLocal({ ...local, enabled: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="desktop-notifications">Desktop notifications</Label>
          <Switch
            id="desktop-notifications"
            checked={local.desktop}
            onCheckedChange={(checked) =>
              setLocal({ ...local, desktop: checked })
            }
            disabled={!local.enabled}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Notification Settings
        </Button>
      </div>
    </Card>
  )
}
