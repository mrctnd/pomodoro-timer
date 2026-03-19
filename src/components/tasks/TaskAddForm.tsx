'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface TaskAddFormProps {
  onAdd: (title: string) => Promise<void>
}

export function TaskAddForm({ onAdd }: TaskAddFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) return

    try {
      await onAdd(title.trim())
      setTitle('')
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="flex-1 rounded-xl border-border/40 bg-muted/30 backdrop-blur-sm focus:bg-background/80 transition-all"
      />
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
