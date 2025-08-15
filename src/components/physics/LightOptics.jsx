import React, { useState, useRef, useEffect } from 'react'

const LightOptics = ({ onComplete }) => {
  const [lensType, setLensType] = useState('convex')
  const [material1, setMaterial1] = useState('air')
  const [material2, setMaterial2] = useState('glass')
  const [incidentAngle, setIncidentAngle] = useState(30)
  const [focalLength, setFocalLength] = useState(20)
  const [objectDistance, setObjectDistance] = useState(30)
  const [incidentPoint, setIncidentPoint] = useState({ x: 50, y: 50 })
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
    
    // Snell's law: n1 * sin(theta1) = n2 * sin(theta2)
    const sinTheta2 = (n1 * Math.sin(theta1)) / n2
    
    if (sinTheta2 > 1) {
      return { refractedAngle: null, totalInternalReflection: true }
    }
    
    const theta2 = Math.asin(sinTheta2) * 180 / Math.PI
    return { refractedAngle: theta2, totalInternalReflection: false }
  }

  const calculateLensOptics = () => {
    // Lens equation: 1/f = 1/do + 1/di
    const imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength)
    const magnification = -imageDistance / objectDistance
    
    return {
      imageDistance,
      magnification,
      isReal: imageDistance > 0,
      isUpright: magnification > 0
    }
  }

  // Enhanced canvas drawing
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Draw lens
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 3
    ctx.beginPath()
    
    if (lensType === 'convex') {
      // Convex lens
      ctx.arc(centerX - 40, centerY, 60, -Math.PI/3, Math.PI/3)
      ctx.arc(centerX + 40, centerY, 60, 2*Math.PI/3, 4*Math.PI/3)
    } else {
      // Concave lens
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
    
    // Draw arrow head on object
    ctx.beginPath()
    ctx.moveTo(objX - 5, centerY - 35)
    ctx.lineTo(objX, centerY - 40)
    ctx.lineTo(objX + 5, centerY - 35)
    ctx.stroke()
    
    // Calculate and draw image
    const lensOptics = calculateLensOptics()
    if (Math.abs(lensOptics.imageDistance) < 1000) { // Reasonable image distance
      const imgX = centerX + lensOptics.imageDistance * 2
      const imgHeight = 40 * Math.abs(lensOptics.magnification)
      
      ctx.strokeStyle = lensOptics.isReal ? '#10b981' : '#f59e0b'
      ctx.setLineDash(lensOptics.isReal ? [] : [5, 5])
      ctx.beginPath()
      ctx.moveTo(imgX, centerY)
      ctx.lineTo(imgX, centerY + (lensOptics.isUpright ? -imgHeight : imgHeight))
      ctx.stroke()
      
      // Draw arrow head on image
      const arrowY = centerY + (lensOptics.isUpright ? -imgHeight : imgHeight)
      ctx.beginPath()
      ctx.moveTo(imgX - 3, arrowY + (lensOptics.isUpright ? 5 : -5))
      ctx.lineTo(imgX, arrowY)
      ctx.lineTo(imgX + 3, arrowY + (lensOptics.isUpright ? 5 : -5))
      ctx.stroke()
      ctx.setLineDash([])
    }
    
    // Draw light rays for refraction
    if (material1 !== material2) {
      const result = calculateRefraction()
      const rayStartX = incidentPoint.x
      const rayStartY = incidentPoint.y
      const interfaceX = centerX
      
      // Incident ray
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rayStartX, rayStartY)
      ctx.lineTo(interfaceX, centerY)
      ctx.stroke()
      
      // Refracted ray
      if (!result.totalInternalReflection) {
        const refractedLength = 100
        const refractedEndX = interfaceX + refractedLength * Math.cos(result.refractedAngle * Math.PI / 180)
        const refractedEndY = centerY + refractedLength * Math.sin(result.refractedAngle * Math.PI / 180)
        
        ctx.strokeStyle = '#06d6a0'
        ctx.beginPath()
        ctx.moveTo(interfaceX, centerY)
        ctx.lineTo(refractedEndX, refractedEndY)
        ctx.stroke()
      } else {
        // Total internal reflection
        ctx.strokeStyle = '#ef4444'
        const reflectedLength = 100
        const reflectedEndX = interfaceX - reflectedLength * Math.cos(incidentAngle * Math.PI / 180)
        const reflectedEndY = centerY - reflectedLength * Math.sin(incidentAngle * Math.PI / 180)
        
        ctx.beginPath()
        ctx.moveTo(interfaceX, centerY)
        ctx.lineTo(reflectedEndX, reflectedEndY)
        ctx.stroke()
      }
    }
    
    // Labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '12px Arial'
    ctx.fillText('F', centerX - focalLength * 2 - 10, centerY + 15)
    ctx.fillText('F', centerX + focalLength * 2 + 5, centerY + 15)
    ctx.fillText('Object', objX - 20, centerY + 60)
    
  }, [lensType, focalLength, objectDistance, incidentAngle, material1, material2, incidentPoint])

  const result = calculateRefraction()
  const lensOptics = calculateLensOptics()

  return (
    <div style={{ width: '100%', height: '100%', padding: 'var(--spacing-md)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        Advanced Light & Optics
      </h3>

      {/* Main Canvas */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h4>Optical System Visualization</h4>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            background: 'var(--panel)',
            cursor: 'crosshair'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) * (800 / rect.width)
            const y = (e.clientY - rect.top) * (400 / rect.height)
            setIncidentPoint({ x, y })
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Lens Controls */}
        <div className="card">
          <h4>Lens Configuration</h4>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <button
                className={`btn ${lensType === 'convex' ? 'btn-primary' : ''}`}
                onClick={() => setLensType('convex')}
              >
                🔍 Convex
              </button>
              <button
                className={`btn ${lensType === 'concave' ? 'btn-primary' : ''}`}
                onClick={() => setLensType('concave')}
              >
                🔍 Concave
              </button>
            </div>
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

          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4>Materials</h4>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                Material 1:
                <select
                  value={material1}
                  onChange={(e) => setMaterial1(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-xs)',
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
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                Material 2:
                <select
                  value={material2}
                  onChange={(e) => setMaterial2(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-xs)',
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
          </div>

          <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div className="slider-group">
              <label>
                Incident Angle: {incidentAngle}°
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={incidentAngle}
                  onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="card">
            <h4>Results</h4>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Incident Angle:</strong><br />
                {incidentAngle}°
              </div>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <strong>Refracted Angle:</strong><br />
                {result.totalInternalReflection ? 
                  'Total Internal Reflection' : 
                  `${result.refractedAngle?.toFixed(1)}°`}
              </div>
              <div>
                <strong>Refractive Index Ratio:</strong><br />
                n₁/n₂ = {(materials[material1].n / materials[material2].n).toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Ray Diagram */}
        <div className="card">
          <h4>Ray Diagram</h4>
          <div style={{
            height: '400px',
            background: 'var(--bg)',
            borderRadius: 'var(--border-radius)',
            position: 'relative',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              {/* Interface line */}
              <line
                x1="200" y1="0"
                x2="200" y2="400"
                stroke="var(--border)"
                strokeWidth="3"
                strokeDasharray="5,5"
              />

              {/* Material backgrounds */}
              <rect
                x="0" y="0"
                width="200" height="400"
                fill={materials[material1].color}
                opacity="0.3"
              />
              <rect
                x="200" y="0"
                width="200" height="400"
                fill={materials[material2].color}
                opacity="0.3"
              />

              {/* Normal line */}
              <line
                x1="180" y1="200"
                x2="220" y2="200"
                stroke="var(--text)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />

              {/* Incident ray */}
              <line
                x1={200 - 100 * Math.sin(incidentAngle * Math.PI / 180)}
                y1={200 - 100 * Math.cos(incidentAngle * Math.PI / 180)}
                x2="200"
                y2="200"
                stroke="#ef4444"
                strokeWidth="3"
                markerEnd="url(#arrowRed)"
              />

              {/* Refracted ray or reflected ray */}
              {result.totalInternalReflection ? (
                // Reflected ray
                <line
                  x1="200"
                  y1="200"
                  x2={200 + 100 * Math.sin(incidentAngle * Math.PI / 180)}
                  y2={200 - 100 * Math.cos(incidentAngle * Math.PI / 180)}
                  stroke="#10b981"
                  strokeWidth="3"
                  markerEnd="url(#arrowGreen)"
                />
              ) : (
                // Refracted ray
                <line
                  x1="200"
                  y1="200"
                  x2={200 + 100 * Math.sin(result.refractedAngle * Math.PI / 180)}
                  y2={200 + 100 * Math.cos(result.refractedAngle * Math.PI / 180)}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  markerEnd="url(#arrowBlue)"
                />
              )}

              {/* Lens visualization */}
              {lensType === 'convex' ? (
                <ellipse
                  cx="200" cy="200"
                  rx="20" ry="80"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                />
              ) : (
                <path
                  d="M 180 120 Q 200 200 180 280 M 220 120 Q 200 200 220 280"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                />
              )}

              {/* Labels */}
              <text x="100" y="30" fill="var(--text)" fontSize="14" textAnchor="middle">
                {materials[material1].name}
              </text>
              <text x="300" y="30" fill="var(--text)" fontSize="14" textAnchor="middle">
                {materials[material2].name}
              </text>

              {/* Angle indicators */}
              <path
                d={`M 200 200 L 200 170 A 30 30 0 0 1 ${200 - 30 * Math.sin(incidentAngle * Math.PI / 180)} ${200 - 30 * Math.cos(incidentAngle * Math.PI / 180)}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text
                x={200 - 15 * Math.sin(incidentAngle * Math.PI / 180 / 2)}
                y={200 - 15 * Math.cos(incidentAngle * Math.PI / 180 / 2)}
                fill="#ef4444"
                fontSize="12"
                textAnchor="middle"
              >
                θ₁
              </text>

              {!result.totalInternalReflection && (
                <>
                  <path
                    d={`M 200 200 L 200 230 A 30 30 0 0 0 ${200 + 30 * Math.sin(result.refractedAngle * Math.PI / 180)} ${200 + 30 * Math.cos(result.refractedAngle * Math.PI / 180)}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text
                    x={200 + 15 * Math.sin(result.refractedAngle * Math.PI / 180 / 2)}
                    y={200 + 15 * Math.cos(result.refractedAngle * Math.PI / 180 / 2)}
                    fill="#3b82f6"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    θ₂
                  </text>
                </>
              )}

              {/* Arrow markers */}
              <defs>
                <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
                <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Snell's Law Formula */}
      <div className="card" style={{
        background: 'var(--accent)',
        color: 'white',
        textAlign: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <h4>Snell's Law</h4>
        <p style={{ 
          fontSize: '1.5rem', 
          fontFamily: 'monospace',
          marginBottom: 'var(--spacing-sm)'
        }}>
          n₁ sin(θ₁) = n₂ sin(θ₂)
        </p>
        <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
          The ratio of sines of angles is equal to the ratio of refractive indices
        </p>
        {result.totalInternalReflection && (
          <p style={{ 
            fontSize: '0.75rem', 
            opacity: 0.8,
            marginTop: 'var(--spacing-sm)',
            color: '#fbbf24'
          }}>
            ⚠️ Total internal reflection occurs when sin(θ₂) &gt; 1
          </p>
        )}
      </div>
    </div>
  )
}

export default LightOptics
