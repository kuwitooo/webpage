'use client'

import { useEffect, type ReactNode } from 'react'

export function ProjectScrollEffects({ children }: { children: ReactNode }) {
  useEffect(() => {
    const section = document.getElementById('work')
    if (!section) return

    const revealItems = Array.from(section.querySelectorAll<HTMLElement>('.work-reveal'))

    const revealAllItems = () => {
      revealItems.forEach((item) => item.classList.add('is-visible'))
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      section.classList.add('work-in-view')
      revealAllItems()
      return
    }

    section.classList.add('work-motion-ready')

    const sectionObserver = new IntersectionObserver(([entry]) => {
      section.classList.toggle('work-in-view', entry.isIntersecting)
      if (entry.isIntersecting) revealAllItems()
    }, { threshold: 0.02 })

    sectionObserver.observe(section)

    return () => {
      sectionObserver.disconnect()
      section.classList.remove('work-in-view')
      section.classList.remove('work-motion-ready')
      revealItems.forEach((item) => item.classList.remove('is-visible'))
    }
  }, [])

  return <div className="project-cards-motion grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}
