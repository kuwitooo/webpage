'use client'

import { useEffect, useRef, useState } from 'react'

const quoteLines = [
  'Design is not just what it looks like',
  'and feels like.',
  'Design is how it works.',
]

const accessibleQuote = quoteLines.join(' ')

export function DesignQuoteCopy() {
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const quote = quoteRef.current
    if (!quote) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.unobserve(quote)
      },
      { threshold: 0.25 },
    )

    observer.observe(quote)
    return () => observer.disconnect()
  }, [])

  return (
    <p ref={quoteRef} className={`design-quote-copy${isVisible ? ' is-visible' : ''}`} aria-label={accessibleQuote}>
      <span aria-hidden="true">
        {quoteLines.map((line, lineIndex) => {
          const lineOffset = quoteLines
            .slice(0, lineIndex)
            .reduce((total, previousLine) => total + previousLine.length + 1, 0)
          const words = line.split(' ')

          return (
            <span className="design-quote-line" key={line}>
              {words.map((word, wordIndex) => {
                const wordOffset = lineOffset + words
                  .slice(0, wordIndex)
                  .reduce((total, previousWord) => total + previousWord.length + 1, 0)

                return (
                  <span className="design-quote-word" key={`${lineIndex}-${wordIndex}`}>
                    {Array.from(word).map((character, characterIndex) => (
                      <span
                        className="design-quote-letter"
                        key={`${lineIndex}-${wordIndex}-${characterIndex}`}
                        style={{ animationDelay: `${(wordOffset + characterIndex) * 55}ms` }}
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                )
              })}
            </span>
          )
        })}
      </span>
    </p>
  )
}
