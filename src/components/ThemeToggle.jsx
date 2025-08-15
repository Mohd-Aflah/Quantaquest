import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, contrast, toggleTheme, toggleContrast } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        )
      case 'dark':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )
      case 'system':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        )
      default:
        return null
    }
  }

  const getContrastIcon = () => {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor"/>
      </svg>
    )
  }

  return (
    <div className="theme-controls">
      <button
        className="btn"
        onClick={toggleTheme}
        title={`Current theme: ${theme}. Click to cycle through themes.`}
        aria-label={`Switch theme. Current: ${theme}`}
      >
        {getThemeIcon()}
        <span className="sr-only">Theme: {theme}</span>
      </button>
      
      <button
        className="btn"
        onClick={toggleContrast}
        title={`Contrast: ${contrast}. Click to toggle high contrast mode.`}
        aria-label={`Toggle high contrast. Current: ${contrast} contrast`}
        style={{ 
          backgroundColor: contrast === 'high' ? 'var(--accent)' : undefined,
          color: contrast === 'high' ? 'white' : undefined
        }}
      >
        {getContrastIcon()}
        <span className="sr-only">Contrast: {contrast}</span>
      </button>
    </div>
  )
}

export default ThemeToggle
