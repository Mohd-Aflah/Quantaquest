import React, { useState } from 'react'

const PressureFluids = ({ onComplete }) => {
  const [depth, setDepth] = useState(5) // meters
  const [fluidType, setFluidType] = useState('freshwater')
  
  const fluids = {
    freshwater: { name: 'Fresh Water', density: 1000, color: '#3b82f6' },
    saltwater: { name: 'Salt Water', density: 1025, color: '#1e40af' },
    oil: { name: 'Oil', density: 800, color: '#f59e0b' },
    mercury: { name: 'Mercury', density: 13600, color: '#6b7280' }
  }
  
  const gravity = 9.81 // m/s²
  const selectedFluid = fluids[fluidType]
  const pressure = selectedFluid.density * gravity * depth // P = ρgh

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      padding: 'var(--spacing-md)',
      overflowY: 'auto'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Pressure in Fluids
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 'var(--spacing-lg)',
        minHeight: '70vh'
      }}>
        {/* Controls */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4>Fluid Type</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-sm)'
            }}>
              {Object.entries(fluids).map(([key, fluid]) => (
                <button
                  key={key}
                  className={`btn ${fluidType === key ? 'btn-primary' : ''}`}
                  onClick={() => setFluidType(key)}
                  style={{ 
                    fontSize: '0.875rem',
                    borderColor: fluid.color
                  }}
                >
                  {fluid.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div className="slider-group">
              <label>
                Depth: {depth} m
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={depth}
                  onChange={(e) => setDepth(parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="card">
            <h4>Pressure Reading</h4>
            <div style={{
              background: '#000',
              color: '#00ff00',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              textAlign: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              {pressure.toFixed(0)} Pa
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              <div><strong>Density:</strong> {selectedFluid.density} kg/m³</div>
              <div><strong>Gravity:</strong> {gravity} m/s²</div>
              <div><strong>Depth:</strong> {depth} m</div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="card">
          <h4>Fluid Tank</h4>
          <div style={{
            height: '400px',
            background: 'linear-gradient(to bottom, #e5e7eb 0%, #e5e7eb 20%, ' + selectedFluid.color + ' 20%, ' + selectedFluid.color + ' 100%)',
            border: '3px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Surface label */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '10px',
              background: 'var(--panel)',
              padding: 'var(--spacing-xs)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              border: '1px solid var(--border)'
            }}>
              Surface
            </div>

            {/* Depth indicator */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '20%',
              bottom: `${80 - (depth / 20) * 80}%`,
              width: '2px',
              background: '#ef4444',
              borderRadius: '1px'
            }} />

            {/* Depth markers */}
            {Array.from({ length: Math.floor(depth) + 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '25px',
                  top: `${20 + (i / 20) * 80}%`,
                  fontSize: '0.75rem',
                  background: 'var(--panel)',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  border: '1px solid var(--border)'
                }}
              >
                {i}m
              </div>
            ))}

            {/* Pressure gauge at depth */}
            <div style={{
              position: 'absolute',
              right: '20px',
              top: `${20 + (depth / 20) * 80}%`,
              transform: 'translateY(-50%)',
              background: 'var(--panel)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius)',
              border: '2px solid var(--border)',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Pressure Gauge
              </div>
              <div style={{ 
                background: '#000',
                color: '#00ff00',
                padding: '4px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                {(pressure / 1000).toFixed(1)} kPa
              </div>
            </div>

            {/* Pressure visualization columns */}
            {Array.from({ length: 10 }, (_, i) => {
              const columnDepth = (depth / 10) * (i + 1)
              const columnPressure = selectedFluid.density * gravity * columnDepth
              const opacity = Math.min(columnPressure / 100000, 0.8) // Max opacity at 100kPa
              
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: `${60 + i * 4}%`,
                    width: '3%',
                    height: `${(columnDepth / depth) * 80}%`,
                    background: `rgba(255, 0, 0, ${opacity})`,
                    borderRadius: '2px 2px 0 0'
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Formula and explanation */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <h4>Pressure Formula</h4>
        <p style={{ 
          fontSize: '1.5rem', 
          fontFamily: 'monospace',
          marginBottom: 'var(--spacing-sm)'
        }}>
          P = ρgh
        </p>
        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          Pressure = density × gravity × height (depth)
        </p>
        <p style={{ 
          fontSize: '0.75rem', 
          opacity: 0.8,
          marginTop: 'var(--spacing-sm)'
        }}>
          Pressure increases linearly with depth in a fluid
        </p>
      </div>
    </div>
  )
}

export default PressureFluids
