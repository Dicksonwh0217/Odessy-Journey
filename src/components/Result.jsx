import { useEffect, useRef } from 'react'
import WaveLayer from './WaveLayer'

export default function Result({ archetype, onRestart }) {
  if (!archetype) return null

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a0a05 0%, #3d1a08 25%, #7a3a10 50%, #1a4060 75%, #0d1b2e 100%)',
        position: 'relative',
        animation: 'fadeIn 0.8s ease-out forwards',
      }}
    >
      <Scene />
      <Ship />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <VoyagePanel archetype={archetype} />
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginTop: '20px',
            animation: 'textReveal 0.6s ease-out 5.1s both',
          }}
        >
          <img
            src="/assets/RestartButton.png"
            alt="← Begin Again"
            style={{ width: 'clamp(100px, 18vw, 180px)', height: 'auto', display: 'block' }}
          />
        </button>
      </div>
    </div>
  )
}

/* ── Scene: sunrise background, sky glow, sun, waves ── */
function Scene() {
  return (
    <>
      {/* Sky glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(255,140,50,0.15) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Sun */}
      <img
        src="/assets/Sun.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', top: '32px', left: '40px',
          width: '160px', height: 'auto',
          zIndex: 2, pointerEvents: 'none',
          animation: 'fadeIn 1.5s ease-out forwards, sunGlow 3s ease-in-out infinite',
          animationDelay: '0.3s, 1.8s',
          opacity: 0,
        }}
      />

      {/* Waves — matching Landing page layers */}
      <WaveLayer src="/assets/wave-back.png"  speed={50}  opacity={0.2}  zIndex={0} bottom="-160px"  height="140%" />
      <WaveLayer src="/assets/wave-back.png"  speed={30}  opacity={0.45} zIndex={1} bottom="-170px"  height="130%" />
      <WaveLayer src="/assets/wave-mid.png"   speed={20}  opacity={0.75} zIndex={3} bottom="-180px"  height="120%" />
      <WaveLayer src="/assets/wave-front.png" speed={15}  opacity={1}    zIndex={5} bottom="-200px"  height="100%" phaseOffset={0.5} />
      <WaveLayer src="/assets/wave-front.png" speed={15}  opacity={1}    zIndex={6} bottom="-220px" height="100%" />
    </>
  )
}

/* ── Ship: sails in from off-screen left, then swaps to gentle float ── */
function Ship() {
  const shipRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Sail-in: starts 0.8s, lasts 2.5s → finishes at 3.3s. Swap at 3.4s.
    timerRef.current = setTimeout(() => {
      if (shipRef.current) {
        shipRef.current.style.animation = 'shipFloat 4s ease-in-out infinite'
      }
    }, 3400)
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <img
      ref={shipRef}
      src="/assets/ship.png"
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        height: 'clamp(280px, 52vh, 520px)',
        width: 'auto',
        animation: 'shipSailIn 2.5s ease-out 0.8s both',
        zIndex: 4,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
      }}
    />
  )
}

/* ── VoyagePanel: VogogeNote.png as background, text overlaid on blank areas ── */
function VoyagePanel({ archetype }) {
  return (
    <div className="result-panel" style={{
      position: 'relative',
      width: 'min(86vw, 820px)',
      animation: 'panelFadeIn 1s ease-out 3.5s both',
    }}>
      <img
        src="/assets/VogogeNote.png"
        alt="Voyage Notes"
        style={{ width: '100%', display: 'block', userSelect: 'none' }}
      />

      {/* ── Archetype title (top-center band) ── */}
      <div style={{
        position: 'absolute', top: '10%', left: '32%', width: '36%',
        textAlign: 'center',
        animation: 'textReveal 0.6s ease-out 4.0s both',
        pointerEvents: 'none',
      }}>
        <div className="result-label" style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20',
        }}>
          Your Archetype
        </div>
        <div className="result-archetype-name" style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: '#3d1a05', fontWeight: 'bold', lineHeight: 1.3,
        }}>
          {archetype.name}
        </div>
      </div>

      {/* ── Captain's Reflection (large left-top box) ── */}
      <div style={{
        position: 'absolute', top: '22%', left: '9%', width: '34%', height: '34%',
        overflow: 'hidden',
        animation: 'textReveal 0.6s ease-out 4.3s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20', marginBottom: '4px',
        }}>
          Captain's Reflection
        </div>
        <div className="result-body" style={{
          fontFamily: "'Kalam', cursive",
          fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
          color: '#3d2b10', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          {archetype.description}
        </div>
      </div>

      {/* ── Strengths (left-bottom box) ── */}
      <div style={{
        position: 'absolute', top: '70%', left: '18%', width: '36%', height: '18%',
        overflow: 'hidden',
        animation: 'textReveal 0.6s ease-out 4.6s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20', marginBottom: '4px',
        }}>
          Strengths
        </div>
        {archetype.strengths.slice(0, 3).map((s, i) => (
          <div key={i} className="result-body" style={{
            fontFamily: "'Kalam', cursive",
            fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
            color: '#3d2b10', lineHeight: 1.6,
          }}>
            · {s}
          </div>
        ))}
      </div>

      {/* ── Blind Spots (right-top box) ── */}
      <div style={{
        position: 'absolute', top: '22%', left: '48%', width: '38%', height: '26%',
        overflow: 'hidden',
        animation: 'textReveal 0.6s ease-out 4.8s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20', marginBottom: '4px',
        }}>
          Blind Spots
        </div>
        {archetype.blindSpots.slice(0, 3).map((s, i) => (
          <div key={i} className="result-body" style={{
            fontFamily: "'Kalam', cursive",
            fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
            color: '#3d2b10', lineHeight: 1.6,
          }}>
            · {s}
          </div>
        ))}
      </div>

      {/* ── 7-Day Quest (right-bottom box) ── */}
      <div className="result-quest-box" style={{
        position: 'absolute', top: '56%', left: '48%', width: '36%', height: '30%',
        overflow: 'hidden',
        animation: 'textReveal 0.6s ease-out 5.1s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.8rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20', marginBottom: '4px',
        }}>
          7-Day Quest
        </div>
        {[
          { label: 'Day 1', task: archetype.quest[0]?.task ?? '' },
          { label: 'Day 3', task: archetype.quest[2]?.task ?? '' },
          { label: 'Day 7', task: archetype.quest[6]?.task ?? '' },
        ].map(({ label, task }) => (
          <div key={label} className="result-quest-item" style={{ marginBottom: '3px' }}>
            <span className="result-day-label" style={{
              fontFamily: "'Special Elite', cursive",
              fontSize: '0.75rem', color: '#7a4a20',
              textTransform: 'uppercase', marginRight: '4px',
            }}>
              {label}
            </span>
            <span className="result-quest" style={{
              fontFamily: "'Kalam', cursive",
              fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
              color: '#3d2b10', lineHeight: 1.5,
            }}>
              {task}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
