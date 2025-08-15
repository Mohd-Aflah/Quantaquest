import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system')
  const [contrast, setContrast] = useState('normal')

  // Get effective theme based on system preference
  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('stemq:theme')
    const savedContrast = localStorage.getItem('stemq:contrast')
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Default to system preference
      setTheme('system')
    }

    if (savedContrast && ['normal', 'high'].includes(savedContrast)) {
      setContrast(savedContrast)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme()
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    document.documentElement.setAttribute('data-contrast', contrast)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff')
    }
  }, [theme, contrast])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const effectiveTheme = getEffectiveTheme()
        document.documentElement.setAttribute('data-theme', effectiveTheme)
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    localStorage.setItem('stemq:theme', nextTheme)
  }

  const toggleContrast = () => {
    const newContrast = contrast === 'normal' ? 'high' : 'normal'
    setContrast(newContrast)
    localStorage.setItem('stemq:contrast', newContrast)
  }

  const value = {
    theme,
    contrast,
    effectiveTheme: getEffectiveTheme(),
    setTheme: (newTheme) => {
      setTheme(newTheme)
      localStorage.setItem('stemq:theme', newTheme)
    },
    toggleTheme,
    toggleContrast
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
