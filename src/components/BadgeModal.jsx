import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../contexts/GameContext'

const BadgeModal = () => {
  const { showBadgeModal, setShowBadgeModal, newBadge } = useGame()

  useEffect(() => {
    if (showBadgeModal) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setShowBadgeModal(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showBadgeModal, setShowBadgeModal])

  const handleClose = () => {
    setShowBadgeModal(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const getBadgeIcon = (category) => {
    switch (category) {
      case 'circuit':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        )
      case 'physics':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l2 2 4-4"/>
          </svg>
        )
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9 8.91 8.26"/>
          </svg>
        )
    }
  }

  return (
    <AnimatePresence>
      {showBadgeModal && newBadge && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
          aria-describedby="badge-modal-description"
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                color: 'var(--good)',
                marginBottom: 'var(--spacing-md)'
              }}
            >
              {getBadgeIcon(newBadge.category)}
            </motion.div>

            <h2 id="badge-modal-title" style={{ color: 'var(--good)', marginBottom: 'var(--spacing-sm)' }}>
              🎉 Achievement Unlocked!
            </h2>

            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
              {newBadge.name}
            </h3>

            <p id="badge-modal-description" style={{ 
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text)',
              opacity: 0.8
            }}>
              Great job! You've earned a new badge in {newBadge.category === 'circuit' ? 'Circuit Connect' : 'Physics Playground'}.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={handleClose}
                autoFocus
              >
                Awesome!
              </button>
            </div>

            <div style={{ 
              marginTop: 'var(--spacing-md)', 
              fontSize: '0.875rem', 
              color: 'var(--text)',
              opacity: 0.6
            }}>
              This modal will auto-close in a few seconds
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BadgeModal
