import { PortfolioScene, SkillsParticleField } from '@/components/lazy-scenes'
import { ProjectScrollEffects } from '@/components/project-scroll-effects'
import { DesignQuoteCopy } from '@/components/design-quote-copy'
import { MobileMenu } from '@/components/mobile-menu'
import { BrowserSiteDemo } from '@/components/browser-site-demo'
import { FooterWatermark } from '@/components/footer-watermark'
import { HeroParticleField } from '@/components/hero-particle-field'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Code2, Layers, MousePointer2, Smartphone } from 'lucide-react'

const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/webpage' : ''

const navItems = [
  { label: 'обо мне', href: '#about' },
  { label: 'работы', href: '#work' },
  { label: 'услуги', href: '#services' },
  { label: 'контакты', href: '#contact' },
]

const services = [
  { number: '01', title: 'Структура и визуальный стиль сайта', description: 'Продумываю страницы, меню и формы, подбираю цвета и шрифты, чтобы сайтом было удобно пользоваться и он подходил вашей аудитории.' },
  { number: '02', title: 'Создание сайтов', description: 'Собираю сайты для телефонов и компьютеров, подключаю формы и другие нужные функции.' },
  { number: '03', title: 'Разработка серверной части', description: 'Создаю серверную часть для сайтов и цифровых продуктов, разрабатываю ботов и программы, настраиваю работу с данными и внешними сервисами.' },
  { number: '04', title: 'Размещение сайта и запуск', description: 'Подготавливаю сервер, подключаю адрес сайта и защищённое соединение, затем проверяю работу после публикации.' },
]

const projectHighlights = [
  { icon: Layers, title: 'Структура сервиса', description: 'Организовал страницы и разделы так, чтобы нужная информация находилась быстро и без лишних шагов.' },
  { icon: MousePointer2, title: 'Понятный интерфейс', description: 'Собрал визуальный стиль и сценарии взаимодействия вокруг задач самого сервиса.' },
  { icon: Smartphone, title: 'Адаптивная версия', description: 'Подготовил интерфейс для комфортной работы на смартфонах и больших экранах.' },
  { icon: Code2, title: 'Полный цикл', description: 'Разработал интерфейс и логику продукта, подготовил проект к публикации.' },
]

