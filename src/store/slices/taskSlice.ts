import { StateCreator } from 'zustand'
import { Task } from '@/types'
import { dbUtils } from '@/lib/database'
import { localStorageUtils } from '@/lib/storage'
import { PomodoroStore } from '../usePomodoro'

export interface TaskSlice {
  tasks: Task[]
  currentTaskId?: string

  addTask: (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (tasks: Task[]) => Promise<void>
  setCurrentTask: (taskId?: string) => void
}

export const createTaskSlice: StateCreator<PomodoroStore, [], [], TaskSlice> = (
  set,
  get
) => ({
  tasks: [],
  currentTaskId: undefined,

  addTask: async (taskData) => {
    try {
      const state = get()
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...taskData,
        completed: false,
        pomodoroCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: state.tasks.length,
      }

      await dbUtils.addTask(newTask)
      set({ tasks: [...state.tasks, newTask] })
    } catch (error) {
      console.error('Failed to add task:', error)
      throw error
    }
  },

  updateTask: async (id, updates) => {
    try {
      await dbUtils.updateTask(id, updates)
      const state = get()
      set({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
        ),
      })
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await dbUtils.deleteTask(id)
      const state = get()
      set({
        tasks: state.tasks.filter((task) => task.id !== id),
        currentTaskId:
          state.currentTaskId === id ? undefined : state.currentTaskId,
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  },

  reorderTasks: async (reorderedTasks) => {
    try {
      await dbUtils.reorderTasks(reorderedTasks)
      set({ tasks: reorderedTasks })
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
      throw error
    }
  },

  setCurrentTask: (taskId) => {
    set({ currentTaskId: taskId })
    if (taskId === undefined) {
      localStorageUtils.removeItem('currentTaskId')
    } else {
      localStorageUtils.setItem('currentTaskId', taskId)
    }
  },
})
