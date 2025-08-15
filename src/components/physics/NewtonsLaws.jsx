import React, { useRef, useEffect, useState } from 'react'
import { Engine, Render, World, Bodies, Body, Vector, Mouse, MouseConstraint } from 'matter-js'

const NewtonsLaws = ({ onComplete }) => {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const boxRef = useRef(null)
  const [force, setForce] = useState({ magnitude: 0.005, angle: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 300, y: 200 })

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Engine.create()
    engine.world.gravity.y = 0 // No gravity for this demo
    engineRef.current = engine

    // Create boundaries to contain the box
    const boundaries = [
      Bodies.rectangle(300, -10, 600, 20, { isStatic: true }), // top
      Bodies.rectangle(300, 410, 600, 20, { isStatic: true }), // bottom
      Bodies.rectangle(-10, 200, 20, 400, { isStatic: true }), // left
      Bodies.rectangle(610, 200, 20, 400, { isStatic: true })  // right
    ]

    // Create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 400,
        wireframes: false,
        background: 'transparent',
        showVelocity: false,
        showAngleIndicator: false,
        showDebug: false
      }
    })
    renderRef.current = render

    // Create a box with reduced speed
    const box = Bodies.rectangle(300, 200, 50, 50, {
      density: 0.005,  // Reduced density for slower movement
      frictionAir: 0.05, // Increased air friction to slow down
      restitution: 0.8, // Bounce off walls
      render: {
        fillStyle: '#3b82f6',
        strokeStyle: '#1d4ed8',
        lineWidth: 2
      }
    })
    boxRef.current = box

    // Add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    })

    // Add bodies to world (including boundaries)
    World.add(engine.world, [box, mouseConstraint, ...boundaries])

    // Run the engine
    Engine.run(engine)
    Render.run(render)

    // Animation loop for vector updates
    const updateVectors = () => {
      if (boxRef.current) {
        const vel = boxRef.current.velocity
        const pos = boxRef.current.position
        
        setVelocity({ x: vel.x, y: vel.y })
        setPosition({ x: pos.x, y: pos.y })
        
        // Calculate acceleration based on recent velocity changes
        const currentAccel = {
          x: (vel.x - velocity.x) * 60, // 60 FPS assumption
          y: (vel.y - velocity.y) * 60
        }
        setAcceleration(currentAccel)
      }
      requestAnimationFrame(updateVectors)
    }
    updateVectors()

    return () => {
      Render.stop(render)
      Engine.clear(engine)
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])

  const applyForce = () => {
    if (boxRef.current) {
      const forceVector = {
        x: force.magnitude * Math.cos(force.angle * Math.PI / 180),
        y: force.magnitude * Math.sin(force.angle * Math.PI / 180)
      }
      
      Body.applyForce(boxRef.current, boxRef.current.position, forceVector)
    }
  }

  const resetBox = () => {
    if (boxRef.current) {
      Body.setPosition(boxRef.current, { x: 300, y: 200 })
      Body.setVelocity(boxRef.current, { x: 0, y: 0 })
      Body.setAngularVelocity(boxRef.current, 0)
    }
  }

  const drawVectors = () => {
    if (!renderRef.current || !boxRef.current) return null

    const canvas = renderRef.current.canvas
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    const pos = boxRef.current.position
    const scale = 30 // Reduced scale for better visibility

    return (
      <div>
        {/* Coordinate display */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 10
        }}>
          Position: ({position.x.toFixed(1)}, {position.y.toFixed(1)})
        </div>

        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          viewBox="0 0 600 400"
        >
        {/* Velocity vector (green) */}
        {Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1 ? (
          <g>
            <line
              x1={pos.x}
              y1={pos.y}
              x2={pos.x + velocity.x * scale}
              y2={pos.y + velocity.y * scale}
              stroke="#10b981"
              strokeWidth="3"
              markerEnd="url(#arrowgreen)"
            />
            <text
              x={pos.x + velocity.x * scale + 10}
              y={pos.y + velocity.y * scale}
              fill="#10b981"
              fontSize="12"
              fontWeight="bold"
            >
              Velocity
            </text>
          </g>
        ) : null}

        {/* Acceleration vector (red) */}
        {Math.abs(acceleration.x) > 0.1 || Math.abs(acceleration.y) > 0.1 ? (
          <g>
            <line
              x1={pos.x}
              y1={pos.y}
              x2={pos.x + acceleration.x * scale * 0.1}
              y2={pos.y + acceleration.y * scale * 0.1}
              stroke="#ef4444"
              strokeWidth="3"
              markerEnd="url(#arrowred)"
            />
            <text
              x={pos.x + acceleration.x * scale * 0.1 + 10}
              y={pos.y + acceleration.y * scale * 0.1 - 10}
              fill="#ef4444"
              fontSize="12"
              fontWeight="bold"
            >
              Acceleration
            </text>
          </g>
        ) : null}

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowgreen"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#10b981"
            />
          </marker>
          <marker
            id="arrowred"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#ef4444"
            />
          </marker>
        </defs>
        </svg>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={canvasRef} style={{ width: '100%', height: '60%' }}>
        {drawVectors()}
      </div>

      <div style={{ 
        padding: 'var(--spacing-md)',
        background: 'var(--panel)',
        borderTop: '1px solid var(--border)'
      }}>
        <div className="control-panel">
          <div className="slider-group">
            <label>
              Force Magnitude: {force.magnitude.toFixed(4)}
              <input
                type="range"
                min="0"
                max="0.02"
                step="0.001"
                value={force.magnitude}
                onChange={(e) => setForce(prev => ({ ...prev, magnitude: parseFloat(e.target.value) }))}
              />
            </label>
          </div>

          <div className="slider-group">
            <label>
              Force Angle: {force.angle}°
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={force.angle}
                onChange={(e) => setForce(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
              />
            </label>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-md)'
          }}>
            <button className="btn btn-primary" onClick={applyForce}>
              Apply Force
            </button>
            <button className="btn" onClick={resetBox}>
              Reset
            </button>
          </div>

          <div style={{ 
            marginTop: 'var(--spacing-md)',
            fontSize: '0.875rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-sm)'
          }}>
            <div>
              <strong style={{ color: '#10b981' }}>Velocity:</strong><br />
              x: {velocity.x.toFixed(2)}<br />
              y: {velocity.y.toFixed(2)}
            </div>
            <div>
              <strong style={{ color: '#ef4444' }}>Acceleration:</strong><br />
              x: {acceleration.x.toFixed(2)}<br />
              y: {acceleration.y.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewtonsLaws
