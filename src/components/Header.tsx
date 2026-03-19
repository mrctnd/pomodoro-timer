'use client'

import { useEffect, useState } from 'react'
import { usePomodoroStore } from '@/store/usePomodoro'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Settings,
  BarChart3,
  Focus,
  Minimize2,
  Maximize2,
  Timer,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../public/logo.svg'
import { usePathname } from 'next/navigation'

export function Header() {
  const { settings, updateSettings, timerState } = usePomodoroStore()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFocusMode = () => {
    updateSettings({ focusMode: !settings.focusMode })
  }

  const isRunning = timerState === 'running'

  if (settings.focusMode || isRunning) {
    return (
      <AnimatePresence>
        <motion.header
          key="minimal-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50"
        >
          <Button
            onClick={toggleFocusMode}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-xl shadow-lg border-border/50 rounded-xl"
            title={isRunning ? 'Focus Mode active' : 'Exit Focus Mode'}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </motion.header>
      </AnimatePresence>
    )
  }

  const navItems = [
    { href: '/', label: 'Timer', icon: Timer },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
  ]

  return (
    <AnimatePresence>
      <motion.header
        key="main-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4">
          <nav
            className={`relative rounded-2xl transition-all duration-300 ${
              scrolled
                ? 'bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg'
                : 'bg-background/60 backdrop-blur-md border border-border/30 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={logo}
                  alt="Pomodoro Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tighter">
                  Chroniqo
                </span>
              </Link>

              {/* Center Navigation */}
              <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                <div className="flex items-center bg-muted/50 rounded-xl p-1">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/' || pathname === ''
                        : pathname?.startsWith(item.href)
                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <ThemeToggle />

                <Button
                  onClick={toggleFocusMode}
                  variant="ghost"
                  size="icon"
                  title="Focus Mode"
                  className="rounded-xl hover:bg-accent/50 transition-all duration-200"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>

                <Link href="/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-accent/50 transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>

                {/* Mobile nav */}
                <div className="md:hidden flex items-center ml-1">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/' || pathname === ''
                        : pathname?.startsWith(item.href)
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Decorative gradient blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary/5 blur-3xl -z-10 rounded-full pointer-events-none" />
      </motion.header>
    </AnimatePresence>
  )
}
