# JourneyForm Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign JourneyForm with voyage stage progress map, ambient background (waves/fog/stars/atmospheric text), mouse-parallax journal card, and smooth transitions.

**Architecture:** All changes stay in two files: `src/components/JourneyForm.jsx` (new helper components added at bottom, main component updated) and `src/index.css` (four new keyframes). WaveLayer is reused from the existing codebase. No new files.

**Tech Stack:** React 18, CSS keyframes, Web Animations API (existing WaveLayer), Tailwind CSS utility classes

---

## File Map

| File | What changes |
|------|-------------|
| `src/index.css` | Add keyframes: `shipBob`, `starTwinkle`, `fogDrift`, `textFloat` |
| `src/components/JourneyForm.jsx` | New constants (`STAGES`, `ATMO_PHRASES`, updated `DAY_LABELS`, updated `QUESTIONS`); rewritten `VoyageMap`; new `Stars`, `Fog`, `AtmosphericText` components; updated `JourneyForm` with `useRef` parallax, ambient layer, transition overlay, WaveLayer import |

---

## Task 1: Add CSS keyframes to index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Open `src/index.css` and append the four keyframes after the existing `button` rule block (end of file)**

```css
/* ── Voyage map: ship bobs above active node ── */
@keyframes shipBob {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(-3px); }
}

/* ── Background: stars twinkle at low opacity ── */
@keyframes starTwinkle {
  0%, 100% { opacity: 0.1; }
  50%      { opacity: 0.5; }
}

/* ── Background: fog blobs drift slowly left/right ── */
@keyframes fogDrift {
  from { transform: translateX(0px); }
  to   { transform: translateX(60px); }
}

/* ── Background: atmospheric phrases float up and fade ── */
@keyframes textFloat {
  0%   { opacity: 0;    transform: translateY(0px); }
  20%  { opacity: 0.12; transform: translateY(-4px); }
  80%  { opacity: 0.12; transform: translateY(-14px); }
  100% { opacity: 0;    transform: translateY(-20px); }
}
```

- [ ] **Step 2: Verify in browser**

Start dev server (`npm run dev`) and navigate to the JourneyForm screen. Open DevTools → Elements, find any div and manually apply `animation: shipBob 2s infinite` in Styles. The element should visibly move up and down 3px. Repeat for `starTwinkle` (opacity pulse), `fogDrift` (horizontal drift), `textFloat` (fade + upward float). Remove the manual styles after verifying.

---

## Task 2: Update constants in JourneyForm.jsx

**Files:**
- Modify: `src/components/JourneyForm.jsx`

- [ ] **Step 1: Replace the top-of-file constants block**

Replace everything from line 1 through the end of the `DAY_LABELS` array with:

```jsx
import { useState, useEffect, useRef } from 'react'
import WaveLayer from './WaveLayer'

const QUESTIONS = [
  'What kind of work makes you lose track of time?',
  'Who do you secretly admire, and why?',
  'What problem in your life keeps repeating?',
  'If failure was impossible, what would you try for 30 days?',
  'What future are you afraid of becoming?',
]

const STAGES = ['Harbor', 'Open Sea', 'Storm', 'Reflection', 'Horizon']

const DAY_LABELS = [
  'Harbor · Day 1 at Sea',
  'Open Sea · Day 2 at Sea',
  'Storm · Day 3 at Sea',
  'Reflection · Day 4 at Sea',
  'Horizon · Day 5 at Sea',
]

const ATMO_PHRASES = [
  'the sea grows quiet...',
  'a question rises with the tide...',
  'keep sailing...',
  'not all answers arrive at once...',
  'the horizon waits patiently...',
  'what the ocean knows, it keeps...',
]
```

- [ ] **Step 2: Verify**

Save and check browser — the JourneyForm should still render. The last question now reads "What future are you afraid of becoming?" (no "kind of"). The day label in the journal should now read e.g. "Harbor · Day 1 at Sea".

---

## Task 3: Replace VoyageMap and add Stars, Fog, AtmosphericText

**Files:**
- Modify: `src/components/JourneyForm.jsx` — replace the existing `VoyageMap` function and add three new helper components below it

- [ ] **Step 1: Replace the existing `VoyageMap` function at the bottom of the file**

Delete the old `VoyageMap` function entirely and replace with this block of four functions:

