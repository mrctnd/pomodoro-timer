'use client'

import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { useAudio } from '@/hooks/useAudio'
import { useNotifications } from '@/hooks/useNotifications'
import { Play, Pause, RotateCcw, Coffee, Clock, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getTimerModeLabel,
  getTimerModeColor,
  getTimerModeGradient,
} from '@/lib/utils'

const modeConfig = [
  { mode: 'pomodoro' as const, label: 'Focus', icon: Zap },
  { mode: 'shortBreak' as const, label: 'Short Break', icon: Coffee },
  { mode: 'longBreak' as const, label: 'Long Break', icon: Clock },
]

export function TimerControls() {
  const {
    timerState,
    currentMode,
    timeLeft,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = usePomodoroStore()

  const { playStartSound, playClickSound, playEndSound } = useAudio()
  const { showNotification } = useNotifications()
  const prevTimeLeftRef = useRef(timeLeft)

  useEffect(() => {
    if (prevTimeLeftRef.current > 0 && timeLeft === 0) {
      playEndSound()
      showNotification({
        title: `${getTimerModeLabel(currentMode)} Complete!`,
        body: 'Time for the next session.',
      })
    }
    prevTimeLeftRef.current = timeLeft
  }, [timeLeft, currentMode, playEndSound, showNotification])

  const handleStart = () => {
    playStartSound()
    startTimer()
    showNotification({
      title: `${getTimerModeLabel(currentMode)} Started`,
      body: 'Stay focused! You got this.',
    })
  }

  const handlePause = () => {
    playClickSound()
    pauseTimer()
  }

  const handleReset = () => {
    playClickSound()
    resetTimer()
  }

  const handleModeSwitch = (mode: typeof currentMode) => {
    playClickSound()
    switchMode(mode)
  }

  const modeColor = getTimerModeColor(currentMode)
  const gradient = getTimerModeGradient(currentMode)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mode Selector - Pill shaped */}
      <AnimatePresence>
        {timerState !== 'running' && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: -24 }}
            transition={{ duration: 0.3 }}
            className="flex gap-1.5 p-1.5 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 overflow-hidden"
          >
            {modeConfig.map(({ mode, label, icon: Icon }) => {
              const isActive = currentMode === mode
              const modeGradient = getTimerModeGradient(mode)
              return (
                <button
                  key={mode}
                  onClick={() => handleModeSwitch(mode)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${modeGradient.from}, ${modeGradient.to})`,
                          boxShadow: `0 4px 20px ${getTimerModeColor(mode)}40`,
                        }
                      : undefined
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Controls */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={timerState === 'running' ? handlePause : handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-all cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            boxShadow: `0 8px 24px ${modeColor}40`,
          }}
        >
          {timerState === 'running' ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </motion.button>

        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={timerState === 'idle'}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-muted/80 hover:bg-muted text-foreground border border-border/50 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-xs text-muted-foreground/70">
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px] border border-border/30">
            Space
          </kbd>{' '}
          start/pause
        </span>
        <span className="mx-2">·</span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px] border border-border/30">
            ?
          </kbd>{' '}
          shortcuts
        </span>
      </div>
    </div>
  )
}
