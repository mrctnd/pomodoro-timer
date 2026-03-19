'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Volume2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface SoundSettings {
  enabled: boolean
  startSound: string
  endSound: string
  volume: number
}

interface SoundSettingsCardProps {
  settings: SoundSettings
  onSave: (settings: SoundSettings) => Promise<void>
}

export function SoundSettingsCard({
  settings,
  onSave,
}: SoundSettingsCardProps) {
  const [local, setLocal] = useState(settings)

  useEffect(() => {
    setLocal(settings)
  }, [settings])

  const handleSave = async () => {
    try {
      await onSave(local)
      toast.success('Sound settings saved')
    } catch {
      toast.error('Failed to save sound settings')
    }
  }

  return (
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
            checked={local.enabled}
            onCheckedChange={(checked) =>
              setLocal({ ...local, enabled: checked })
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
            value={local.volume}
            onChange={(e) =>
              setLocal({ ...local, volume: Number(e.target.value) })
            }
            disabled={!local.enabled}
          />
          <div className="text-sm text-muted-foreground">
            {Math.round(local.volume * 100)}%
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Sound Settings
        </Button>
      </div>
    </Card>
  )
}
