# Result Screen Redesign — Design Spec
Date: 2026-05-16

## Overview

Fully rewrite `src/components/Result.jsx` to deliver a cinematic "voyage end" moment. The journey form fades out, a sunrise ocean scene fades in, the ship sails home, and a Voyage Notes parchment panel reveals the user's archetype text. Everything is CSS keyframes — no Framer Motion, no canvas, no new dependencies.

---

## 1. Files Changed

| File | Change |
|------|--------|
| `src/components/Result.jsx` | Full rewrite — cinematic scene, VogogeNote panel, archetype overlays |
| `src/index.css` | Add 4 keyframes: `sunGlow`, `shipSailIn`, `panelFadeIn`, `textReveal` |

No changes to `App.jsx`, `archetypes.js`, `WaveLayer.jsx`, or any other file.

---

## 2. Component Structure

`Result.jsx` exports one default function `Result({ archetype, onRestart })` — same props as the current component.

Three internal helper components:

- **`Scene`** — full-screen background: sunrise gradient, sky glow div, `Sun.png`, three `WaveLayer` instances
- **`Ship`** — sail-in → float logic via `useRef` timeout swap
- **`VoyagePanel`** — `VogogeNote.png` as background image with five absolutely-positioned text overlays

---

## 3. Background Scene

### Gradient
```css
background: linear-gradient(180deg, #1a0a05 0%, #3d1a08 25%, #7a3a10 50%, #1a4060 75%, #0d1b2e 100%)
```

### Sky glow
Absolutely-positioned div, top 0, full width, height 40%, `background: linear-gradient(180deg, rgba(255,140,50,0.15) 0%, transparent 100%)`, `pointer-events: none`.

### Sun (`/assets/Sun.png`)
- `position: absolute`, `top: 32px`, `left: 40px`, width `80px`
- `animation: fadeIn 1.5s ease-out forwards` — reuse existing `fadeIn` keyframe
- `animation: sunGlow 3s ease-in-out infinite`, `animation-delay: 1.5s`

```css
@keyframes sunGlow {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(247,168,48,0.4)); }
  50%       { filter: drop-shadow(0 0 40px rgba(247,168,48,0.8)); }
}
```

### Waves
Three `<WaveLayer>` instances (reusing existing component):
- `wave-back.png`: `opacity={0.25}`, `speed={100}`, `bottom="-80px"`
- `wave-mid.png`: `opacity={0.20}`, `speed={80}`, `bottom="-60px"`
- `wave-front.png`: `opacity={0.15}`, `speed={60}`, `bottom="-80px"`, `phaseOffset={0.4}`

### Screen fade-in
Result container: `animation: fadeIn 0.8s ease-out forwards` (existing keyframe).

---

## 4. Ship Animation

### Keyframe
```css
@keyframes shipSailIn {
  0%   { transform: translateX(-50%) translateX(-120vw) translateY(10px); }
  70%  { transform: translateX(-50%) translateX(-10px)  translateY(-8px); }
  100% { transform: translateX(-50%) translateX(0px)    translateY(0px); }
}
```
Consistent with existing `shipSailRight` pattern in `index.css`: `translateX(-50%)` for centering (because `left: 50%`), then a second `translateX` for movement offset.

### Positioning
`position: absolute`, `bottom: 60px`, `left: 50%`. Width: `clamp(120px, 20vw, 200px)`.

### Sail-once → float logic
```jsx
const shipRef = useRef(null)
const timerRef = useRef(null)

useEffect(() => {
  // sail-in starts at 0.8s (after screen fade), lasts 2.5s → done at 3.3s
  timerRef.current = setTimeout(() => {
    if (shipRef.current) {
      shipRef.current.style.animation = 'shipFloat 4s ease-in-out infinite'
    }
  }, 3400)
  return () => clearTimeout(timerRef.current)
}, [])
```

Initial inline style: `animation: shipSailIn 2.5s ease-out forwards; animation-delay: 0.8s`.

---

## 5. VogogeNote Panel

### Wrapper
`position: relative`, `width: min(86vw, 820px)`, centered horizontally. The `VogogeNote.png` image fills the wrapper with `width: 100%` and `display: block`. Aspect ratio is preserved naturally by the image — no forced `aspectRatio` needed.

