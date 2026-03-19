import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'

export function useAudio() {
  const settings = usePomodoroStore((state) => state.settings)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    createBeep(800, 0.1)
    setTimeout(() => createBeep(1000, 0.1), 100)
  }

  const playEndSound = () => {
    createBeep(800, 0.5)
    setTimeout(() => createBeep(1000, 0.3), 50)
    setTimeout(() => createBeep(1200, 0.2), 100)
  }

  const playClickSound = () => {
    createBeep(600, 0.05, 0.3)
  }

  return {
    playStartSound,
    playEndSound,
    playClickSound,
  }
}
