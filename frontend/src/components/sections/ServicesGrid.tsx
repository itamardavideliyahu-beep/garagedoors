import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlignLeft,
  ArrowRight,
  Building2,
  ClipboardCheck,
  Cog,
  Cpu,
  Home,
  Layers,
  Link as LinkIcon,
  Siren,
  Wrench,
} from 'lucide-react'
import { apiClient, type Service } from '@/lib/api'
import { cn, formatCurrency } from '@/lib/utils'

const ICON_MAP: Record<string, typeof Wrench> = {
  spring: Cog,
  cpu: Cpu,
  'align-left': AlignLeft,
  layers: Layers,
  home: Home,
  'clipboard-check': ClipboardCheck,
  link: LinkIcon,
  siren: Siren,
  building: Building2,
  wrench: Wrench,
}

type Props = {
  featuredOnly?: boolean
  limit?: number
  showCta?: boolean
}

export function ServicesGrid({ featuredOnly = false, limit, showCta = true }: Props) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en') as 'en' | 'es'

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.listServices(),
  })

  const filtered = (featuredOnly ? services.filter((s) => s.is_featured) : services).slice(
    0,
    limit ?? 99,
  )

  return (
    <section id="services" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-brand">{t('nav.services')}</span>
          <h2 className="mt-3 section-title text-ink-900 text-balance">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-ink-600">{t('services.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} lang={lang} />
            ))}
          </div>
        )}

        {showCta && (
          <div className="mt-10 text-center">
            <Link to="/services" className="btn-outline">
              {t('services.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function ServiceCard({ service, lang }: { service: Service; lang: 'en' | 'es' }) {
  const { t } = useTranslation()
  const Icon = ICON_MAP[service.icon] || Wrench
  return (
    <Link
      to="/quote"
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft',
        service.is_emergency && 'ring-1 ring-red-100',
      )}
    >
      {service.is_emergency && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
          <Siren className="h-3 w-3" />
          {t('services.emergency')}
        </span>
      )}
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-500 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
        {lang === 'es' ? service.name_es : service.name_en}
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-600">
        {lang === 'es' ? service.description_es : service.description_en}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-400">
            {t('services.startsAt')}
          </div>
          <div className="font-display text-xl font-bold text-brand-600">
            {formatCurrency(service.starts_at_price)}
          </div>
        </div>
        <div className="text-xs text-ink-500">
          {t('services.duration', { minutes: service.duration_min })}
        </div>
      </div>
    </Link>
  )
}
