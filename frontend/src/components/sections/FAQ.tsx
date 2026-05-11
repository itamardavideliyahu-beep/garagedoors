import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apiClient } from '@/lib/api'
import { cn } from '@/lib/utils'

export function FAQ() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en') as 'en' | 'es'
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => apiClient.listFAQs(),
  })

  return (
    <section id="faq" className="section bg-ink-50/60">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-brand">{t('nav.faq')}</span>
          <h2 className="mt-3 section-title text-ink-900 text-balance">{t('faq.title')}</h2>
          <p className="mt-4 text-lg text-ink-600">{t('faq.subtitle')}</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((item, i) => {
            const open = openIndex === i
            return (
              <div
                key={i}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white transition',
                  open ? 'border-brand-300 shadow-soft' : 'border-ink-100',
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-base font-bold text-ink-900 sm:text-lg">
                    {lang === 'es' ? item.question_es : item.question_en}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-none text-ink-500 transition',
                      open && 'rotate-180 text-brand-600',
                    )}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-ink-700">
                    {lang === 'es' ? item.answer_es : item.answer_en}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
