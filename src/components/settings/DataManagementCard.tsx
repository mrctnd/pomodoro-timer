'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, Upload, RotateCcw } from 'lucide-react'
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Data Management</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>

          <Button
            onClick={handleImport}
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
            onClick={handleReset}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Settings
          </Button>
          <p className="text-sm text-muted-foreground">
            This will reset all settings to their default values. Your tasks and
            session data will remain intact.
          </p>
        </div>
      </div>
    </Card>
  )
}
