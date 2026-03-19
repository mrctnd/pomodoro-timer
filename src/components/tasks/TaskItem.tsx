'use client'

import { Task } from '@/types'
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
        'group flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-border/60 hover:bg-background/80',
        isDragging && 'shadow-xl z-10 border-border',
        isSelected && 'ring-2 ring-primary/50 border-primary/30 bg-primary/5',
        task.completed && 'opacity-50'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
          task.completed
            ? 'bg-green-500/20 border-green-500 text-green-500'
            : 'border-muted-foreground/30 hover:border-muted-foreground/50'
        )}
      >
        {task.completed && <Check className="w-3 h-3" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm font-medium truncate',
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-muted-foreground/70 truncate mt-0.5">
            {task.description}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-5 rounded-md bg-muted/50 border border-border/30 font-mono"
          >
            {task.pomodoroCount}/{task.estimatedPomodoros}
          </Badge>
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 rounded-md"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSelect(task.id)}
          className={cn(
            'p-1.5 rounded-lg transition-all duration-200 hover:bg-muted/80',
            isSelected && 'bg-primary/10 text-primary'
          )}
        >
          <Target className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg transition-all duration-200 hover:bg-muted/80 text-muted-foreground"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg transition-all duration-200 hover:bg-destructive/10 text-destructive/70 hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