### Text overlays
All overlays: `position: absolute`, `pointer-events: none`, `overflow: hidden`.

| Section | top | left | width | height |
|---------|-----|------|-------|--------|
| Archetype title | 6% | 32% | 36% | auto |
| Captain's Reflection | 22% | 9% | 38% | 34% |
| Strengths | 63% | 9% | 36% | 18% |
| Blind Spots | 22% | 54% | 38% | 26% |
| 7-Day Quest | 58% | 54% | 38% | 27% |

### Text styling
- Section label: `font-family: 'Special Elite', cursive`, `font-size: 0.6rem`, `text-transform: uppercase`, `letter-spacing: 1.5px`, `color: #7a4a20`
- Body text: `font-family: 'Kalam', cursive`, `font-size: clamp(0.65rem, 1.2vw, 0.8rem)`, `color: #3d2b10`, `line-height: 1.6`
- Archetype name: `font-family: 'Special Elite', cursive`, `font-size: clamp(1rem, 2vw, 1.3rem)`, `color: #3d1a05`, `font-weight: bold`

### Archetype data mapping
- `archetype.name` → Archetype title overlay
- `archetype.description` → Captain's Reflection body
- `archetype.strengths` → Strengths bullet list (3 items max, slice to 3)
- `archetype.blindSpots` → Blind Spots bullet list (3 items max, slice to 3)
- `archetype.quest[0].task`, `archetype.quest[2].task`, `archetype.quest[6].task` → 7-Day Quest displayed as "Day 1 / Day 3 / Day 7" steps

Note: `quest[]` already exists in `archetypes.js` with 7 `{ day, task }` objects per archetype. `paths[]` is not used on the panel.

---

## 6. Panel & Text Animation Sequence

| Element | Keyframe | Delay | Duration |
|---------|----------|-------|----------|
| Screen | `fadeIn` | 0s | 0.8s |
| Sun (fade) | `fadeIn` | 0.3s | 1.5s |
| Sun (glow) | `sunGlow` | 1.8s | 3s ∞ |
| Ship sail | `shipSailIn` | 0.8s | 2.5s |
| Ship float | `shipFloat` | JS swap at 3.4s | 4s ∞ |
| Panel | `panelFadeIn` | 3.5s | 1s |
| Title text | `textReveal` | 4.0s | 0.6s |
| Reflection | `textReveal` | 4.3s | 0.6s |
| Strengths | `textReveal` | 4.6s | 0.6s |
| Blind Spots | `textReveal` | 4.8s | 0.6s |
| Quest | `textReveal` | 5.1s | 0.6s |

Note: panel delay (3.5s) is after ship sail-in completes (0.8s start + 2.5s duration = 3.3s). Text overlays begin at 4.0s, after panel is visible.

```css
@keyframes panelFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes textReveal {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Both use `animation-fill-mode: forwards`.

---

## 7. Restart Button

Below the panel (not inside it). `font-family: 'Kalam', cursive`, warm muted style matching JourneyForm nav buttons. Text: "← Begin Again". `margin-top: 24px`, `animation: textReveal 0.6s ease-out forwards`, `animation-delay: 4.8s`, starts at `opacity: 0`.

---

## 8. Mobile

- Panel scales naturally (percentage widths on overlays + `min(86vw, 820px)` wrapper)
- Text `clamp()` font sizes shrink on narrow screens
- If viewport < 480px: add `overflow: hidden` to each overlay div to prevent text spilling outside blank box boundaries
- Ship width `clamp(80px, 15vw, 200px)` on mobile

---

## 9. Assets Used

| Asset | Usage |
|-------|-------|
| `/assets/VogogeNote.png` | Panel background image (actual filename — note: spec may refer to it as voyage-notes.png) |
| `/assets/Sun.png` | Sun in top-left of scene |
| `/assets/ship.png` | Ship sail-in + float |
| `/assets/wave-back.png` | Background wave layer |
| `/assets/wave-mid.png` | Mid wave layer |
| `/assets/wave-front.png` | Front wave layer |

---

## 10. Constraints

- No Framer Motion
- No new npm dependencies
- No new component files (all in Result.jsx)
- No canvas, no Three.js
- CSS keyframes only for animation
- All parallax / animation swap via direct DOM style mutation (useRef), not useState
- Max 3 items shown per bullet list (truncate if archetype data has more)
