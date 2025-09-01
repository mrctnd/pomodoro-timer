'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import {
  formatTime,
  getTimerModeLabel,
  getTimerModeColor,
  calculateProgress,
} from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Timer() {
  const { currentMode, timeLeft, timerState, settings } = usePomodoroStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const totalTime = settings.timer[currentMode] * 60
  const progress = calculateProgress(timeLeft, totalTime)
  const modeColor = getTimerModeColor(currentMode)

  return (
    <Card className="p-8 text-center">
      <div className="space-y-6">
        {/* Mode Label */}
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-lg font-medium text-muted-foreground">
            {getTimerModeLabel(currentMode)}
          </h2>
        </motion.div>

        {/* Circular Progress */}
        <div className="relative mx-auto w-64 h-64">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={modeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={`${timeLeft}-${currentMode}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-5xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {timerState === 'running'
                  ? 'Focus time'
                  : timerState === 'paused'
                    ? 'Paused'
                    : 'Ready to start'}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Linear Progress Bar (for accessibility) */}
        <div className="sr-only">
          <Progress
            value={progress}
            className="w-full"
            aria-label={`Timer progress: ${Math.round(progress)}% complete`}
          />
        </div>

        {/* Session Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Session {Math.floor((totalTime - timeLeft) / 60) + 1}</div>
          {timerState === 'running' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-1"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  )
}
