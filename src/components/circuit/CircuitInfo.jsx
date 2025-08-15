import React from 'react'

const CircuitInfo = ({ level, analysis, showHelp, onToggleHelp }) => {
  const getStatusColor = () => {
    if (!analysis) return 'var(--text)'
    if (analysis.shortCircuit) return 'var(--error)'
    if (analysis.bulbsOn > 0) return 'var(--good)'
    if (analysis.hasClosedLoop) return 'var(--warn)'
    return 'var(--text)'
  }

  const getStatusIcon = () => {
    if (!analysis) return '❓'
    if (analysis.shortCircuit) return '⚠️'
    if (analysis.bulbsOn > 0) return '💡'
    if (analysis.hasClosedLoop) return '🔄'
    return '⭕'
  }

  return (
    <div className="control-panel">
      {/* Level Info */}
      <div className="card">
        <h3>{level.title}</h3>
        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
          {level.description}
        </p>
        
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Objectives:</h4>
          <ul style={{ 
            marginLeft: 'var(--spacing-md)', 
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            {level.objectives.map((objective, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {level.hint && (
          <div style={{
            background: 'var(--accent)',
            color: 'white',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem'
          }}>
            💡 <strong>Hint:</strong> {level.hint}
          </div>
        )}
      </div>

      {/* Circuit Status */}
      <div className="card">
        <h4 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-xs)',
          color: getStatusColor()
        }}>
          {getStatusIcon()} Circuit Status
        </h4>
        
        <p style={{ 
          fontSize: '0.875rem', 
          marginBottom: 'var(--spacing-md)',
          color: getStatusColor()
        }}>
          {analysis?.explanation || 'Build your circuit to see analysis'}
        </p>

        {analysis && (
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div>
                <strong>Current:</strong><br />
                {analysis.current ? `${analysis.current.toFixed(2)}A` : '0A'}
              </div>
              <div>
                <strong>Resistance:</strong><br />
                {analysis.totalResistance ? `${analysis.totalResistance.toFixed(1)}Ω` : 'N/A'}
              </div>
              <div>
                <strong>Bulbs On:</strong><br />
                {analysis.bulbsOn}
              </div>
              <div>
                <strong>Switches:</strong><br />
                {analysis.switchesOpen > 0 ? `${analysis.switchesOpen} open` : 'All closed'}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <strong>Circuit Type:</strong><br />
              {analysis.hasParallel && analysis.hasSeries ? 'Mixed (Series + Parallel)' :
               analysis.hasParallel ? 'Parallel' :
               analysis.hasSeries ? 'Series' :
               'Simple'}
            </div>

            {analysis.warnings && analysis.warnings.length > 0 && (
              <div style={{
                background: 'var(--warn)',
                color: 'white',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-md)'
              }}>
                {analysis.warnings.map((warning, index) => (
                  <div key={index}>⚠️ {warning}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Toggle */}
      <button
        className="btn"
        onClick={onToggleHelp}
        style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
        aria-expanded={showHelp}
        aria-controls="help-section"
      >
        {showHelp ? '📖 Hide Help' : '❓ Show Help'}
      </button>

      {/* Help Section */}
      {showHelp && (
        <div id="help-section" className="card">
          <h4>How to Build Circuits</h4>
          
          <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
            <h5>Components:</h5>
            <ul style={{ marginLeft: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <li><strong>Battery:</strong> Provides power (9V)</li>
              <li><strong>Bulb:</strong> Lights up when current flows</li>
              <li><strong>Resistor:</strong> Reduces current flow</li>
              <li><strong>Switch:</strong> Opens/closes the circuit</li>
            </ul>

            <h5>Building:</h5>
            <ul style={{ marginLeft: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <li>Drag components from the toolbox</li>
              <li>Enable wire mode to connect terminals</li>
              <li>Click switch to toggle open/closed</li>
              <li>Right-click to remove components</li>
            </ul>

            <h5>Circuit Types:</h5>
            <ul style={{ marginLeft: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <li><strong>Series:</strong> Components in a single path</li>
              <li><strong>Parallel:</strong> Multiple paths from battery</li>
            </ul>

            <h5>Keyboard Shortcuts:</h5>
            <ul style={{ marginLeft: 'var(--spacing-md)' }}>
              <li><strong>R:</strong> Reset circuit</li>
              <li><strong>H:</strong> Toggle help</li>
              <li><strong>Esc:</strong> Cancel wire mode</li>
            </ul>
          </div>
        </div>
      )}

      {/* Badge Progress */}
      <div style={{ 
        fontSize: '0.75rem', 
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 'var(--spacing-md)'
      }}>
        💡 Complete objectives to earn badges!
      </div>
    </div>
  )
}

export default CircuitInfo
