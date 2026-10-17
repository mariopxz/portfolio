import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import App from './App.tsx'
import Products from './Products.tsx'
import { Layout } from './ui.tsx'

// El blog trae markdown + resaltado de código (pesado): se carga solo al abrirlo
const BlogList = lazy(() => import('./Blog.tsx').then(m => ({ default: m.BlogList })))
const BlogPost = lazy(() => import('./Blog.tsx').then(m => ({ default: m.BlogPost })))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />} />
          <Route path="products" element={<Products />} />
          <Route path="blog" element={<Suspense><BlogList /></Suspense>} />
          <Route path="blog/:slug" element={<Suspense><BlogPost /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
