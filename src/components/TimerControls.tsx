'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import { useAudio } from '@/hooks/useAudio'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, RotateCcw, Coffee, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { getTimerModeLabel } from '@/lib/utils'

export function TimerControls() {
  const {
    timerState,
    currentMode,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = usePomodoroStore()

  const { playStartSound, playClickSound } = useAudio()
  const { showNotification } = useNotifications()

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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={timerState === 'running' ? handlePause : handleStart}
              size="lg"
              className="h-14 px-8 text-lg font-medium"
            >
              {timerState === 'running' ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {timerState === 'paused' ? 'Resume' : 'Start'}
                </>
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="h-14 px-6"
              disabled={timerState === 'idle'}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </motion.div>
        </div>

        <Separator />

        {/* Mode Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-center text-muted-foreground">
            Timer Mode
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleModeSwitch('pomodoro')}
                variant={currentMode === 'pomodoro' ? 'default' : 'outline'}
                className="w-full"
                disabled={timerState === 'running'}
              >
                <Zap className="w-4 h-4 mr-2" />
                Focus
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleModeSwitch('shortBreak')}
                variant={currentMode === 'shortBreak' ? 'default' : 'outline'}
                className="w-full"
                disabled={timerState === 'running'}
              >
                <Coffee className="w-4 h-4 mr-2" />
                Short
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleModeSwitch('longBreak')}
                variant={currentMode === 'longBreak' ? 'default' : 'outline'}
                className="w-full"
                disabled={timerState === 'running'}
              >
                <Clock className="w-4 h-4 mr-2" />
                Long
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-center text-sm text-muted-foreground">
          <div>
            Use{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd>{' '}
            to start/pause
          </div>
          <div className="mt-1">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">?</kbd> for
            more shortcuts
          </div>
        </div>
      </div>
    </Card>
  )
}
