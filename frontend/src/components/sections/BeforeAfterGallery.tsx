import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { apiClient, type GalleryItem } from '@/lib/api'

const FALLBACK_GRADIENTS = [
  'from-amber-400 via-orange-500 to-red-500',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-violet-400 via-purple-500 to-pink-500',
  'from-yellow-400 via-amber-500 to-orange-600',
]

export function BeforeAfterGallery() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en') as 'en' | 'es'
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => apiClient.listGallery(),
  })

  return (
    <section id="gallery" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-brand">{t('nav.gallery')}</span>
          <h2 className="mt-3 section-title text-ink-900 text-balance">
            {t('gallery.title')}
          </h2>
          <p className="mt-4 text-lg text-ink-600">{t('gallery.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                lang={lang}
                gradientClass={FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function GalleryCard({
  item,
  lang,
  gradientClass,
}: {
  item: GalleryItem
  lang: 'en' | 'es'
  gradientClass: string
}) {
  const { t } = useTranslation()
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
      {/* "After" image background (gradient fallback if no real asset). */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80`}
        aria-hidden
      />
      {/* "Before" image slides in on hover. */}
      <div className="absolute inset-0 bg-ink-800/85 transition-opacity duration-500 group-hover:opacity-0" />

      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900 opacity-100 transition group-hover:opacity-100">
        {t('gallery.before')} → {t('gallery.after')}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent p-5">
        <h3 className="font-display text-lg font-bold text-white text-balance">
          {lang === 'es' ? item.title_es : item.title_en}
        </h3>
      </div>
    </div>
  )
}
