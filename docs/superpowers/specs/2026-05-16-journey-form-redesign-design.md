# JourneyForm Redesign — Design Spec
Date: 2026-05-16

## Overview

Redesign `JourneyForm.jsx` to feel like a real nautical voyage diary. Five changes:
1. Voyage stage progress map (replaces plain numbered steps)
2. Ambient background motion (waves, fog, stars, atmospheric text)
3. Journal card improvements (tilt, parallax, shadow)
4. Narrative question structure (stage name + day at sea)
5. Smoother question transitions

No Framer Motion. No new dependencies. No new component files — everything in `JourneyForm.jsx` + new keyframes in `index.css`.

---

## 1. Voyage Progress Map

**Replaces:** `VoyageMap` component + "Question X of 5 · Keep sailing" text (removed entirely).

### Stage definitions
| Index | Stage name  | Day label              |
|-------|-------------|------------------------|
| 0     | Harbor      | Harbor · Day 1 at Sea  |
| 1     | Open Sea    | Open Sea · Day 2 at Sea|
| 2     | Storm       | Storm · Day 3 at Sea   |
| 3     | Reflection  | Reflection · Day 4 at Sea |
| 4     | Horizon     | Horizon · Day 5 at Sea |

### Node appearance
- **Done**: 28px circle, `#2a5070` fill, `#7aadcc` border, ✓ mark, muted label below
- **Active**: 28px circle, dark navy fill, `#e8a060` border, amber glow (`box-shadow: 0 0 14px rgba(232,160,96,0.7)`), stage name label in amber below
- **Future**: 28px circle, `#0d1b2e` fill, `#2a4060` border, dim label

### Connectors
Dotted row of 3px circles between each node. Sailed segments use `#5a8aaa`, unsailed use `#2a4060`.

### Ship icon
`/assets/ship.png` scaled to 32px wide, positioned `absolute` above the active node (centered, ~20px above). CSS keyframe `shipBob`: gentle 3px vertical float, 2s infinite ease-in-out. Drop-shadow filter: `drop-shadow(0 0 4px rgba(232,160,96,0.6))`.

### Day label in journal
The clipped-note text overlay in the journal card changes to show e.g. "Harbor · Day 1 at Sea" instead of plain "Day 1 at Sea".

---

## 2. Ambient Background

All ambient elements are `position: absolute`, `pointer-events: none`, `z-index` below the journal card.

### Ocean waves
Two `WaveLayer` instances using existing `wave-mid.png` and `wave-front.png`:
- Back wave: opacity `0.08`, speed `80s`, `bottom: -60px`
- Front wave: opacity `0.06`, speed `60s`, `bottom: -80px`, `phaseOffset: 0.4`

### Fog
Two large absolutely-positioned divs with radial-gradient blobs:
- `rgba(180,200,220,0.04)` centre, transparent edge, 400–600px wide
- CSS keyframe `fogDrift`: translates ±60px horizontally over 28s and 35s (different per blob), `alternate` direction
- Positioned in mid-screen area, different sides

### Stars
8–10 fixed `<div>` elements (2px × 2px, `border-radius: 50%`, white). Each has:
- Random `top` (5–35%), random `left` (5–90%)
- CSS `starTwinkle` keyframe: opacity 0.1 → 0.5 → 0.1 over 3–5s, staggered `animation-delay` (0–4s)

### Atmospheric text
Single React component `AtmosphericText` with an internal cycling system:

**Phrases:**
- "the sea grows quiet..."
- "a question rises with the tide..."
- "keep sailing..."
- "not all answers arrive at once..."
- "the horizon waits patiently..."
- "what the ocean knows, it keeps..."

**Behaviour:**
- `useEffect` with `setTimeout`, interval 6000–8000ms (randomised each cycle)
- On trigger: pick random phrase + random position (`top: 20–75%`, `left: 10–75%`)
- Render `<span>` with CSS `textFloat` keyframe applied
- `textFloat`: opacity 0 → 0.12 → 0.12 → 0 over 5s total, translateY 0 → -20px
- After 5s, clear the phrase (back to null) until next trigger
- Max opacity 0.12 — never distracting

---

## 3. Journal Card

### Resting tilt
Outer card wrapper gets `transform: rotate(-1deg)` as its default state.

### Mouse-tracking parallax
`mousemove` listener on the outer container div. On move:
```
offsetX = (e.clientX - cardCenterX) / cardWidth   // -0.5 to 0.5
offsetY = (e.clientY - cardCenterY) / cardHeight
rotateY = offsetX * 6   // capped at ±6°
rotateX = -offsetY * 6
transform: perspective(800px) rotateX({rotateX}deg) rotateY({rotateY}deg) rotate(-1deg)
```
Stored in `useRef` (not state) to avoid re-renders. Applied directly to DOM via `cardRef.current.style.transform`.
`mouseleave`: reset to `rotate(-1deg)` with a `transition: transform 0.4s ease-out`.

### Shadow
```css
box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.4);
```

---

## 4. Transitions

When `handleNext` or `handlePrev` is called:
1. Set `cardVisible = false` → card animates to `opacity: 0, transform: translateY(8px)` (200ms)
2. After 200ms: update `current` index
3. Set `cardVisible = true` → card animates from `opacity: 0, translateY(-8px)` to `opacity: 1, translateY(0)` + resting tilt

Background overlay: a full-screen `<div>` with `background: rgba(0,0,0,0)`, briefly transitions to `rgba(0,0,0,0.15)` and back during the 200ms swap. Controlled by the same `cardVisible` flag.

---

## 5. Files Changed

| File | Changes |
|------|---------|
| `src/components/JourneyForm.jsx` | Full rewrite of `VoyageMap`, add `AtmosphericText`, add ambient layer, parallax logic, updated day labels, updated questions |
| `src/index.css` | Add keyframes: `shipBob`, `fogDrift`, `starTwinkle`, `textFloat` |

### Updated questions
1. What kind of work makes you lose track of time?
2. Who do you secretly admire, and why?
3. What problem in your life keeps repeating?
4. If failure was impossible, what would you try for 30 days?
5. What future are you afraid of becoming?

---

## Constraints

- No Framer Motion
- No new npm dependencies
- No new component files
- Reuse existing wave assets (`wave-mid.png`, `wave-front.png`, `ship.png`)
- All parallax via direct DOM style mutation (useRef), not useState
- Max atmospheric text opacity: 0.12
- Parallax tilt capped at ±6°
