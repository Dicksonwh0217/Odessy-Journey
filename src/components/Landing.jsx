import { useState, useEffect, useRef } from 'react'
import WaveLayer from './WaveLayer'

const STARS = [
  { top: '8%',  left: '12%', opacity: 0.6 },
  { top: '15%', left: '28%', opacity: 0.4 },
  { top: '5%',  left: '55%', opacity: 0.8 },
  { top: '20%', left: '72%', opacity: 0.7 },
  { top: '12%', left: '85%', opacity: 0.5 },
  { top: '30%', left: '90%', opacity: 0.6 },
  { top: '6%',  left: '40%', opacity: 0.3 },
  { top: '25%', left: '18%', opacity: 0.5 },
  { top: '18%', left: '62%', opacity: 0.4 },
  { top: '10%', left: '78%', opacity: 0.7 },
]

export default function Landing({ onStart }) {
  const [sailing, setSailing] = useState(false)
  const seagullRef = useRef(null)
  const seagullTimerRef = useRef(null)

  useEffect(() => {
    const seagull = new Audio('/assets/seagull.mp3')
    seagull.volume = 0.55
    seagullRef.current = seagull

    // Play 2s seagull clip every 4–6s
    function scheduleSeagull() {
      const delay = 5000 + Math.random() * 2000
      seagullTimerRef.current = setTimeout(() => {
        const s = seagullRef.current
        if (s) {
          s.currentTime = 0
          s.play().catch(() => {})
          setTimeout(() => { s.pause() }, 2000)
        }
        scheduleSeagull()
      }, delay)
    }
    scheduleSeagull()

    return () => {
      if (seagullRef.current) seagullRef.current.pause()
      clearTimeout(seagullTimerRef.current)
    }
  }, [])


  function handleCTA() {
    setSailing(true)
  }

  function handleSailEnd(e) {
    if (e.animationName === 'shipSailRight') onStart()
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2e 40%, #1a2d40 70%, #1e3a50 100%)',
      }}
    >
      {/* Seagull left — rope from browser top, bird hangs at ~22vh */}
      <div className="seagull-left" style={{
        position: 'absolute', top: 0, left: '18%', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transformOrigin: 'top center',
        animation: 'seagullSway 3s ease-in-out infinite',
        pointerEvents: 'none',
      }}>
        <div className="seagull-rope" style={{ width: 2, height: '22vh', background: 'linear-gradient(to bottom, rgba(160,130,90,0.0), rgba(130,100,60,0.7))' }} />
        <img src="/assets/seagull.png" alt="" aria-hidden="true"
          style={{ width: 'clamp(60px, 7vw, 100px)', opacity: 0.9, marginTop: -20 }} />
      </div>

      {/* Seagull right — rope from browser top, bird hangs at ~30vh */}
      <div className="seagull-right" style={{
        position: 'absolute', top: 0, right: '14%', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transformOrigin: 'top center',
        animation: 'seagullSway 4.5s ease-in-out infinite',
        animationDelay: '-2s',
        pointerEvents: 'none',
      }}>
        <div className="seagull-rope" style={{ width: 2, height: '30vh', background: 'linear-gradient(to bottom, rgba(160,130,90,0.0), rgba(130,100,60,0.7))' }} />
        <img src="/assets/seagull.png" alt="" aria-hidden="true"
          style={{ width: 'clamp(45px, 5vw, 75px)', opacity: 0.75, marginTop: -16 }} />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ top: s.top, left: s.left, opacity: s.opacity, width: 2, height: 2 }}
          />
        ))}
      </div>

      {/* Hero copy */}
      <div
        className="relative flex flex-col items-center text-center px-6 pt-8 md:pt-12 flex-1"
        style={{ zIndex: 10 }}
      >
        <h1
          className="mb-4 drop-shadow-lg"
          style={{
            fontFamily: "'Special Elite', cursive",
            color: '#e8dcc8',
            fontSize: 'clamp(1.6rem, 5vw, 3rem)',
          }}
        >
          Not every drifting soul is lost.
        </h1>
        <p
          className="mb-8 leading-relaxed max-w-xl"
          style={{
            fontFamily: "'Kalam', cursive",
            color: '#a0b8cc',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          }}
        >
          Begin an AI-guided voyage to understand what gives you energy,
          what holds you back, and what direction is worth exploring next.
        </p>

        {/* CTA — cta-button.png is a pre-rendered cardboard sign with text baked in */}
        <button
          onClick={handleCTA}
          disabled={sailing}
          aria-label="Begin Your Odyssey"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          <img
            src="/assets/cta-button.png"
            alt="Begin Your Odyssey"
            className="cta-btn-img"
            style={{ width: '300px', height: 'auto', display: 'block' }}
          />
          <span className="sr-only">Begin Your Odyssey</span>
        </button>
      </div>

      {/* Ocean scene */}
      <div className="relative w-full landing-ocean" style={{ height: '65vh', flexShrink: 0 }}>
        {/* Ship — left:50% + animation includes translateX(-50%) for centering */}
        <img
          src="/assets/ship.png"
          alt="A cardboard ship on the ocean"
          className={`${sailing ? 'animate-ship-sail' : 'animate-ship-float'} absolute landing-ship`}
          onAnimationEnd={handleSailEnd}
          style={{
            bottom: '18%',
            left: '50%',
            zIndex: 4,
            height: 'clamp(280px, 52vh, 520px)',
          }}
        />

        <WaveLayer className="wave-back-1"  src="/assets/wave-back.png"  speed={50} opacity={0.2}  zIndex={0} bottom="-40px" height="140%" />
        <WaveLayer className="wave-back-2"  src="/assets/wave-back.png"  speed={30} opacity={0.45} zIndex={1} bottom="-40px" height="130%" />
        <WaveLayer className="wave-mid"     src="/assets/wave-mid.png"   speed={20} opacity={0.75} zIndex={3} bottom="-50px" height="120%" />
        <WaveLayer className="wave-front-1" src="/assets/wave-front.png" speed={15} opacity={1}    zIndex={5} bottom="-90px"  height="100%" phaseOffset={0.5} />
        <WaveLayer className="wave-front-2" src="/assets/wave-front.png" speed={15} opacity={1}    zIndex={6} bottom="-100px" height="100%" />
      </div>
    </div>
  )
}
