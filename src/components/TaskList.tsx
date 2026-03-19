'use client'

import { useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { Task } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <Badge variant="secondary">
            {tasks.filter((t) => !t.completed).length} active
          </Badge>
        </div>

        <TaskAddForm onAdd={handleAddTask} />

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
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>

        <TaskEditDialog
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      </div>
    </Card>
  )
}
