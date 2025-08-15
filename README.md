# Quantaquest: Learn Through Play

An interactive educational web application that teaches physics and electronics concepts through engaging simulations and games. Built with React and Vite for modern web performance.

![Quantaquest Logo](https://img.shields.io/badge/Quantaquest-Learn%20Through%20Play-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.3.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/quantaquest-learn-through-play.git
   cd quantaquest-learn-through-play
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

## 🎮 Features

### 🔌 Circuit Connect
Interactive circuit building with:
- Drag-and-drop components (Battery, Bulb, Resistor, Switch)
- Real-time circuit analysis and simulation
- Visual feedback for current flow and bulb brightness
- Progressive levels from basic to complex circuits
- Educational explanations and safety warnings

**Badges Available:**
- 🌟 **First Light**: Light up your first bulb
- ⚡ **Parallel Pro**: Master parallel circuits
- 🛡️ **Safety First**: Handle a short circuit safely

### ⚛️ Physics Playground
Eight interactive physics modules:

1. **🚀 Newton's Laws**: Force, mass, and acceleration with draggable objects
2. **⚖️ Weight vs Mass**: Compare weight on different planets
3. **🏎️ Speed, Velocity & Acceleration**: Racing carts with motion graphs
4. **🌊 Pressure & Fluids**: Explore pressure changes with depth
5. **🌡️ Temperature & Heat**: Visualize molecular motion and kinetic energy
6. **🔊 Sound Waves**: Create and manipulate wave properties
7. **🔬 Light & Optics**: Ray tracing through lenses and prisms
8. **🍎 Gravity Drop**: Compare falling objects with/without air resistance

**Badges Available:**
- 🎯 **Physics Explorer**: Complete your first module
- 📚 **Physics Scholar**: Complete 4 modules
- 🏆 **Physics Master**: Complete all 8 modules

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

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── circuit/        # Circuit-specific components
│   │   ├── CircuitCanvas.jsx
│   │   ├── CircuitInfo.jsx
│   │   └── CircuitToolbox.jsx
│   ├── physics/        # Physics module components
│   │   ├── NewtonsLaws.jsx
│   │   ├── WeightMass.jsx
│   │   └── ... (8 modules total)
│   ├── BadgeModal.jsx  # Achievement notifications
│   └── ThemeToggle.jsx # Theme switching
├── contexts/           # React Context providers
│   ├── GameContext.jsx # Game state & achievements
│   └── ThemeContext.jsx # Theme management
├── data/              # Static game data
│   └── circuitData.js # Circuit levels & components
├── pages/             # Main application pages
│   ├── Home.jsx       # Main menu
│   ├── CircuitConnect.jsx
│   └── PhysicsPlayground.jsx
├── utils/             # Utility functions
│   └── circuitUtils.js # Circuit analysis logic
├── App.jsx            # Main app component
├── main.jsx          # Application entry point
└── index.css         # Global styles & CSS variables
```

## 🔒 Data Storage

All user progress is stored locally using `localStorage`:

- **`stemq:theme`**: Theme preference (light/dark/system)
- **`stemq:contrast`**: Contrast preference (normal/high)
- **`stemq:badges`**: Earned achievements per category
- **`stemq:progress`**: Level completion and module progress

No personal data is collected or transmitted to external servers.

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast development server and build tool
- **React Router**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **Matter.js**: 2D physics engine for Newton's Laws module
- **CSS Variables**: Dynamic theming system
- **Canvas API**: Interactive graphics and simulations

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add JSDoc comments for complex functions
- Test accessibility with keyboard navigation
- Ensure mobile responsiveness
- Add appropriate ARIA labels for screen readers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Physics Simulations**: Inspired by PhET Interactive Simulations
- **Educational Design**: Based on constructivist learning principles
- **Accessibility**: Following WCAG 2.1 guidelines
- **Icons**: Using native emoji for universal compatibility

## 📞 Support

- **Report Issues**: Use GitHub Issues for bug reports
- **Feature Requests**: Create an issue with the 'enhancement' label
- **Documentation**: Check this README and inline code comments

---

**Made with ❤️ for STEM education**

*Quantaquest: Where learning meets play!* 🎮📚
