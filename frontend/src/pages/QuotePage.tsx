import { QuoteCalculator } from '@/components/quote/QuoteCalculator'
import { TrustBar } from '@/components/sections/TrustBar'
import { useTranslation } from 'react-i18next'
import { Clock, ShieldCheck, Wallet } from 'lucide-react'

export function QuotePage() {
  const { t } = useTranslation()
  const perks = [
    { icon: Clock, title: '60-minute response', desc: 'Across all of LA County' },
    { icon: ShieldCheck, title: 'Lifetime spring warranty', desc: 'Risk-free repairs' },
    { icon: Wallet, title: 'No service-call fee', desc: 'When you approve the work' },
  ]
  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 py-16 text-white">
        <div className="container-x text-center">
          <span className="badge-brand">{t('cta.getFreeQuote')}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-balance sm:text-5xl">
            {t('quote.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300">{t('quote.subtitle')}</p>
        </div>
      </section>
      <TrustBar />
      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-brand-100 text-brand-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
                    <p className="text-sm text-ink-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <QuoteCalculator />
        </div>
      </section>
    </>
  )
}
