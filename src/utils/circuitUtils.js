// Circuit analysis utilities
import { componentTypes } from '../data/circuitData'

/**
 * Analyzes the current circuit state and returns useful information
 */
export function analyzeCircuit(components, wires) {
  const analysis = {
    hasClosedLoop: false,
    shortCircuit: false,
    bulbsOn: 0,
    totalResistance: 0,
    current: 0,
    hasParallel: false,
    hasSeries: false,
    hasSwitch: false,
    hasResistor: false,
    switchesOpen: 0,
    explanation: '',
    warnings: []
  }

  // Find batteries
  const batteries = components.filter(c => c.type === 'battery')
  if (batteries.length === 0) {
    analysis.explanation = 'Add a battery to power your circuit.'
    return analysis
  }

  if (batteries.length > 1) {
    analysis.warnings.push('Multiple batteries detected. This may cause unexpected behavior.')
  }

  const battery = batteries[0]

  // Check for basic component types
  analysis.hasSwitch = components.some(c => c.type === 'switch')
  analysis.hasResistor = components.some(c => c.type === 'resistor')

  // Build circuit graph
  const graph = buildCircuitGraph(components, wires)
  
  // Find path from battery positive to negative
  const paths = findAllPaths(graph, `${battery.id}-positive`, `${battery.id}-negative`)
  
  console.log('Circuit Analysis Debug:', {
    components: components.length,
    wires: wires.length,
    graph: Array.from(graph.entries()),
    paths: paths,
    batteryId: battery.id
  })
  
  if (paths.length === 0) {
    analysis.explanation = 'No complete circuit found. Make sure there\'s a path from the battery\'s positive terminal to its negative terminal.'
    return analysis
  }

  analysis.hasClosedLoop = true

  // Check for open switches in the path
  let hasOpenSwitchInPath = false
  paths.forEach(path => {
    path.forEach(node => {
      const componentId = node.split('-')[0]
      const component = components.find(c => c.id === componentId)
      if (component && component.type === 'switch' && component.state === 'open') {
        hasOpenSwitchInPath = true
      }
    })
  })

  if (hasOpenSwitchInPath) {
    analysis.switchesOpen = components.filter(c => c.type === 'switch' && c.state === 'open').length
    analysis.explanation = `Circuit is open - switch(es) are open. Close them to allow current to flow.`
    return analysis
  }

  // Calculate circuit properties
  const circuitAnalysis = calculateCircuitProperties(components, wires, paths)
  Object.assign(analysis, circuitAnalysis)

  // Set a minimum resistance to avoid division by zero
  if (analysis.totalResistance <= 0) {
    analysis.totalResistance = 0.1
  }

  // Calculate current using Ohm's law (V = I * R, so I = V / R)
  const voltage = componentTypes.battery.voltage || 9
  analysis.current = voltage / analysis.totalResistance

  // Determine bulb brightness
  const bulbs = components.filter(c => c.type === 'bulb')
  analysis.bulbsOn = calculateBulbBrightness(bulbs, analysis.current, paths, components)

  console.log('Analysis Result:', {
    current: analysis.current,
    totalResistance: analysis.totalResistance,
    bulbsOn: analysis.bulbsOn,
    hasClosedLoop: analysis.hasClosedLoop,
    voltage: voltage
  })

  // Generate explanation
  if (analysis.bulbsOn > 0) {
    const brightness = analysis.current > 0.8 ? 'bright' : analysis.current > 0.4 ? 'dim' : 'barely glowing'
    analysis.explanation = `Circuit is working! ${analysis.bulbsOn} bulb(s) are ${brightness}. Current: ${analysis.current.toFixed(2)}A`
  } else if (analysis.hasClosedLoop) {
    analysis.explanation = 'Circuit is complete but no bulbs are lighting up. Check your connections.'
  } else {
    analysis.explanation = 'No complete circuit found. Make sure there\'s a path from the battery\'s positive terminal to its negative terminal.'
  }

  return analysis
}

/**
 * Builds a graph representation of the circuit
 */
function buildCircuitGraph(components, wires) {
  const graph = new Map()

  // Add component terminals as nodes
  components.forEach(component => {
    const terminals = componentTypes[component.type].terminals || []
    terminals.forEach(terminal => {
      const nodeId = `${component.id}-${terminal}`
      if (!graph.has(nodeId)) {
        graph.set(nodeId, [])
      }
    })
  })

  // Add connections (wires) as edges
  wires.forEach(wire => {
    const fromNode = `${wire.from.componentId}-${wire.from.terminal}`
    const toNode = `${wire.to.componentId}-${wire.to.terminal}`
    
    if (graph.has(fromNode) && graph.has(toNode)) {
      graph.get(fromNode).push(toNode)
      graph.get(toNode).push(fromNode)
    }
  })

  return graph
}

/**
 * Finds all possible paths between two nodes in the circuit graph
 */
function findAllPaths(graph, start, end, visited = new Set(), path = []) {
  if (start === end) {
    return [path.concat(start)]
  }

  if (visited.has(start)) {
    return []
  }

  visited.add(start)
  const neighbors = graph.get(start) || []
  const allPaths = []

  neighbors.forEach(neighbor => {
    const paths = findAllPaths(graph, neighbor, end, new Set(visited), path.concat(start))
    allPaths.push(...paths)
  })

  return allPaths
}

