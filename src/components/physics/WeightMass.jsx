import React, { useState, useRef, useEffect } from 'react'

const WeightMass = ({ onComplete }) => {
  const [selectedPlanet, setSelectedPlanet] = useState('earth')
  const [objectMass, setObjectMass] = useState(10) // kg
  const [scaleReading, setScaleReading] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const canvasRef = useRef(null)

  const planets = {
    earth: { name: 'Earth', gravity: 9.81, color: '#3b82f6' },
    moon: { name: 'Moon', gravity: 1.62, color: '#94a3b8' },
    mars: { name: 'Mars', gravity: 3.71, color: '#dc2626' },
    jupiter: { name: 'Jupiter', gravity: 24.79, color: '#f59e0b' }
  }

  const objects = [
    { name: 'Apple', mass: 0.2, icon: '🍎' },
    { name: 'Book', mass: 1.5, icon: '📚' },
    { name: 'Basketball', mass: 0.6, icon: '🏀' },
    { name: 'Dumbbell', mass: 10, icon: '🏋️' },
    { name: 'Person', mass: 70, icon: '🧍' }
  ]

  const calculateWeight = () => {
    const weight = objectMass * planets[selectedPlanet].gravity
    setScaleReading(weight)
  }

  const resetScale = () => {
    setScaleReading(null)
    setSelectedObject(null)
  }

  const selectObject = (obj) => {
    setSelectedObject(obj)
    setObjectMass(obj.mass)
    const weight = obj.mass * planets[selectedPlanet].gravity
    setScaleReading(weight)
  }

  // Canvas visualization for gravity effect
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw planet surface
    const planetY = canvas.height - 50
    ctx.fillStyle = planets[selectedPlanet].color
    ctx.fillRect(0, planetY, canvas.width, 50)
    
    // Draw gravity field lines
    ctx.strokeStyle = planets[selectedPlanet].color
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 1
    
    for (let x = 50; x < canvas.width; x += 60) {
      ctx.beginPath()
      ctx.moveTo(x, 50)
      ctx.lineTo(x, planetY - 10)
      ctx.stroke()
      
      // Arrow heads
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(x - 5, planetY - 20)
      ctx.lineTo(x, planetY - 10)
      ctx.lineTo(x + 5, planetY - 20)
      ctx.stroke()
      ctx.setLineDash([5, 5])
    }
    
    // Draw object if selected
    if (selectedObject && scaleReading) {
      const objectX = canvas.width / 2
      const objectY = planetY - 80
      
      // Object shadow (shows weight effect)
      const shadowIntensity = Math.min(scaleReading / 500, 1) // Normalize to 0-1
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity * 0.3})`
      ctx.ellipse(objectX, planetY - 5, 30, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Object
      ctx.font = '40px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(selectedObject.icon, objectX, objectY)
      
      // Weight force arrow
      ctx.setLineDash([])
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(objectX, objectY + 20)
      ctx.lineTo(objectX, objectY + 50)
      ctx.stroke()
      
      // Arrow head
      ctx.beginPath()
      ctx.moveTo(objectX - 5, objectY + 45)
      ctx.lineTo(objectX, objectY + 50)
      ctx.lineTo(objectX + 5, objectY + 45)
      ctx.stroke()
      
      // Weight label
      ctx.fillStyle = '#ef4444'
      ctx.font = '14px Arial'
      ctx.fillText(`${scaleReading.toFixed(1)} N`, objectX + 40, objectY + 35)
    }
    
    // Planet label
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${planets[selectedPlanet].name} (g = ${planets[selectedPlanet].gravity} m/s²)`, canvas.width / 2, planetY + 35)
    
  }, [selectedPlanet, selectedObject, scaleReading])

  return (
    <div style={{ width: '100%', height: '100%', padding: 'var(--spacing-md)' }}>
      {/* Gravity Visualization */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4>Gravity Visualization</h4>
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            background: 'var(--panel)'
          }}
        />
      </div>

      {/* Main Display */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <h3>Digital Scale on {planets[selectedPlanet].name}</h3>
        
        {/* Scale Display */}
        <div style={{
          width: '300px',
          height: '200px',
          margin: '0 auto var(--spacing-md)',
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid var(--border)',
          boxShadow: '0 4px 8px var(--shadow)'
        }}>
          <div style={{
            background: '#000',
            color: '#00ff00',
            padding: 'var(--spacing-md)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            marginBottom: 'var(--spacing-md)',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            {scaleReading !== null ? (
              <>
                <div>Weight: {scaleReading.toFixed(2)} N</div>
                <div style={{ fontSize: '1rem', opacity: 0.8 }}>
                  Mass: {objectMass.toFixed(1)} kg
                </div>
              </>
            ) : (
              <div>Place object on scale</div>
            )}
          </div>
          
          {/* Scale Platform */}
          <div style={{
            width: '80%',
            height: '20px',
            background: '#6b7280',
            borderRadius: '4px',
            border: '2px solid #4b5563'
          }} />
        </div>

        {/* Gravity Display */}
        <div style={{
          background: planets[selectedPlanet].color,
          color: 'white',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--border-radius)',
          display: 'inline-block',
          marginBottom: 'var(--spacing-md)'
        }}>
          Gravity: {planets[selectedPlanet].gravity} m/s²
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Planet Selection */}
        <div className="card">
          <h4>Select Planet</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-sm)'
          }}>
            {Object.entries(planets).map(([key, planet]) => (
              <button
                key={key}
                className={`btn ${selectedPlanet === key ? 'btn-primary' : ''}`}
                onClick={() => setSelectedPlanet(key)}
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>

        {/* Object Selection */}
        <div className="card">
          <h4>Select Object</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 'var(--spacing-sm)'
          }}>
            {objects.map((object) => (
              <button
                key={object.name}
                className={`btn ${selectedObject?.name === object.name ? 'btn-primary' : ''}`}
                onClick={() => selectObject(object)}
                style={{
                  fontSize: '1.5rem',
                  padding: 'var(--spacing-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{object.icon}</span>
                <span style={{ fontSize: '0.75rem' }}>{object.mass}kg</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Mass Slider */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="slider-group">
          <label>
            Custom Mass: {objectMass.toFixed(1)} kg
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={objectMass}
              onChange={(e) => setObjectMass(parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <button
          className="btn btn-primary"
          onClick={calculateWeight}
          style={{ fontSize: '1.1rem', padding: 'var(--spacing-md) var(--spacing-lg)' }}
        >
          Weigh Object
        </button>
        <button
          className="btn"
          onClick={resetScale}
        >
          Clear Scale
        </button>
      </div>

      {/* Educational Info */}
      {scaleReading !== null && (
        <div className="card" style={{
          background: 'var(--accent)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h4>Understanding the Results</h4>
          <p style={{ marginBottom: 'var(--spacing-sm)' }}>
            The mass ({objectMass.toFixed(1)} kg) stays the same everywhere, 
            but the weight ({scaleReading.toFixed(2)} N) changes because gravity is different!
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            Formula: Weight = Mass × Gravity (W = mg)
          </p>
        </div>
      )}

      {/* Comparison Table */}
      {objectMass && (
        <div className="card" style={{ marginTop: 'var(--spacing-md)' }}>
          <h4>Weight Comparison</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'var(--spacing-sm)',
            textAlign: 'center'
          }}>
            {Object.entries(planets).map(([key, planet]) => {
              const weight = objectMass * planet.gravity
              return (
                <div
                  key={key}
                  style={{
                    padding: 'var(--spacing-sm)',
                    background: selectedPlanet === key ? planet.color : 'var(--bg)',
                    color: selectedPlanet === key ? 'white' : 'var(--text)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{planet.name}</div>
                  <div style={{ fontSize: '0.875rem' }}>{weight.toFixed(1)} N</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeightMass
