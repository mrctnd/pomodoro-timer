'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Dynamically import components to avoid SSR issues
const Timer = dynamic(
  () => import('@/components/Timer').then((mod) => ({ default: mod.Timer })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-card rounded-lg animate-pulse" />,
  }
)

const TimerControls = dynamic(
  () =>
    import('@/components/TimerControls').then((mod) => ({
      default: mod.TimerControls,
    })),
  {
    ssr: false,
    loading: () => <div className="h-32 bg-card rounded-lg animate-pulse" />,
  }
)

const TaskList = dynamic(
  () =>
    import('@/components/TaskList').then((mod) => ({ default: mod.TaskList })),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-card rounded-lg animate-pulse" />,
  }
)

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 bg-card rounded-lg animate-pulse" />
            <div className="space-y-6">
              <div className="h-32 bg-card rounded-lg animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-card rounded-lg animate-pulse" />
                <div className="h-16 bg-card rounded-lg animate-pulse" />
                <div className="h-16 bg-card rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
          <div className="h-96 bg-card rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Main Timer Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div layout className="lg:col-span-1">
            <Timer />
          </motion.div>
          <motion.div layout className="lg:col-span-1 space-y-6">
            <TimerControls />

            {/* Quick Stats - Simple placeholders for now */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 text-center"
            >
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">0h</div>
                <div className="text-sm text-muted-foreground">Focus Time</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TaskList />
        </motion.div>
      </motion.div>
    </div>
  )
}
