import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AreasPage } from '@/pages/AreasPage'
import { QuotePage } from '@/pages/QuotePage'
import { GalleryPage } from '@/pages/GalleryPage'
import { ContactPage } from '@/pages/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/areas" element={<AreasPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
