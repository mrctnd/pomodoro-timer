import { useMemo } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { CHART_COLORS } from '@/constants'
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from 'date-fns'

export function useStatsData() {
  const { sessions, tasks, stats } = usePomodoroStore()

  const dailyStats = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    })

    return last30Days.map((day) => {
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)

      const daySessions = sessions.filter(
        (session) =>
          session.completed &&
          session.startTime >= dayStart.getTime() &&
          session.startTime <= dayEnd.getTime()
      )

      const pomodoroSessions = daySessions.filter((s) => s.mode === 'pomodoro')

      return {
        date: format(day, 'MMM dd'),
        fullDate: day,
        sessions: pomodoroSessions.length,
        focusTime: pomodoroSessions.reduce(
          (total, session) => total + session.duration,
          0
        ),
      }
    })
  }, [sessions])

  const weeklyStats = useMemo(() => {
    const weeks = []
    for (let i = 0; i < 12; i++) {
      const weekEnd = subDays(new Date(), i * 7)
      const weekStart = subDays(weekEnd, 6)

      const weekSessions = sessions.filter(
        (session) =>
          session.completed &&
          session.mode === 'pomodoro' &&
          session.startTime >= startOfDay(weekStart).getTime() &&
          session.startTime <= endOfDay(weekEnd).getTime()
      )

      weeks.unshift({
        week: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
        sessions: weekSessions.length,
        focusTime: weekSessions.reduce(
          (total, session) => total + session.duration,
          0
        ),
      })
    }
    return weeks
  }, [sessions])

  const taskStats = useMemo(() => {
    return tasks
      .map((task) => ({
        name:
          task.title.length > 20
            ? task.title.substring(0, 20) + '...'
            : task.title,
        pomodoros: task.pomodoroCount,
        completed: task.completed,
      }))
      .sort((a, b) => b.pomodoros - a.pomodoros)
      .slice(0, 10)
  }, [tasks])

  const modeStats = useMemo(() => {
    const modeCount = sessions.reduce(
      (acc, session) => {
        if (session.completed) {
          acc[session.mode] = (acc[session.mode] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )

    return [
      { name: 'Focus', value: modeCount.pomodoro || 0, color: CHART_COLORS[0] },
      {
        name: 'Short Break',
        value: modeCount.shortBreak || 0,
        color: CHART_COLORS[1],
      },
      {
        name: 'Long Break',
        value: modeCount.longBreak || 0,
        color: CHART_COLORS[2],
      },
    ].filter((item) => item.value > 0)
  }, [sessions])

  return {
    stats,
    tasks,
    dailyStats,
    weeklyStats,
    taskStats,
    modeStats,
  }
}
