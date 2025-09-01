'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Clock, Target, Zap, TrendingUp, CheckCircle } from 'lucide-react'
import { useMemo } from 'react'
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from 'date-fns'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function StatsPage() {
  const { sessions, tasks, stats } = usePomodoroStore()

  // Calculate daily stats for the last 30 days
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

  // Calculate weekly stats
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

  // Task completion stats
  const taskStats = useMemo(() => {
    const taskData = tasks
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

    return taskData
  }, [tasks])

  // Mode distribution
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
      { name: 'Focus', value: modeCount.pomodoro || 0, color: COLORS[0] },
      {
        name: 'Short Break',
        value: modeCount.shortBreak || 0,
        color: COLORS[1],
      },
      { name: 'Long Break', value: modeCount.longBreak || 0, color: COLORS[2] },
    ].filter((item) => item.value > 0)
  }, [sessions])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Statistics</h1>
            <p className="text-muted-foreground">
              Track your productivity and focus patterns
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.completedPomodoros}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold">
                  {formatDuration(stats.totalFocusTime)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-2xl font-bold">{stats.streak}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Daily Sessions (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Daily Focus Time (Minutes)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="focusTime"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Progress (Last 12 Weeks)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Top Tasks by Pomodoros
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskStats} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="pomodoros" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Session Types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Task List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Task Overview</h3>
              <div className="space-y-2">
                {tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p
                          className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.pomodoroCount}/{task.estimatedPomodoros}{' '}
                          pomodoros
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.completed && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                      <Badge variant="outline">
                        {Math.round(
                          (task.pomodoroCount / task.estimatedPomodoros) * 100
                        )}
                        %
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
