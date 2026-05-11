import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { ServiceAreaMap } from '@/components/sections/ServiceAreaMap'
import { Stats } from '@/components/sections/Stats'
import { BeforeAfterGallery } from '@/components/sections/BeforeAfterGallery'
import { Reviews } from '@/components/sections/Reviews'
import { Brands } from '@/components/sections/Brands'
import { MaintenancePlan } from '@/components/sections/MaintenancePlan'
import { FAQ } from '@/components/sections/FAQ'
import { QuoteCalculator } from '@/components/quote/QuoteCalculator'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()
  return (
    <>
      <Hero />
      <TrustBar />
      <Brands />
      <ServicesGrid featuredOnly limit={6} />
      <Stats />
      <ServiceAreaMap />
      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="badge-brand">{t('cta.getFreeQuote')}</span>
            <h2 className="mt-3 section-title text-ink-900 text-balance">
              {t('quote.title')}
            </h2>
            <p className="mt-4 text-lg text-ink-600">{t('quote.subtitle')}</p>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2"><span className="text-brand-500">✓</span> No service-call fee when you approve the repair</li>
              <li className="flex gap-2"><span className="text-brand-500">✓</span> Same-day appointments across LA</li>
              <li className="flex gap-2"><span className="text-brand-500">✓</span> Lifetime warranty on springs we install</li>
              <li className="flex gap-2"><span className="text-brand-500">✓</span> 0% APR financing on new doors</li>
              <li className="flex gap-2"><span className="text-brand-500">✓</span> Hablamos espanol</li>
            </ul>
          </div>
          <QuoteCalculator />
        </div>
      </section>
      <BeforeAfterGallery />
      <Reviews />
      <MaintenancePlan />
      <FAQ />
    </>
  )
}
