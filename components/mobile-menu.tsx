'use client'

import { useState } from 'react'

const items = [
  { label: 'обо мне', href: '#about' },
  { label: 'работы', href: '#work' },
  { label: 'услуги', href: '#services' },
  { label: 'контакты', href: '#contact' },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`mobile-menu-trigger flex size-11 items-center justify-center text-slate-200${isOpen ? ' is-open' : ''}`}
      >
        <span className="mobile-menu-dots" aria-hidden="true"><i /><i /></span>
      </button>
      {isOpen && (
        <nav className="mobile-menu-panel absolute right-0 top-12 z-50 flex w-[min(18rem,calc(100vw-3rem))] flex-col gap-1 rounded-2xl p-2">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="mobile-menu-link rounded-xl px-4 py-3 text-base text-slate-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
