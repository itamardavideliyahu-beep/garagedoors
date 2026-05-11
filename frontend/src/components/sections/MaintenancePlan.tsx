import { Link } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MaintenancePlan() {
  const { t } = useTranslation()
  const features = [
    t('maintenance.feature1'),
    t('maintenance.feature2'),
    t('maintenance.feature3'),
    t('maintenance.feature4'),
    t('maintenance.feature5'),
  ]

  return (
    <section className="section">
      <div className="container-x">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 p-1 shadow-soft">
          <div className="grid gap-0 rounded-[22px] bg-gradient-to-br from-ink-900 to-ink-950 p-8 text-white lg:grid-cols-2 lg:gap-10 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-300">
                <Sparkles className="h-3.5 w-3.5" />
                Membership
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold lg:text-4xl text-balance">
                {t('maintenance.title')}
              </h2>
              <p className="mt-3 text-ink-300">{t('maintenance.subtitle')}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold text-brand-400">$149</span>
                <span className="text-sm text-ink-400">/{t('common.perYear').replace('per ', '')}</span>
              </div>
              <Link to="/quote" className="btn-primary mt-6">
                {t('maintenance.cta')}
              </Link>
            </div>

            <ul className="space-y-3 self-center">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="grid h-6 w-6 flex-none place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-ink-200">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
