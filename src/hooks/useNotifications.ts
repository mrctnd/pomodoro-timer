import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
  actions?: Array<{
    action: string
    title: string
  }>
}

export function useNotifications() {
  const settings = usePomodoroStore((state) => state.settings)
  const hasPermission = useRef(false)

  useEffect(() => {
    if ('Notification' in window && settings.notifications.enabled) {
      if (Notification.permission === 'granted') {
        hasPermission.current = true
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          hasPermission.current = permission === 'granted'
        })
      }
    }
  }, [settings.notifications.enabled])

  const showNotification = (options: NotificationOptions) => {
    if (!hasPermission.current || !settings.notifications.desktop) {
      return
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-72x72.png',
        tag: 'pomodoro-timer',
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      hasPermission.current = permission === 'granted'
      return hasPermission.current
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  return {
    showNotification,
    requestPermission,
    hasPermission: hasPermission.current,
    isSupported: 'Notification' in window,
  }
}
