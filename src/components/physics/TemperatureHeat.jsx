import React, { useState, useRef, useEffect } from 'react'

const TemperatureHeat = ({ onComplete }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [temperature, setTemperature] = useState(300) // Kelvin
  const [particles, setParticles] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize particles
  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 3 + Math.random() * 2
      })
    }
    setParticles(newParticles)
  }, [])

  // Update particle velocities based on temperature
  useEffect(() => {
    const speedMultiplier = Math.sqrt(temperature / 300) // Proportional to sqrt(T)
    setParticles(prev => prev.map(particle => ({
      ...particle,
      vx: particle.vx * speedMultiplier,
      vy: particle.vy * speedMultiplier
    })))
  }, [temperature])

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx
        let newY = particle.y + particle.vy
        let newVx = particle.vx
        let newVy = particle.vy

        // Bounce off walls
        if (newX <= particle.radius || newX >= 600 - particle.radius) {
          newVx = -newVx
          newX = particle.x
        }
        if (newY <= particle.radius || newY >= 400 - particle.radius) {
          newVy = -newVy
          newY = particle.y
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        }
      }))

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw container
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 3
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Draw particles with color based on temperature
    const hue = Math.max(0, Math.min(240, 240 - (temperature - 200) / 300 * 240)) // Blue to red
    
    particles.forEach(particle => {
      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
      const opacity = Math.min(1, speed / 5)
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${opacity})`
      ctx.fill()
      
      // Add glow for high temperatures
      if (temperature > 400) {
        ctx.shadowColor = `hsl(${hue}, 70%, 50%)`
        ctx.shadowBlur = 5
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })
  }, [particles, temperature])

  const calculateAverageSpeed = () => {
    if (particles.length === 0) return 0
    const totalSpeed = particles.reduce((sum, p) => sum + Math.sqrt(p.vx ** 2 + p.vy ** 2), 0)
    return totalSpeed / particles.length
  }

  const getTemperaturePhase = () => {
    if (temperature < 273) return { phase: 'Solid (Ice)', color: '#3b82f6', icon: '🧊' }
    if (temperature < 373) return { phase: 'Liquid (Water)', color: '#06b6d4', icon: '💧' }
    return { phase: 'Gas (Steam)', color: '#ef4444', icon: '💨' }
  }

  const temperatureC = temperature - 273.15
  const averageSpeed = calculateAverageSpeed()
  const phaseInfo = getTemperaturePhase()

  return (
    <div style={{ width: '100%', height: '100%', padding: 'var(--spacing-md)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Temperature & Molecular Motion
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--spacing-lg)',
        height: '70%'
      }}>
        {/* Particle Simulation */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h4>Particle Container</h4>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--panel)',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>

          {/* Animation Control */}
          <div style={{ textAlign: 'center' }}>
            <button
              className={`btn ${isAnimating ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => setIsAnimating(!isAnimating)}
              style={{ fontSize: '1.1rem', padding: 'var(--spacing-md) var(--spacing-lg)' }}
            >
              {isAnimating ? '⏹️ Stop' : '▶️ Start'} Animation
            </button>
          </div>
        </div>

        {/* Controls and Info */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4>Temperature Control</h4>
            <div className="slider-group">
              <label>
                {temperature} K ({temperatureC.toFixed(1)}°C)
                <input
                  type="range"
                  min="200"
                  max="600"
                  step="5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                />
              </label>
            </div>

            <div style={{
              background: phaseInfo.color,
              color: 'white',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius)',
              textAlign: 'center',
              marginTop: 'var(--spacing-md)'
            }}>
              {phaseInfo.icon} {phaseInfo.phase}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4>Quick Settings</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--spacing-sm)'
            }}>
              <button
                className="btn"
                onClick={() => setTemperature(250)}
                style={{ fontSize: '0.875rem' }}
              >
                ❄️ Freezing (250K)
              </button>
              <button
                className="btn"
                onClick={() => setTemperature(300)}
                style={{ fontSize: '0.875rem' }}
              >
                🌡️ Room Temp (300K)
              </button>
              <button
                className="btn"
                onClick={() => setTemperature(400)}
                style={{ fontSize: '0.875rem' }}
              >
                🔥 Hot (400K)
              </button>
              <button
                className="btn"
                onClick={() => setTemperature(500)}
                style={{ fontSize: '0.875rem' }}
              >
                🌋 Very Hot (500K)
              </button>
            </div>
          </div>

          <div className="card">
            <h4>Measurements</h4>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Temperature:</strong><br />
                {temperature} K / {temperatureC.toFixed(1)}°C
              </div>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Avg. Particle Speed:</strong><br />
                {averageSpeed.toFixed(2)} units/frame
              </div>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Kinetic Energy:</strong><br />
                {isAnimating ? 'High' : 'Paused'} {temperature > 350 ? '🔥' : temperature > 300 ? '🌡️' : '❄️'}
              </div>
              <div>
                <strong>Particle Count:</strong><br />
                {particles.length} molecules
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Info */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <h4>Temperature & Kinetic Energy</h4>
        <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
          Temperature is proportional to the average kinetic energy of particles.
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          fontFamily: 'monospace',
          marginBottom: 'var(--spacing-sm)'
        }}>
          KE = ½mv² ∝ T
        </p>
        <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>
          Higher temperature = faster moving particles = more kinetic energy
        </p>
      </div>
    </div>
  )
}

export default TemperatureHeat
