import { useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Link, Navigate, useParams } from 'react-router'
import { Section } from './ui'
import { btn, card, eyebrow, tag } from './styles'
import { formatDate, getPost, posts, type Post } from './posts'

function useTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => { document.title = prev }
  }, [title])
}

// Portada: la imagen de la entrada o, si no tiene, un bloque con rayas, número y etiqueta
function Cover({ post, n, className = '' }: { post: Post; n: number; className?: string }) {
  if (post.cover) return <img src={post.cover} alt="" loading="lazy" className={`object-cover ${className}`} />
  return (
    <div aria-hidden className={`relative grid place-items-center overflow-hidden bg-[repeating-linear-gradient(-45deg,transparent_0_14px,var(--g0)_14px_15px)] ${n % 2 ? 'bg-surface' : 'bg-accent text-accent-ink'} ${className}`}>
      <span className="text-[clamp(4.5rem,12vw,8rem)] font-bold leading-none tracking-tighter">{String(n).padStart(2, '0')}</span>
      {post.tags[0] && <span className="absolute bottom-3 left-3 rounded-full border-2 border-line bg-bg px-3 py-0.5 font-mono text-xs uppercase tracking-widest text-ink">{post.tags[0]}</span>}
    </div>
  )
}

const more = <span className="ml-auto font-medium"><span className="inline-block transition-transform duration-200 group-hover:translate-x-1">Leer →</span></span>

export function BlogList() {
  useTitle('Blog — Mario López')
  const [first, ...rest] = posts
  return (
    <Section id="top" eyebrow="Blog" title="Notas sobre desarrollo" tint="min-h-[70svh] border-b-2 border-line pt-8">
      <div className="-mt-6 mb-12 flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="max-w-xl text-lg text-muted">Apuntes sobre desarrollo web: lo que voy aprendiendo, decisiones y errores por el camino.</p>
        {posts.length > 0 && <span className="rounded-full border-2 border-line bg-surface px-3 py-0.5 font-mono text-xs uppercase tracking-widest">{posts.length} {posts.length === 1 ? 'entrada' : 'entradas'}</span>}
      </div>

      {posts.length === 0 && <p className="text-muted">Todavía no hay entradas. Vuelve pronto.</p>}

      {first && (
        <Link to={`/blog/${first.slug}`} className={`${card} group mb-8 grid overflow-hidden !p-0 no-underline md:grid-cols-[1.1fr_.9fr]`}>
          <Cover post={first} n={posts.length} className="aspect-[16/10] border-b-2 border-line md:aspect-auto md:min-h-80 md:border-b-0 md:border-r-2" />
          <div className="flex flex-col p-6 sm:p-8">
            <span className="mb-4 w-fit rounded-full border-2 border-line bg-accent px-3 py-0.5 text-xs font-bold text-accent-ink">Última entrada</span>
            <p className={eyebrow}>{formatDate(first.date)} · {first.minutes} min de lectura</p>
            <h3 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{first.title}</h3>
            {first.description && <p className="mt-3 text-muted">{first.description}</p>}
            <ul className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              {first.tags.map(t => <li className={tag} key={t}>{t}</li>)}
              <li className="ml-auto font-medium">{more}</li>
            </ul>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))] gap-8">
        {rest.map((p, i) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className={`${card} group flex flex-col overflow-hidden !p-0 no-underline`}>
            <Cover post={p} n={posts.length - 1 - i} className="aspect-[16/9] border-b-2 border-line" />
            <div className="flex flex-1 flex-col p-5">
              <p className={eyebrow}>{formatDate(p.date)} · {p.minutes} min</p>
              <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight">{p.title}</h3>
              {p.description && <p className="mt-2 line-clamp-3 text-muted">{p.description}</p>}
              <ul className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                {p.tags.map(t => <li className={tag} key={t}>{t}</li>)}
                <li className="ml-auto">{more}</li>
              </ul>
            </div>
          </Link>
        ))}

      </div>
    </Section>
  )
}

export function BlogPost() {
  const post = getPost(useParams().slug)
  useTitle(post ? `${post.title} — Mario López` : 'Blog — Mario López')
  if (!post) return <Navigate to="/blog" replace />
  return (
    <article id="top" className="mx-auto max-w-2xl px-5 pb-24 pt-28 sm:pt-36">
      <Link to="/blog" className={`${btn} mb-10 !px-4 !py-1 text-sm`}>← Todas las entradas</Link>
      <p className={eyebrow}>{formatDate(post.date)} · {post.minutes} min de lectura</p>
      <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tighter sm:text-6xl">{post.title}</h1>
      {post.tags.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{post.tags.map(t => <li className={tag} key={t}>{t}</li>)}</ul>}
      {post.cover && <img src={post.cover} alt="" className="mt-8 w-full rounded-[14px] border-2 border-line shadow-[6px_6px_0_var(--ink)]" />}
      <div className="prose mt-10 max-w-none">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}
          components={{ a: ({ href = '', children }) => href.startsWith('/') ? <Link to={href}>{children}</Link> : <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a> }}>{post.body}</Markdown>
      </div>
    </article>
  )
}
