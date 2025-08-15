import React, { useState, useRef, useEffect } from 'react'

const SoundWaves = ({ onComplete }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [frequency, setFrequency] = useState(440) // Hz (A4 note)
  const [amplitude, setAmplitude] = useState(50) // pixels
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)

  const speedOfSound = 343 // m/s in air at 20°C
  const wavelength = speedOfSound / frequency // meters
  const wavelengthPixels = Math.max(50, Math.min(400, 20000 / frequency)) // Scale for visualization

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width = 600
    const height = canvas.height = 300

    const drawWave = () => {
      // Clear canvas
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel').trim()
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3

      // Horizontal lines
      for (let y = 0; y <= height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x <= width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Draw center line
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw wave
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x <= width; x += 2) {
        const angle = (2 * Math.PI * x / wavelengthPixels) + (isPlaying ? time * 0.1 : 0)
        const y = height / 2 + amplitude * Math.sin(angle)
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Draw wavelength indicator
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--good').trim()
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, height - 30)
      ctx.lineTo(wavelengthPixels, height - 30)
      ctx.stroke()

      // Wavelength arrows
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--good').trim()
      ctx.beginPath()
      ctx.moveTo(0, height - 30)
      ctx.lineTo(10, height - 35)
      ctx.lineTo(10, height - 25)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(wavelengthPixels, height - 30)
      ctx.lineTo(wavelengthPixels - 10, height - 35)
      ctx.lineTo(wavelengthPixels - 10, height - 25)
      ctx.fill()

      // Wavelength label
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`λ = ${wavelength.toFixed(2)} m`, wavelengthPixels / 2, height - 10)

      // Draw amplitude indicator
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--warn').trim()
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(width - 50, height / 2)
      ctx.lineTo(width - 50, height / 2 - amplitude)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width - 50, height / 2)
      ctx.lineTo(width - 50, height / 2 + amplitude)
      ctx.stroke()
      ctx.setLineDash([])

      // Amplitude arrows
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--warn').trim()
      ctx.beginPath()
      ctx.moveTo(width - 50, height / 2 - amplitude)
      ctx.lineTo(width - 55, height / 2 - amplitude + 10)
      ctx.lineTo(width - 45, height / 2 - amplitude + 10)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(width - 50, height / 2 + amplitude)
      ctx.lineTo(width - 55, height / 2 + amplitude - 10)
      ctx.lineTo(width - 45, height / 2 + amplitude - 10)
      ctx.fill()

      // Amplitude label
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('A', width - 40, height / 2)

      if (isPlaying) {
        setTime(prev => prev + 1)
        animationRef.current = requestAnimationFrame(drawWave)
      }
    }

    drawWave()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [frequency, amplitude, isPlaying, time, wavelength, wavelengthPixels])

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setTime(0)
    }
  }

  const getFrequencyNote = (freq) => {
    const notes = [
      { freq: 261.63, name: 'C4' },
      { freq: 293.66, name: 'D4' },
      { freq: 329.63, name: 'E4' },
      { freq: 349.23, name: 'F4' },
      { freq: 392.00, name: 'G4' },
      { freq: 440.00, name: 'A4' },
      { freq: 493.88, name: 'B4' },
      { freq: 523.25, name: 'C5' }
    ]
    
    const closest = notes.reduce((prev, curr) => 
      Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
    )
    
    return Math.abs(closest.freq - freq) < 10 ? closest.name : ''
  }

  const presetFrequencies = [
    { name: 'Low C', freq: 131, color: '#ef4444' },
    { name: 'Middle C', freq: 262, color: '#f59e0b' },
    { name: 'A4', freq: 440, color: '#10b981' },
    { name: 'High C', freq: 523, color: '#3b82f6' },
    { name: 'Ultrasonic', freq: 20000, color: '#8b5cf6' }
  ]

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      padding: 'var(--spacing-md)',
      overflowY: 'auto'
    }}>
      {/* Wave Display */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h3>Sound Wave Simulator</h3>
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            background: 'var(--panel)',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Frequency Control */}
        <div className="card">
          <h4>Frequency (Pitch)</h4>
          <div className="slider-group">
            <label>
              {frequency} Hz {getFrequencyNote(frequency)}
              <input
                type="range"
                min="20"
                max="2000"
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
              />
            </label>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <strong>Preset Notes:</strong>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: 'var(--spacing-xs)',
              marginTop: 'var(--spacing-sm)'
            }}>
              {presetFrequencies.map((preset) => (
                <button
                  key={preset.name}
                  className={`btn ${frequency === preset.freq ? 'btn-primary' : ''}`}
                  onClick={() => setFrequency(preset.freq)}
                  style={{
                    fontSize: '0.75rem',
                    padding: 'var(--spacing-xs)',
                    borderColor: preset.color
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amplitude Control */}
        <div className="card">
          <h4>Amplitude (Volume)</h4>
          <div className="slider-group">
            <label>
              {amplitude} units
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
              />
            </label>
          </div>
          
          <div style={{ 
            marginTop: 'var(--spacing-md)',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            <strong>Volume Level:</strong><br />
            {amplitude < 30 ? '🔈 Quiet' : 
             amplitude < 60 ? '🔉 Medium' : 
             '🔊 Loud'}
          </div>
        </div>
      </div>

      {/* Wave Properties */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4>Wave Properties</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-md)',
          fontSize: '0.875rem'
        }}>
          <div>
            <strong>Frequency:</strong><br />
            {frequency} Hz
          </div>
          <div>
            <strong>Wavelength:</strong><br />
            {wavelength.toFixed(2)} m
          </div>
          <div>
            <strong>Speed:</strong><br />
            {speedOfSound} m/s
          </div>
          <div>
            <strong>Period:</strong><br />
            {(1/frequency * 1000).toFixed(2)} ms
          </div>
        </div>
      </div>

      {/* Animation Control */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <button
          className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`}
          onClick={toggleAnimation}
          style={{ fontSize: '1.1rem', padding: 'var(--spacing-md) var(--spacing-lg)' }}
        >
          {isPlaying ? '⏹️ Stop Animation' : '▶️ Animate Wave'}
        </button>
      </div>

      {/* Educational Info */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h4>Wave Equation</h4>
        <p style={{ 
          fontSize: '1.2rem', 
          fontFamily: 'monospace',
          marginBottom: 'var(--spacing-sm)'
        }}>
          λ = v / f
        </p>
        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          Wavelength = Speed ÷ Frequency
        </p>
        <p style={{ 
          fontSize: '0.75rem', 
          opacity: 0.8,
          marginTop: 'var(--spacing-sm)'
        }}>
          Higher frequency = shorter wavelength = higher pitch
        </p>
      </div>
    </div>
  )
}

export default SoundWaves
