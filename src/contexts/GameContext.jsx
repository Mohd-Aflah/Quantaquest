import React, { createContext, useContext, useState, useEffect } from 'react'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

// Default state structure
const defaultBadges = {
  circuit: [],
  physics: []
}

const defaultProgress = {
  circuit: {
    completedLevels: 0,
    currentLevel: 1
  },
  physics: {
    completedModules: []
  }
}

export const GameProvider = ({ children }) => {
  const [badges, setBadges] = useState(defaultBadges)
  const [progress, setProgress] = useState(defaultProgress)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [newBadge, setNewBadge] = useState(null)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedBadges = localStorage.getItem('stemq:badges')
      const savedProgress = localStorage.getItem('stemq:progress')

      if (savedBadges) {
        const parsedBadges = JSON.parse(savedBadges)
        setBadges({ ...defaultBadges, ...parsedBadges })
      }

      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress)
        setProgress({ ...defaultProgress, ...parsedProgress })
      }
    } catch (error) {
      console.error('Error loading game data from localStorage:', error)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('stemq:badges', JSON.stringify(badges))
    } catch (error) {
      console.error('Error saving badges to localStorage:', error)
    }
  }, [badges])

  useEffect(() => {
    try {
      localStorage.setItem('stemq:progress', JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving progress to localStorage:', error)
    }
  }, [progress])

  const awardBadge = (category, badgeId, badgeName) => {
    if (!badges[category] || badges[category].includes(badgeId)) {
      return // Badge already awarded
    }

    setBadges(prev => ({
      ...prev,
      [category]: [...prev[category], badgeId]
    }))

    // Show badge modal
    setNewBadge({ id: badgeId, name: badgeName, category })
    setShowBadgeModal(true)

    // Announce for screen readers
    const announcement = `Achievement unlocked: ${badgeName}`
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)
  }

  const updateProgress = (category, updates) => {
    setProgress(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates
      }
    }))
  }

  const resetProgress = () => {
    setBadges(defaultBadges)
    setProgress(defaultProgress)
    localStorage.removeItem('stemq:badges')
    localStorage.removeItem('stemq:progress')
  }

  const hasBadge = (category, badgeId) => {
    return badges[category] && badges[category].includes(badgeId)
  }

  const getBadgeCount = (category) => {
    return badges[category] ? badges[category].length : 0
  }

  const getTotalBadges = () => {
    return Object.values(badges).reduce((total, categoryBadges) => {
      return total + (categoryBadges ? categoryBadges.length : 0)
    }, 0)
  }

  const value = {
    badges,
    progress,
    awardBadge,
    updateProgress,
    resetProgress,
    hasBadge,
    getBadgeCount,
    getTotalBadges,
    showBadgeModal,
    setShowBadgeModal,
    newBadge,
    setNewBadge
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
