'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import {
  formatTime,
  getTimerModeLabel,
  getTimerModeColor,
  getTimerModeGradient,
  calculateProgress,
} from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'

export function Timer() {
  const { currentMode, timeLeft, timerState, settings, stats } =
    usePomodoroStore()

  const totalTime = settings.timer[currentMode] * 60
  const progress = calculateProgress(timeLeft, totalTime)
  const modeColor = getTimerModeColor(currentMode)
  const gradient = getTimerModeGradient(currentMode)

  const circumference = 2 * Math.PI * 140
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const gradientId = `timer-gradient-${currentMode}`

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-2xl">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${modeColor}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Mode Label */}
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {getTimerModeLabel(currentMode)}
          </h2>
        </motion.div>

        {/* Circular Progress */}
        <div
          className="relative rounded-3xl p-6 backdrop-blur-xl border border-border/30"
          style={{
            background: `linear-gradient(135deg, ${modeColor}08, ${modeColor}04)`,
          }}
        >
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg
              width="288"
              height="288"
              viewBox="0 0 320 320"
              className="absolute inset-0"
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={gradient.from} />
                  <stop offset="100%" stopColor={gradient.to} />
                </linearGradient>
                <filter id="timer-glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted/20"
              />

              {/* Progress circle */}
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 160 160)"
                filter="url(#timer-glow)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <motion.div
                key={`${timeLeft}-${currentMode}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-6xl font-bold font-mono"
                style={{ color: modeColor }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                {timerState === 'running'
                  ? 'Focus time'
                  : timerState === 'paused'
                    ? 'Paused'
                    : 'Ready to start'}
              </div>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Session {stats.completedPomodoros + 1}</span>
          {timerState === 'running' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5"
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: modeColor }}
              />
              <span>Active</span>
            </motion.div>
          )}
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
    </div>
  )
}
