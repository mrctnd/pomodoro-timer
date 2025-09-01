import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Pomodoro Timer - Stay Focused',
  description:
    'A modern, minimal Pomodoro timer to boost your productivity with task management, statistics, and focus modes.',
  keywords: [
    'pomodoro',
    'timer',
    'productivity',
    'focus',
    'tasks',
    'time management',
  ],
  authors: [{ name: 'Pomodoro App' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  metadataBase: new URL('https://mrctnd.github.io/pomodoro-timer'),
  openGraph: {
    title: 'Pomodoro Timer - Stay Focused',
    description: 'A modern, minimal Pomodoro timer to boost your productivity',
    url: 'https://mrctnd.github.io/pomodoro-timer',
    siteName: 'Pomodoro Timer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer - Stay Focused',
    description: 'A modern, minimal Pomodoro timer to boost your productivity',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Header />
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
