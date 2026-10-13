import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Reveal, Section } from './ui'
import { band, btn, btnGo, card, ease, eyebrow, tag } from './styles'
import { aboutNotes, education, experience, languages, monoLogos, profile, projects, since, skills, softSkills } from './data'

type Day = { date: string; count: number; level: number }

const levels = ['bg-g0', 'bg-g1', 'bg-g2', 'bg-g3', 'bg-g4']

function useContributions(user: string) {
  const [days, setDays] = useState<Day[] | null>(null)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        setDays(d.contributions)
        setTotal(d.total.lastYear)
      })
      .catch(() => setError(true))
  }, [user])

  return { days, total, error }
}

function Contributions({ days, total, error }: ReturnType<typeof useContributions>) {
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)
  if (error) return <p>No se pudieron cargar las contribuciones.</p>
  if (!days) return <p aria-busy="true">Cargando contribuciones…</p>

  // Delegación: un solo manejador para los ~365 cuadrados (ratón y táctil)
  const show = (e: React.PointerEvent<HTMLElement>) => {
    const i = (e.target as HTMLElement).dataset.i
    if (i === undefined) return setTip(null)
    const d = days[+i]
    const r = (e.target as HTMLElement).getBoundingClientRect()
    const date = new Date(d.date + 'T00:00').toLocaleDateString('es-ES', { dateStyle: 'long' })
    const n = d.count === 0 ? 'Sin contribuciones' : `${d.count} ${d.count === 1 ? 'contribución' : 'contribuciones'}`
    setTip({ text: `${n} el ${date}`, x: r.left + r.width / 2, y: r.top })
  }

  // Relleno para que la primera columna empiece en domingo
  const pad = new Date(days[0].date + 'T00:00').getDay()
  return (
    <>
      <p><strong>{total}</strong> contribuciones en el último año</p>
      <div
        role="img"
        aria-label={`${total} contribuciones en el último año`}
        onPointerOver={show}
        onPointerDown={show}
        onPointerLeave={() => setTip(null)}
        onScroll={() => setTip(null)}
        className="my-3 grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto pb-2"
      >
        {Array.from({ length: pad }, (_, i) => <i key={'p' + i} className="size-3" />)}
        {days.map((d, i) => (
          <i key={d.date} data-i={i} className={`size-3 rounded-[2px] hover:outline hover:outline-2 hover:outline-line ${levels[d.level]}`} />
        ))}
      </div>
      {tip && createPortal(
        <div role="tooltip" style={{ left: Math.min(Math.max(tip.x, 100), innerWidth - 100), top: tip.y - 8 }}
          className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border-2 border-line bg-ink px-3 py-1.5 text-xs font-medium text-bg shadow-[3px_3px_0_var(--accent)]">
          {tip.text}
        </div>,
        document.body,
      )}
    </>
  )
}

