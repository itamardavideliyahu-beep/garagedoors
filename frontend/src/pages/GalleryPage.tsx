import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery'
import { Reviews } from '@/components/sections/Reviews'
import { useTranslation } from 'react-i18next'

export function GalleryPage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 py-16 text-white">
        <div className="container-x text-center">
          <span className="badge-brand">{t('nav.gallery')}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-balance sm:text-5xl">
            {t('gallery.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300">{t('gallery.subtitle')}</p>
        </div>
      </section>
      <BeforeAfterGallery />
      <Reviews />
    </>
  )
}
