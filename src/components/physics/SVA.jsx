import React, { useState, useRef, useEffect } from 'react'

const SVA = ({ onComplete }) => {
  const [cart1, setCart1] = useState({ mass: 1, thrust: 5, friction: 0.5 })
  const [cart2, setCart2] = useState({ mass: 2, thrust: 3, friction: 0.3 })
  const [isRacing, setIsRacing] = useState(false)
  const [raceResults, setRaceResults] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const animationRef = useRef(null)
  const canvasRef = useRef(null)

  const calculateAcceleration = (cart) => {
    const netForce = cart.thrust - cart.friction
    return netForce / cart.mass
  }

  const runRace = () => {
    setIsRacing(true)
    setCurrentTime(0)
    
    const cart1Acc = calculateAcceleration(cart1)
    const cart2Acc = calculateAcceleration(cart2)
    
    // Simple physics calculation for 10 seconds
    const timeSteps = []
    const cart1Data = []
    const cart2Data = []
    
    for (let t = 0; t <= 10; t += 0.1) {
      timeSteps.push(t)
      
      // v = at, s = ½at²
      const cart1Velocity = cart1Acc * t
      const cart1Distance = 0.5 * cart1Acc * t * t
      
      const cart2Velocity = cart2Acc * t
      const cart2Distance = 0.5 * cart2Acc * t * t
      
      cart1Data.push({ time: t, velocity: cart1Velocity, distance: cart1Distance })
      cart2Data.push({ time: t, velocity: cart2Velocity, distance: cart2Distance })
    }
    
    setRaceResults({ cart1Data, cart2Data, timeSteps })
    
    // Animate the race
    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000 // Convert to seconds
      setCurrentTime(elapsed)
      
      if (elapsed < 10) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsRacing(false)
        setCurrentTime(10)
      }
    }
    animate()
  }

  const resetRace = () => {
    setRaceResults(null)
    setCurrentTime(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsRacing(false)
  }

  // Canvas visualization
  useEffect(() => {
    if (!canvasRef.current || !raceResults) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw track
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 2
    ctx.strokeRect(50, 100, 500, 100)
    ctx.strokeRect(50, 220, 500, 100)
    
    // Track labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '14px Arial'
    ctx.fillText('Cart 1 (Blue)', 60, 90)
    ctx.fillText('Cart 2 (Red)', 60, 210)
    
    // Current data index
    const dataIndex = Math.min(Math.floor(currentTime * 10), raceResults.cart1Data.length - 1)
    const cart1Current = raceResults.cart1Data[dataIndex]
    const cart2Current = raceResults.cart2Data[dataIndex]
    
    // Draw carts at current positions
    const maxDistance = Math.max(
      raceResults.cart1Data[raceResults.cart1Data.length - 1].distance,
      raceResults.cart2Data[raceResults.cart2Data.length - 1].distance
    )
    
    const cart1X = 50 + (cart1Current.distance / maxDistance) * 480
    const cart2X = 50 + (cart2Current.distance / maxDistance) * 480
    
    // Cart 1 (Blue)
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(cart1X, 120, 20, 60)
    ctx.fillStyle = '#1d4ed8'
    ctx.fillRect(cart1X + 2, 122, 16, 56)
    
    // Cart 2 (Red)
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(cart2X, 240, 20, 60)
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(cart2X + 2, 242, 16, 56)
    
    // Display current values
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '12px Arial'
    ctx.fillText(`V: ${cart1Current.velocity.toFixed(1)} m/s`, cart1X, 110)
    ctx.fillText(`D: ${cart1Current.distance.toFixed(1)} m`, cart1X, 190)
    ctx.fillText(`V: ${cart2Current.velocity.toFixed(1)} m/s`, cart2X, 230)
    ctx.fillText(`D: ${cart2Current.distance.toFixed(1)} m`, cart2X, 310)
    
  }, [raceResults, currentTime])

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      padding: 'var(--spacing-md)',
      overflowY: 'auto'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Speed, Velocity & Acceleration Race
      </h3>

      {/* Cart Configuration */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Cart 1 */}
        <div className="card" style={{ borderColor: '#3b82f6' }}>
          <h4 style={{ color: '#3b82f6' }}>🏎️ Cart 1 (Blue)</h4>
          
          <div className="slider-group">
            <label>
              Mass: {cart1.mass} kg
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={cart1.mass}
                onChange={(e) => setCart1(prev => ({ ...prev, mass: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              Thrust Force: {cart1.thrust} N
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={cart1.thrust}
                onChange={(e) => setCart1(prev => ({ ...prev, thrust: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              Friction: {cart1.friction} N
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={cart1.friction}
                onChange={(e) => setCart1(prev => ({ ...prev, friction: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div style={{ 
            background: 'var(--bg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            marginTop: 'var(--spacing-md)'
          }}>
            <strong>Acceleration:</strong> {calculateAcceleration(cart1).toFixed(2)} m/s²
          </div>
        </div>

        {/* Cart 2 */}
        <div className="card" style={{ borderColor: '#ef4444' }}>
          <h4 style={{ color: '#ef4444' }}>🏎️ Cart 2 (Red)</h4>
          
          <div className="slider-group">
            <label>
              Mass: {cart2.mass} kg
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={cart2.mass}
                onChange={(e) => setCart2(prev => ({ ...prev, mass: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              Thrust Force: {cart2.thrust} N
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={cart2.thrust}
                onChange={(e) => setCart2(prev => ({ ...prev, thrust: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              Friction: {cart2.friction} N
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={cart2.friction}
                onChange={(e) => setCart2(prev => ({ ...prev, friction: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div style={{ 
            background: 'var(--bg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            marginTop: 'var(--spacing-md)'
          }}>
            <strong>Acceleration:</strong> {calculateAcceleration(cart2).toFixed(2)} m/s²
          </div>
        </div>
      </div>

      {/* Race Visualization */}
      {raceResults && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h4>Live Race Visualization</h4>
          <canvas
            ref={canvasRef}
            width={600}
            height={350}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid var(--border)',
              borderRadius: 'var(--border-radius)',
              background: 'var(--panel)'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--spacing-sm)',
            fontSize: '0.875rem'
          }}>
            <span>Time: {currentTime.toFixed(1)}s</span>
            <span>{isRacing ? '🏁 Racing in progress...' : '✅ Race completed!'}</span>
          </div>
        </div>
      )}

      {/* Race Controls */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <button
          className="btn btn-primary"
          onClick={runRace}
          disabled={isRacing}
          style={{ fontSize: '1.1rem', padding: 'var(--spacing-md) var(--spacing-lg)' }}
        >
          {isRacing ? '🏁 Racing...' : '🚦 Start Race!'}
        </button>
        <button
          className="btn"
          onClick={resetRace}
          disabled={!raceResults}
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {raceResults && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-md)'
        }}>
          {/* Distance Graph */}
          <div className="card">
            <h4>Distance vs Time</h4>
            <div style={{
              height: '200px',
              background: 'var(--bg)',
              borderRadius: 'var(--border-radius)',
              position: 'relative',
              border: '1px solid var(--border)'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 300 200">
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Cart 1 line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={raceResults.cart1Data.map((point, i) => 
                    `${i * 30},${200 - Math.min(point.distance * 5, 180)}`
                  ).join(' ')}
                />
                
                {/* Cart 2 line */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={raceResults.cart2Data.map((point, i) => 
                    `${i * 30},${200 - Math.min(point.distance * 5, 180)}`
                  ).join(' ')}
                />
              </svg>
              
              <div style={{
                position: 'absolute',
                bottom: '5px',
                left: '5px',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#3b82f6' }}>■ Cart 1</span>{' '}
                <span style={{ color: '#ef4444' }}>■ Cart 2</span>
              </div>
            </div>
          </div>

          {/* Velocity Graph */}
          <div className="card">
            <h4>Velocity vs Time</h4>
            <div style={{
              height: '200px',
              background: 'var(--bg)',
              borderRadius: 'var(--border-radius)',
              position: 'relative',
              border: '1px solid var(--border)'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 300 200">
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Cart 1 line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={raceResults.cart1Data.map((point, i) => 
                    `${i * 30},${200 - Math.min(point.velocity * 10, 180)}`
                  ).join(' ')}
                />
                
                {/* Cart 2 line */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={raceResults.cart2Data.map((point, i) => 
                    `${i * 30},${200 - Math.min(point.velocity * 10, 180)}`
                  ).join(' ')}
                />
              </svg>
              
              <div style={{
                position: 'absolute',
                bottom: '5px',
                left: '5px',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#3b82f6' }}>■ Cart 1</span>{' '}
                <span style={{ color: '#ef4444' }}>■ Cart 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formula Info */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <h4>Key Formulas</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-md)',
          fontFamily: 'monospace',
          fontSize: '1.1rem'
        }}>
          <div>F = ma</div>
          <div>v = at</div>
          <div>s = ½at²</div>
        </div>
        <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: 'var(--spacing-sm)' }}>
          Force = mass × acceleration | velocity = acceleration × time | distance = ½ × acceleration × time²
        </p>
      </div>
    </div>
  )
}

export default SVA
