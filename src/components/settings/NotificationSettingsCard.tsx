'use client'

import { useState, useEffect } from 'react'
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
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Bell className="w-4 h-4 text-purple-500" />
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
          <Label htmlFor="notifications-enabled" className="text-sm">
            Enable notifications
          </Label>
          <Switch
            id="notifications-enabled"
            checked={local.enabled}
            onCheckedChange={(checked) =>
              setLocal({ ...local, enabled: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
          <Label htmlFor="desktop-notifications" className="text-sm">
            Desktop notifications
          </Label>
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
        <Button onClick={handleSave} className="rounded-xl shadow-sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}