```jsx
function VoyageMap({ current, total }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      paddingTop: '40px',
      position: 'relative',
      zIndex: 10,
    }}>
      {STAGES.map((stage, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
          {/* Node column */}
          <span style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative',
          }}>
            {/* Ship icon above active node */}
            {i === current && (
              <img
                src="/assets/ship.png"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  width: '30px',
                  height: 'auto',
                  marginBottom: '2px',
                  filter: 'drop-shadow(0 0 4px rgba(232,160,96,0.6))',
                  animation: 'shipBob 2s ease-in-out infinite',
                  zIndex: 3,
                }}
              />
            )}
            {/* Circle node */}
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              fontFamily: "'Special Elite', cursive", fontSize: '0.65rem',
              border: `2px solid ${i < current ? '#7aadcc' : i === current ? '#e8a060' : '#2a4060'}`,
              background: i < current ? '#2a5070' : i === current ? '#1a3a5a' : '#0d1b2e',
              color: i < current ? '#c8e0f0' : i === current ? '#fff' : '#2a4060',
              boxShadow: i === current
                ? '0 0 14px rgba(232,160,96,0.7), 0 0 28px rgba(232,160,96,0.3)'
                : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </span>
            {/* Stage label below node */}
            <span style={{
              fontFamily: "'Kalam', cursive",
              fontSize: '0.55rem',
              color: i === current ? '#e8a060' : '#3a5a7a',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}>
              {stage}
            </span>
          </span>

          {/* Dotted connector between nodes */}
          {i < total - 1 && (
            <span style={{
              display: 'flex', gap: '3px', alignItems: 'center',
              paddingBottom: '18px', flexShrink: 0, margin: '0 4px',
            }}>
              {[0, 1, 2, 3, 4].map(d => (
                <span key={d} style={{
                  display: 'block', width: 4, height: 4, borderRadius: '50%',
                  background: i < current ? '#5a8aaa' : '#2a4060',
                  flexShrink: 0,
                }} />
              ))}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

const STAR_CONFIG = [
  { top: '8%',  left: '12%', delay: '0s',   dur: '3.2s' },
  { top: '15%', left: '88%', delay: '0.8s', dur: '4.1s' },
  { top: '5%',  left: '55%', delay: '1.5s', dur: '3.7s' },
  { top: '25%', left: '72%', delay: '0.3s', dur: '4.8s' },
  { top: '12%', left: '35%', delay: '2.1s', dur: '3.4s' },
  { top: '30%', left: '8%',  delay: '1.2s', dur: '5.0s' },
  { top: '6%',  left: '78%', delay: '0.6s', dur: '3.9s' },
  { top: '20%', left: '22%', delay: '1.8s', dur: '4.3s' },
]

function Stars() {
  return (
    <>
      {STAR_CONFIG.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', top: s.top, left: s.left,
            width: 2, height: 2, borderRadius: '50%', background: 'white',
            animation: `starTwinkle ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      ))}
    </>
  )
}

function Fog() {
  return (
    <>
      <div style={{
        position: 'absolute', top: '20%', left: '-10%',
        width: '500px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(180,200,220,0.04) 0%, transparent 70%)',
        animation: 'fogDrift 28s ease-in-out infinite alternate',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', top: '45%', right: '-5%',
        width: '600px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(180,200,220,0.04) 0%, transparent 70%)',
        animation: 'fogDrift 35s ease-in-out infinite alternate-reverse',
        pointerEvents: 'none', zIndex: 1,
      }} />
    </>
  )
}

