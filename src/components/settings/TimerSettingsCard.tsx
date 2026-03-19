'use client'

import { useState, useEffect } from 'react'
import { TimerSettings } from '@/types'
import { Card } from '@/components/ui/card'
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Timer</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="pomodoro-duration">Focus Duration (minutes)</Label>
          <Input
            id="pomodoro-duration"
            type="number"
            min="1"
            max="120"
            value={local.pomodoro}
            onChange={(e) =>
              setLocal({ ...local, pomodoro: Number(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short-break-duration">Short Break (minutes)</Label>
          <Input
            id="short-break-duration"
            type="number"
            min="1"
            max="60"
            value={local.shortBreak}
            onChange={(e) =>
              setLocal({ ...local, shortBreak: Number(e.target.value) })
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
            value={local.longBreak}
            onChange={(e) =>
              setLocal({ ...local, longBreak: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
          <Switch
            id="auto-start-breaks"
            checked={local.autoStartBreaks}
            onCheckedChange={(checked) =>
              setLocal({ ...local, autoStartBreaks: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-start-pomodoros">
            Auto-start focus sessions
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

      <div className="mt-6">
        <Label htmlFor="long-break-interval">
          Long break interval (pomodoros)
        </Label>
        <Select
          value={local.longBreakInterval.toString()}
          onValueChange={(value) =>
            setLocal({ ...local, longBreakInterval: Number(value) })
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
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Timer Settings
        </Button>
      </div>
    </Card>
  )
}
