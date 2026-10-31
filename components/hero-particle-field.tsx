'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  radius: number
  phase: number
  speed: number
}

export function HeroParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const section = canvas.parentElement
    if (!section) return

    let width = 0
    let height = 0
    let frame = 0
    let lastTime = 0
    let elapsed = 0
    let formation = -1
    let particles: Particle[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const setFormation = (nextFormation: number) => {
      formation = nextFormation
      particles.forEach((particle, index) => {
        const group = index % 4
        if (formation % 3 === 0) {
          particle.targetX = Math.random() * width
          particle.targetY = Math.random() * height
        } else if (formation % 3 === 1) {
          const centers = [0.18, 0.4, 0.66, 0.86]
          particle.targetX = (centers[group] + (Math.random() - 0.5) * 0.28) * width
          particle.targetY = (0.25 + Math.random() * 0.56) * height
        } else {
          particle.targetX = Math.random() * width
          particle.targetY = (0.2 + particle.targetX / Math.max(width, 1) * 0.55 + (Math.random() - 0.5) * 0.42) * height
        }
      })
    }

    const resize = () => {
      const bounds = section.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = width < 640 ? 30 : width < 1024 ? 44 : 62
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * width
        const y = Math.random() * height
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.025,
          vy: (Math.random() - 0.5) * 0.025,
          targetX: x,
          targetY: y,
          radius: 0.8 + Math.random() * 1.35,
          phase: Math.random() * Math.PI * 2,
          speed: 0.12 + Math.random() * 0.22,
        }
      })
      formation = -1
      draw(0, false)
    }

    const draw = (delta: number, animate: boolean) => {
      if (width <= 0 || height <= 0) return
      elapsed += delta
      const nextFormation = Math.floor(elapsed / 28)
      if (nextFormation !== formation) setFormation(nextFormation)
      context.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        if (animate) {
          const time = elapsed * particle.speed + particle.phase
          let ax = (particle.targetX - particle.x) * 0.0000028 + Math.sin(time * 0.28) * 0.00022
          let ay = (particle.targetY - particle.y) * 0.0000028 + Math.cos(time * 0.24) * 0.00022

          const frameScale = Math.min(delta * 60, 2.4)
          const damping = 0.99 ** frameScale
          particle.vx = (particle.vx + ax * frameScale) * damping
          particle.vy = (particle.vy + ay * frameScale) * damping
          particle.x += particle.vx * frameScale
          particle.y += particle.vy * frameScale

          if (particle.x < -12) particle.x = width + 12
          if (particle.x > width + 12) particle.x = -12
          if (particle.y < -12) particle.y = height + 12
          if (particle.y > height + 12) particle.y = -12
        }
      })

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        const colorMix = (Math.sin(elapsed * 0.075 + particle.phase) + 1) / 2
        const red = Math.round(108 + colorMix * 35)
        const green = Math.round(172 + colorMix * 48)
        const blue = Math.round(237 + colorMix * 18)

        const pulse = 0.78 + (Math.sin(elapsed * 0.34 + particle.phase) + 1) * 0.1
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius * pulse, 0, Math.PI * 2)
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.32 + colorMix * 0.32})`
        context.fill()
      }

    }

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = Math.min((time - lastTime) / 1000, 0.04)
      lastTime = time
      draw(delta, true)
      frame = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (frame || reducedMotion) return
      lastTime = 0
      frame = window.requestAnimationFrame(animate)
    }
    const stop = () => {
      if (!frame) return
      window.cancelAnimationFrame(frame)
      frame = 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else stop()
    }, { rootMargin: '120px' })
    observer.observe(section)

    const resizeObserver = new ResizeObserver(resize)

    resizeObserver.observe(section)
    resize()

    if (reducedMotion) draw(0, false)

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particle-canvas" aria-hidden="true" />
}
