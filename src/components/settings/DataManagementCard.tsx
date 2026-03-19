'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, RotateCcw, Database } from 'lucide-react'
import { downloadFile, readFile } from '@/lib/utils'
import { toast } from 'sonner'

interface DataManagementCardProps {
  onExport: () => Promise<string>
  onImport: (data: string) => Promise<void>
  onReset: () => Promise<void>
}

export function DataManagementCard({
  onExport,
  onImport,
  onReset,
}: DataManagementCardProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await onExport()
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

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const fileContent = await readFile()
      await onImport(fileContent)
      toast.success('Data imported successfully')
    } catch {
      toast.error('Failed to import data. Please check the file format.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleReset = async () => {
    try {
      await onReset()
      toast.success('Settings reset to defaults')
    } catch {
      toast.error('Failed to reset settings')
    }
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Database className="w-4 h-4 text-cyan-500" />
        </div>
        <h2 className="text-lg font-semibold">Data Management</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>

          <Button
            onClick={handleImport}
            disabled={isImporting}
            variant="outline"
            className="rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>

        <div className="border-t border-border/30 pt-4">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <h3 className="text-sm font-medium text-destructive mb-2">
              Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Reset all settings to defaults. Tasks and session data remain
              intact.
            </p>
            <Button
              onClick={handleReset}
              variant="destructive"
              size="sm"
              className="rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Reset Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
