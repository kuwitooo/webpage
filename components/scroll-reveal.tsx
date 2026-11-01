'use client'

import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (items.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-revealed'))
      return
    }

    items.forEach((item) => {
      const delay = item.dataset.revealDelay
      if (delay) item.style.setProperty('--reveal-delay', `${delay}ms`)
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

    const revealVisibleItems = () => {
      const viewportHeight = window.innerHeight
      items.forEach((item) => {
        if (item.classList.contains('is-revealed')) return
        const bounds = item.getBoundingClientRect()
        if (bounds.top < viewportHeight * 0.9 && bounds.bottom > 0) {
          item.classList.add('is-revealed')
          observer.unobserve(item)
        }
      })
    }
    items.forEach((item) => observer.observe(item))

    const motionSections = Array.from(document.querySelectorAll<HTMLElement>('#top, #about, #work, #services, .design-quote, #contact, .site-footer'))
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('section-motion-active', entry.isIntersecting))
    }, { rootMargin: '100px 0px' })
    motionSections.forEach((section) => motionObserver.observe(section))

    root.classList.add('reveal-ready')
    let scrollFrame = 0
    const checkVisibleItems = () => {
      if (scrollFrame) return
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0
        revealVisibleItems()
      })
    }
    revealVisibleItems()
    window.addEventListener('scroll', checkVisibleItems, { passive: true })
    window.addEventListener('resize', revealVisibleItems)
    return () => {
      observer.disconnect()
      motionObserver.disconnect()
      window.removeEventListener('scroll', checkVisibleItems)
      window.removeEventListener('resize', revealVisibleItems)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      root.classList.remove('reveal-ready')
      motionSections.forEach((section) => section.classList.remove('section-motion-active'))
    }
  }, [])

  return null
}
