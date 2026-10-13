// shortcut: solo `clave: valor` planos y listas en una línea `[a, b]`; si necesitas YAML anidado, cambia a una librería
export function parseFrontmatter(raw: string): { data: Record<string, string | string[] | boolean>; body: string } {
  const m = (raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data: Record<string, string | string[] | boolean> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (!kv) continue
    const v = kv[2].trim().replace(/^(["'])(.*)\1$/, '$2')
    const list = v.match(/^\[(.*)\]$/)
    data[kv[1]] = list ? list[1].split(',').map(s => s.trim().replace(/^(["'])(.*)\1$/, '$2')).filter(Boolean) : v === 'true' ? true : v === 'false' ? false : v
  }
  return { data, body: m[2] }
}
