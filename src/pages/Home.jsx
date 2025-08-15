import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'

const Home = () => {
  const { getBadgeCount, progress } = useGame()

  const menuItems = [
    {
      path: '/circuit',
      title: 'Circuit Connect',
      description: 'Build and simulate electrical circuits with batteries, bulbs, resistors, and switches. Learn about series and parallel connections.',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      badges: getBadgeCount('circuit'),
      progress: `Level ${progress.circuit.currentLevel}`
    },
    {
      path: '/physics',
      title: 'Physics Playground',
      description: 'Explore fundamental physics concepts through interactive simulations. From Newton\'s laws to light optics.',
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6"/>
          <path d="M21 12h-6m-6 0H3"/>
          <path d="M19.07 4.93l-4.24 4.24m-5.66 0L4.93 4.93"/>
          <path d="M19.07 19.07l-4.24-4.24m-5.66 0L4.93 19.07"/>
        </svg>
      ),
      badges: getBadgeCount('physics'),
      progress: `${progress.physics.completedModules.length}/8 modules`
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <motion.div 
      className="main-menu"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1>Quantaquest</h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: 'var(--spacing-xl)',
          maxWidth: '600px',
          opacity: 0.8 
        }}>
          Learn Through Play
        </p>
      </motion.div>

      <motion.div className="menu-options" variants={containerVariants}>
        {menuItems.map((item, index) => (
          <motion.div key={item.path} variants={itemVariants}>
            <Link 
              to={item.path} 
              className="menu-card"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.currentTarget.click()
                }
              }}
            >
              <div style={{ 
                color: 'var(--accent)', 
                marginBottom: 'var(--spacing-md)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80px'
              }}>
                {item.icon}
              </div>
              
              <h2 style={{ 
                marginBottom: 'var(--spacing-md)',
                fontSize: '1.5rem',
                lineHeight: '1.2'
              }}>
                {item.title}
              </h2>
              
              <p style={{ 
                marginBottom: 'var(--spacing-lg)',
                opacity: 0.8,
                lineHeight: '1.5',
                minHeight: '3em'
              }}>
                {item.description}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.875rem',
                opacity: 0.7,
                marginTop: 'auto'
              }}>
                <span style={{
                  background: 'var(--good)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  🏆 {item.badges} badge{item.badges !== 1 ? 's' : ''}
                </span>
                <span style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {item.progress}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
        <p style={{ 
          fontSize: '0.875rem', 
          opacity: 0.6,
          marginBottom: 'var(--spacing-md)' 
        }}>
          🎯 Total Achievements: {getBadgeCount('circuit') + getBadgeCount('physics')}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-sm)', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          fontSize: '0.875rem',
          opacity: 0.6
        }}>
          <span>📱 Mobile-friendly</span>
          <span>•</span>
          <span>⌨️ Keyboard accessible</span>
          <span>•</span>
          <span>🌙 Dark mode</span>
        </div>

        <div style={{ 
          marginTop: 'var(--spacing-lg)',
          fontSize: '0.75rem',
          opacity: 0.5
        }}>
          <p>Keyboard shortcuts: [H] Help • [R] Reset • [Alt+T] Toggle theme</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home
