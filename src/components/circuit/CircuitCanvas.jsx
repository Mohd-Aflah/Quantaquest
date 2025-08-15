import React, { useRef, useEffect, useState, useCallback } from 'react'
import { snapToGrid, getTerminalPosition, isValidPosition } from '../../utils/circuitUtils'
import { gridConfig } from '../../data/circuitData'

const CircuitCanvas = ({
  components,
  wires,
  onAddComponent,
  onUpdateComponent,
  onRemoveComponent,
  onAddWire,
  wireMode,
  wireStart,
  onWireStart,
  selectedComponent,
  onSelectComponent,
  analysis
}) => {
  const canvasRef = useRef(null)
  const [draggedComponent, setDraggedComponent] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)

  // Get mouse position relative to canvas, accounting for scaling
  const getCanvasMousePosition = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    drawCanvas(ctx)
  }, [components, wires, analysis, wireStart, mousePosition, wireMode, draggedComponent])

  const drawCanvas = (ctx) => {
    const { width, height } = ctx.canvas
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel').trim()
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    drawGrid(ctx, width, height)
    
    // Draw wires
    wires.forEach(wire => drawWire(ctx, wire))
    
    // Draw wire preview
    if (wireMode && wireStart) {
      drawWirePreview(ctx, wireStart, mousePosition)
    }
    
    // Draw components
    components.forEach(component => drawComponent(ctx, component))
    
    // Draw terminals in wire mode
    if (wireMode) {
      components.forEach(component => drawTerminals(ctx, component))
    }
  }

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3

    const { cellSize } = gridConfig
    
    // Vertical lines
    for (let x = cellSize / 2; x < width; x += cellSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = cellSize / 2; y < height; y += cellSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    ctx.globalAlpha = 1
  }

  const drawComponent = (ctx, component) => {
    const { x, y } = component.position
    const { cellSize } = gridConfig
    
    ctx.save()
    ctx.translate(x, y)
    
    // Apply rotation if component has rotation
    if (component.rotation) {
      ctx.rotate((component.rotation * Math.PI) / 180)
    }
    
    // Component background with selection highlight
    const isSelected = draggedComponent && component.id === draggedComponent.id
    const halfCell = cellSize / 2
    
    // Draw selection outline if selected
    if (isSelected) {
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      ctx.lineWidth = 3
      ctx.strokeRect(-halfCell, -halfCell, cellSize, cellSize)
    }
    
    // Set component colors
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
    ctx.lineWidth = 2
    
    switch (component.type) {
      case 'battery':
        drawBattery(ctx, halfCell)
        break
      case 'bulb':
        const isLit = analysis && analysis.current > 0 && analysis.bulbsOn > 0
        drawBulb(ctx, halfCell, isLit)
        break
      case 'resistor':
        drawResistor(ctx, halfCell)
        break
      case 'switch':
        drawSwitch(ctx, halfCell, component.state || 'closed')
        break
    }
    
    ctx.restore()
  }

  const drawBattery = (ctx, size) => {
    // Battery body
    ctx.fillRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6)
    ctx.strokeRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6)
    
    // Positive terminal (red) - positioned at the right edge
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(size * 0.7, -size * 0.15, size * 0.3, size * 0.3)
    ctx.strokeStyle = '#ff0000'
    ctx.strokeRect(size * 0.7, -size * 0.15, size * 0.3, size * 0.3)
    
    // Negative terminal (black) - positioned at the left edge
    ctx.fillStyle = '#000000'
    ctx.fillRect(-size, -size * 0.15, size * 0.3, size * 0.3)
    ctx.strokeStyle = '#000000'
    ctx.strokeRect(-size, -size * 0.15, size * 0.3, size * 0.3)
    
    // Labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('+', size * 0.85, size * 0.5)
    ctx.fillText('-', -size * 0.85, size * 0.5)
  }

  const drawBulb = (ctx, size, isLit) => {
    // Bulb base
    ctx.fillRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6)
    ctx.strokeRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6)
    
    // Bulb glow
    if (isLit) {
      ctx.shadowColor = '#ffff00'
      ctx.shadowBlur = 20
    }
    
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    ctx.shadowBlur = 0
    
    // Filament
    ctx.strokeStyle = isLit ? '#ff6600' : getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-size * 0.3, -size * 0.3)
    ctx.lineTo(size * 0.3, size * 0.3)
    ctx.moveTo(-size * 0.3, size * 0.3)
    ctx.lineTo(size * 0.3, -size * 0.3)
    ctx.stroke()
  }

  const drawResistor = (ctx, size) => {
    // Resistor zigzag
    ctx.beginPath()
    ctx.moveTo(-size, 0)
    ctx.lineTo(-size * 0.6, 0)
    ctx.lineTo(-size * 0.4, -size * 0.3)
    ctx.lineTo(-size * 0.2, size * 0.3)
    ctx.lineTo(0, -size * 0.3)
    ctx.lineTo(size * 0.2, size * 0.3)
    ctx.lineTo(size * 0.4, -size * 0.3)
    ctx.lineTo(size * 0.6, 0)
    ctx.lineTo(size, 0)
    ctx.stroke()
  }

  const drawSwitch = (ctx, size, state) => {
    // Switch terminals
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.beginPath()
    ctx.arc(-size * 0.8, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.arc(size * 0.8, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Switch lever
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-size * 0.8, 0)
    if (state === 'closed') {
      ctx.lineTo(size * 0.8, 0)
      ctx.strokeStyle = '#00ff00'
    } else {
      ctx.lineTo(size * 0.6, -size * 0.5)
      ctx.strokeStyle = '#ff0000'
    }
    ctx.stroke()
    
    // State indicator
    ctx.fillStyle = state === 'closed' ? '#00ff00' : '#ff0000'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(state === 'closed' ? 'ON' : 'OFF', 0, size * 0.8)
  }

  const drawWire = (ctx, wire) => {
    const fromComponent = components.find(c => c.id === wire.from.componentId)
    const toComponent = components.find(c => c.id === wire.to.componentId)
    
    if (!fromComponent || !toComponent) return
    
    const fromPos = getTerminalPosition(fromComponent, wire.from.terminal, gridConfig.cellSize)
    const toPos = getTerminalPosition(toComponent, wire.to.terminal, gridConfig.cellSize)
    
    ctx.strokeStyle = analysis && analysis.current > 0 ? '#00ff00' : getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(fromPos.x, fromPos.y)
    
    // Draw orthogonal path (L-shaped)
    const midX = (fromPos.x + toPos.x) / 2
    ctx.lineTo(midX, fromPos.y)
    ctx.lineTo(midX, toPos.y)
    ctx.lineTo(toPos.x, toPos.y)
    
    ctx.stroke()
  }

  const drawWirePreview = (ctx, start, end) => {
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    
    const midX = (start.x + end.x) / 2
    ctx.lineTo(midX, start.y)
    ctx.lineTo(midX, end.y)
    ctx.lineTo(end.x, end.y)
    
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawTerminals = (ctx, component) => {
    const terminals = component.type === 'battery' ? ['positive', 'negative'] : ['terminal1', 'terminal2']
    
    terminals.forEach(terminal => {
      const pos = getTerminalPosition(component, terminal, gridConfig.cellSize)
      
      // Draw terminal background
      ctx.fillStyle = wireStart && 
        wireStart.componentId === component.id && 
        wireStart.terminal === terminal 
        ? getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
        : getComputedStyle(document.documentElement).getPropertyValue('--good').trim()
      
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
      ctx.fill()
      
      // Add border for better visibility
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Add terminal labels for battery
      if (component.type === 'battery') {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(terminal === 'positive' ? '+' : '-', pos.x, pos.y - 15)
      }
    })
  }

  const handleWireClick = (x, y) => {
    // Find terminal at click position
    const terminal = findTerminalAt(x, y)
    
    if (terminal) {
      if (!wireStart) {
        onWireStart({
          componentId: terminal.componentId,
          terminal: terminal.terminal,
          x: terminal.position.x,
          y: terminal.position.y
        })
      } else if (wireStart.componentId !== terminal.componentId) {
        // Complete the wire
        onAddWire(wireStart, {
          componentId: terminal.componentId,
          terminal: terminal.terminal
        })
        // Keep wire mode active, just reset wireStart
        onWireStart(null)
      }
    } else {
      // Only clear wireStart, don't exit wire mode
      onWireStart(null)
    }
  }

  const handleComponentClick = (x, y) => {
    const component = findComponentAt(x, y)
    
    if (component && component.type === 'switch') {
      // Toggle switch state
      onUpdateComponent(component.id, {
        state: component.state === 'open' ? 'closed' : 'open'
      })
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('component-type')
    
    if (componentType && onAddComponent) {
      const pos = getCanvasMousePosition(e)
      const snappedPosition = snapToGrid(pos)
      
      if (isValidPosition(snappedPosition, components)) {
        onAddComponent(componentType, snappedPosition)
      }
    }
  }

  const handleMouseMove = (e) => {
    const pos = getCanvasMousePosition(e)
    setMousePosition(pos)
    
    // Handle component dragging
    if (isDragging && draggedComponent && onUpdateComponent) {
      const newPosition = snapToGrid({
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y
      })
      
      // Check if new position is valid
      const otherComponents = components.filter(c => c.id !== draggedComponent.id)
      if (isValidPosition(newPosition, otherComponents)) {
        onUpdateComponent(draggedComponent.id, { position: newPosition })
      }
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    const pos = getCanvasMousePosition(e)
    
    // Hide context menu on any click
    if (contextMenu) {
      setContextMenu(null)
      return
    }
    
    if (!wireMode) {
      const component = findComponentAt(pos.x, pos.y)
      if (component) {
        setDraggedComponent(component)
        setDragOffset({
          x: pos.x - component.position.x,
          y: pos.y - component.position.y
        })
        setIsDragging(true)
      }
    }
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    const pos = getCanvasMousePosition(e)
    
    if (isDragging && draggedComponent) {
      setIsDragging(false)
      setDraggedComponent(null)
      setDragOffset({ x: 0, y: 0 })
    } else {
      // Handle regular click
      if (wireMode) {
        handleWireClick(pos.x, pos.y)
      } else {
        handleComponentClick(pos.x, pos.y)
      }
    }
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    const pos = getCanvasMousePosition(e)
    
    const component = findComponentAt(pos.x, pos.y)
    if (component) {
      // Show context menu at mouse position
      const rect = canvasRef.current.getBoundingClientRect()
      setContextMenu({
        component,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true
      })
    } else {
      // Hide context menu if clicking on empty space
      setContextMenu(null)
    }
  }

  const handleContextMenuAction = (action) => {
    if (!contextMenu || !contextMenu.component) return

    const component = contextMenu.component
    
    switch (action) {
      case 'rotate':
        onUpdateComponent(component.id, {
          rotation: (component.rotation || 0) + 90
        })
        break
      case 'remove':
        onRemoveComponent(component.id)
        break
    }
    
    setContextMenu(null)
  }

  const hideContextMenu = () => {
    setContextMenu(null)
  }

  const findComponentAt = (x, y) => {
    const tolerance = gridConfig.cellSize * 0.7 // Increased tolerance for larger grid
    return components.find(component => {
      const dx = Math.abs(component.position.x - x)
      const dy = Math.abs(component.position.y - y)
      return dx < tolerance && dy < tolerance
    })
  }

  const findTerminalAt = (x, y) => {
    const tolerance = 20 // Increased tolerance for larger grid
    
    for (const component of components) {
      const terminals = component.type === 'battery' ? ['positive', 'negative'] : ['terminal1', 'terminal2']
      
      for (const terminal of terminals) {
        const pos = getTerminalPosition(component, terminal, gridConfig.cellSize)
        const dx = Math.abs(pos.x - x)
        const dy = Math.abs(pos.y - y)
        
        if (dx < tolerance && dy < tolerance) {
          return {
            componentId: component.id,
            terminal,
            position: pos
          }
        }
      }
    }
    
    return null
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={gridConfig.width * gridConfig.cellSize}
        height={gridConfig.height * gridConfig.cellSize}
        className="circuit-grid"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleRightClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ 
          cursor: wireMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          userSelect: 'none'
        }}
        aria-label="Circuit building canvas. Click and drag to move components, right-click for options."
      />
      
      {/* Context Menu */}
      {contextMenu && contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={() => handleContextMenuAction('rotate')}
          >
            <span>🔄</span>
            Rotate
          </div>
          <div
            className="context-menu-item danger"
            onClick={() => handleContextMenuAction('remove')}
          >
            <span>🗑️</span>
            Remove
          </div>
        </div>
      )}
    </div>
  )
}

export default CircuitCanvas
