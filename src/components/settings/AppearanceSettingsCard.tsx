'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette } from 'lucide-react'
import { useTheme } from 'next-themes'

export function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
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
  )
}
