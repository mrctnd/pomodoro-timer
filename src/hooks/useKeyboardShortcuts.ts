import { useEffect, useCallback, useMemo } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { useAudio } from './useAudio'

interface ShortcutEntry {
  keys: string[]
  description: string
  action: () => void
}

export function useKeyboardShortcuts() {
  const { timerState, startTimer, pauseTimer, resetTimer, switchMode } =
    usePomodoroStore()

  const { playClickSound } = useAudio()

  const shortcuts = useMemo<Record<string, ShortcutEntry>>(
    () => ({
      startPause: {
        keys: ['Space'],
        description: 'Start/Pause timer',
        action: () => {
          playClickSound()
          if (timerState === 'running') {
            pauseTimer()
          } else {
            startTimer()
          }
        },
      },
      reset: {
        keys: ['r'],
        description: 'Reset timer',
        action: () => {
          playClickSound()
          resetTimer()
        },
      },
      focusMode: {
        keys: ['1'],
        description: 'Switch to Focus mode',
        action: () => {
          playClickSound()
          switchMode('pomodoro')
        },
      },
      shortBreak: {
        keys: ['2'],
        description: 'Switch to Short Break',
        action: () => {
          playClickSound()
          switchMode('shortBreak')
        },
      },
      longBreak: {
        keys: ['3'],
        description: 'Switch to Long Break',
        action: () => {
          playClickSound()
          switchMode('longBreak')
        },
      },
    }),
    [timerState, startTimer, pauseTimer, resetTimer, switchMode, playClickSound]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      const key = event.key
      const isCtrlCmd = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey
      const isAlt = event.altKey

      if (isCtrlCmd || isShift || isAlt) return

      for (const [, shortcut] of Object.entries(shortcuts)) {
        if (shortcut.keys.includes(key)) {
          event.preventDefault()
          shortcut.action()
          return
        }
      }

      // Space key handling
      if (key === ' ') {
        event.preventDefault()
        shortcuts.startPause.action()
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    shortcuts: Object.entries(shortcuts).map(([id, shortcut]) => ({
      id,
      keys: shortcut.keys,
      description: shortcut.description,
    })),
  }
}
