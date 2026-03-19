'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
        className="flex-1"
      />
      <Button onClick={handleSubmit} disabled={!title.trim()}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
