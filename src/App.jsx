import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Context providers
import { ThemeProvider } from './contexts/ThemeContext'
import { GameProvider } from './contexts/GameContext'

// Components
import ThemeToggle from './components/ThemeToggle'
import BadgeModal from './components/BadgeModal'

// Pages
import Home from './pages/Home'
import CircuitConnect from './pages/CircuitConnect'
import PhysicsPlayground from './pages/PhysicsPlayground'

function App() {
  // Handle keyboard shortcuts globally
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Global shortcuts
      if (e.altKey && e.key === 't') {
        e.preventDefault()
        // Theme toggle handled by ThemeContext
      }
      
      if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.modal-overlay')
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.click()
          }
        })
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <ThemeProvider>
      <GameProvider>
        <Router basename="/Quantaquest-Learn-Through-Play">
          <div className="App">
            <ThemeToggle />
            <BadgeModal />
            
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/circuit" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CircuitConnect />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/physics" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PhysicsPlayground />
                    </motion.div>
                  } 
                />
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </GameProvider>
    </ThemeProvider>
  )
}

export default App
