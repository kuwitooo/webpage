'use client'

import { useEffect, useRef } from 'react'

const items = [
  { label: 'обо мне', href: '#about' },
  { label: 'работы', href: '#work' },
  { label: 'услуги', href: '#services' },
  { label: 'контакты', href: '#contact' },
]

export function MobileMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      const menu = menuRef.current
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [])

  return (
    <details ref={menuRef} className="mobile-menu-disclosure relative z-[52] isolate md:hidden">
      <summary
        aria-label="Меню"
        aria-controls="mobile-navigation"
        className="mobile-menu-trigger pointer-events-auto relative z-50 flex size-11 cursor-pointer touch-manipulation list-none items-center justify-center text-slate-200"
      >
        <span className="mobile-menu-dots" aria-hidden="true"><i /><i /></span>
      </summary>
      <nav
        id="mobile-navigation"
        className="mobile-menu-panel absolute right-0 top-12 z-50 flex w-[min(18rem,calc(100vw-3rem))] flex-col gap-1 rounded-2xl p-2"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
            className="mobile-menu-link rounded-xl px-4 py-3 text-base text-slate-200"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  )
}
