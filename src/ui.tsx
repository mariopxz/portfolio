import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { profile } from './data'
import { btn, btnIcon, ease, eyebrow, links, pages } from './styles'


// Scroll animado (ease in-out) para los enlaces #ancla; se cancela si el usuario hace scroll
function smoothAnchors() {
  let raf = 0
  const stop = () => cancelAnimationFrame(raf)
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
    const target = a && document.getElementById(a.hash.slice(1))
    if (!a || !target || e.defaultPrevented || e.metaKey || e.ctrlKey) return
    e.preventDefault()
    history.replaceState(null, '', a.hash)
    const from = scrollY
    const to = a.hash === '#top' ? 0 : target.getBoundingClientRect().top + from - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
    const dist = to - from
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduce ? 0 : Math.min(1500, 600 + Math.abs(dist) * 0.2)
    const t0 = performance.now()
    stop()
    const step = (now: number) => {
      const t = dur ? Math.min((now - t0) / dur, 1) : 1
      scrollTo(0, from + dist * (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }
  document.addEventListener('click', onClick)
  addEventListener('wheel', stop, { passive: true })
  addEventListener('touchstart', stop, { passive: true })
  return () => {
    stop()
    document.removeEventListener('click', onClick)
    removeEventListener('wheel', stop)
    removeEventListener('touchstart', stop)
  }
}

// Cursor propio (solo con ratón): punto de tinta; amarillo y más grande sobre lo clicable
function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = dot.current!
    const root = document.documentElement
    root.classList.add('custom-cursor')
    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      el.dataset.hot = String(!!(e.target as Element).closest('a, button, [role="button"], summary, label'))
      el.dataset.on = '1'
    }
    const leave = () => (el.dataset.on = '0')
    addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('custom-cursor')
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])
  return (
    <div ref={dot} aria-hidden data-on="0" data-hot="false"
      className="group pointer-events-none fixed left-0 top-0 z-[100] data-[on=0]:opacity-0 motion-reduce:transition-none">
      <div className="-ml-1 -mt-1 size-2 rounded-full bg-ink transition-[width,height,margin,background-color] duration-150 group-data-[hot=true]:-ml-2 group-data-[hot=true]:-mt-2 group-data-[hot=true]:size-2.5 group-data-[hot=true]:bg-accent group-data-[hot=true]:shadow-[0_0_0_1.5px_var(--ink)]" />
    </div>
  )
}

function useTheme() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme ?? 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))] as const
}

// Aparece con fade + subida al entrar en pantalla (sin movimiento si el usuario lo reduce)
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.12 })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition duration-700 ${ease} motion-reduce:transition-none ${seen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'} ${className}`}>
      {children}
    </div>
  )
}

export function Section({ id, eyebrow: label, title, tint, children }: { id: string; eyebrow: string; title: string; tint?: string; children: ReactNode }) {
  return (
    <section id={id} className={tint}>
      <Reveal className="mx-auto max-w-[1180px] px-5 py-16 sm:py-24">
        <div className="mb-10 sm:mb-14">
          <p className={`${eyebrow} flex items-center gap-3 after:h-0.5 after:flex-1 after:bg-line/20`}>{label}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
        </div>
        {children}
      </Reveal>
    </section>
  )
}

// Enlace a una sección de la home: ancla en la home, Link con hash desde otras rutas
function Anchor({ id, className, onClick, children }: { id: string; className?: string; onClick?: () => void; children: ReactNode }) {
  const home = useLocation().pathname === '/'
  return home
    ? <a href={`#${id}`} className={className} onClick={onClick}>{children}</a>
    : <Link to={id === 'top' ? '/' : { pathname: '/', hash: id }} className={className} onClick={onClick}>{children}</Link>
}

