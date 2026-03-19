'use client'

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
import {
  Clock,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  BarChart3,
} from 'lucide-react'
import { useStatsData } from '@/hooks/useStatsData'

const overviewCards = [
  {
    key: 'sessions',
    label: 'Total Sessions',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'focusTime',
    label: 'Focus Time',
    icon: Clock,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'tasksDone',
    label: 'Tasks Done',
    icon: CheckCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    key: 'streak',
    label: 'Day Streak',
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
] as const

export default function StatsPage() {
  const { stats, tasks, dailyStats, weeklyStats, taskStats, modeStats } =
    useStatsData()

  const statValues = {
    sessions: stats.completedPomodoros,
    focusTime: formatDuration(stats.totalFocusTime),
    tasksDone: stats.completedTasks,
    streak: stats.streak,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Statistics</h1>
            <p className="text-sm text-muted-foreground">
              Track your productivity and focus patterns
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overviewCards.map((card) => (
            <div
              key={card.key}
              className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/60"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${card.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold mt-0.5">
                    {statValues[card.key]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="daily" className="rounded-lg">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-lg">
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                  Daily Sessions (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dailyStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                    />
                    <Bar
                      dataKey="sessions"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                  Daily Focus Time (Minutes)
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="focusTime"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#10b981' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                Weekly Progress (Last 12 Weeks)
              </h3>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                  Top Tasks by Pomodoros
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={taskStats} layout="horizontal">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                    />
                    <Bar
                      dataKey="pomodoros"
                      fill="#8b5cf6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                  Session Types
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={modeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {modeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task List */}
            <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                Task Overview
              </h3>
              <div className="space-y-1.5">
                {tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-background/50 hover:bg-background/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-muted-foreground/50" />
                      <div>
                        <p
                          className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {task.pomodoroCount}/{task.estimatedPomodoros}{' '}
                          pomodoros
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.completed && (
                        <Badge
                          variant="secondary"
                          className="rounded-lg text-[10px] bg-emerald-500/10 text-emerald-600 border-0"
                        >
                          Done
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="rounded-lg text-[10px] font-mono"
                      >
                        {Math.round(
                          (task.pomodoroCount / task.estimatedPomodoros) * 100
                        )}
                        %
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
