# Result Screen Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully rewrite `Result.jsx` to deliver a cinematic "voyage end" moment — sunrise ocean, ship sails home, parchment VogogeNote panel fades in with archetype text overlaid on its blank writing areas.

**Architecture:** Two files change only: `src/index.css` gains 4 new CSS keyframes; `src/components/Result.jsx` is rewritten with three internal helpers (`Scene`, `Ship`, `VoyagePanel`) wired into one default export. All animation is CSS keyframes. Ship sail-once → float-forever uses a single `useRef` + `setTimeout` swap; everything else uses `animation-delay` staggering.

**Tech Stack:** React 18, Vite 5, CSS keyframes (no Framer Motion), existing `WaveLayer` component, existing `archetypes.js` data shape.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/index.css` | Modify | Add 4 keyframes: `sunGlow`, `shipSailIn`, `panelFadeIn`, `textReveal` |
| `src/components/Result.jsx` | Full rewrite | Cinematic result screen — Scene, Ship, VoyagePanel, restart button |

**No other files change.** `App.jsx`, `archetypes.js`, `WaveLayer.jsx` are untouched.

---

## Existing data shape (read-only reference)

`archetypes.js` exports objects with this shape (all three archetypes follow it):
```js
{
  name: 'The Drifting Builder',
  description: 'You learn by making things...',
  strengths: ['Learns by doing', 'High creative output', 'Comfortable with ambiguity', 'Builds momentum quickly'],
  blindSpots: ['Starts more than finishes', 'Avoids strategic thinking', ...],
  paths: ['Indie maker / solopreneur...', ...],
  quest: [
    { day: 1, task: "List every project..." },
    { day: 2, task: 'Pick one starred project...' },
    ...
    { day: 7, task: 'Write a 30-day commitment...' },
  ],
}
```
Use `quest[0].task`, `quest[2].task`, `quest[6].task` for Day 1 / Day 3 / Day 7 on the panel.

---

## Existing CSS keyframes already in `src/index.css` (do not re-add)

- `fadeIn` — opacity 0 → 1
- `shipFloat` — translateX(-50%) with -10px bob, 4s infinite
- `waveScroll`, `shipSailRight`, `seagullSway` — unrelated, leave alone

---

## Task 1: Add CSS keyframes to index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Open `src/index.css` and append the four new keyframes at the bottom of the file**

Add this block after the last existing keyframe (currently `@keyframes textFloat`):

```css
/* ── Result screen: sun pulses with warm glow ── */
@keyframes sunGlow {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(247,168,48,0.4)); }
  50%       { filter: drop-shadow(0 0 40px rgba(247,168,48,0.8)); }
}

/* ── Result screen: ship sails in from off-screen left ── */
@keyframes shipSailIn {
  0%   { transform: translateX(-50%) translateX(-120vw) translateY(10px); }
  70%  { transform: translateX(-50%) translateX(-10px)  translateY(-8px); }
  100% { transform: translateX(-50%) translateX(0px)    translateY(0px); }
}

/* ── Result screen: VogogeNote panel slides up and fades in ── */
@keyframes panelFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Result screen: text overlays on panel fade in section by section ── */
@keyframes textReveal {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 2: Verify the keyframes were added**

Run:
```bash
grep -c "sunGlow\|shipSailIn\|panelFadeIn\|textReveal" "src/index.css"
```
Expected output: `4` (each name appears once as a keyframe definition)

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add result screen CSS keyframes (sunGlow, shipSailIn, panelFadeIn, textReveal)"
```

---

## Task 2: Rewrite Result.jsx

**Files:**
- Rewrite: `src/components/Result.jsx`

This task replaces the entire file. Write it in one go — intermediate states are not meaningful commits.

- [ ] **Step 1: Replace the entire contents of `src/components/Result.jsx` with the following**

```jsx
import { useEffect, useRef } from 'react'
import WaveLayer from './WaveLayer'

export default function Result({ archetype, onRestart }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'linear-gradient(180deg, #1a0a05 0%, #3d1a08 25%, #7a3a10 50%, #1a4060 75%, #0d1b2e 100%)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.8s ease-out forwards',
        paddingBottom: '100px',
      }}
    >
      <Scene />
      <Ship />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <VoyagePanel archetype={archetype} />
        <button
          onClick={onRestart}
          style={{
            fontFamily: "'Kalam', cursive",
            fontSize: '0.9rem',
            padding: '10px 32px',
            borderRadius: '6px',
            background: 'transparent',
            border: '1.5px solid #5a4a30',
            color: '#c8a870',
            cursor: 'pointer',
            marginTop: '20px',
            animation: 'textReveal 0.6s ease-out 5.1s both',
          }}
        >
          ← Begin Again
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
          width: '80px', height: 'auto',
          zIndex: 2, pointerEvents: 'none',
          animation: 'fadeIn 1.5s ease-out forwards, sunGlow 3s ease-in-out infinite',
          animationDelay: '0.3s, 1.8s',
          opacity: 0,
        }}
      />

      {/* Waves — slightly brighter than JourneyForm to match daylit scene */}
      <WaveLayer src="/assets/wave-back.png"  speed={100} opacity={0.25} zIndex={0} bottom="-80px" height="140%" />
      <WaveLayer src="/assets/wave-mid.png"   speed={80}  opacity={0.20} zIndex={1} bottom="-60px" height="140%" />
      <WaveLayer src="/assets/wave-front.png" speed={60}  opacity={0.15} zIndex={2} bottom="-80px" height="130%" phaseOffset={0.4} />
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
        bottom: '60px',
        left: '50%',
        width: 'clamp(120px, 20vw, 200px)',
        height: 'auto',
        animation: 'shipSailIn 2.5s ease-out 0.8s both',
        zIndex: 3,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
      }}
    />
  )
}

