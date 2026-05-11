import { Award, Clock, ShieldCheck, Star, Zap, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const items = [
  { icon: ShieldCheck, key: 'licensed' },
  { icon: Award, key: 'bonded' },
  { icon: ShieldCheck, key: 'insured' },
  { icon: Star, key: 'bbb' },
  { icon: Clock, key: 'sameDay' },
  { icon: Wrench, key: 'warranty' },
] as const

export function TrustBar() {
  const { t } = useTranslation()
  return (
    <section className="border-y border-ink-100 bg-ink-50/60 py-5">
      <div className="container-x grid grid-cols-2 gap-y-3 text-center sm:grid-cols-3 lg:grid-cols-6">
        {items.map(({ icon: Icon, key }) => (
          <div key={key} className="flex items-center justify-center gap-2">
            <Icon className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-semibold text-ink-700">{t(`trust.${key}`)}</span>
          </div>
        ))}
      </div>
      <div className="container-x mt-3 flex items-center justify-center gap-2 text-xs text-ink-500">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        Free quote · No service-call fee · Upfront pricing
      </div>
    </section>
  )
}
