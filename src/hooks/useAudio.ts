import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'

interface AudioHookReturn {
  playStartSound: () => void
  playEndSound: () => void
  playClickSound: () => void
  setVolume: (volume: number) => void
}

export function useAudio(): AudioHookReturn {
  const settings = usePomodoroStore((state) => state.settings)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      } catch (error) {
        console.error('Failed to create audio context:', error)
      }
    }
  }, [])

  const createBeep = (
    frequency: number,
    duration: number,
    volume: number = 0.5
  ) => {
    if (!audioContextRef.current || !settings.sound.enabled) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      )
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        volume * settings.sound.volume,
        audioContextRef.current.currentTime + 0.01
      )
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContextRef.current.currentTime + duration
      )

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }

  const playStartSound = () => {
    // Quick ascending beep
    createBeep(800, 0.1)
    setTimeout(() => createBeep(1000, 0.1), 100)
  }

  const playEndSound = () => {
    // Bell-like sound with multiple frequencies
    createBeep(800, 0.5)
    setTimeout(() => createBeep(1000, 0.3), 50)
    setTimeout(() => createBeep(1200, 0.2), 100)
  }

  const playClickSound = () => {
    // Short click sound
    createBeep(600, 0.05, 0.3)
  }

  const setVolume = (volume: number) => {
    // This would be handled by the store
    usePomodoroStore.getState().updateSettings({
      sound: {
        ...settings.sound,
        volume: Math.max(0, Math.min(1, volume)),
      },
    })
  }

  return {
    playStartSound,
    playEndSound,
    playClickSound,
    setVolume,
  }
}
