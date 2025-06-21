'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <button className="w-9 h-9 rounded-md flex items-center justify-center">
      <span className="sr-only">Loading theme</span>
    </button>
  )

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}