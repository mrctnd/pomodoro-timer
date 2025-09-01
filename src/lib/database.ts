import Dexie, { Table } from 'dexie'
import { Task, PomodoroSession, AppSettings } from '@/types'

export class PomodoroDatabase extends Dexie {
  tasks!: Table<Task>
  sessions!: Table<PomodoroSession>
  settings!: Table<AppSettings & { id: string }>

  constructor() {
    super('PomodoroDatabase')
    this.version(1).stores({
      tasks: '++id, title, completed, createdAt, updatedAt, order',
      sessions: '++id, taskId, mode, startTime, endTime, createdAt',
      settings: '++id',
    })
  }
}

export const db = new PomodoroDatabase()

// Database utilities
export const dbUtils = {
  async getTasks(): Promise<Task[]> {
    try {
      return await db.tasks.orderBy('order').toArray()
    } catch (error) {
      console.error('Failed to get tasks:', error)
      return []
    }
  },

  async addTask(task: Omit<Task, 'id'>): Promise<string> {
    try {
      const id = await db.tasks.add({ ...task, id: crypto.randomUUID() })
      return id as string
    } catch (error) {
      console.error('Failed to add task:', error)
      throw error
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
      await db.tasks.update(id, { ...updates, updatedAt: Date.now() })
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await db.tasks.delete(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  },

  async reorderTasks(tasks: Task[]): Promise<void> {
    try {
      await db.transaction('rw', db.tasks, async () => {
        for (let i = 0; i < tasks.length; i++) {
          await db.tasks.update(tasks[i].id, { order: i })
        }
      })
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
      throw error
    }
  },

  async getSessions(limit?: number): Promise<PomodoroSession[]> {
    try {
      const query = db.sessions.orderBy('createdAt').reverse()
      return limit ? await query.limit(limit).toArray() : await query.toArray()
    } catch (error) {
      console.error('Failed to get sessions:', error)
      return []
    }
  },

  async addSession(session: Omit<PomodoroSession, 'id'>): Promise<string> {
    try {
      const id = await db.sessions.add({
        ...session,
        id: crypto.randomUUID(),
      })
      return id as string
    } catch (error) {
      console.error('Failed to add session:', error)
      throw error
    }
  },

  async updateSession(
    id: string,
    updates: Partial<PomodoroSession>
  ): Promise<void> {
    try {
      await db.sessions.update(id, updates)
    } catch (error) {
      console.error('Failed to update session:', error)
      throw error
    }
  },

  async getSettings(): Promise<AppSettings | null> {
    try {
      const settings = await db.settings.limit(1).first()
      return settings ? { ...settings } : null
    } catch (error) {
      console.error('Failed to get settings:', error)
      return null
    }
  },

  async updateSettings(settings: AppSettings): Promise<void> {
    try {
      const existing = await db.settings.limit(1).first()
      if (existing) {
        await db.settings.update(existing.id, settings)
      } else {
        await db.settings.add({ ...settings, id: 'main' })
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  },

  async exportData(): Promise<string> {
    try {
      const [tasks, sessions, settings] = await Promise.all([
        db.tasks.toArray(),
        db.sessions.toArray(),
        db.settings.toArray(),
      ])

      return JSON.stringify(
        {
          version: 1,
          exportDate: new Date().toISOString(),
          data: { tasks, sessions, settings },
        },
        null,
        2
      )
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  },

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)

      if (!data.data || !data.version) {
        throw new Error('Invalid data format')
      }

      await db.transaction(
        'rw',
        [db.tasks, db.sessions, db.settings],
        async () => {
          // Clear existing data
          await db.tasks.clear()
          await db.sessions.clear()
          await db.settings.clear()

          // Import new data
          if (data.data.tasks) {
            await db.tasks.bulkAdd(data.data.tasks)
          }
          if (data.data.sessions) {
            await db.sessions.bulkAdd(data.data.sessions)
          }
          if (data.data.settings) {
            await db.settings.bulkAdd(data.data.settings)
          }
        }
      )
    } catch (error) {
      console.error('Failed to import data:', error)
      throw error
    }
  },
}

// Fallback localStorage utilities
export const localStorageUtils = {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },
}
