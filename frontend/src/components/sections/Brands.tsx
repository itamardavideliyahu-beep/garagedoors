import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { apiClient } from '@/lib/api'

export function Brands() {
  const { t } = useTranslation()
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => apiClient.listBrands(),
  })

  return (
    <section className="border-y border-ink-100 bg-white py-12">
      <div className="container-x">
        <div className="text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
            {t('brands.title')}
          </h3>
        </div>
        <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((b) => (
            <div
              key={b.name}
              className="font-display text-lg font-bold text-ink-400 grayscale transition hover:text-ink-700 hover:grayscale-0"
              title={b.name}
            >
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
