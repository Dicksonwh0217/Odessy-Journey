# Odyssey — Design Spec
**Date:** 2026-05-16
**Stack:** Vite + React + Tailwind CSS
**Status:** Approved

---

## 1. Overview

Odyssey is a single-page emotional self-discovery experience for young people who feel lost about career, money, creativity, and life direction. The user is guided through 5 reflective journal questions and receives a personalised archetype result with strengths, blind spots, possible paths, and a 7-day exploration quest.

**Mood:** Lonely but hopeful. Like a paper theatre voyage journal at night.
**Not:** Futuristic SaaS, generic dashboard, childish cartoon.

---

## 2. Visual Style

- **Background:** Dark ocean night gradient (`#0a0a1a` → `#0d1b2e` → `#1a2d40`)
- **Aesthetic:** Handmade cardboard / paper-cut. Subtle paper texture feel via CSS.
- **Stars:** Small fixed dots scattered in the upper portion of the scene.
- **Fonts:**
  - Headlines / archetype names / question text: **Special Elite** (Google Fonts)
  - Body text / textarea / labels / buttons: **Kalam** (Google Fonts)
- **Colour palette:**
  - Text primary: `#e8dcc8` (warm parchment)
  - Text secondary: `#a0b8cc` (muted teal-grey)
  - Accent (current step / quest): `#c87840` (amber)
  - Ocean accent: `#7aadcc` (teal)
  - Button (cardboard sign): `#7a5c3a` bg, `#5a3e20` border, shadow `#3a2010`

---

## 3. Architecture

### State Management
- Single `useState` in `App.jsx` controls active screen: `'landing' | 'journey' | 'result'`
- Answers stored as a `string[]` array (index 0–4, one per question) in `App.jsx`
- Archetype computed synchronously when transitioning from journey → result
- Screen transitions use CSS opacity fade-in (0.3s) on mount: the incoming screen starts at `opacity-0` and transitions to `opacity-100` via a `useEffect` toggling a `visible` boolean. There is no fade-out — the outgoing screen unmounts instantly and the new screen fades in. Question-to-question transitions within JourneyForm use the same fade-in pattern on the card only.

### File Structure
```
src/
  App.jsx                   # Root: screen state, answers state, archetype logic
  index.css                 # CSS keyframe animations (wave scroll, ship float, fade)
  components/
    Landing.jsx             # Landing scene with waves, ship, hero copy, CTA
    WaveLayer.jsx           # Reusable wave image layer (accepts speed, opacity, zIndex props)
    JourneyForm.jsx         # Question screen with progress map, textarea, nav
    Result.jsx              # Archetype result with strengths, blind spots, paths, quest
public/
  assets/
    ship.png                # Currently in project root — move during scaffold
    wave-front.png          # Currently in project root — move during scaffold
    wave-mid.png            # Currently in project root — move during scaffold
    wave-back.png           # Currently in project root — move during scaffold
    cta-button.png          # Currently in project root — move during scaffold; pre-rendered button with text baked in
docs/
  superpowers/specs/
    2026-05-16-odyssey-design.md
```

### Data Flow
```
App.jsx
  ├── screen: 'landing' | 'journey' | 'result'
  ├── answers: string[5]
  ├── computeArchetype(answers) → archetypeKey
  │
  ├── <Landing onStart={() => setScreen('journey')} />
  ├── <JourneyForm answers={answers} setAnswers={...} onComplete={() => { compute; setScreen('result') }} />
  └── <Result archetype={archetypeData[archetypeKey]} onRestart={() => { reset; setScreen('landing') }} />
```

---

## 4. Screen Designs

### 4.1 Landing Screen

**Layout:** Full viewport. Scene is layered bottom-to-top.

**Wave layers (bottom to top):**
| Layer | Component | Asset | Animation | Opacity | Z-index |
|---|---|---|---|---|---|
| Back | `<WaveLayer>` | `wave-back.png` | `waveScroll` 30s linear infinite | 0.45 | 1 |
| Mid | `<WaveLayer>` | `wave-mid.png` | `waveScroll` 20s linear infinite | 0.75 | 3 |
| Front | `<WaveLayer>` | `wave-front.png` | `waveScroll` 15s linear infinite | 1.0 | 5 |

**Ship:**
- Asset: `ship.png`
- Z-index: 4 (between mid and front waves)
- Position: horizontally centred, bottom ~18% of viewport
- Animation: `shipFloat` keyframe — `translateY(0)` → `translateY(-10px)` → `translateY(0)`, 4s ease-in-out infinite

**Hero copy:**
- Title: `"Not every drifting soul is lost."` — Special Elite, `#e8dcc8`
- Subtext: `"Begin an AI-guided voyage..."` — Kalam, `#a0b8cc`
- Positioned in upper portion of viewport (above the waves)

**CTA Button:**
- Visual: `cta-button.png` as `<img>` (pre-rendered cardboard sign with text)
- Accessibility: `<button>` wrapper with `aria-label="Begin Your Odyssey"` and `<span className="sr-only">Begin Your Odyssey</span>`
- On click: fade out landing, fade in journey screen

### 4.2 Journey Question Screen

**5 questions (shown one at a time):**
1. What kind of work makes you lose track of time?
2. Who do you secretly admire, and why?
3. What problem in your life keeps repeating?
4. If failure was impossible, what would you try for 30 days?
5. What kind of future are you afraid of becoming?

**Voyage map progress indicator:**
- 5 circular stops connected by lines
- Completed: teal fill + ✓
- Current: amber glow (`#c87840`) + box-shadow
- Future: dim outline only

**Journal card:**
- Floating label: `"Day {n} at Sea"` in Special Elite, teal colour
- Question text: Special Elite
- Textarea: Kalam font, placeholder `"Write freely. There's no wrong answer here..."`
- Character count displayed (soft limit, not enforced)

