'use client'

import { useEffect, useRef } from 'react'

const LOOP_DURATION = 12000
const LOAD_DURATION = 1000

type TargetName = 'projects' | 'contact' | 'projectCard' | 'contactAction' | 'reload'
type Point = { x: number; y: number }
type Waypoint = { time: number; target?: TargetName; x?: number; y?: number }

function smoothStep(value: number) {
  const t = Math.max(0, Math.min(1, value))
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function easeInOutCubic(value: number) {
  const t = Math.max(0, Math.min(1, value))
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function setClass(element: Element | null, name: string, active: boolean) {
  if (!element || element.classList.contains(name) === active) return
  element.classList.toggle(name, active)
}

export function BrowserSiteDemo() {
  const screen = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const loader = useRef<HTMLSpanElement>(null)
  const cursor = useRef<HTMLSpanElement>(null)
  const click = useRef<HTMLSpanElement>(null)
  const home = useRef<HTMLDivElement>(null)
  const projectsView = useRef<HTMLDivElement>(null)
  const contactView = useRef<HTMLDivElement>(null)
  const homeLink = useRef<HTMLSpanElement>(null)
  const projectsLink = useRef<HTMLSpanElement>(null)
  const contactLink = useRef<HTMLSpanElement>(null)
  const projectCard = useRef<HTMLDivElement | null>(null)
  const contactAction = useRef<HTMLSpanElement>(null)
  const reloadButton = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const screenElement = screen.current
    const pageElement = page.current
    const loaderElement = loader.current
    const cursorElement = cursor.current
    const clickElement = click.current
    const homeElement = home.current
    const projectsElement = projectsView.current
    const contactElement = contactView.current

    if (!screenElement || !pageElement || !loaderElement || !cursorElement || !clickElement || !homeElement || !projectsElement || !contactElement) return

    const views = [homeElement, projectsElement, contactElement]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      pageElement.classList.remove('is-loading')
      pageElement.classList.add('is-open')
      homeElement.classList.add('is-active')
      homeLink.current?.classList.add('is-active')
      return
    }

    const waypoints: Waypoint[] = [
      { time: 0, target: 'reload' },
      { time: 2800, target: 'reload' },
      { time: 4800, target: 'projects' },
      { time: 5500, target: 'projects' },
      { time: 6500, target: 'projectCard' },
      { time: 7100, target: 'projectCard' },
      { time: 8100, target: 'contact' },
      { time: 8600, target: 'contact' },
      { time: 9300, target: 'contactAction' },
      { time: 10100, target: 'contactAction' },
      { time: 10900, target: 'reload' },
      { time: 11300, target: 'reload' },
      { time: 11700, target: 'reload' },
    ]

    const clickEvents: { start: number; end: number; target: TargetName }[] = [
      { start: 5100, end: 5500, target: 'projects' },
      { start: 6800, end: 7100, target: 'projectCard' },
      { start: 8300, end: 8600, target: 'contact' },
      { start: 9600, end: 9900, target: 'contactAction' },
      { start: 11200, end: 11900, target: 'reload' },
    ]

    const getTarget = (name: TargetName) => {
      if (name === 'projects') return projectsLink.current
      if (name === 'contact') return contactLink.current
      if (name === 'projectCard') return projectCard.current
      if (name === 'contactAction') return contactAction.current
      return reloadButton.current
    }

    const positions: Partial<Record<TargetName, Point>> = {}
    let screenBounds = { width: screenElement.clientWidth, height: screenElement.clientHeight }

    const measureTargets = () => {
      const bounds = screenElement.getBoundingClientRect()
      screenBounds = { width: bounds.width, height: bounds.height }

      ;(['projects', 'contact', 'projectCard', 'contactAction', 'reload'] as const).forEach((name) => {
        const target = getTarget(name)
        if (!target) return
        const targetBounds = target.getBoundingClientRect()
        positions[name] = {
          x: targetBounds.left - bounds.left + targetBounds.width / 2,
          y: targetBounds.top - bounds.top + targetBounds.height / 2,
        }
      })
    }

    measureTargets()
    const resizeObserver = new ResizeObserver(measureTargets)
    resizeObserver.observe(screenElement)
    ;[projectsLink.current, contactLink.current, projectCard.current, contactAction.current, reloadButton.current].forEach((element) => {
      if (element) resizeObserver.observe(element)
    })

    const pointFor = (waypoint: Waypoint): Point => {
      if (waypoint.target && positions[waypoint.target]) return positions[waypoint.target]!
      return {
        x: (waypoint.x ?? 0.5) * screenBounds.width,
        y: (waypoint.y ?? 0.5) * screenBounds.height,
      }
    }

    let frameId = 0
    let elapsedBeforePause = 0
    let visibleSince: number | null = null
    const animate = (now: number) => {
      if (visibleSince === null) return
      const time = (elapsedBeforePause + now - visibleSince) % LOOP_DURATION
      const loadTime = Math.max(0, Math.min(1, time / LOAD_DURATION))
      const loadProgress = smoothStep(loadTime)
      const pageLoaded = time >= LOAD_DURATION

      setClass(pageElement, 'is-loading', !pageLoaded)
      setClass(pageElement, 'is-open', pageLoaded)
      loaderElement.style.transform = `scaleX(${loadProgress})`
      loaderElement.style.opacity = pageLoaded ? '0' : '1'

      const activeView = time < 5000 ? homeElement : time < 8300 ? projectsElement : contactElement
      views.forEach((view) => setClass(view, 'is-active', view === activeView))
      setClass(homeLink.current, 'is-active', activeView === homeElement)
      setClass(projectsLink.current, 'is-active', activeView === projectsElement)
      setClass(contactLink.current, 'is-active', activeView === contactElement)
      setClass(projectCard.current, 'is-selected', time >= 6800 && time < 7200)
      setClass(contactAction.current, 'is-pressed', time >= 9600 && time < 9900)
      setClass(reloadButton.current, 'is-pressed', time >= 11200 && time < 11900)

      let segment = 0
      while (segment < waypoints.length - 2 && time > waypoints[segment + 1].time) segment += 1
      const from = waypoints[segment]
      const to = waypoints[Math.min(segment + 1, waypoints.length - 1)]
      const distance = Math.max(1, to.time - from.time)
      const amount = easeInOutCubic((time - from.time) / distance)
      const fromPoint = pointFor(from)
      const toPoint = pointFor(to)
      const x = fromPoint.x + (toPoint.x - fromPoint.x) * amount
      const y = fromPoint.y + (toPoint.y - fromPoint.y) * amount
      const clickEvent = clickEvents.find((event) => time >= event.start && time < event.end)

      cursorElement.style.opacity = '1'
      const clickProgress = clickEvent ? (time - clickEvent.start) / (clickEvent.end - clickEvent.start) : 0
      const cursorScale = clickEvent ? 1 - Math.sin(clickProgress * Math.PI) * 0.08 : 1
      cursorElement.style.transform = `translate3d(${x - 2}px, ${y - 1.5}px, 0) scale(${cursorScale})`

      if (clickEvent) {
        const point = positions[clickEvent.target]
        if (point) {
          clickElement.style.left = `${point.x}px`
          clickElement.style.top = `${point.y}px`
        }
        setClass(clickElement, 'is-active', true)
      } else {
        setClass(clickElement, 'is-active', false)
      }

      if (visibleSince !== null) frameId = window.requestAnimationFrame(animate)
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleSince === null) {
        visibleSince = performance.now()
        frameId = window.requestAnimationFrame(animate)
      } else if (!entry.isIntersecting && visibleSince !== null) {
        elapsedBeforePause = (elapsedBeforePause + performance.now() - visibleSince) % LOOP_DURATION
        visibleSince = null
        window.cancelAnimationFrame(frameId)
      }
    }, { rootMargin: '0px' })
    intersectionObserver.observe(screenElement)

    return () => {
      window.cancelAnimationFrame(frameId)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="work-demo-stage" ref={screen}>
      <div className="work-mac-toolbar">
        <div className="work-mac-title">
          <span className="work-mac-controls"><i /><i /><i /></span>
          <span className="work-mac-reload" ref={reloadButton} aria-hidden="true">
            <svg viewBox="0 0 20 20"><path d="M16.3 7.1A6.7 6.7 0 1 0 16.7 10M16.3 7.1V3.8m0 3.3H13" /></svg>
          </span>
          <span className="work-mac-address">https://kuwito.dev/</span>
        </div>
      </div>
      <div className="work-demo-screen">
        <span className="work-demo-loader-fill" ref={loader} />
        <div className="work-demo-page is-loading" ref={page}>
          <div className="work-demo-nav">
            <span className="work-demo-nav-links">
              <span className="work-demo-nav-link work-demo-nav-home is-active" ref={homeLink}>Главная</span>
              <span className="work-demo-nav-link" ref={projectsLink}>Проекты</span>
              <span className="work-demo-nav-link" ref={contactLink}>Контакты</span>
            </span>
            <span className="work-demo-nav-tools" aria-hidden="true">
              <span className="work-demo-nav-action"><span className="work-demo-nav-action-label">dev</span></span>
            </span>
          </div>
          <div className="work-demo-main">
            <div className="work-demo-view work-demo-view-home is-active" ref={home}>
              <div className="work-demo-hero">
                <div className="work-demo-copy" aria-hidden="true">
                  <span className="work-demo-description">Разработка</span>
                  <span className="work-demo-button">Подробнее</span>
                </div>
                <div className="work-demo-visual" aria-hidden="true"><i /><i /><i /></div>
              </div>
              <div className="work-demo-tiles" aria-hidden="true">
                <span className="work-demo-tile">Сайты</span>
                <span className="work-demo-tile">Интерфейсы</span>
                <span className="work-demo-tile">Сервисы</span>
              </div>
            </div>
            <div className="work-demo-view work-demo-view-projects" ref={projectsView}>
              <span className="work-demo-view-heading">Проекты</span>
              <div className="work-demo-project-grid">
                <div className="work-demo-project-tile" ref={projectCard}>Веб-сайт</div>
                <div className="work-demo-project-tile">Веб-дизайн</div>
                <div className="work-demo-project-tile">Настройка сервера</div>
              </div>
            </div>
            <div className="work-demo-view work-demo-view-contact" ref={contactView}>
              <span className="work-demo-contact-heading">Контакты</span>
              <span className="work-demo-contact-copy" aria-hidden="true"><i /><i /></span>
              <span className="work-demo-contact-button" ref={contactAction}>Написать</span>
            </div>
          </div>
        </div>
      </div>
      <span className="work-demo-click" ref={click} aria-hidden="true" />
      <span className="work-demo-cursor" ref={cursor} aria-hidden="true">
        <svg viewBox="0 0 20 26"><path d="M2 1.5 18 15l-7 .6-3.6 7.1L2 1.5Z" /></svg>
      </span>
    </div>
  )
}
