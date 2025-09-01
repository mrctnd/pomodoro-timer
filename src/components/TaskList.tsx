'use client'

import { useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { Task } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Check, Trash2, Edit, GripVertical, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

function SortableTaskItem({
  task,
  onEdit,
  onDelete,
  onToggle,
  onSelect,
  isSelected,
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  isSelected: boolean
}) {
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
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Complete Checkbox */}
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

      {/* Task Content */}
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

      {/* Actions */}
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

export function TaskList() {
  const {
    tasks,
    currentTaskId,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    setCurrentTask,
  } = usePomodoroStore()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editEstimated, setEditEstimated] = useState(1)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    try {
      await addTask({
        title: newTaskTitle.trim(),
        description: '',
        completed: false,
        pomodoroCount: 0,
        estimatedPomodoros: 1,
        tags: [],
      })
      setNewTaskTitle('')
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditEstimated(task.estimatedPomodoros)
  }

  const handleSaveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return

    try {
      await updateTask(editingTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        estimatedPomodoros: editEstimated,
      })
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      await updateTask(id, { completed: !task.completed })
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleSelectTask = (id: string) => {
    setCurrentTask(currentTaskId === id ? undefined : id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id)
      const newIndex = tasks.findIndex((task) => task.id === over.id)

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex)
      reorderTasks(reorderedTasks)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Badge variant="secondary">
            {tasks.filter((t) => !t.completed).length} active
          </Badge>
        </div>

        {/* Add New Task */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {tasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={deleteTask}
                    onToggle={handleToggleComplete}
                    onSelect={handleSelectTask}
                    isSelected={currentTaskId === task.id}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Edit Task Modal */}
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Input
                  placeholder="Description (optional)"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Estimated pomodoros"
                  value={editEstimated}
                  onChange={(e) => setEditEstimated(Number(e.target.value))}
                  min={1}
                  max={50}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}
