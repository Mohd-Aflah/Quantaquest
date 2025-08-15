import React, { useState, useRef, useEffect } from 'react'

const GravityDrop = ({ onComplete }) => {
  const [object1, setObject1] = useState({ name: 'Feather', mass: 0.01, dragCoeff: 2.0 })
  const [object2, setObject2] = useState({ name: 'Hammer', mass: 1.0, dragCoeff: 0.1 })
  const [hasAirResistance, setHasAirResistance] = useState(true)
  const [isDropping, setIsDropping] = useState(false)
  const [results, setResults] = useState(null)
  const animationRef = useRef(null)

  const objects = [
    { name: 'Feather', mass: 0.01, dragCoeff: 2.0, icon: '🪶' },
    { name: 'Paper', mass: 0.05, dragCoeff: 1.5, icon: '📄' },
    { name: 'Ball', mass: 0.2, dragCoeff: 0.5, icon: '⚽' },
    { name: 'Hammer', mass: 1.0, dragCoeff: 0.1, icon: '🔨' },
    { name: 'Bowling Ball', mass: 7.0, dragCoeff: 0.05, icon: '🎳' }
  ]

  const gravity = 9.81 // m/s²
  const dropHeight = 10 // meters
  const airDensity = 1.225 // kg/m³

  const simulateDrop = (obj, withAir) => {
    const timeSteps = []
    const positions = []
    const velocities = []
    
    let y = 0 // position
    let v = 0 // velocity
    let t = 0 // time
    const dt = 0.01 // time step
    
    while (y < dropHeight) {
      let acceleration = gravity
      
      if (withAir) {
        // Air resistance: F_drag = 0.5 * ρ * v² * C_d * A
        // Simplified: assume area proportional to mass^(2/3)
        const area = Math.pow(obj.mass, 2/3) * 0.1
        const dragForce = 0.5 * airDensity * v * v * obj.dragCoeff * area
        const dragAccel = dragForce / obj.mass
        acceleration = gravity - dragAccel
      }
      
      v += acceleration * dt
      y += v * dt
      t += dt
      
      if (t % 0.1 < dt) { // Record every 0.1 seconds
        timeSteps.push(t)
        positions.push(y)
        velocities.push(v)
      }
    }
    
    return {
      fallTime: t,
      finalVelocity: v,
      timeSteps,
      positions,
      velocities
    }
  }

  const runSimulation = () => {
    setIsDropping(true)
    
    const result1WithAir = simulateDrop(object1, hasAirResistance)
    const result1NoAir = simulateDrop(object1, false)
    const result2WithAir = simulateDrop(object2, hasAirResistance)
    const result2NoAir = simulateDrop(object2, false)
    
    setResults({
      object1: {
        withAir: result1WithAir,
        noAir: result1NoAir
      },
      object2: {
        withAir: result2WithAir,
        noAir: result2NoAir
      }
    })
    
    setTimeout(() => setIsDropping(false), 2000)
  }

  const resetSimulation = () => {
    setResults(null)
  }

  return (
    <div style={{ width: '100%', height: '100%', padding: 'var(--spacing-md)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Gravity Drop Experiment
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Object 1 Selection */}
        <div className="card">
          <h4>Object 1: {object1.icon} {object1.name}</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-md)'
          }}>
            {objects.map((obj) => (
              <button
                key={obj.name}
                className={`btn ${object1.name === obj.name ? 'btn-primary' : ''}`}
                onClick={() => setObject1(obj)}
                style={{ 
                  fontSize: '0.75rem',
                  padding: 'var(--spacing-xs)',
                  flexDirection: 'column'
                }}
              >
                <div>{obj.icon}</div>
                {obj.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            <div><strong>Mass:</strong> {object1.mass} kg</div>
            <div><strong>Drag Coefficient:</strong> {object1.dragCoeff}</div>
          </div>
        </div>

        {/* Object 2 Selection */}
        <div className="card">
          <h4>Object 2: {object2.icon} {object2.name}</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-md)'
          }}>
            {objects.map((obj) => (
              <button
                key={obj.name}
                className={`btn ${object2.name === obj.name ? 'btn-primary' : ''}`}
                onClick={() => setObject2(obj)}
                style={{ 
                  fontSize: '0.75rem',
                  padding: 'var(--spacing-xs)',
                  flexDirection: 'column'
                }}
              >
                <div>{obj.icon}</div>
                {obj.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            <div><strong>Mass:</strong> {object2.mass} kg</div>
            <div><strong>Drag Coefficient:</strong> {object2.dragCoeff}</div>
          </div>
        </div>
      </div>

      {/* Simulation Settings */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4>Simulation Settings</h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <input
              type="checkbox"
              checked={hasAirResistance}
              onChange={(e) => setHasAirResistance(e.target.checked)}
            />
            Include Air Resistance
          </label>
          <div style={{
            background: hasAirResistance ? 'var(--warn)' : 'var(--good)',
            color: 'white',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem'
          }}>
            {hasAirResistance ? '🌬️ Earth Atmosphere' : '🌌 Vacuum'}
          </div>
        </div>
        
        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          <div><strong>Drop Height:</strong> {dropHeight} meters</div>
          <div><strong>Gravity:</strong> {gravity} m/s²</div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <button
          className="btn btn-primary"
          onClick={runSimulation}
          disabled={isDropping}
          style={{ fontSize: '1.1rem', padding: 'var(--spacing-md) var(--spacing-lg)' }}
        >
          {isDropping ? '⏳ Dropping...' : '🪂 Drop Objects'}
        </button>
        <button
          className="btn"
          onClick={resetSimulation}
          disabled={!results}
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-md)'
        }}>
          {/* Fall Times Comparison */}
          <div className="card">
            <h4>Fall Time Results</h4>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold',
                borderBottom: '1px solid var(--border)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                <div>Object</div>
                <div>With Air</div>
                <div>Vacuum</div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)'
              }}>
                <div>{object1.icon} {object1.name}</div>
                <div>{results.object1.withAir.fallTime.toFixed(2)}s</div>
                <div>{results.object1.noAir.fallTime.toFixed(2)}s</div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div>{object2.icon} {object2.name}</div>
                <div>{results.object2.withAir.fallTime.toFixed(2)}s</div>
                <div>{results.object2.noAir.fallTime.toFixed(2)}s</div>
              </div>

              <div style={{
                background: 'var(--accent)',
                color: 'white',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center'
              }}>
                <strong>Time Difference:</strong><br />
                {Math.abs(results.object1.withAir.fallTime - results.object2.withAir.fallTime).toFixed(2)}s
                {hasAirResistance ? ' (with air)' : ' (vacuum)'}
              </div>
            </div>
          </div>

          {/* Velocity Comparison */}
          <div className="card">
            <h4>Final Velocities</h4>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold',
                borderBottom: '1px solid var(--border)',
                paddingBottom: 'var(--spacing-xs)'
              }}>
                <div>Object</div>
                <div>With Air</div>
                <div>Vacuum</div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)'
              }}>
                <div>{object1.icon} {object1.name}</div>
                <div>{results.object1.withAir.finalVelocity.toFixed(1)} m/s</div>
                <div>{results.object1.noAir.finalVelocity.toFixed(1)} m/s</div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: 'var(--spacing-sm)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div>{object2.icon} {object2.name}</div>
                <div>{results.object2.withAir.finalVelocity.toFixed(1)} m/s</div>
                <div>{results.object2.noAir.finalVelocity.toFixed(1)} m/s</div>
              </div>

              <div style={{
                background: hasAirResistance ? 'var(--warn)' : 'var(--good)',
                color: 'white',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}>
                {hasAirResistance ? 
                  'Air resistance affects lighter objects more!' :
                  'In vacuum, all objects fall at the same rate!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <h4>Galileo's Discovery</h4>
        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
          Without air resistance, all objects fall at the same rate regardless of their mass.
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          fontFamily: 'monospace',
          marginBottom: 'var(--spacing-sm)'
        }}>
          d = ½gt²
        </p>
        <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>
          Air resistance depends on shape, size, and speed - affecting lighter objects more
        </p>
      </div>
    </div>
  )
}

export default GravityDrop
