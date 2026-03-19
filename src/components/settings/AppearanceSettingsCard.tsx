'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

export function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Palette className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="text-lg font-semibold">Appearance</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme" className="text-xs text-muted-foreground">
          Theme
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                theme === opt.value
                  ? 'border-primary/50 bg-primary/5 text-foreground shadow-sm'
                  : 'border-border/30 bg-muted/20 text-muted-foreground hover:bg-muted/40'
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
