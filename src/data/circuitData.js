// Circuit level definitions
export const circuitLevels = [
  {
    id: 1,
    title: "First Light",
    description: "Light up a single bulb using a battery and a switch.",
    objectives: [
      "Place a battery on the grid",
      "Add a bulb",
      "Connect them with a switch using wires",
      "Make sure the bulb lights up!"
    ],
    availableComponents: ['battery', 'bulb', 'switch', 'wire'],
    checkCompletion: (analysis) => {
      return analysis.bulbsOn >= 1 && analysis.hasSwitch
    },
    hint: "Remember: electricity needs a complete path from the positive terminal of the battery to the negative terminal."
  },
  {
    id: 2,
    title: "Dimmer Switch",
    description: "Add a resistor to control the brightness of your bulb.",
    objectives: [
      "Build the circuit from Level 1",
      "Add a resistor to make the bulb dimmer",
      "Observe how resistance affects brightness"
    ],
    availableComponents: ['battery', 'bulb', 'switch', 'resistor', 'wire'],
    checkCompletion: (analysis) => {
      return analysis.bulbsOn >= 1 && analysis.hasResistor && analysis.hasSwitch
    },
    hint: "Resistors reduce the current flowing through the circuit, making bulbs dimmer."
  },
  {
    id: 3,
    title: "Parallel Power",
    description: "Wire two bulbs in parallel to make them both bright.",
    objectives: [
      "Place two bulbs on the grid",
      "Wire them in parallel (not series!)",
      "Both bulbs should be bright",
      "Include a switch to control both"
    ],
    availableComponents: ['battery', 'bulb', 'switch', 'resistor', 'wire'],
    checkCompletion: (analysis) => {
      return analysis.bulbsOn >= 2 && analysis.hasParallel
    },
    hint: "In parallel circuits, each component gets the full voltage from the battery."
  },
  {
    id: 4,
    title: "Series Circuit",
    description: "Create a series circuit and observe how it differs from parallel.",
    objectives: [
      "Wire two bulbs in series",
      "Notice they are dimmer than in parallel",
      "Add a switch to control the entire circuit"
    ],
    availableComponents: ['battery', 'bulb', 'switch', 'resistor', 'wire'],
    checkCompletion: (analysis) => {
      return analysis.bulbsOn >= 2 && analysis.hasSeries
    },
    hint: "In series circuits, components share the voltage from the battery."
  },
  {
    id: 5,
    title: "Mixed Circuit",
    description: "Combine series and parallel connections in one circuit.",
    objectives: [
      "Create a circuit with both series and parallel sections",
      "Use at least 3 bulbs",
      "Add switches to control different sections"
    ],
    availableComponents: ['battery', 'bulb', 'switch', 'resistor', 'wire'],
    checkCompletion: (analysis) => {
      return analysis.bulbsOn >= 3 && analysis.hasParallel && analysis.hasSeries
    },
    hint: "Try having two bulbs in parallel, then connecting that parallel section in series with a third bulb."
  }
]

// Component definitions for the toolbox
export const componentTypes = {
  battery: {
    name: 'Battery',
    symbol: '⚡',
    description: 'Provides electrical power (voltage)',
    resistance: 0.1, // Internal resistance
    voltage: 9, // 9V battery
    terminals: ['positive', 'negative']
  },
  bulb: {
    name: 'Light Bulb',
    symbol: '💡',
    description: 'Converts electrical energy to light',
    resistance: 10, // Ohms
    terminals: ['terminal1', 'terminal2']
  },
  resistor: {
    name: 'Resistor',
    symbol: '◊',
    description: 'Resists the flow of current',
    resistance: 20, // Ohms
    terminals: ['terminal1', 'terminal2']
  },
  switch: {
    name: 'Switch',
    symbol: '⏸',
    description: 'Opens or closes the circuit',
    resistance: 0, // When closed
    terminals: ['terminal1', 'terminal2'],
    states: ['open', 'closed']
  },
  wire: {
    name: 'Wire',
    symbol: '—',
    description: 'Connects components together',
    resistance: 0.01 // Very low resistance
  }
}

// Grid settings
export const gridConfig = {
  cellSize: 60,
  width: 12,
  height: 8,
  snapTolerance: 30
}
