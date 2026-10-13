import { parseFrontmatter } from './frontmatter'

export type Post = { slug: string; title: string; date: string; description: string; tags: string[]; cover?: string; body: string; minutes: number }

const files = import.meta.glob('./content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

// Entradas publicadas (sin `draft: true`), la más reciente primero
export const posts: Post[] = Object.entries(files)
  .flatMap(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    if (data.draft === true) return []
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    return [{
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      description: String(data.description ?? ''),
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover ? String(data.cover) : undefined,
      body,
      minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    }]
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug?: string) => posts.find(p => p.slug === slug)

export const formatDate = (d: string) => (d ? new Date(d + 'T00:00').toLocaleDateString('es-ES', { dateStyle: 'long' }) : '')