// Cabecera, menú móvil, pie y botón de volver arriba; las páginas se pintan en <Outlet />
export function Layout() {
  const [theme, toggle] = useTheme()
  const dark = theme === 'dark'
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)
  useEffect(smoothAnchors, [])

  // Cambio de ruta: ir a la ancla de la URL o, si no hay, arriba del todo
  useEffect(() => {
    const changed = prevPath.current !== pathname
    prevPath.current = pathname
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else if (changed) scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [menu])

  useEffect(() => {
    const on = () => setScrolled(scrollY > 400)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-bg font-sans leading-relaxed text-ink">
      <Cursor />
      <a className="absolute -left-[999px] z-[80] bg-accent px-4 py-2 text-accent-ink focus:left-0" href="#main">
        Saltar al contenido
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-line bg-bg">
        <div className="flex items-center gap-3 px-5 py-2 sm:px-12">
          <Anchor id="top" className="mr-auto grid size-8 place-items-center rounded-lg border-2 border-line bg-accent text-xs font-bold text-accent-ink no-underline">ML</Anchor>
          <nav aria-label="Principal" className="mr-2 hidden gap-5 text-[13px] text-muted lg:flex">
            {links.filter(([id]) => id !== 'contact').map(([id, label]) => (
              <Anchor key={id} id={id} className="py-1 no-underline hover:text-ink hover:underline">{label}</Anchor>
            ))}
            {pages.map(([to, label]) => {
              const on = pathname === to || pathname.startsWith(to + '/')
              return <Link key={to} to={to} aria-current={on ? 'page' : undefined} className={`py-1 no-underline hover:text-ink hover:underline ${on ? 'font-bold text-ink' : ''}`}>{label}</Link>
            })}
          </nav>
          <button className={btnIcon} onClick={toggle}
            aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            {dark ? '☀' : '☾'}
          </button>
          <Anchor id="contact" className={`${btn} max-lg:!hidden !px-4 !py-1 text-[13px]`}>Contacto</Anchor>
          <button className={`${btnIcon} lg:!hidden`} onClick={() => setMenu(true)}
            aria-label="Abrir menú" aria-expanded={menu} aria-controls="drawer">
            <span aria-hidden className="block w-4 space-y-[3px]">
              <i className="block h-0.5 bg-ink" /><i className="block h-0.5 bg-ink" /><i className="block h-0.5 bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Menú lateral solo en móvil */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${menu ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none ${menu ? 'opacity-100' : 'opacity-0'}`} />
        <aside id="drawer" inert={!menu} aria-label="Menú"
          className={`absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto overscroll-contain border-l-2 border-line bg-bg p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${ease} motion-reduce:transition-none ${menu ? 'translate-x-0' : 'translate-x-full'}`}>
          <button className={`${btnIcon} ml-auto`} onClick={() => setMenu(false)} aria-label="Cerrar menú">✕</button>
          <nav aria-label="Móvil" className="mt-4 flex flex-col">
            {links.map(([id, label], i) => (
              <Anchor key={id} id={id} onClick={() => setMenu(false)}
                className="border-b-[1.5px] border-line/15 py-[clamp(.5rem,1.9svh,1rem)] text-[clamp(1.25rem,3.8svh,1.875rem)] font-bold leading-tight no-underline hover:text-muted">
                <span className={`${eyebrow} mr-3`}>0{i + 1}</span>{label}
              </Anchor>
            ))}
            {pages.map(([to, label], i) => (
              <Link key={to} to={to} onClick={() => setMenu(false)}
                className="border-b-[1.5px] border-line/15 py-[clamp(.5rem,1.9svh,1rem)] text-[clamp(1.25rem,3.8svh,1.875rem)] font-bold leading-tight no-underline hover:text-muted">
                <span className={`${eyebrow} mr-3`}>0{links.length + 1 + i}</span>{label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <main id="main" className="flex-1"><Outlet /></main>

      <footer className="border-t-[1.5px] border-line/20 bg-[color-mix(in_srgb,var(--ink)_14%,var(--bg))] text-[.8125rem] text-muted">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-between gap-x-6 gap-y-2 px-5 py-6">
          <span>{profile.name} · Terrassa, Barcelona</span>
          <span>Gracias por llegar hasta el final :)</span>
        </div>
      </footer>

      {/* Solo móvil y tablet; aparece al hacer scroll */}
      <a href="#top" aria-label="Volver arriba" tabIndex={scrolled ? 0 : -1}
        className={`fixed bottom-4 right-4 z-[70] grid size-12 place-items-center rounded-full border-2 border-line bg-surface text-lg text-ink no-underline shadow-[3px_3px_0_var(--ink)] transition duration-300 ${ease} hover:bg-accent hover:text-accent-ink motion-reduce:transition-none lg:hidden ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2.5 opacity-0'}`}>
        ↑
      </a>
    </div>
  )
}
