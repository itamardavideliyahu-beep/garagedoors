import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { Brands } from '@/components/sections/Brands'
import { TrustBar } from '@/components/sections/TrustBar'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Phone } from 'lucide-react'
import { config } from '@/lib/config'
import { formatPhone, telHref } from '@/lib/utils'

export function ServicesPage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 py-16 text-white">
        <div className="container-x text-center">
          <span className="badge-brand">{t('nav.services')}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-balance sm:text-5xl">
            {t('services.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300">{t('services.subtitle')}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quote" className="btn-primary">
              {t('cta.getFreeQuote')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={telHref(config.businessPhone)}
              className="btn border-2 border-white/30 bg-white/5 text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              {formatPhone(config.businessPhone)}
            </a>
          </div>
        </div>
      </section>
      <TrustBar />
      <ServicesGrid showCta={false} />
      <Brands />
    </>
  )
}
