'use client'

import { useEffect, useRef } from 'react'

export function FooterWatermark() {
  const watermarkRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const watermark = watermarkRef.current
    if (!watermark) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      watermark.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      watermark.classList.add('is-visible')
      observer.disconnect()
    }, { threshold: 0.1 })

    observer.observe(watermark)
    return () => observer.disconnect()
  }, [])

  return <p ref={watermarkRef} className="footer-watermark" aria-hidden="true">kuwito</p>
}
