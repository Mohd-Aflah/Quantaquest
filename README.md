# QuantaQuest: Interactive Physics & Electronics Learning Platform

An innovative educational web application that transforms physics and electronics learning through interactive simulations, games, and hands-on experiments. Built with modern React and advanced visualization technologies to create an engaging STEM learning experience.

![QuantaQuest](https://img.shields.io/badge/QuantaQuest-Interactive%20Learning-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.3.2-purple)
![Physics Engine](https://img.shields.io/badge/Matter.js-Physics%20Engine-green)
![Canvas](https://img.shields.io/badge/Canvas%20API-Graphics-orange)

## 👨‍💻 About the Project

**QuantaQuest** is developed by **Mohammed Aflah** as part of an internship program at **Pro26**. This project represents a comprehensive approach to STEM education, combining interactive physics simulations with circuit building exercises to create an immersive learning environment.

### 🎯 Mission
To make physics and electronics concepts accessible and engaging through interactive, hands-on learning experiences that bridge the gap between theoretical knowledge and practical understanding.

### 🏢 Developed At
**Pro26** - Technology Innovation Hub  
*Internship Project 2025*

**Developer:** Mohammed Aflah  
**Supervisor:** Pro26 Technical Team  
**Duration:** Summer 2025 Internship Program

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mohd-Aflah/Quantaquest.git
   cd Quantaquest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## � Key Features & Innovations

### 🔌 Interactive Circuit Laboratory
Advanced circuit building simulation featuring:
- **Drag & Drop Interface**: Intuitive component placement with grid snapping
- **Real-time Circuit Analysis**: Live electrical calculations and current flow visualization
- **Smart Terminal Detection**: Visual terminal identification for all components
- **Progressive Difficulty**: 5 levels from basic circuits to complex parallel/series combinations
- **Educational Feedback**: Instant explanations of circuit behavior and electrical principles
- **Component Library**: Battery, Bulbs, Resistors, Switches with realistic electrical properties

**🏆 Circuit Achievements:**
- ⚡ **First Spark**: Complete your first working circuit
- 🔄 **Parallel Master**: Design complex parallel circuits
- ⛓️ **Series Expert**: Master series circuit configurations
- 🛡️ **Safety Champion**: Demonstrate proper circuit safety practices

### 🔬 Physics Simulation Engine
Eight comprehensive physics modules with advanced visualizations:

1. **🚀 Newton's Laws of Motion**: 
   - Interactive force application with Matter.js physics engine
   - Real-time vector visualization and coordinate tracking
   - Boundary containment and realistic motion physics

2. **⚖️ Weight vs Mass Explorer**: 
   - Multi-planetary gravity simulation with visual effects
   - Interactive scale with digital readouts
   - Gravity field visualization with particle effects

3. **🏎️ Speed, Velocity & Acceleration Dynamics**: 
   - Racing cart simulation with live motion graphs
   - Real-time physics calculations and visual feedback
   - Canvas-based animation with time-step progression

4. **🌊 Pressure & Fluid Mechanics**: 
   - Depth-pressure relationship visualization
   - Multiple fluid types with different densities
   - Interactive pressure measurement tools

5. **🌡️ Temperature & Molecular Motion**: 
   - Particle simulation showing kinetic theory
   - Temperature effects on molecular movement
   - Phase transition demonstrations

6. **🔊 Sound Wave Physics**: 
   - Wave frequency and amplitude manipulation
   - Real-time waveform generation and visualization
   - Sound properties and characteristics exploration

7. **� Light & Optics Laboratory**: 
   - **Enhanced Ray Tracing**: Incident and reflected ray visualization
   - **Lens Calculations**: Focal length, object distance, and magnification controls
   - **Snell's Law Implementation**: Refraction angle calculations with material properties
   - **Interactive Interface**: Material selection and angle adjustment controls

8. **🍎 Gravity & Motion Studies**: 
   - Falling object comparison with air resistance
   - Terminal velocity demonstrations
   - Mass independence verification

**🏆 Physics Achievements:**
- 🎯 **Physics Explorer**: Complete your first simulation
- 📚 **Physics Scholar**: Master 4 different modules  
- 🔬 **Laboratory Expert**: Complete all 8 modules with excellence
- ⚛️ **Physics Master**: Achieve perfect understanding across all concepts

## 🎨 Accessibility Features

- **🌙 Dark/Light Theme**: Automatic system detection with manual override
- **🔆 High Contrast Mode**: Enhanced visibility for users with visual impairments
- **⌨️ Keyboard Navigation**: Full keyboard accessibility for all interactions
- **📱 Mobile-First Design**: Responsive layout that works on all screen sizes
- **🔊 Screen Reader Support**: ARIA labels and live regions for assistive technologies
- **⚡ Focus Management**: Clear focus indicators and logical tab order

## ⌨️ Keyboard Shortcuts

### Global Shortcuts
- **Alt + T**: Toggle theme (Light/Dark/System)
- **Escape**: Close modals and cancel operations
- **H**: Show/hide help in modules

### Circuit Connect
- **R**: Reset current circuit
- **Space/Enter**: Activate selected components
- **Right-click**: Remove components

### Physics Modules
- **Space**: Start/stop animations
- **R**: Reset module state
- **Enter**: Confirm selections

## 🔧 Adding New Content

### Adding a New Circuit Level

1. **Edit `src/data/circuitData.js`:**
   ```javascript
   export const circuitLevels = [
     // ... existing levels
     {
       id: 6,
       title: "Your New Level",
       description: "Description of what to build",
       objectives: [
         "First objective",
         "Second objective"
       ],
       availableComponents: ['battery', 'bulb', 'switch', 'resistor', 'wire'],
       checkCompletion: (analysis) => {
         // Return true when level is complete
         return analysis.bulbsOn >= 2 && analysis.hasSwitch
       },
       hint: "Helpful hint for students"
     }
   ]
   ```

2. **Update level navigation** in `CircuitConnect.jsx` to handle the new level count.

### Adding a New Physics Module

1. **Create component file:** `src/components/physics/YourModule.jsx`
   ```javascript
   import React, { useState } from 'react'

   const YourModule = ({ onComplete }) => {
     const [parameter, setParameter] = useState(0)

     return (
       <div style={{ width: '100%', height: '100%', padding: 'var(--spacing-md)' }}>
         <h3>Your Physics Module</h3>
         {/* Your interactive content */}
         <button onClick={() => onComplete('your-module')}>
           Mark Complete
         </button>
       </div>
     )
   }

   export default YourModule
   ```

2. **Register in `PhysicsPlayground.jsx`:**
   ```javascript
   import YourModule from '../components/physics/YourModule'

   const modules = [
     // ... existing modules
     {
       id: 'your-module',
       title: "Your Module Title",
       description: "Brief description",
       icon: '🔬',
       component: YourModule,
       theory: "Theoretical background",
       tryThis: "Instructions for interaction"
     }
   ]
   ```

## 🚀 GitHub Pages Deployment

### Automatic Deployment

1. **Configure repository settings:**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will deploy automatically on push to main

2. **Manual deployment:**
   ```bash
   npm run deploy
   ```

### Custom Domain Setup

1. **Add domain to repository settings**
2. **Update `vite.config.js`:**
   ```javascript
   export default defineConfig({
     base: '/', // Change from '/Quantaquest-Learn-Through-Play/'
     // ... rest of config
   })
   ```

## 📁 Project Architecture

```
src/
├── components/              # Modular UI components
│   ├── circuit/            # Circuit simulation components
│   │   ├── CircuitCanvas.jsx    # Main circuit building interface
│   │   ├── CircuitInfo.jsx      # Real-time circuit analysis display
│   │   └── CircuitToolbox.jsx   # Component selection and tools
│   ├── physics/            # Physics simulation modules
│   │   ├── NewtonsLaws.jsx      # Force and motion simulation
│   │   ├── WeightMass.jsx       # Gravity and weight comparison
│   │   ├── SVA.jsx              # Speed, velocity & acceleration
│   │   ├── LightOptics.jsx      # Optics and ray tracing
│   │   ├── PressureFluids.jsx   # Fluid mechanics
│   │   ├── TemperatureHeat.jsx  # Molecular motion simulation
│   │   ├── SoundWaves.jsx       # Wave physics
│   │   └── GravityDrop.jsx      # Falling object experiments
│   ├── BadgeModal.jsx      # Achievement notification system
│   └── ThemeToggle.jsx     # Theme switching interface
├── contexts/               # React Context providers
│   ├── GameContext.jsx     # Game state, progress & achievements
│   └── ThemeContext.jsx    # Theme management & accessibility
├── data/                  # Static configuration and content
│   └── circuitData.js     # Circuit levels & component definitions
├── pages/                 # Main application pages
│   ├── Home.jsx           # Landing page with navigation
│   ├── CircuitConnect.jsx # Circuit building game
│   └── PhysicsPlayground.jsx # Physics module hub
├── utils/                 # Core utility functions
│   └── circuitUtils.js    # Circuit analysis algorithms
├── App.jsx               # Root application component
├── main.jsx             # Application entry point
└── index.css           # Global styles & CSS custom properties
```

## 🔒 Data Storage

All user progress is stored locally using `localStorage`:

- **`stemq:theme`**: Theme preference (light/dark/system)
- **`stemq:contrast`**: Contrast preference (normal/high)
- **`stemq:badges`**: Earned achievements per category
- **`stemq:progress`**: Level completion and module progress

No personal data is collected or transmitted to external servers.

## 🛠️ Technical Implementation

### Core Technologies
- **React 18.2.0**: Modern React with hooks, concurrent features, and component optimization
- **Vite 4.3.2**: Lightning-fast development server with HMR and optimized builds  
- **React Router**: Single-page application routing with dynamic loading
- **Framer Motion**: Advanced animations and smooth transitions
- **Matter.js**: Professional 2D physics engine for realistic simulations
- **Canvas API**: High-performance graphics rendering for complex visualizations
- **CSS Variables**: Dynamic theming system with real-time theme switching

### Advanced Features
- **Responsive Grid System**: 60px grid with smart component snapping
- **Real-time Physics Calculations**: Live force vectors, motion analysis, and circuit simulation
- **Local Storage Integration**: Progress persistence and user preference management
- **Accessibility Compliance**: WCAG 2.1 AA standard with screen reader support
- **Performance Optimization**: Lazy loading, component memoization, and efficient rendering

### Architecture Highlights
- **Modular Component Design**: Reusable components with clear separation of concerns
- **Context-based State Management**: Efficient global state handling for themes and progress
- **Utility-first Approach**: Centralized utility functions for circuit analysis and physics calculations
- **Event-driven Interactions**: Mouse, keyboard, and touch event handling with collision detection

## 🤝 Contributing & Development

### For Pro26 Team Members
1. **Fork the repository** from the main Pro26 organization
2. **Create a feature branch:** `git checkout -b feature/enhanced-simulation`
3. **Follow coding standards:** Maintain consistency with existing patterns
4. **Test thoroughly:** Verify functionality across all modules
5. **Document changes:** Update relevant documentation and comments
6. **Submit for review:** Create pull request with detailed description

### Development Guidelines
- **Code Style**: Follow existing React patterns and component structure
- **Documentation**: Add JSDoc comments for complex physics calculations
- **Accessibility**: Maintain WCAG 2.1 compliance in all new features  
- **Performance**: Test with React DevTools for optimization opportunities
- **Mobile Support**: Ensure responsive behavior across all device sizes
- **Educational Value**: Keep learning objectives clear in all implementations

### Internship Learning Outcomes
This project demonstrates proficiency in:
- ✅ **Modern React Development**: Hooks, Context, and component lifecycle
- ✅ **Physics Engine Integration**: Matter.js implementation and optimization
- ✅ **Canvas Graphics Programming**: Complex visualizations and animations
- ✅ **Educational Software Design**: User experience for learning applications
- ✅ **Performance Optimization**: Efficient rendering and state management
- ✅ **Accessibility Implementation**: Inclusive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments & Credits

### Pro26 Internship Program
- **Mentorship Team**: For guidance in modern web development practices
- **Technical Support**: Pro26 engineering team for code reviews and feedback  
- **Learning Environment**: Providing resources and infrastructure for development

### Educational Inspiration
- **PhET Interactive Simulations**: Reference for physics simulation design principles
- **Constructivist Learning Theory**: Educational framework for interactive learning
- **Accessibility Standards**: WCAG 2.1 guidelines for inclusive design
- **Open Source Community**: React, Vite, and Matter.js communities for excellent documentation

### Technical Acknowledgments
- **React Team**: For the powerful component framework
- **Vite Development Team**: For the exceptional build tool and development experience
- **Matter.js Contributors**: For the robust 2D physics engine
- **Educational Technology Researchers**: For insights into effective STEM learning tools

---

## 📄 License & Usage

This project is developed as part of the Pro26 internship program. All code is available under the MIT License for educational and non-commercial use.

## 📞 Contact & Support

**Developer**: Mohammed Aflah  
**Organization**: Pro26  
**Project Type**: Internship Development Project  
**Year**: 2025

For technical support or questions about this implementation:
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Educational Feedback**: Contact Pro26 team for curriculum integration
- **Technical Discussion**: Available for peer review and collaboration

---

**🚀 Developed with passion at Pro26**

*QuantaQuest: Where interactive learning transforms physics education* 🔬⚡📚
