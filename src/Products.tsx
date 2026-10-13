import { useEffect } from 'react'
import { Link } from 'react-router'
import { Section } from './ui'
import { btn, btnGo, card, eyebrow, tag } from './styles'
import { priceLabel, products } from './products'

export default function Products() {
  useEffect(() => {
    const title = document.title
    document.title = 'Productos — Mario López'
    return () => { document.title = title }
  }, [])

  return (
    <>
      <Section id="top" eyebrow="Productos" title="Productos digitales" tint="min-h-[70svh] border-b-2 border-line pt-8">
        <p className="-mt-6 mb-12 max-w-xl text-lg text-muted">Plantillas, componentes y recursos que he hecho para mis propios proyectos. De momento son gratis: descárgalos y úsalos como quieras.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))] gap-8">
          {products.map(p => {
            const free = p.price === 0
            const local = p.url.startsWith('/')
            return (
              <article key={p.id} className={`${card} flex flex-col overflow-hidden !p-0`}>
                <div className="relative aspect-[16/10] border-b-2 border-line bg-bg">
                  <img src={p.image} alt="" loading="lazy" className="size-full object-cover" />
                  <span className="absolute right-3 top-3 rounded-full border-2 border-line bg-accent px-3 py-0.5 text-sm font-bold text-accent-ink">{priceLabel(p)}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className={eyebrow}>{p.kind}{p.meta && ` · ${p.meta}`}</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">{p.tags.map(t => <li className={tag} key={t}>{t}</li>)}</ul>
                  <div className="mt-auto pt-6">
                    <a className={btnGo} href={p.url} {...(free && local ? { download: true } : { target: '_blank', rel: 'noreferrer' })}>
                      {free ? 'Descargar ↓' : 'Comprar →'}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <Link to="/" className={`${btn} mt-12`}>← Volver al portfolio</Link>
      </Section>
    </>
  )
}
