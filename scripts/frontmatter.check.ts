// Autotest: node scripts/frontmatter.check.ts
import assert from 'node:assert/strict'
import { parseFrontmatter } from '../src/frontmatter.ts'

const a = parseFrontmatter('---\ntitle: "Hola: mundo"\ndate: 2026-10-13\ntags: [react, "vite"]\ndraft: true\n---\n# Texto\n')
assert.deepEqual(a.data, { title: 'Hola: mundo', date: '2026-10-13', tags: ['react', 'vite'], draft: true })
assert.equal(a.body, '# Texto\n')

const b = parseFrontmatter('---\r\ntitle: Windows\r\n---\r\ncuerpo')
assert.deepEqual(b.data, { title: 'Windows' })
assert.equal(b.body, 'cuerpo')

const c = parseFrontmatter('sin cabecera')
assert.deepEqual(c, { data: {}, body: 'sin cabecera' })
console.log('frontmatter ok')
