'use client'

import { usePomodoroStore } from '@/store/usePomodoro'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Settings, BarChart3, Focus, Minimize2, Maximize2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const { settings, updateSettings } = usePomodoroStore()
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleFocusMode = () => {
    const newFocusMode = !settings.focusMode
    updateSettings({ focusMode: newFocusMode })
    setIsMinimized(newFocusMode)
  }

  if (isMinimized || settings.focusMode) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <Button
          onClick={toggleFocusMode}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </motion.header>
    )
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Focus className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Pomodoro</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Timer
            </Button>
          </Link>
          <Link href="/stats">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </Button>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          <Button
            onClick={toggleFocusMode}
            variant="ghost"
            size="sm"
            title="Focus Mode"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>

          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Link href="/stats">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
