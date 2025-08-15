import React, { useState, useRef, useEffect } from 'react'

const LightOptics = ({ onComplete }) => {
  const [lensType, setLensType] = useState('convex')
  const [material1, setMaterial1] = useState('air')
  const [material2, setMaterial2] = useState('glass')
  const [incidentAngle, setIncidentAngle] = useState(30)
  const [focalLength, setFocalLength] = useState(20)
  const [objectDistance, setObjectDistance] = useState(30)
  const canvasRef = useRef(null)

  const materials = {
    air: { name: 'Air', n: 1.00, color: '#e5e7eb' },
    water: { name: 'Water', n: 1.33, color: '#3b82f6' },
    glass: { name: 'Glass', n: 1.52, color: '#6b7280' },
    diamond: { name: 'Diamond', n: 2.42, color: '#f3f4f6' }
  }

  const calculateRefraction = () => {
    const n1 = materials[material1].n
    const n2 = materials[material2].n
    const theta1 = incidentAngle * Math.PI / 180
    
    const sinTheta2 = (n1 * Math.sin(theta1)) / n2
    
    if (sinTheta2 > 1) {
      return { refractedAngle: null, totalInternalReflection: true }
    }
    
    const theta2 = Math.asin(sinTheta2) * 180 / Math.PI
    return { refractedAngle: theta2, totalInternalReflection: false }
  }

  const calculateLensOptics = () => {
    const imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength)
    const magnification = -imageDistance / objectDistance
    
    return {
      imageDistance,
      magnification,
      isReal: imageDistance > 0,
      isUpright: magnification > 0
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Draw lens
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 3
    ctx.beginPath()
    
    if (lensType === 'convex') {
      ctx.arc(centerX - 40, centerY, 60, -Math.PI/3, Math.PI/3)
      ctx.arc(centerX + 40, centerY, 60, 2*Math.PI/3, 4*Math.PI/3)
    } else {
      ctx.arc(centerX + 40, centerY, 60, -2*Math.PI/3, -Math.PI/3)
      ctx.arc(centerX - 40, centerY, 60, Math.PI/3, 2*Math.PI/3)
    }
    ctx.stroke()
    
    // Draw optical axis
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(canvas.width, centerY)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw focal points
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(centerX - focalLength * 2, centerY, 3, 0, Math.PI * 2)
    ctx.arc(centerX + focalLength * 2, centerY, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw object
    const objX = centerX - objectDistance * 2
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(objX, centerY)
    ctx.lineTo(objX, centerY - 40)
    ctx.stroke()
    
    // Draw object arrow
    ctx.beginPath()
    ctx.moveTo(objX - 5, centerY - 35)
    ctx.lineTo(objX, centerY - 40)
    ctx.lineTo(objX + 5, centerY - 35)
    ctx.stroke()
    
    // Draw image
    const lensOptics = calculateLensOptics()
    if (Math.abs(lensOptics.imageDistance) < 100) {
      const imgX = centerX + lensOptics.imageDistance * 2
      const imgHeight = 40 * Math.abs(lensOptics.magnification)
      
      ctx.strokeStyle = lensOptics.isReal ? '#10b981' : '#f59e0b'
      ctx.setLineDash(lensOptics.isReal ? [] : [5, 5])
      ctx.beginPath()
      ctx.moveTo(imgX, centerY)
      ctx.lineTo(imgX, centerY + (lensOptics.isUpright ? -imgHeight : imgHeight))
      ctx.stroke()
      ctx.setLineDash([])
    }
    
    // Labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '12px Arial'
    ctx.fillText('F', centerX - focalLength * 2 - 10, centerY + 15)
    ctx.fillText('F', centerX + focalLength * 2 + 5, centerY + 15)
    
  }, [lensType, focalLength, objectDistance, incidentAngle, material1, material2])

  const result = calculateRefraction()
  const lensOptics = calculateLensOptics()

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      padding: 'var(--spacing-md)',
      overflowY: 'auto'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Light & Optics
      </h3>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4>Optical Visualization</h4>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            background: 'var(--panel)'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div className="card">
          <h4>Lens Settings</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <button
              className={`btn ${lensType === 'convex' ? 'btn-primary' : ''}`}
              onClick={() => setLensType('convex')}
            >
              Convex
            </button>
            <button
              className={`btn ${lensType === 'concave' ? 'btn-primary' : ''}`}
              onClick={() => setLensType('concave')}
            >
              Concave
            </button>
          </div>
          
          <div className="slider-group">
            <label>
              Focal Length: {focalLength} cm
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={focalLength}
                onChange={(e) => setFocalLength(parseInt(e.target.value))}
              />
            </label>
          </div>
          
          <div className="slider-group">
            <label>
              Object Distance: {objectDistance} cm
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={objectDistance}
                onChange={(e) => setObjectDistance(parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="card">
          <h4>Refraction</h4>
          <div style={{ marginBottom: 'var(--spacing-sm)' }}>
            <label>
              Material 1:
              <select
                value={material1}
                onChange={(e) => setMaterial1(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-xs)',
                  margin: 'var(--spacing-xs) 0',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border)'
                }}
              >
                {Object.entries(materials).map(([key, mat]) => (
                  <option key={key} value={key}>{mat.name} (n={mat.n})</option>
                ))}
              </select>
            </label>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label>
              Material 2:
              <select
                value={material2}
                onChange={(e) => setMaterial2(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-xs)',
                  margin: 'var(--spacing-xs) 0',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border)'
                }}
              >
                {Object.entries(materials).map(([key, mat]) => (
                  <option key={key} value={key}>{mat.name} (n={mat.n})</option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="slider-group">
            <label>
              Incident Angle: {incidentAngle}°
              <input
                type="range"
                min="0"
                max="89"
                step="1"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="card">
          <h4>Results</h4>
          
          <div style={{ 
            background: 'var(--bg)', 
            padding: 'var(--spacing-sm)', 
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <strong>Lens:</strong>
            <div style={{ fontSize: '0.875rem' }}>
              <div>Image Distance: {lensOptics.imageDistance.toFixed(1)} cm</div>
              <div>Magnification: {lensOptics.magnification.toFixed(2)}×</div>
              <div>Type: {lensOptics.isReal ? 'Real' : 'Virtual'}</div>
            </div>
          </div>
          
          <div style={{ 
            background: 'var(--bg)', 
            padding: 'var(--spacing-sm)', 
            borderRadius: 'var(--border-radius)'
          }}>
            <strong>Refraction:</strong>
            <div style={{ fontSize: '0.875rem' }}>
              {result.totalInternalReflection ? (
                <div style={{ color: '#ef4444' }}>Total Internal Reflection!</div>
              ) : (
                <div>
                  <div>Incident: {incidentAngle}°</div>
                  <div>Refracted: {result.refractedAngle.toFixed(1)}°</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LightOptics
