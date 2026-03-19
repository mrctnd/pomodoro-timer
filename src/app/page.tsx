'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { formatDuration } from '@/lib/utils'
import { Zap, Clock, Flame } from 'lucide-react'

const Timer = dynamic(
  () => import('@/components/Timer').then((mod) => ({ default: mod.Timer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] bg-muted/20 rounded-3xl animate-pulse border border-border/30" />
    ),
  }
)

const TimerControls = dynamic(
  () =>
    import('@/components/TimerControls').then((mod) => ({
      default: mod.TimerControls,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 bg-muted/20 rounded-3xl animate-pulse border border-border/30" />
    ),
  }
)

const TaskList = dynamic(
  () =>
    import('@/components/TaskList').then((mod) => ({ default: mod.TaskList })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-muted/20 rounded-3xl animate-pulse border border-border/30" />
    ),
  }
)

const quickStats = [
  {
    key: 'sessions',
    label: 'Sessions',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'focusTime',
    label: 'Focus Time',
    icon: Clock,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'streak',
    label: 'Day Streak',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
] as const

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const stats = usePomodoroStore((state) => state.stats)

  useKeyboardShortcuts()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="h-[420px] w-full max-w-lg bg-muted/20 rounded-3xl animate-pulse border border-border/30" />
            <div className="h-32 w-full max-w-md bg-muted/20 rounded-3xl animate-pulse border border-border/30" />
          </div>
        </div>
      </div>
    )
  }

  const statValues = {
    sessions: stats.completedPomodoros,
    focusTime: formatDuration(stats.totalFocusTime),
    streak: stats.streak,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Timer Section - Centered */}
        <div className="flex flex-col items-center gap-6">
          <Timer />
          <TimerControls />
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 max-w-lg mx-auto"
        >
          {quickStats.map((stat) => (
            <div
              key={stat.key}
              className="relative rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-4 text-center transition-all duration-200 hover:border-border/60 hover:shadow-sm"
            >
              <div
                className={`w-8 h-8 mx-auto mb-2 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-xl font-bold">{statValues[stat.key]}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <TaskList />
        </motion.div>
      </motion.div>
    </div>
  )
}
