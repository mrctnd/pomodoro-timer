'use client'

import { useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { Task } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Target, ListTodo } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { TaskItem } from './tasks/TaskItem'
import { TaskAddForm } from './tasks/TaskAddForm'
import { TaskEditDialog } from './tasks/TaskEditDialog'

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

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddTask = async (title: string) => {
    await addTask({
      title,
      description: '',
      completed: false,
      pomodoroCount: 0,
      estimatedPomodoros: 1,
      tags: [],
    })
  }

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { completed: !task.completed })
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
      reorderTasks(arrayMove(tasks, oldIndex, newIndex))
    }
  }

  const activeCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="relative rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-xl p-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Tasks</h2>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-medium bg-muted/50 border border-border/30"
          >
            {activeCount} active
          </Badge>
        </div>

        {/* Add Form */}
        <TaskAddForm onAdd={handleAddTask} />

        {/* Task List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
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
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 text-muted-foreground"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/30 border border-border/30 flex items-center justify-center">
                <Target className="w-7 h-7 opacity-40" />
              </div>
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Add a task to get started!
              </p>
            </motion.div>
          )}
        </div>

        <TaskEditDialog
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      </div>
    </div>
  )
}
