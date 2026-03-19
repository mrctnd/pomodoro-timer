import { useEffect, useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import {
  NOTIFICATION_ICON,
  NOTIFICATION_BADGE,
  NOTIFICATION_AUTO_CLOSE_MS,
} from '@/constants'

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
}

export function useNotifications() {
  const settings = usePomodoroStore((state) => state.settings)
  const [hasPermission, setHasPermission] = useState(false)

  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  useEffect(() => {
    if (isSupported && settings.notifications.enabled) {
      if (Notification.permission === 'granted') {
        setHasPermission(true)
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setHasPermission(permission === 'granted')
        })
      }
    }
  }, [settings.notifications.enabled, isSupported])

  const showNotification = (options: NotificationOptions) => {
    if (!hasPermission || !settings.notifications.desktop) {
      return
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || NOTIFICATION_ICON,
        badge: options.badge || NOTIFICATION_BADGE,
        tag: 'pomodoro-timer',
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      setTimeout(() => {
        notification.close()
      }, NOTIFICATION_AUTO_CLOSE_MS)

      return notification
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      const granted = permission === 'granted'
      setHasPermission(granted)
      return granted
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  return {
    showNotification,
    requestPermission,
    hasPermission,
    isSupported,
  }
}
