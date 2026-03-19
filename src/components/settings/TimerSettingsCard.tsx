'use client'

import { useState, useEffect } from 'react'
import { TimerSettings } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock, Save } from 'lucide-react'
import { toast } from 'sonner'

interface TimerSettingsCardProps {
  settings: TimerSettings
  onSave: (settings: TimerSettings) => Promise<void>
}

export function TimerSettingsCard({
  settings,
  onSave,
}: TimerSettingsCardProps) {
  const [local, setLocal] = useState(settings)

  useEffect(() => {
    setLocal(settings)
  }, [settings])

  const handleSave = async () => {
    try {
      await onSave(local)
      toast.success('Timer settings saved')
    } catch {
      toast.error('Failed to save timer settings')
    }
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Clock className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold">Timer</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label
            htmlFor="pomodoro-duration"
            className="text-xs text-muted-foreground"
          >
            Focus Duration (min)
          </Label>
          <Input
            id="pomodoro-duration"
            type="number"
            min="1"
            max="120"
            value={local.pomodoro}
            onChange={(e) =>
              setLocal({ ...local, pomodoro: Number(e.target.value) })
            }
            className="rounded-xl border-border/40 bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="short-break-duration"
            className="text-xs text-muted-foreground"
          >
            Short Break (min)
          </Label>
          <Input
            id="short-break-duration"
            type="number"
            min="1"
            max="60"
            value={local.shortBreak}
            onChange={(e) =>
              setLocal({ ...local, shortBreak: Number(e.target.value) })
            }
            className="rounded-xl border-border/40 bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="long-break-duration"
            className="text-xs text-muted-foreground"
          >
            Long Break (min)
          </Label>
          <Input
            id="long-break-duration"
            type="number"
            min="1"
            max="120"
            value={local.longBreak}
            onChange={(e) =>
              setLocal({ ...local, longBreak: Number(e.target.value) })
            }
            className="rounded-xl border-border/40 bg-muted/30"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
          <Label htmlFor="auto-start-breaks" className="text-sm">
            Auto-start breaks
          </Label>
          <Switch
            id="auto-start-breaks"
            checked={local.autoStartBreaks}
            onCheckedChange={(checked) =>
              setLocal({ ...local, autoStartBreaks: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
          <Label htmlFor="auto-start-pomodoros" className="text-sm">
            Auto-start focus
          </Label>
          <Switch
            id="auto-start-pomodoros"
            checked={local.autoStartPomodoros}
            onCheckedChange={(checked) =>
              setLocal({ ...local, autoStartPomodoros: checked })
            }
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Label
          htmlFor="long-break-interval"
          className="text-xs text-muted-foreground"
        >
          Long break interval
        </Label>
        <Select
          value={local.longBreakInterval.toString()}
          onValueChange={(value) =>
            setLocal({ ...local, longBreakInterval: Number(value) })
          }
        >
          <SelectTrigger className="w-full rounded-xl border-border/40 bg-muted/30">
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
        <Button onClick={handleSave} className="rounded-xl shadow-sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}
