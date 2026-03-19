'use client'

import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Trash2, Edit, GripVertical, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  isSelected: boolean
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggle,
  onSelect,
  isSelected,
}: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg border transition-all',
        isDragging && 'shadow-lg z-10',
        isSelected && 'ring-2 ring-primary',
        task.completed && 'opacity-60'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <Button
        onClick={() => onToggle(task.id)}
        variant="ghost"
        size="sm"
        className="p-0 w-5 h-5 rounded"
      >
        <Check
          className={cn(
            'w-4 h-4',
            task.completed ? 'text-green-600' : 'text-muted-foreground'
          )}
        />
      </Button>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'font-medium truncate',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-sm text-muted-foreground truncate">
            {task.description}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {task.pomodoroCount}/{task.estimatedPomodoros}
          </Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={() => onSelect(task.id)}
          variant="ghost"
          size="sm"
          className={cn(
            'p-1',
            isSelected && 'bg-primary text-primary-foreground'
          )}
        >
          <Target className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onEdit(task)}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDelete(task.id)}
          variant="ghost"
          size="sm"
          className="p-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
