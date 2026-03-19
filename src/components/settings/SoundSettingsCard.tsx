'use client'

import { useState, useEffect } from 'react'
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
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-lg font-semibold">Sound</h2>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
          <Label htmlFor="sound-enabled" className="text-sm">
            Enable sounds
          </Label>
          <Switch
            id="sound-enabled"
            checked={local.enabled}
            onCheckedChange={(checked) =>
              setLocal({ ...local, enabled: checked })
            }
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume" className="text-xs text-muted-foreground">
              Volume
            </Label>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round(local.volume * 100)}%
            </span>
          </div>
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
            className="accent-emerald-500"
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
