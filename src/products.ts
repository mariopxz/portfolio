export type Product = {
  id: string
  title: string
  kind: string
  desc: string
  image: string // /products/<id>.svg|png
  tags: string[]
  price: number // 0 = gratis
  // Gratis: archivo en public/downloads/ ('/downloads/x.zip') o cualquier URL.
  // De pago: URL del checkout externo (Lemon Squeezy, Polar, Gumroad…). Nunca poner archivos de pago en public/.
  url: string
  meta?: string // p. ej. 'ZIP · 1,2 MB'
}

export const products: Product[] = [
  {
    id: 'checklist-lanzamiento-web',
    title: 'Checklist: antes de lanzar tu web',
    kind: 'Checklist',
    desc: 'Los 30 puntos que conviene revisar antes de sacar una web o app al mercado, en 4 bloques: lo legal, SEO, contacto y detalles. Con casillas que se marcan en el propio PDF.',
    image: '/products/checklist-lanzamiento-web.png',
    tags: ['PDF', 'Checklist', 'Web'],
    price: 0,
    url: '/downloads/checklist-lanzamiento-web.pdf',
    meta: 'PDF · 5 págs · 72 KB',
  },
]

export const priceLabel = (p: Product) =>
  p.price === 0 ? 'Gratis' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p.price)
