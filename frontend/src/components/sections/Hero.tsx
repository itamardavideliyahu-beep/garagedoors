import { Link } from 'react-router-dom'
import { ArrowRight, Award, Clock, Phone, ShieldCheck, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { config } from '@/lib/config'
import { siteConfig } from '@/lib/siteConfig'
import { formatPhone, telHref } from '@/lib/utils'

export function Hero() {
  const { t } = useTranslation()

  const stats = [
    { value: t('hero.stat1'), label: t('hero.stat1Label') },
    { value: t('hero.stat2'), label: t('hero.stat2Label') },
    { value: t('hero.stat3'), label: t('hero.stat3Label') },
    { value: t('hero.stat4'), label: t('hero.stat4Label') },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 text-white">
      <div className="absolute inset-0 hero-grid opacity-30" aria-hidden />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-700/20 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-12 lg:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-300">
            <Clock className="h-3.5 w-3.5" />
            {siteConfig.heroBadge}
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {t('hero.titleBefore')}{' '}
            <span className="text-brand-400">{siteConfig.heroAccent}</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-ink-200 sm:text-xl">
            {siteConfig.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/quote" className="btn-primary text-base">
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={telHref(config.businessPhone)}
              className="btn border-2 border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/10 focus:ring-white/10"
            >
              <Phone className="h-5 w-5" />
              {t('hero.ctaSecondary', { phone: formatPhone(config.businessPhone) })}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              {t('trust.licensed')} · {t('trust.bonded')} · {t('trust.insured')}
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" />
              {t('trust.bbb')}
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
            <span className="flex items-center gap-1.5">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                {t('hero.stat4')} · {t('hero.stat4Label')}
              </span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur lg:p-8">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <div className="font-display text-3xl font-extrabold text-brand-300">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-300">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-soft">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-100">
                {t('common.from')} $89
              </div>
              <div className="mt-1 font-display text-2xl font-bold">25-Point Tune-Up</div>
              <p className="mt-1 text-sm text-brand-50">
                Annual maintenance to prevent emergency repairs.
              </p>
              <Link
                to="/services"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white underline-offset-2 hover:underline"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
