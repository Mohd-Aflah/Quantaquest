import React from 'react'
import { componentTypes } from '../../data/circuitData'

const CircuitToolbox = ({ 
  onAddComponent, 
  selectedComponent, 
  onSelectComponent,
  wireMode,
  onToggleWireMode 
}) => {
  const components = Object.entries(componentTypes).filter(([key]) => key !== 'wire')

  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('component-type', componentType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const ComponentIcon = ({ type }) => {
    const iconStyle = {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }

    switch (type) {
      case 'battery':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="8" width="3" height="8"/>
            <rect x="7" y="6" width="3" height="12"/>
            <rect x="10" y="8" width="3" height="8"/>
            <rect x="13" y="6" width="3" height="12"/>
            <line x1="16" y1="12" x2="20" y2="12"/>
            <line x1="1" y1="12" x2="4" y2="12"/>
          </svg>
        )
      case 'bulb':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 3v1M12 20v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1M22 12h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707"/>
          </svg>
        )
      case 'resistor':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12h2l1-3 2 6 2-6 2 6 2-6 2 6 2-6 1 3h2"/>
          </svg>
        )
      case 'switch':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="12" r="2"/>
            <circle cx="18" cy="12" r="2"/>
            <path d="M8 12h6l2-2"/>
          </svg>
        )
      default:
        return <div style={iconStyle}>{componentTypes[type]?.symbol || '?'}</div>
    }
  }

  return (
    <div className="control-panel">
      <h3>Components</h3>
      
      {/* Wire Mode Toggle */}
      <button
        className={`btn ${wireMode ? 'btn-primary' : ''}`}
        onClick={onToggleWireMode}
        style={{ 
          width: '100%', 
          marginBottom: 'var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-xs)'
        }}
        aria-pressed={wireMode}
        aria-label={`Wire mode ${wireMode ? 'enabled' : 'disabled'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20"/>
          <circle cx="6" cy="12" r="2"/>
          <circle cx="18" cy="12" r="2"/>
        </svg>
        {wireMode ? 'Wire Mode ON' : 'Wire Mode OFF'}
      </button>

      {wireMode && (
        <div className="card" style={{ 
          marginBottom: 'var(--spacing-md)',
          padding: 'var(--spacing-sm)',
          fontSize: '0.875rem',
          backgroundColor: 'var(--accent)',
          color: 'white'
        }}>
          Click on component terminals to connect them with wires.
        </div>
      )}

      {/* Component Grid */}
      <div className="component-grid">
        {components.map(([type, config]) => (
          <div
            key={type}
            className={`component-item ${selectedComponent === type ? 'selected' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onSelectComponent(selectedComponent === type ? null : type)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectComponent(selectedComponent === type ? null : type)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${config.name} - ${config.description}`}
            title={config.description}
            style={{
              borderColor: selectedComponent === type ? 'var(--accent)' : undefined,
              backgroundColor: selectedComponent === type ? 'var(--hover)' : undefined
            }}
          >
            <ComponentIcon type={type} />
            <span>{config.name}</span>
          </div>
        ))}
      </div>

      {/* Component Info */}
      {selectedComponent && (
        <div className="card" style={{ fontSize: '0.875rem' }}>
          <h4>{componentTypes[selectedComponent].name}</h4>
          <p>{componentTypes[selectedComponent].description}</p>
          {componentTypes[selectedComponent].resistance && (
            <p><strong>Resistance:</strong> {componentTypes[selectedComponent].resistance}Ω</p>
          )}
          {componentTypes[selectedComponent].voltage && (
            <p><strong>Voltage:</strong> {componentTypes[selectedComponent].voltage}V</p>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        fontSize: '0.75rem', 
        opacity: 0.7,
        marginTop: 'var(--spacing-md)',
        lineHeight: 1.4
      }}>
        <p><strong>How to build:</strong></p>
        <ul style={{ marginLeft: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)' }}>
          <li>Drag components from here to the grid</li>
          <li>Click and drag components to move them</li>
          <li>Toggle wire mode to connect terminals</li>
          <li>Click switches to open/close them</li>
          <li>Right-click to remove components</li>
          <li>Press R to reset the circuit</li>
        </ul>
      </div>
    </div>
  )
}

export default CircuitToolbox