**Navigation:**
- Previous button: ghost style (transparent bg, teal border)
- Next button: cardboard sign style (brown bg, shadow)
- On Q5: Next button label becomes `"See My Results →"`
- Previous hidden on Q1

**Transitions:**
- Switching between questions: card fades out/in (opacity 0→1, 0.3s)
- Q5 → result: full screen opacity fade

### 4.3 Result Screen

**Layout:** Scrollable card on dark ocean background.

**Sections:**
1. **Archetype badge** — label "Your Archetype", name in large Special Elite with amber glow, short description in Kalam
2. **Divider**
3. **2-column grid:**
   - Strengths card
   - Blind Spots card
4. **Full-width Possible Paths card**
5. **7-day Exploration Quest** — amber-toned card, day-by-day list
6. **Restart Journey button** — ghost style, resets state and returns to landing

---

## 5. Archetype Logic

Computed in `App.jsx` by `computeArchetype(answers: string[])`.

All 5 answers are concatenated into one lowercase string. Keywords are counted per archetype. The archetype with the highest keyword match wins. Tie → first in priority order. No matches → default to `driftingBuilder`.

### Archetypes

#### The Drifting Builder (`driftingBuilder`)
**Keywords:** `build, create, code, website, app, business, startup, product, ai`
**Description:** Someone who learns by making things, but may feel lost because they have too many ideas.
**Strengths:** Learns by doing, high creative output, comfortable with ambiguity, builds momentum quickly
**Blind Spots:** Starts more than finishes, avoids strategic thinking, undervalues what's already built, chases novelty over depth
**Paths:** Indie maker / solopreneur, technical co-founder who ships first, creative developer blending code and storytelling
**7-Day Quest:**
- Day 1: List every project you've started in the past year. Star the ones that still excite you.
- Day 2: Pick one starred project. Write one sentence about who it helps and why.
- Day 3: Build the smallest possible version you can show someone in 24 hours.
- Day 4: Share it with one real person and write down their reaction.
- Day 5: Read one story of a maker who shipped something small and built from there.
- Day 6: Identify the one thing stopping you from committing to this for 30 days.
- Day 7: Write a 30-day commitment to yourself. No conditions. Just a direction.

#### The Hidden Creator (`hiddenCreator`)
**Keywords:** `content, video, writing, design, art, youtube, tiktok, storytelling`
**Description:** Someone who has creative energy but struggles with consistency, self-doubt, or choosing a niche.
**Strengths:** Rich inner world, natural storyteller, high empathy, sees beauty others miss
**Blind Spots:** Perfection paralysis, struggles to commit to one medium, compares self to polished creators
**Paths:** Content creator with a consistent niche, visual designer or brand identity artist, writer / newsletter author
**7-Day Quest:**
- Day 1: List every creative thing you've made in the past 6 months, including drafts never published.
- Day 2: Pick the one that felt most alive when you made it. Write down why.
- Day 3: Create something small in that medium — just for yourself, not for posting.
- Day 4: Share it with one trusted person and ask them what they felt.
- Day 5: Find one creator whose work you genuinely admire. Study what makes their style consistent.
- Day 6: Write your one-line creative vision: "I make ___ for people who ___."
- Day 7: Post or share something — imperfect, small, real.

#### The Searching Strategist (`searchingStrategist`)
**Keywords:** `career, money, job, future, confused, lost, direction, study`
**Description:** Someone who wants stability and growth but feels overwhelmed by choices.
**Strengths:** Thoughtful decision-maker, values security and growth, good at research, long-term thinker
**Blind Spots:** Analysis paralysis, waits for the "right" answer before moving, underestimates intuition
**Paths:** Structured career path with clear milestones, entrepreneurship with a roadmap, freelancing in a high-demand skill
**7-Day Quest:**
- Day 1: Write down the 3 futures you're most afraid of. Be specific.
- Day 2: For each fear, write what you would need to feel safer about that outcome.
- Day 3: List 3 people in careers or lifestyles you'd actually want. What do they have in common?
- Day 4: Identify one skill that appears in all 3 of those paths.
- Day 5: Spend 30 minutes learning or practising that skill today.
- Day 6: Talk to one person — a friend, mentor, or stranger online — who works in that direction.
- Day 7: Write the one next step you could take this week. Not the full plan — just one step.

---

## 6. CSS Animations (in `index.css`)

```css
@keyframes waveScroll {
  from { background-position-x: 0; }
  to   { background-position-x: 100%; }
}

@keyframes shipFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Wave images are set as CSS `background-image` on full-width divs via `style={{ backgroundImage: \`url(${src})\` }}` so `background-position-x` scrolling works. The `src` prop on `WaveLayer` feeds this CSS property — it does NOT render an `<img>` element. Ship uses an `<img>` with the float keyframe applied via className.

---

## 7. WaveLayer Component Props

```jsx
<WaveLayer
  src="/assets/wave-back.png"
  speed={30}        // animation duration in seconds
  opacity={0.45}    // CSS opacity
  zIndex={1}        // CSS z-index
  bottom="12%"      // CSS bottom position
  height="28%"      // CSS height
/>
```

---

## 8. Responsiveness

- Landing: hero text scales via `clamp()`. Waves and ship scale naturally with viewport.
- Journey: card is `max-width: 640px`, centred, full-width on mobile with padding.
- Result: grid collapses to single column below `sm` breakpoint (Tailwind `sm:grid-cols-2`).
- Fonts loaded from Google Fonts via `<link>` in `index.html`.

---

## 9. Out of Scope

- Authentication, backend, database, payments
- Real AI/API calls (archetype is computed locally)
- Canvas or WebGL animations
- Framer Motion or other animation libraries
