import { useRef, useEffect } from 'react'

// 8 copies is more than enough to cover any viewport at any wave height.
// Animating by -(100/N)% = exactly one image width — no pixel math, perfectly seamless.
const N = 8

export default function WaveLayer({ src, speed, opacity, zIndex, bottom, height, phaseOffset = 0, className = '' }) {
  const innerRef = useRef(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const anim = el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${-(100 / N)}%)` },
      ],
      { duration: speed * 1000, iterations: Infinity, easing: 'linear', iterationStart: phaseOffset }
    )
    return () => anim.cancel()
  }, [speed, phaseOffset])

  return (
    <div className={className} style={{ position: 'absolute', bottom, left: 0, width: '100%', height, zIndex, opacity, overflow: 'hidden', pointerEvents: 'none' }}>
      <div ref={innerRef} style={{ display: 'flex', height: '100%', width: 'max-content' }}>
        {Array.from({ length: N }, (_, i) => (
          <img key={i} src={src} alt="" aria-hidden="true"
            style={{ height: '100%', width: 'auto', flexShrink: 0, display: 'block' }} />
        ))}
      </div>
    </div>
  )
}