/**
 * Calculates circuit properties like total resistance and circuit topology
 */
function calculateCircuitProperties(components, wires, paths) {
  const analysis = {
    totalResistance: 0,
    hasParallel: false,
    hasSeries: false
  }

  if (paths.length === 0) {
    return analysis
  }

  // Simplified resistance calculation for series circuit
  const componentsInCircuit = new Set()
  paths.forEach(path => {
    path.forEach(node => {
      const componentId = node.split('-')[0]
      componentsInCircuit.add(componentId)
    })
  })

  console.log('Components in circuit:', Array.from(componentsInCircuit))

  // Calculate total resistance (simplified for series)
  let totalResistance = 0
  componentsInCircuit.forEach(componentId => {
    const component = components.find(c => c.id === componentId)
    if (component && componentTypes[component.type]) {
      let resistance = componentTypes[component.type].resistance || 0
      
      // Handle switch resistance based on state
      if (component.type === 'switch') {
        resistance = component.state === 'open' ? Infinity : 0.01
      }
      
      totalResistance += resistance
      console.log(`Component ${component.type} (${componentId}): ${resistance}Ω`)
    }
  })

  // Add wire resistance
  totalResistance += wires.length * (componentTypes.wire?.resistance || 0.01)

  analysis.totalResistance = Math.max(totalResistance, 0.1) // Minimum resistance

  // Detect series vs parallel (simplified heuristic)
  if (paths.length > 1) {
    analysis.hasParallel = true
  }
  
  if (componentsInCircuit.size > 2) { // More than just battery
    analysis.hasSeries = true
  }

  console.log('Total resistance calculated:', analysis.totalResistance)

  return analysis
}

/**
 * Calculates how many bulbs are on and their brightness
 */
function calculateBulbBrightness(bulbs, current, paths, allComponents) {
  if (current <= 0 || paths.length === 0) return 0

  // Find bulbs that are in the circuit path
  const bulbsInPath = new Set()
  
  paths.forEach(path => {
    path.forEach(node => {
      const componentId = node.split('-')[0]
      const component = allComponents.find(c => c.id === componentId)
      if (component && component.type === 'bulb') {
        bulbsInPath.add(componentId)
      }
    })
  })

  console.log('Bulb Brightness Debug:', {
    totalBulbs: bulbs.length,
    bulbsInPath: Array.from(bulbsInPath),
    current: current,
    paths: paths
  })

  // A bulb is "on" if current is above threshold and it's in the path
  const minCurrentForLight = 0.1
  return current >= minCurrentForLight ? bulbsInPath.size : 0
}

/**
 * Utility function to snap position to grid
 */
export function snapToGrid(position, gridSize = 40) {
  // Snap to grid cell centers
  const halfGrid = gridSize / 2
  const snapX = Math.round(position.x / gridSize) * gridSize + halfGrid
  const snapY = Math.round(position.y / gridSize) * gridSize + halfGrid
  
  return {
    x: Math.max(halfGrid, Math.min(snapX, 12 * gridSize - halfGrid)),
    y: Math.max(halfGrid, Math.min(snapY, 8 * gridSize - halfGrid))
  }
}

/**
 * Utility function to get component terminal positions
 */
export function getTerminalPosition(component, terminal, gridSize = 60) {
  const baseX = component.position.x
  const baseY = component.position.y
  
  // Terminal positions relative to component center
  const halfGrid = gridSize / 2
  const offsets = {
    battery: {
      positive: { x: halfGrid, y: 0 },
      negative: { x: -halfGrid, y: 0 }
    },
    bulb: {
      terminal1: { x: 0, y: -halfGrid },
      terminal2: { x: 0, y: halfGrid }
    },
    resistor: {
      terminal1: { x: -halfGrid, y: 0 },
      terminal2: { x: halfGrid, y: 0 }
    },
    switch: {
      terminal1: { x: -halfGrid, y: 0 },
      terminal2: { x: halfGrid, y: 0 }
    }
  }

  let offset = offsets[component.type]?.[terminal] || { x: 0, y: 0 }
  
  // Apply rotation if component has rotation
  if (component.rotation) {
    const angle = (component.rotation * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    const rotatedX = offset.x * cos - offset.y * sin
    const rotatedY = offset.x * sin + offset.y * cos
    
    offset = { x: rotatedX, y: rotatedY }
  }
  
  return {
    x: baseX + offset.x,
    y: baseY + offset.y
  }
}

/**
 * Check if a position is valid for placing a component
 */
export function isValidPosition(position, existingComponents, gridSize = 60) {
  const halfGrid = gridSize / 2
  
  // Check bounds - ensure component stays within canvas
  if (position.x < halfGrid || position.y < halfGrid) return false
  if (position.x > (12 * gridSize - halfGrid) || position.y > (8 * gridSize - halfGrid)) return false

  // Check for overlaps with existing components
  const tolerance = gridSize * 0.9 // Allow close placement but not exact overlap
  return !existingComponents.some(component => {
    const dx = Math.abs(component.position.x - position.x)
    const dy = Math.abs(component.position.y - position.y)
    return dx < tolerance && dy < tolerance
  })
}