/* ── VoyagePanel: VogogeNote.png as background, text overlaid on blank areas ── */
function VoyagePanel({ archetype }) {
  return (
    <div style={{
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
        position: 'absolute', top: '6%', left: '32%', width: '36%',
        textAlign: 'center',
        animation: 'textReveal 0.6s ease-out 4.0s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20',
        }}>
          Your Archetype
        </div>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: '#3d1a05', fontWeight: 'bold', lineHeight: 1.3,
        }}>
          {archetype.name}
        </div>
      </div>

      {/* ── Captain's Reflection (large left-top box) ── */}
      <div style={{
        position: 'absolute', top: '22%', left: '9%', width: '38%', height: '34%',
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
        <div style={{
          fontFamily: "'Kalam', cursive",
          fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
          color: '#3d2b10', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          {archetype.description}
        </div>
      </div>

      {/* ── Strengths (left-bottom box) ── */}
      <div style={{
        position: 'absolute', top: '63%', left: '9%', width: '36%', height: '18%',
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
          <div key={i} style={{
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
        position: 'absolute', top: '22%', left: '54%', width: '38%', height: '26%',
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
          <div key={i} style={{
            fontFamily: "'Kalam', cursive",
            fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
            color: '#3d2b10', lineHeight: 1.6,
          }}>
            · {s}
          </div>
        ))}
      </div>

      {/* ── 7-Day Quest (right-bottom box) ── */}
      <div style={{
        position: 'absolute', top: '58%', left: '54%', width: '38%', height: '27%',
        overflow: 'hidden',
        animation: 'textReveal 0.6s ease-out 5.1s both',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Special Elite', cursive",
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '1.5px', color: '#7a4a20', marginBottom: '4px',
        }}>
          7-Day Quest
        </div>
        {[
          { label: 'Day 1', task: archetype.quest[0].task },
          { label: 'Day 3', task: archetype.quest[2].task },
          { label: 'Day 7', task: archetype.quest[6].task },
        ].map(({ label, task }) => (
          <div key={label} style={{ marginBottom: '3px' }}>
            <span style={{
              fontFamily: "'Special Elite', cursive",
              fontSize: '0.55rem', color: '#7a4a20',
              textTransform: 'uppercase', marginRight: '4px',
            }}>
              {label}
            </span>
            <span style={{
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
```

- [ ] **Step 2: Verify the dev server compiles without errors**

Run:
```bash
npm run dev
```
Expected: no errors in terminal output. The Vite dev server should start (or hot-reload if already running) without TypeScript/JSX errors.

If you see `shipRef is not defined` or similar: check that `useRef` is in the import at line 1.

- [ ] **Step 3: Verify in browser**

Open `http://localhost:5173` in a browser, complete the JourneyForm (or trigger the result screen directly), and confirm the following sequence:

1. Screen fades in over dark sunrise gradient (0–0.8s)
2. Sun appears top-left and begins softly glowing (starts ~0.3s)
3. Ship slides in from off-screen left to center-bottom (starts ~0.8s, ends ~3.3s)
4. Ship transitions to gentle bob (after 3.4s)
5. VogogeNote panel fades up into view (starts ~3.5s)
6. Text overlays appear section by section: archetype title → reflection → strengths → blind spots → quest (4.0s–5.1s)
7. "← Begin Again" button fades in (~5.1s)
8. Waves animate continuously in the background

- [ ] **Step 4: Commit**

```bash
git add src/components/Result.jsx
git commit -m "feat: cinematic result screen with VogogeNote panel and archetype overlays"
```

---

## Animation timing reference (for debugging)

| Element | Start | Ends / loops |
|---------|-------|--------------|
| Screen fade | 0s | 0.8s |
| Sun fade-in | 0.3s | 1.8s (then glow loops) |
| Ship sail-in | 0.8s | 3.3s |
| Ship float swap | JS at 3.4s | loops forever |
| Panel fade-in | 3.5s | 4.5s |
| Title text | 4.0s | 4.6s |
| Reflection | 4.3s | 4.9s |
| Strengths | 4.6s | 5.2s |
| Blind Spots | 4.8s | 5.4s |
| Quest | 5.1s | 5.7s |
| Begin Again btn | 5.1s | 5.7s |

---

## Notes for implementer

- **`animation-fill-mode: both`** (shorthand via the 5th value in `animation`) is used on all animated elements. `both` = apply `from` state during delay (keeps elements invisible before their entrance) AND retain `to` state after the animation ends. This prevents flashing.
- **`shipFloat` keyframe already exists** in `src/index.css` — do not re-add it. The JS timeout swaps the ship's inline `animation` style to use it.
- **Asset filename is `VogogeNote.png`** (not `voyage-notes.png`) — the spec mentions both names but the actual file in `/public/assets/` is `VogogeNote.png`. Same for `Sun.png` (capital S).
- **`WaveLayer` props**: `src`, `speed` (scroll speed in seconds), `opacity`, `zIndex`, `bottom` (CSS string), `height` (CSS string), `phaseOffset` (optional 0–1 float for staggering).
- **Text overflow**: all overlay divs have `overflow: hidden` — text that's too long for the blank area is clipped cleanly.