const sectionLabel = 'section-label inline-flex w-fit select-none bg-transparent px-0 pt-0.5 font-mono text-sm tracking-[.08em] text-slate-100 md:text-base'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="site-ambient pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <header className="site-header fixed inset-x-0 top-0 z-40">
        <div className="site-header-inner mx-auto flex items-center justify-between">
          <a href="#top" aria-label="kuwito" className="site-logo text-xl font-semibold tracking-[-0.06em] text-white">
            <span className="site-logo-slash" aria-hidden="true" />
            <span>kuwito<span className="site-logo-dot" aria-hidden="true">.</span></span>
          </a>
          <nav className="header-nav hidden items-center md:flex">
            {navItems.map((item) => <a key={item.href} href={item.href} className="header-nav-link text-sm tracking-[0.02em]">{item.label}</a>)}
          </nav>
          <a href="#contact" className="header-cta hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm sm:flex">Связаться <ArrowUpRight size={16} /></a>
          <MobileMenu />
        </div>
      </header>

      <section id="top" className="relative z-10 isolate flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-24 lg:px-10">
        <div className="hero-ambient absolute inset-0 -z-10" />
        <div className="hero-grid absolute inset-0 -z-10" />
        <div className="hero-stars absolute inset-0 -z-10" aria-hidden="true" />
        <HeroParticleField />
        <div className="hero-glow hero-glow-one absolute -right-24 top-[12%] -z-10 size-[28rem] rounded-full bg-blue-500/15 blur-[110px]" />
        <div className="hero-glow hero-glow-two absolute -bottom-40 left-[5%] -z-10 size-[34rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="hero-transition-fade absolute inset-x-0 bottom-0 -z-10" aria-hidden="true" />
        <div className="hero-glass-panels pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="hero-glass-panel hero-glass-panel-one" />
          <div className="hero-glass-panel hero-glass-panel-two" />
          <div className="hero-glass-panel hero-glass-panel-three" />
        </div>
        <div className="pointer-events-none relative z-10 mx-auto flex w-full min-w-0 max-w-7xl flex-col items-center justify-center gap-3 sm:gap-5">
          <div className="hero-copy pointer-events-auto w-full min-w-0 max-w-3xl">
            <h1 className="hero-title order-1 mx-auto max-w-6xl text-balance text-center text-[clamp(3.2rem,9.4vw,8rem)] font-medium leading-[.91] tracking-[-0.075em] text-white">Цифровые решения<br className="hidden sm:block" /><br className="sm:hidden" /><span className="hero-liquid-text">для ваших идей.</span></h1>
            <div className="hero-actions order-4 mt-6 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-5"><a href="#work" className="inline-flex min-h-14 items-center gap-3 px-4 py-3 text-base text-slate-200 underline decoration-slate-500 underline-offset-8 transition hover:text-white">Смотреть работы <ArrowDown size={18} /></a><a href="#contact" className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-cyan-300 px-7 py-4 text-base font-semibold text-[#04101e] transition hover:bg-white">Связаться <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></div>
          </div>
          <div className="hero-scene order-2 relative flex h-[clamp(15rem,32vh,23rem)] w-full max-w-[46rem] min-w-0 items-center justify-center">
            <div className="relative z-10 h-full w-full"><PortfolioScene variant="hero" /></div>
          </div>
        </div>
      </section>

      <section id="about" className="section-tint-about relative z-10 min-h-screen px-6 py-20 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl flex-col">
          <p className={`${sectionLabel} about-section-label`}>обо мне</p>
          <div className="about-layout">
            <div className="about-intro">
              <h2 className="about-title">От идеи<br />до <span>готового продукта.</span></h2>
              <p className="about-description">Продумываю, создаю и запускаю цифровые продукты — от понятного интерфейса до надёжной логики.</p>
            </div>
            <div className="about-capabilities">
              <p className="about-info-label">возможности</p>
              <article className="about-capability">
                <div className="about-capability-copy"><h3>Дизайн</h3><p>Продумываю структуру и визуальный стиль по вашим референсам и предпочтениям, чтобы интерфейс был удобным и отражал характер проекта.</p></div>
              </article>
              <article className="about-capability">
                <div className="about-capability-copy"><h3>Разработка</h3><p>Создаю сайты и цифровые продукты, настраиваю серверную часть, пишу программы и ботов. Подключаю нужные функции и довожу проект до запуска.</p></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section-tint-work relative z-10 min-h-screen px-6 py-16 sm:py-20 lg:px-10">
        <div className="work-background-particles" aria-hidden="true" />
        <div className="work-transition-fade" aria-hidden="true" />
        <div className="mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-7xl flex-col justify-center">
          <h2 className={`${sectionLabel} mb-7 -translate-y-4 sm:mb-9 sm:-translate-y-6`}>работы</h2>
          <ProjectScrollEffects>
            <article className="work-project-card work-reveal group sm:col-span-2">
              <div className="work-project-preview">
                <div className="work-preview-browser" aria-hidden="true">
                  <BrowserSiteDemo />
                </div>
              </div>
              <div className="work-project-caption">
                <p className="work-project-tagline">Создаю сайты и цифровые продукты — от идеи до готового решения.</p>
              </div>
            </article>

            <article className="work-project-story work-reveal sm:col-span-2">
              <div className="work-story-project">
                <div className="work-story-project-meta"><span>проект</span><strong>2026</strong></div>
                <h3>Система самопознания «Матрица судьбы»</h3>
              </div>
              <div className="work-story-summary">
                <div>
                  <p className="work-story-role">Моя роль: полный цикл разработки</p>
                  <p className="work-story-description">Продумал структуру, разработал адаптивный интерфейс и логику сервиса, подготовил проект к запуску.</p>
                </div>
                <div className="work-project-actions">
                  <a href="https://violettaputmatrixru.ru/" target="_blank" rel="noopener noreferrer" className="work-open-link">
                    <span><ArrowUpRight size={18} /></span>Открыть проект
                  </a>
                  <button type="button" className="work-all-projects" disabled>
                    Смотреть все проекты
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>

            {projectHighlights.map(({ icon: Icon, title, description }) => (
              <article key={title} className="work-detail-card work-reveal">
                <Icon className="work-detail-icon" size={21} strokeWidth={1.6} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </ProjectScrollEffects>
        </div>
      </section>
      <section id="services" className="section-tint-services relative z-10 min-h-screen px-6 py-20 lg:px-10">
        <div className="skills-particle-field" aria-hidden="true"><SkillsParticleField /></div>
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl flex-col">
          <p className={sectionLabel}>направления</p>
          <div className="skills-layout relative grid flex-1 items-center gap-10 py-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
            <div className="skills-intro relative flex min-h-[28rem] flex-col justify-center">
              <div className="services-heading relative z-10 flex flex-col items-start gap-5">
                <h2 className="text-5xl font-medium tracking-[-.06em] text-white md:text-7xl">Полный цикл<br className="hidden md:block" /> разработки<span className="text-cyan-200">.</span></h2>
                <p className="max-w-md pb-1 text-base leading-relaxed text-slate-300 md:text-lg">От первой идеи до готового продукта: продумываю, разрабатываю и запускаю проект.</p>
              </div>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <article key={service.number} className={`service-card${index % 2 === 1 ? ' service-card-reverse' : ''}`}>
                  <span className="service-number">{service.number}</span>
                  <div className="service-copy"><h3>{service.title}</h3><p>{service.description}</p></div>
                  <ArrowUpRight className="service-arrow" size={18} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="design-quote relative z-10 min-h-[24rem] px-6 py-24 sm:min-h-[28rem] sm:py-32 lg:px-10" aria-label="Design quote">
        <figure className="design-quote-inner">
          <blockquote>
            <DesignQuoteCopy />
          </blockquote>
          <figcaption>— Steve Jobs</figcaption>
        </figure>
      </section>

      <section id="contact" className="section-tint-contact relative z-10 min-h-screen px-6 py-16 sm:py-20 lg:px-10"><div className="mx-auto w-full max-w-7xl"><p className={sectionLabel}>контакты</p><div className="mt-4 grid min-h-[calc(100vh-10rem)] content-center gap-8 sm:min-h-[calc(100vh-12rem)] sm:gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20"><div className="pt-3 lg:pt-12"><h2 className="max-w-2xl text-[clamp(3rem,12vw,5.5rem)] font-medium leading-[.88] tracking-[-.075em] text-white sm:text-6xl md:text-8xl">Свяжитесь<br /><span className="text-cyan-300">со мной</span><span>.</span></h2><p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:mt-8 sm:text-base md:text-lg">Подробно опишите техническое задание: цель проекта, нужные функции, референсы и ваши пожелания. Чем точнее будут исходные требования, тем лучше я смогу оценить сроки и предложить подходящее решение.</p></div><div className="flex min-w-0 flex-col items-center text-center -translate-y-8 sm:-translate-y-10 lg:-translate-y-14"><div className="contact-scene-wrap w-full min-w-0"><div className="contact-grid-fade" aria-hidden="true" /><PortfolioScene variant="contact" /></div><h3 className="mt-1 w-full text-center text-3xl font-medium tracking-[-.04em] text-white md:text-4xl">Способы связи</h3><div className="mt-6 flex flex-wrap justify-center gap-3"><a href="https://instagram.com/kuwito" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-cyan-200/50 hover:text-cyan-200"><Image src={`${basePath}/icons/ig_icon.png`} width={20} height={20} alt="" className="contact-social-icon" /> Instagram <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a><a href="https://t.me/kuwito" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-cyan-200/50 hover:text-cyan-200"><Image src={`${basePath}/icons/tg_icon.png`} width={20} height={20} alt="" className="contact-social-icon contact-social-icon-telegram" /> Telegram <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div></div></div></div></section>

      <footer className="site-footer relative z-10 w-full overflow-hidden">
        <div className="site-footer-inner relative mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-12">
          <div className="footer-upper">
            <div className="footer-meta">
              <p className="footer-availability"><i />Открыт к новым проектам</p>
              <p>© 2026 · Дизайн и разработка kuwito</p>
            </div>
            <nav className="footer-link-columns" aria-label="Навигация и контакты">
              <div className="footer-link-column">
                <h2>Меню</h2>
                <a href="#top">Главная</a>
                <a href="#work">Работы</a>
                <a href="#about">Обо мне</a>
                <a href="#services">Направления</a>
              </div>
              <div className="footer-link-column">
                <h2>Контакты</h2>
                <a href="#contact">Связаться</a>
                <a href="https://t.me/kuwito" target="_blank" rel="noreferrer">Telegram</a>
                <a href="https://instagram.com/kuwito" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </nav>
          </div>
          <FooterWatermark />
        </div>
      </footer>
    </main>
  )
}
