'use client'

import { useEffect, type ReactNode } from 'react'

export function ProjectScrollEffects({ children }: { children: ReactNode }) {
  useEffect(() => {
    const section = document.getElementById('work')
    if (!section) return

    const revealItems = Array.from(section.querySelectorAll<HTMLElement>('.work-reveal'))

    const revealAllItems = () => revealItems.forEach((item) => item.classList.add('is-visible'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealAllItems()
      return
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    }, { threshold: 0.02, rootMargin: '0px 0px -8% 0px' })

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) item.classList.add('is-visible')
      else revealObserver.observe(item)
    })

    return () => {
      revealObserver.disconnect()
    }
  }, [])

  return <div className="project-cards-motion work-motion-ready grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}
