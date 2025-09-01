import { useEffect, useCallback, useMemo } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { useAudio } from './useAudio'

interface KeyboardShortcuts {
  [key: string]: {
    keys: string[]
    description: string
    action: () => void
    global?: boolean
  }
}

export function useKeyboardShortcuts() {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    addTask,
  } = usePomodoroStore()

  const { playClickSound } = useAudio()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shortcuts: KeyboardShortcuts = {
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
      global: true,
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
    newTask: {
      keys: ['n'],
      description: 'Add new task',
      action: () => {
        playClickSound()
        // This would trigger a task creation modal
        const title = prompt('Enter task title:')
        if (title?.trim()) {
          addTask({
            title: title.trim(),
            description: '',
            completed: false,
            pomodoroCount: 0,
            estimatedPomodoros: 1,
            tags: [],
          })
        }
      },
    },
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
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

      // Find matching shortcut
      for (const [, shortcut] of Object.entries(shortcuts)) {
        const matchesKey = shortcut.keys.includes(key)

        if (matchesKey && !isCtrlCmd && !isShift && !isAlt) {
          event.preventDefault()
          shortcut.action()
          return
        }
      }

      // Global shortcuts (work even when inputs are focused)
      if (key === ' ' && !isCtrlCmd && !isShift && !isAlt) {
        // Only prevent default for spacebar if not in an input
        if (
          !(event.target instanceof HTMLInputElement) &&
          !(event.target instanceof HTMLTextAreaElement)
        ) {
          event.preventDefault()
          shortcuts.startPause.action()
        }
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

  const getShortcutsList = () => {
    return Object.entries(shortcuts).map(([id, shortcut]) => ({
      id,
      keys: shortcut.keys,
      description: shortcut.description,
    }))
  }

  return {
    shortcuts: getShortcutsList(),
  }
}
