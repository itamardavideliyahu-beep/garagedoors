import { useQuery } from '@tanstack/react-query'
import { Star, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apiClient, type Review } from '@/lib/api'

export function Reviews() {
  const { t } = useTranslation()
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', 'featured'],
    queryFn: () => apiClient.listReviews(12, true),
  })

  return (
    <section id="reviews" className="section bg-gradient-to-br from-ink-50 to-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-brand">{t('nav.reviews')}</span>
          <h2 className="mt-3 section-title text-ink-900 text-balance">
            {t('reviews.title')}
          </h2>
          <p className="mt-4 text-lg text-ink-600">{t('reviews.subtitle')}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-ink-900">4.9/5</span>
            <span className="text-ink-500">· 1,247 verified reviews</span>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const { t } = useTranslation()
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
      <div className="flex items-center gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      {review.title && (
        <h4 className="mt-3 font-display text-lg font-bold text-ink-900">{review.title}</h4>
      )}
      <p className="mt-2 flex-1 text-sm text-ink-700">{review.comment}</p>
      <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white">
          {review.customer_name.charAt(0)}
        </div>
        <div className="text-sm">
          <div className="font-semibold text-ink-900">{review.customer_name}</div>
          <div className="text-xs text-ink-500">
            {review.customer_location} · {t('reviews.verified')}
          </div>
        </div>
      </div>
    </article>
  )
}
