'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Estimated pomodoros"
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
            min={1}
            max={50}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
