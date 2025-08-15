import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'

// Physics modules
import NewtonsLaws from '../components/physics/NewtonsLaws'
import WeightMass from '../components/physics/WeightMass'
import SVA from '../components/physics/SVA'
import PressureFluids from '../components/physics/PressureFluids'
import TemperatureHeat from '../components/physics/TemperatureHeat'
import SoundWaves from '../components/physics/SoundWaves'
import LightOptics from '../components/physics/LightOptics'
import GravityDrop from '../components/physics/GravityDrop'

const PhysicsPlayground = () => {
  const { progress, updateProgress, awardBadge } = useGame()
  const [selectedModule, setSelectedModule] = useState(null)

  const modules = [
    {
      id: 'newtons-laws',
      title: "Newton's Laws",
      description: "Explore forces, mass, and acceleration with interactive objects",
      icon: '🚀',
      component: NewtonsLaws,
      theory: "Newton's three laws describe the relationship between forces and motion. F = ma shows how force, mass, and acceleration are related.",
      tryThis: "Drag the box around and apply different forces. Watch how the velocity and acceleration vectors change!"
    },
    {
      id: 'weight-mass',
      title: "Weight vs Mass",
      description: "Understand the difference between weight and mass on different planets",
      icon: '⚖️',
      component: WeightMass,
      theory: "Mass is the amount of matter in an object (constant), while weight is the force due to gravity (W = mg).",
      tryThis: "Place objects on the scale and change gravity settings. Notice how mass stays the same but weight changes!"
    },
    {
      id: 'sva',
      title: "Speed, Velocity & Acceleration",
      description: "Race carts and visualize motion graphs",
      icon: '🏎️',
      component: SVA,
      theory: "Speed is distance over time, velocity includes direction, and acceleration is change in velocity over time.",
      tryThis: "Adjust cart properties and race them. Watch the real-time speed and velocity graphs!"
    },
    {
      id: 'pressure-fluids',
      title: "Pressure & Fluids",
      description: "Explore how pressure changes with depth in fluids",
      icon: '🌊',
      component: PressureFluids,
      theory: "Pressure in fluids increases with depth: P = ρgh, where ρ is density, g is gravity, h is depth.",
      tryThis: "Change the depth and fluid type. See how pressure changes with these variables!"
    },
    {
      id: 'temperature-heat',
      title: "Temperature & Heat",
      description: "Visualize molecular motion and temperature",
      icon: '🌡️',
      component: TemperatureHeat,
      theory: "Temperature is the average kinetic energy of particles. Adding heat increases particle motion.",
      tryThis: "Heat and cool the particles. Watch how their average speed changes with temperature!"
    },
    {
      id: 'sound-waves',
      title: "Sound Waves",
      description: "Create and manipulate sound waves",
      icon: '🔊',
      component: SoundWaves,
      theory: "Sound travels as waves. Frequency determines pitch, amplitude determines volume. λ = v/f relates wavelength, velocity, and frequency.",
      tryThis: "Adjust frequency and amplitude sliders. See how wavelength and wave speed change!"
    },
    {
      id: 'light-optics',
      title: "Light & Optics",
      description: "Bend light through lenses and prisms",
      icon: '🔬',
      component: LightOptics,
      theory: "Light bends when entering different materials. Snell's law: n₁sin(θ₁) = n₂sin(θ₂) describes refraction.",
      tryThis: "Change the lens type and material properties. Watch how light rays bend through different media!"
    },
    {
      id: 'gravity-drop',
      title: "Gravity Drop",
      description: "Drop objects and explore air resistance",
      icon: '🍎',
      component: GravityDrop,
      theory: "In a vacuum, all objects fall at the same rate regardless of mass. Air resistance affects lighter objects more.",
      tryThis: "Drop different objects with and without air resistance. Compare their fall times!"
    }
  ]

  const handleModuleComplete = (moduleId) => {
    if (!progress.physics.completedModules.includes(moduleId)) {
      updateProgress('physics', {
        completedModules: [...progress.physics.completedModules, moduleId]
      })
      
      // Award badges for milestones
      const completedCount = progress.physics.completedModules.length + 1
      if (completedCount === 1) {
        awardBadge('physics', 'first-physics', 'Physics Explorer')
      } else if (completedCount === 4) {
        awardBadge('physics', 'physics-scholar', 'Physics Scholar')
      } else if (completedCount === 8) {
        awardBadge('physics', 'physics-master', 'Physics Master')
      }
    }
  }

  const isCompleted = (moduleId) => {
    return progress.physics.completedModules.includes(moduleId)
  }

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule)
    const ModuleComponent = module.component

    return (
      <div className="game-layout">
        {/* Back button */}
        <button
          className="btn"
          onClick={() => setSelectedModule(null)}
          style={{ 
            position: 'fixed', 
            top: 'var(--spacing-md)', 
            left: 'var(--spacing-md)',
            zIndex: 100
          }}
          aria-label="Back to physics modules"
        >
          ← Back
        </button>

        {/* Module content */}
        <div className="toolbox">
          <h3>{module.title}</h3>
          <div className="card">
            <h4>Theory</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
              {module.theory}
            </p>
          </div>
          <div className="card">
            <h4>Try This</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
              {module.tryThis}
            </p>
          </div>
          <button
            className="btn btn-success"
            onClick={() => handleModuleComplete(selectedModule)}
            style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
          >
            {isCompleted(selectedModule) ? '✅ Completed' : '📋 Mark Complete'}
          </button>
        </div>

        <div className="canvas">
          <ModuleComponent onComplete={() => handleModuleComplete(selectedModule)} />
        </div>

        <div className="info-panel">
          <h4>Instructions</h4>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
            <p>Interact with the simulation to explore {module.title.toLowerCase()}.</p>
            <p>Use the controls to change parameters and observe the effects.</p>
            <p>When you understand the concept, mark the module as complete!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)', minHeight: '100vh' }}>
      {/* Back button */}
      <Link 
        to="/" 
        className="btn"
        style={{ 
          position: 'fixed', 
          top: 'var(--spacing-md)', 
          left: 'var(--spacing-md)',
          zIndex: 100
        }}
        aria-label="Return to main menu"
      >
        ← Home
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1>Physics Playground</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: 'var(--spacing-md)' }}>
          Explore fundamental physics concepts through interactive simulations
        </p>
        <div style={{ fontSize: '0.875rem', opacity: 0.6 }}>
          Progress: {progress.physics.completedModules.length} / {modules.length} modules completed
        </div>
        <div className="progress-bar" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div 
            className="progress-fill" 
            style={{ width: `${(progress.physics.completedModules.length / modules.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="physics-modules">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            className="card"
            style={{ 
              cursor: 'pointer',
              position: 'relative',
              opacity: isCompleted(module.id) ? 0.8 : 1
            }}
            onClick={() => setSelectedModule(module.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedModule(module.id)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${module.title} module`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCompleted(module.id) && (
              <div style={{
                position: 'absolute',
                top: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                background: 'var(--good)',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>
                ✓
              </div>
            )}

            <div style={{ 
              fontSize: '3rem', 
              textAlign: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              {module.icon}
            </div>

            <h3 style={{ 
              color: 'var(--accent)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-sm)'
            }}>
              {module.title}
            </h3>

            <p style={{ 
              fontSize: '0.875rem',
              textAlign: 'center',
              opacity: 0.8,
              marginBottom: 'var(--spacing-md)'
            }}>
              {module.description}
            </p>

            <div style={{
              padding: 'var(--spacing-sm)',
              background: 'var(--bg)',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.75rem',
              textAlign: 'center',
              color: isCompleted(module.id) ? 'var(--good)' : 'var(--accent)'
            }}>
              {isCompleted(module.id) ? 'Completed ✅' : 'Click to explore →'}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 'var(--spacing-xl)',
        fontSize: '0.875rem',
        opacity: 0.6 
      }}>
        Complete all modules to become a Physics Master! 🏆
      </div>
    </div>
  )
}

export default PhysicsPlayground
