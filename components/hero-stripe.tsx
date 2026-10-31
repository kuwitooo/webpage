'use client'

import { useEffect, useRef, type PointerEvent } from 'react'

const stripePath = 'M 198 0 Q 205 0 201 13 L 14 602 Q 8 620 25 620 L 125 620 Q 140 620 146 603 L 316 18 Q 321 0 305 0 Z'

export function HeroStripe() {
  const stageRef = useRef<HTMLDivElement>(null)
  const stripeSvgRef = useRef<SVGSVGElement>(null)
  const stripeDotRef = useRef<SVGCircleElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const svg = stripeSvgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix || !stripeDotRef.current) return

    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const localPoint = point.matrixTransform(matrix.inverse())
    stripeDotRef.current.setAttribute('cx', String(localPoint.x))
    stripeDotRef.current.setAttribute('cy', String(localPoint.y))
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        if (reducedMotion.matches) {
          stage.style.setProperty('--stripe-scroll-y', '0px')
          stage.style.setProperty('--stripe-scroll-rotation', '0deg')
          return
        }

        const bounds = stage.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.78 - bounds.top) / (window.innerHeight + bounds.height)))
        stage.style.setProperty('--stripe-scroll-y', `${(progress - 0.5) * 120}px`)
        stage.style.setProperty('--stripe-scroll-rotation', `${(progress - 0.5) * 14}deg`)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    reducedMotion.addEventListener('change', update)
    update()

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      reducedMotion.removeEventListener('change', update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-stripe-stage" aria-hidden="true">
      <div className="hero-stripe-scroll">
        <div className="hero-stripe-shadow" />
        <div className="hero-stripe" onPointerMove={handlePointerMove}>
          <svg ref={stripeSvgRef} className="hero-stripe-art" viewBox="0 0 320 620" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="hero-stripe-fill" x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0" stopColor="#03091e" />
                <stop offset="0.42" stopColor="#0a2259" />
                <stop offset="0.68" stopColor="#102e70" />
                <stop offset="1" stopColor="#040b21" />
              </linearGradient>
              <linearGradient id="hero-stripe-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#c7e4ff" stopOpacity="0.3" />
                <stop offset="0.22" stopColor="#78baff" stopOpacity="0.05" />
                <stop offset="1" stopColor="#a7d4ff" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path className="hero-stripe-depth" d={stripePath} transform="translate(5 6)" />
            <path className="hero-stripe-path" d={stripePath} fill="url(#hero-stripe-fill)" stroke="url(#hero-stripe-edge)" strokeWidth="2" />
            <circle ref={stripeDotRef} className="hero-stripe-dot" cx="0" cy="0" r="8" />
          </svg>
        </div>
      </div>
    </div>
  )
}
