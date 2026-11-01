'use client'

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const progress = progressRef.current
    if (!progress) return

    let frame = 0
    const update = () => {
      frame = 0
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const value = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0
      progress.style.transform = `scaleX(${value})`
      progress.setAttribute('aria-valuenow', String(Math.round(value * 100)))
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="header-scroll-progress" role="progressbar" aria-label="Прокрутка страницы" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div ref={progressRef} className="header-scroll-progress-fill" />
    </div>
  )
}
