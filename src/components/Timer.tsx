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
    <div className="relative flex flex-col items-center gap-8 py-4">
      {/* Mode Label */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="z-10"
      >
        <h2
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: modeColor }}
        >
          {getTimerModeLabel(currentMode)}
        </h2>
      </motion.div>

      {/* Circular Clock Body */}
      <div
        className="relative w-[320px] h-[320px] rounded-full flex items-center justify-center transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${modeColor}15 0%, ${modeColor}05 70%, transparent 100%)`,
          boxShadow: `0 20px 60px -15px ${modeColor}30, inset 0 10px 40px -10px ${modeColor}20`,
        }}
      >
        {/* Subtle Inner Glass Ring */}
        <div
          className="absolute inset-4 rounded-full border border-white/5 dark:border-white/5 backdrop-blur-sm shadow-inner transition-colors duration-700"
          style={{
            background: `linear-gradient(135deg, ${modeColor}08, ${modeColor}02)`,
          }}
        />

        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="absolute inset-0 z-10 drop-shadow-md"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
            <filter id="timer-glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
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
            strokeWidth="8"
            className="text-muted/10"
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
        <div className="relative z-20 flex flex-col items-center gap-2">
          <motion.div
            key={`${timeLeft}-${currentMode}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-[4rem] leading-none font-bold font-mono tracking-tight"
            style={{ color: modeColor }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground/80 tracking-wide">
            {timerState === 'running'
              ? 'Focus time'
              : timerState === 'paused'
                ? 'Paused'
                : 'Ready to start'}
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground z-10">
        <span>Session {stats.completedPomodoros + 1}</span>
        {timerState === 'running' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/50"
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse shadow-sm"
              style={{
                backgroundColor: modeColor,
                boxShadow: `0 0 8px ${modeColor}`,
              }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active
            </span>
          </motion.div>
        )}
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