export default function App() {
  const hero = useRef<HTMLElement>(null)
  const [light, setLight] = useState(false)
  const gh = useContributions(profile.github)
  const stats = [
    { value: String(projects.length), label: 'proyectos publicados' },
    { value: gh.error ? '—' : (gh.days ? String(gh.total) : '…'), label: 'contribuciones en el último año' },
    { value: `Desde ${since}`, label: 'programando' },
  ]

  // La luz del hero sigue al puntero (solo ratón/lápiz; en táctil queda apagada)
  const move = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const r = hero.current!.getBoundingClientRect()
    hero.current!.style.setProperty('--sx', `${e.clientX - r.left}px`)
    hero.current!.style.setProperty('--sy', `${e.clientY - r.top}px`)
    setLight(true)
  }

  return (
    <>
    <section id="top" ref={hero} onPointerMove={move} onPointerLeave={() => setLight(false)}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pb-12 pt-24">
      <div aria-hidden className="animate-grid pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px),linear-gradient(var(--grid-fine)_1px,transparent_1px),linear-gradient(90deg,var(--grid-fine)_1px,transparent_1px)] [background-size:58px_58px,58px_58px,29px_29px,29px_29px] [mask-image:linear-gradient(#000_0%,#000_55%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_6%,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_40%)]" />
      <div aria-hidden style={{ opacity: light ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 [background:radial-gradient(circle_240px_at_var(--sx,50%)_var(--sy,42%),color-mix(in_srgb,var(--accent)_32%,transparent)_0%,color-mix(in_srgb,var(--accent)_10%,transparent)_50%,transparent_76%)]" />
      <div className="relative mx-auto w-full max-w-2xl px-5">
        <p className={`${eyebrow} flex max-w-[22.5rem] items-center gap-3 text-[11px] after:h-px after:flex-1 after:bg-line/25`}>Terrassa, Barcelona</p>
        <h1 className="mt-6 text-[clamp(4.5rem,17vw,8.5rem)] font-bold uppercase leading-[.9] tracking-tighter">Mario<br />López</h1>
        <p className="mt-6 text-[clamp(1.5rem,3.6vw,2.4rem)] leading-[1.15] tracking-tight">
          {profile.role} que construye aplicaciones web con <b className="font-bold">React y Node.js</b>, con código limpio y una interfaz cuidada.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a className={`${btn} group relative isolate !inline-flex items-center gap-3 overflow-hidden !py-1.5 !pr-1.5 text-sm before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-ink before:transition-transform before:duration-300 ${ease} before:ease-[cubic-bezier(.16,1,.3,1)] hover:text-bg focus-visible:text-bg hover:before:scale-x-100 focus-visible:before:scale-x-100 motion-reduce:before:transition-none`} href="#work">
            Ver proyectos
            <span aria-hidden className="grid size-7 place-items-center rounded-full bg-accent text-accent-ink">→</span>
          </a>
          <a className="rounded-full border-[1.5px] border-dashed border-line/40 px-4 py-2 text-sm text-muted no-underline hover:bg-surface" href="#contact">Contacto</a>
        </div>
        <ul className="relative mt-14 flex flex-wrap gap-x-9 gap-y-4 border-t-[1.5px] border-line/20 pt-6">
          <li aria-hidden className="pointer-events-none absolute inset-x-0 -top-[58px] h-14">
            <div className="animate-walk absolute bottom-0 h-7 w-12">
            <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 bg-ink/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-bg">fred</span>
            <svg viewBox="0 0 12 7" shapeRendering="crispEdges" className="animate-flip size-full [filter:drop-shadow(0_0_.6px_var(--ink))]">
              <g className="fill-accent">
                <rect x="2" y="0" width="8" height="5" />
                <rect x="0" y="2" width="2" height="2" />
                <rect x="10" y="2" width="2" height="2" />
              </g>
              <g className="fill-accent-ink"><rect x="3" y="1" width="1" height="2" /><rect x="6" y="1" width="1" height="2" /></g>
              <g className="animate-leg-a fill-accent"><rect x="3" y="5" width="1" height="2" /><rect x="8" y="5" width="1" height="2" /><rect x="4" y="5" width="1" height="1" /><rect x="7" y="5" width="1" height="1" /></g>
              <g className="animate-leg-b fill-accent"><rect x="4" y="5" width="1" height="2" /><rect x="7" y="5" width="1" height="2" /><rect x="3" y="5" width="1" height="1" /><rect x="8" y="5" width="1" height="1" /></g>
            </svg>
            </div>
          </li>
          {stats.map(s => (
            <li key={s.label}><strong className="block text-3xl font-bold leading-none tracking-tight">{s.value}</strong><span className="mt-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">{s.label}</span></li>
          ))}
        </ul>
      </div>
    </section>

    <Section id="about" eyebrow="Sobre mí" title="¡Hola!" tint={`${band} bg-surface`}>
      <div className="grid items-start gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
        <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[14px] border-2 border-line bg-bg shadow-[8px_8px_0_var(--ink)]">
          {profile.photo
            ? <img src={profile.photo} alt={profile.name} className="size-full object-cover" />
            : <div aria-label="Aquí irá tu foto" role="img" className="grid size-full place-items-center bg-[repeating-linear-gradient(-45deg,transparent_0_14px,var(--g0)_14px_15px)] text-6xl font-bold text-muted">M.</div>}
        </div>
        <div>
          <p className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-medium leading-snug tracking-tight">{profile.about}</p>
          <div className="mt-7 grid gap-4 text-muted">{aboutNotes.map(n => <p key={n}>{n}</p>)}</div>
        </div>
      </div>
    </Section>

    <Section id="skills" eyebrow="Toolbox" title="Con qué construyo" tint={`${band} bg-line/10`}>
      <div className="grid gap-1.5">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="grid items-start gap-3 border-t-[1.5px] border-line/15 py-4 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-6">
            <h3 className="text-xs font-medium uppercase tracking-[.14em] text-muted">{group}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map(([name, logo]) => (
                <li key={name} className={`inline-flex items-center gap-2 rounded-lg border-[1.5px] border-line/25 bg-surface py-1.5 pl-2 pr-3 text-sm transition duration-200 ${ease} hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 motion-reduce:transition-none sm:text-[.9375rem]`}>
                  <img src={`/logos/${logo}.svg`} alt="" width={28} height={28} className={`size-7 ${monoLogos.includes(logo) ? '[[data-theme=dark]_&]:invert' : ''}`} />{name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>

    <Section id="experience" eyebrow="Experiencia" title="Dónde he trabajado" tint={`${band} bg-surface`}>
      <ol className="grid gap-6">
        {experience.map((e, i) => (
          <li key={e.company} className={card}>
            <p className={eyebrow}>0{i + 1} / {e.period} · {e.place}</p>
            <h3 className="mt-1 text-2xl font-bold">{e.role}</h3>
            <p className="font-medium text-muted">{e.company}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">{e.points.map(t => <li key={t}>{t}</li>)}</ul>
            {e.stack.length > 0 && <ul className="mt-4 flex flex-wrap gap-2">{e.stack.map(s => <li className={tag} key={s}>{s}</li>)}</ul>}
          </li>
        ))}
      </ol>
    </Section>

    <Section id="work" eyebrow="Proyectos" title="Cosas que merece la pena abrir" tint={`${band} bg-line/10`}>
      <div className="grid gap-16 sm:gap-24">
        {projects.map((p, i) => (
          <article key={p.title} className="grid items-center gap-6 md:grid-cols-[1.05fr_.95fr] md:gap-16">
            <a href={p.demo ?? p.code} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden
              className="block aspect-[16/10] overflow-hidden rounded-[14px] border-2 border-line bg-surface p-2 shadow-[8px_8px_0_var(--ink)] transition duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[11px_11px_0_var(--ink)] motion-reduce:transition-none sm:p-3 md:order-2">
              <img src={p.image} alt="" loading="lazy" className="size-full rounded-md object-cover object-top" />
            </a>
            <div>
              <p className="text-[.8125rem] tracking-widest text-muted">0{i + 1} / {p.year} · {p.kind}</p>
              <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h3>
              <p className="mt-2 text-lg text-muted">{p.tag}</p>
              <p className="mt-4 max-w-[46ch] text-muted">{p.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">{p.stack.map(t => <li className="rounded-lg border-[1.5px] border-line/30 px-2.5 py-1 text-[.8125rem] text-muted" key={t}>{t}</li>)}</ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {p.demo && <a className={btnGo} href={p.demo} target="_blank" rel="noreferrer">Ver demo →</a>}
                {p.code && <a className={btn} href={p.code} target="_blank" rel="noreferrer">Código →</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>

    <Section id="education" eyebrow="Formación" title="Dónde he aprendido" tint={`${band} bg-surface`}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ol className="grid gap-4">
          {education.map(e => (
            <li key={e.title + e.period} className={card}>
              <p className={eyebrow}>{e.period} · {e.place}</p>
              <h3 className="mt-1 text-lg font-bold">{e.title}</h3>
              <p className="text-muted">{e.school}</p>
            </li>
          ))}
        </ol>
        <div className={`${card} self-start`}>
          <h3 className="text-xs font-medium uppercase tracking-[.14em] text-muted">Idiomas</h3>
          <ul className="mb-5 mt-2">{languages.map(([l, n]) => <li key={l}><strong>{l}</strong> · {n}</li>)}</ul>
          <h3 className="text-xs font-medium uppercase tracking-[.14em] text-muted">Competencias</h3>
          <ul className="mt-2 flex flex-wrap gap-2">{softSkills.map(s => <li className={tag} key={s}>{s}</li>)}</ul>
        </div>
      </div>
    </Section>

    <Section id="github" eyebrow="GitHub" title="Mi actividad" tint={`${band} bg-line/10`}>
      <div className={card}>
        <Contributions {...gh} />
        <a className="font-medium" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">@{profile.github} →</a>
      </div>
    </Section>

    <section id="contact" className="border-t-[1.5px] border-line/20 [background:radial-gradient(circle_at_8%_6%,color-mix(in_srgb,var(--accent)_26%,transparent),transparent_42%),radial-gradient(circle_at_92%_100%,color-mix(in_srgb,var(--surface)_80%,transparent),transparent_40%),color-mix(in_srgb,var(--ink)_14%,var(--bg))]">
      <Reveal className="mx-auto max-w-2xl px-5 py-20 sm:py-28">
        <h2 className="text-[clamp(3rem,9vw,5.5rem)] font-bold leading-[.95] tracking-tighter">Construyamos algo.</h2>
        <p className="mt-6 max-w-md text-muted">Disponible para proyectos y colaboraciones. La forma más rápida de contactarme es el correo.</p>
        <a href={`mailto:${profile.email}`} className="mt-8 inline-block break-all text-xl font-medium underline decoration-accent decoration-2 underline-offset-[10px] sm:text-2xl">{profile.email}</a>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[['GitHub', `https://github.com/${profile.github}`], ['LinkedIn', profile.linkedin]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className={`rounded-full border-[1.5px] border-line bg-surface px-4 py-1.5 text-sm font-medium no-underline transition duration-150 ${ease} hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink motion-reduce:transition-none`}>
              {label} ↗
            </a>
          ))}
        </div>
      </Reveal>
    </section>
    </>
  )
}
