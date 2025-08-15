import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import CircuitToolbox from '../components/circuit/CircuitToolbox'
import CircuitCanvas from '../components/circuit/CircuitCanvas'
import CircuitInfo from '../components/circuit/CircuitInfo'
import { circuitLevels } from '../data/circuitData'
import { analyzeCircuit } from '../utils/circuitUtils'

const CircuitConnect = () => {
  const { progress, updateProgress, awardBadge, hasBadge } = useGame()
  const [currentLevel, setCurrentLevel] = useState(progress.circuit.currentLevel)
  const [components, setComponents] = useState([])
  const [wires, setWires] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [wireMode, setWireMode] = useState(false)
  const [wireStart, setWireStart] = useState(null)
  const [circuitAnalysis, setCircuitAnalysis] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  // Get current level data
  const levelData = circuitLevels[currentLevel - 1] || circuitLevels[0]

  // Analyze circuit whenever components or wires change
  useEffect(() => {
    const analysis = analyzeCircuit(components, wires)
    setCircuitAnalysis(analysis)

    // Check for badge conditions
    if (analysis.bulbsOn > 0 && !hasBadge('circuit', 'first-light')) {
      awardBadge('circuit', 'first-light', 'First Light')
    }

    if (analysis.hasParallel && !hasBadge('circuit', 'parallel-pro')) {
      awardBadge('circuit', 'parallel-pro', 'Parallel Pro')
    }

    if (analysis.shortCircuit && !hasBadge('circuit', 'safety-first')) {
      awardBadge('circuit', 'safety-first', 'Safety First')
    }

    // Check level completion
    if (levelData.checkCompletion && levelData.checkCompletion(analysis)) {
      const newLevel = Math.max(currentLevel + 1, progress.circuit.completedLevels + 1)
      updateProgress('circuit', {
        completedLevels: newLevel - 1,
        currentLevel: newLevel
      })
    }
  }, [components, wires, currentLevel, levelData, hasBadge, awardBadge, updateProgress, progress.circuit.completedLevels])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        resetLevel()
      }
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        setShowHelp(!showHelp)
      }
      if (e.key === 'Escape') {
        setSelectedComponent(null)
        setWireMode(false)
        setWireStart(null)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [showHelp])

  const resetLevel = useCallback(() => {
    setComponents([])
    setWires([])
    setSelectedComponent(null)
    setWireMode(false)
    setWireStart(null)
  }, [])

  const addComponent = useCallback((type, position) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      rotation: 0,
      state: type === 'switch' ? 'closed' : 'normal'
    }
    setComponents(prev => [...prev, newComponent])
  }, [])

  const removeComponent = useCallback((componentId) => {
    setComponents(prev => prev.filter(c => c.id !== componentId))
    setWires(prev => prev.filter(w => 
      w.from.componentId !== componentId && w.to.componentId !== componentId
    ))
  }, [])

  const addWire = useCallback((from, to) => {
    const newWire = {
      id: `wire-${Date.now()}`,
      from,
      to,
      path: [] // Will be calculated by the canvas
    }
    setWires(prev => [...prev, newWire])
    setWireMode(false)
    setWireStart(null)
  }, [])

  const changeLevel = (direction) => {
    const newLevel = direction === 'next' 
      ? Math.min(currentLevel + 1, circuitLevels.length)
      : Math.max(currentLevel - 1, 1)
    
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel)
      resetLevel()
    }
  }

  return (
    <div className="game-layout">
      {/* Back button */}
      <Link 
        to="/" 
        className="btn"
        style={{ 
          position: 'fixed', 
          top: 'var(--spacing-md)', 
          left: 'var(--spacing-md)',
          zIndex: 100
        }}
        aria-label="Return to main menu"
      >
        ← Home
      </Link>

      {/* Toolbox */}
      <div className="toolbox">
        <CircuitToolbox
          onAddComponent={addComponent}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          wireMode={wireMode}
          onToggleWireMode={() => setWireMode(!wireMode)}
        />
      </div>

      {/* Canvas */}
      <div className="canvas">
        <CircuitCanvas
          components={components}
          wires={wires}
          onAddComponent={addComponent}
          onUpdateComponent={(id, updates) => {
            setComponents(prev => prev.map(c => 
              c.id === id ? { ...c, ...updates } : c
            ))
          }}
          onRemoveComponent={removeComponent}
          onAddWire={addWire}
          wireMode={wireMode}
          wireStart={wireStart}
          onWireStart={setWireStart}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          analysis={circuitAnalysis}
        />
        
        {/* Level indicator */}
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-md)',
          background: 'var(--panel)',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <button 
            className="btn"
            onClick={() => changeLevel('prev')}
            disabled={currentLevel <= 1}
            aria-label="Previous level"
          >
            ←
          </button>
          <span>Level {currentLevel}</span>
          <button 
            className="btn"
            onClick={() => changeLevel('next')}
            disabled={currentLevel >= circuitLevels.length}
            aria-label="Next level"
          >
            →
          </button>
        </div>

        {/* Reset button */}
        <button
          className="btn"
          onClick={resetLevel}
          style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)'
          }}
          aria-label="Reset level (R key)"
        >
          🔄 Reset
        </button>
      </div>

      {/* Info Panel */}
      <div className="info-panel">
        <CircuitInfo
          level={levelData}
          analysis={circuitAnalysis}
          showHelp={showHelp}
          onToggleHelp={() => setShowHelp(!showHelp)}
        />
      </div>
    </div>
  )
}

export default CircuitConnect