function AtmosphericText() {
  const [visible, setVisible] = useState(null)

  useEffect(() => {
    let scheduleTimer, clearTimer
    function schedule() {
      const delay = 6000 + Math.random() * 2000
      scheduleTimer = setTimeout(() => {
        const phrase = ATMO_PHRASES[Math.floor(Math.random() * ATMO_PHRASES.length)]
        const top = 20 + Math.random() * 55
        const left = 10 + Math.random() * 65
        setVisible({ phrase, top, left, key: Date.now() })
        clearTimer = setTimeout(() => {
          setVisible(null)
          schedule()
        }, 5000)
      }, delay)
    }
    schedule()
    return () => { clearTimeout(scheduleTimer); clearTimeout(clearTimer) }
  }, [])

  if (!visible) return null
  return (
    <span
      key={visible.key}
      style={{
        position: 'absolute',
        top: `${visible.top}%`,
        left: `${visible.left}%`,
        fontFamily: "'Kalam', cursive",
        fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
        color: '#a0c0d8',
        pointerEvents: 'none',
        animation: 'textFloat 5s ease-in-out forwards',
        zIndex: 2,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {visible.phrase}
    </span>
  )
}
```

- [ ] **Step 2: Verify**

In the browser, the voyage map should now show `Harbor · Open Sea · Storm · Reflection · Horizon` stage names below the numbered nodes. The ship.png should appear above the active (current) node with a gentle bob. Stars should twinkle faintly in the background. After 6–8 seconds, a phrase should softly float up and fade out.

---

## Task 4: Update the main JourneyForm component render

**Files:**
- Modify: `src/components/JourneyForm.jsx` — update the `JourneyForm` function body

- [ ] **Step 1: Replace the entire `JourneyForm` export default function with the following**

```jsx
export default function JourneyForm({ answers, setAnswers, onComplete, onBack }) {
  const [current, setCurrent] = useState(0)
  const [cardVisible, setCardVisible] = useState(true)
  const cardRef = useRef(null)

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = (e.clientX - centerX) / (rect.width / 2)
    const offsetY = (e.clientY - centerY) / (rect.height / 2)
    const rotateY = Math.max(-6, Math.min(6, offsetX * 6))
    const rotateX = Math.max(-6, Math.min(6, -offsetY * 6))
    cardRef.current.style.transition = 'transform 0.1s ease-out'
    cardRef.current.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(-1deg)`
  }

  function handleMouseLeave() {
    if (!cardRef.current) return
    cardRef.current.style.transition = 'transform 0.4s ease-out'
    cardRef.current.style.transform = 'rotate(-1deg)'
  }

  function transitionTo(nextIndex) {
    setCardVisible(false)
    setTimeout(() => {
      setCurrent(nextIndex)
      setCardVisible(true)
    }, 200)
  }

  function handleNext() {
    if (current < QUESTIONS.length - 1) {
      transitionTo(current + 1)
    } else {
      onComplete(answers)
    }
  }

  function handlePrev() {
    if (current > 0) transitionTo(current - 1)
  }

  function handleChange(e) {
    const updated = [...answers]
    updated[current] = e.target.value
    setAnswers(updated)
  }

  const isLast = current === QUESTIONS.length - 1

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 journey-container"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Ambient layer (z-index 0–2, behind everything) ── */}
      <Stars />
      <Fog />
      <WaveLayer
        src="/assets/wave-mid.png"
        speed={80} opacity={0.08} zIndex={0} bottom="-60px" height="140%"
      />
      <WaveLayer
        src="/assets/wave-front.png"
        speed={60} opacity={0.06} zIndex={1} bottom="-80px" height="130%"
        phaseOffset={0.4}
      />
      <AtmosphericText />

      {/* ── Transition darkening overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: cardVisible ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.15)',
        transition: 'background 0.2s ease-in-out',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* ── Back button ── */}
      <div className="w-full max-w-xl mb-2" style={{ position: 'relative', zIndex: 10 }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Kalam', cursive",
            fontSize: '0.85rem',
            background: 'transparent',
            border: 'none',
            color: '#4a6a7a',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          ← Back to shore
        </button>
      </div>

      {/* ── Voyage progress map ── */}
      <VoyageMap current={current} total={QUESTIONS.length} />

      {/* ── Journal card (fade + slide on transition) ── */}
      <div
        className="w-full max-w-2xl"
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Tilt + mouse-parallax wrapper */}
        <div
          ref={cardRef}
          style={{
            transform: 'rotate(-1deg)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {/* Journal PNG background */}
          <div
            className="relative w-full"
            style={{
              backgroundImage: "url('/assets/JourneyForm.png')",
              backgroundSize: '100% 100%',
              aspectRatio: '3/2',
            }}
          >
            {/* Day label overlaid on the clipped-note in the PNG */}
            <div style={{
              position: 'absolute',
              top: '24%',
              left: '16%',
              zIndex: 2,
              fontFamily: "'Special Elite', cursive",
              fontSize: 'clamp(0.55rem, 1.1vw, 0.7rem)',
              color: '#5a3a1a',
              transform: 'rotate(-1deg)',
              pointerEvents: 'none',
              fontWeight: 'bold',
            }}>
              {DAY_LABELS[current]}
            </div>

            {/* Question title */}
            <p style={{
              position: 'absolute',
              top: '38%',
              left: '17%',
              right: '14%',
              fontFamily: "'Special Elite', cursive",
              color: '#3d2b10',
              fontSize: 'clamp(0.75rem, 1.6vw, 0.95rem)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {QUESTIONS[current]}
            </p>

            {/* Response textarea + char count */}
            <div style={{
              position: 'absolute',
              top: '44%',
              left: '17%',
              right: '14%',
              bottom: '10%',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div className="flex justify-end mb-1">
                <span style={{ fontFamily: "'Kalam', cursive", color: '#8a6a3a', fontSize: '0.65rem' }}>
                  {answers[current].length} / 350
                </span>
              </div>
              <textarea
                className="resize-none outline-none flex-1 journal-textarea"
                style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                  lineHeight: '1.7',
                  background: 'repeating-linear-gradient(to bottom, transparent, transparent calc(1.7em - 1px), rgba(80,45,15,0.35) calc(1.7em - 1px), rgba(80,45,15,0.35) 1.7em)',
                  backgroundAttachment: 'local',
                  border: 'none',
                  color: '#3d2b10',
                  width: '100%',
                }}
                placeholder="Write freely. There's no wrong answer here…"
                value={answers[current]}
                onChange={handleChange}
                maxLength={350}
              />
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: '0.9rem',
                padding: '8px 22px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1.5px solid #5a4a30',
                color: current === 0 ? '#4a3a20' : '#c8a870',
                cursor: current === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: '0.9rem',
                padding: '8px 22px',
                borderRadius: '6px',
                background: '#7a5c3a',
                border: '1.5px solid #5a3e20',
                color: '#f0e8d8',
                boxShadow: '0 3px 0 #3a2010',
                cursor: 'pointer',
              }}
            >
              {isLast ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify all features in browser**

Check each item:
1. Voyage map shows Harbor → Open Sea → Storm → Reflection → Horizon with stage labels below nodes
2. ship.png appears above the active node, bobs gently — advances correctly when clicking Next/Previous
3. "Question X of 5 · Keep sailing" text is gone
4. Day label in journal reads "Harbor · Day 1 at Sea" etc.
5. Moving the mouse across the screen tilts the journal card subtly (±6° max)
6. Mouse leaving the container resets card to slight resting tilt
7. Clicking Next fades card out + darkens background, then fades new question in
8. Stars twinkle faintly in background
9. Fog blobs drift slowly (may need to wait a few seconds to notice)
10. After 6–8 seconds an atmospheric phrase floats up and fades in the background

---

## Self-Review Checklist

**Spec coverage:**
- [x] Voyage stage progress map (Harbor/Open Sea/Storm/Reflection/Horizon) — Task 3 VoyageMap
- [x] Circular nodes + dotted connectors — Task 3 VoyageMap
- [x] Active node glows amber — Task 3 node `boxShadow`
- [x] Ship.png above active node with shipBob animation — Task 3 VoyageMap + Task 1 keyframe
- [x] Active stage label below in amber — Task 3 label color
- [x] "Question X of 5 · Keep sailing" removed — Task 4 render (not present)
- [x] Ocean waves behind journal — Task 4 WaveLayer instances
- [x] Fog — Task 3 Fog component + Task 1 fogDrift keyframe
- [x] Star twinkle — Task 3 Stars + Task 1 starTwinkle keyframe
- [x] Atmospheric text — Task 3 AtmosphericText + Task 1 textFloat keyframe
- [x] Journal resting tilt rotate(-1deg) — Task 4 cardRef div
- [x] Mouse-tracking parallax ±6° — Task 4 handleMouseMove
- [x] Deeper shadow — Task 4 cardRef boxShadow
- [x] Narrative day labels — Task 2 DAY_LABELS
- [x] Updated question 5 — Task 2 QUESTIONS
- [x] Transition: opacity + translateY — Task 4 cardVisible state
- [x] Background darkens on transition — Task 4 overlay div
- [x] No Framer Motion — confirmed, CSS only
- [x] No new files — all changes in existing 2 files
