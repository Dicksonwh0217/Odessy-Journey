import { useState, useEffect } from 'react'
import Landing from './components/Landing'
import JourneyForm from './components/JourneyForm'
import Result from './components/Result'
import { computeArchetype } from './utils/computeArchetype'
import { archetypes } from './data/archetypes'

// Single audio instance at module level — immune to React StrictMode double-invoke
const oceanAudio = new Audio('/assets/ocean-waves.mp3')
oceanAudio.loop = true
oceanAudio.volume = 0.25

/**
 * Screen wraps a child and fades it in on mount.
 * Starts at opacity 0, then on the next animation frame transitions to opacity 1.
 */
function Screen({ children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
      {children}
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [answers, setAnswers] = useState(['', '', '', '', ''])
  const [archetypeKey, setArchetypeKey] = useState(null)
  useEffect(() => {
    oceanAudio.play().catch(() => {
      const unlock = () => { oceanAudio.play().catch(() => {}); window.removeEventListener('click', unlock) }
      window.addEventListener('click', unlock)
    })
    return () => oceanAudio.pause()
  }, [])

  function handleStart() {
    setScreen('journey')
  }

  function handleComplete(finalAnswers) {
    const key = computeArchetype(finalAnswers)
    setArchetypeKey(key)
    setScreen('result')
  }

  function handleRestart() {
    setAnswers(['', '', '', '', ''])
    setArchetypeKey(null)
    setScreen('landing')
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]" style={{ position: 'relative' }}>
      {screen === 'landing' && (
        <Screen>
          <Landing onStart={handleStart} />
        </Screen>
      )}
      {screen === 'journey' && (
        <Screen>
          <JourneyForm answers={answers} setAnswers={setAnswers} onComplete={handleComplete} onBack={handleRestart} />
        </Screen>
      )}
      {screen === 'result' && archetypeKey && (
        <Screen>
          <Result archetype={archetypes[archetypeKey]} onRestart={handleRestart} />
        </Screen>
      )}
    </div>
  )
}
