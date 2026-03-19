'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TaskEditDialogProps {
  task: Task | null
  onSave: (id: string, updates: Partial<Task>) => Promise<void>
  onClose: () => void
}

export function TaskEditDialog({ task, onSave, onClose }: TaskEditDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setEstimatedPomodoros(task.estimatedPomodoros)
    }
  }, [task])

  const handleSave = async () => {
    if (!task || !title.trim()) return

    try {
      await onSave(task.id, {
        title: title.trim(),
        description: description.trim(),
        estimatedPomodoros,
      })
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Title
            </Label>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border/40 bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Description
            </Label>
            <Input
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-border/40 bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Estimated Pomodoros
            </Label>
            <Input
              type="number"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
              min={1}
              max={50}
              className="rounded-xl border-border/40 bg-muted/30 w-24"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-xl shadow-sm">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
