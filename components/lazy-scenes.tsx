'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const PortfolioScene3D = dynamic(
  () => import('./portfolio-scene').then((module) => module.PortfolioScene),
  { ssr: false },
)

const SkillsParticleField3D = dynamic(
  () => import('./portfolio-scene').then((module) => module.SkillsParticleField),
  { ssr: false },
)

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

function useDeferredScene<T extends HTMLElement>(rootMargin: string) {
  const container = useRef<T>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return

    const idleWindow = window as IdleWindow
    let idleId: number | undefined
    let timeoutId: number | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      observer.disconnect()
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 900 })
      } else {
        timeoutId = window.setTimeout(() => setReady(true), 120)
      }
    }, { rootMargin })

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [rootMargin])

  return [container, ready] as const
}

export function PortfolioScene({ variant = 'hero' }: { variant?: 'hero' | 'contact' }) {
  const isContact = variant === 'contact'
  const [container, ready] = useDeferredScene<HTMLDivElement>(isContact ? '260px' : '0px')

  return (
    <div
      ref={container}
      className={isContact ? 'h-[400px] w-full sm:h-[520px]' : 'h-full w-full'}
      role="img"
      aria-label={isContact ? 'Animated 3D chat bubble' : 'Animated 3D glass cloud'}
    >
      {ready && <PortfolioScene3D variant={variant} />}
    </div>
  )
}

export function SkillsParticleField() {
  const [container, ready] = useDeferredScene<HTMLDivElement>('260px')

  return (
    <div ref={container} className="h-full w-full">
      {ready && <SkillsParticleField3D />}
    </div>
  )
}
