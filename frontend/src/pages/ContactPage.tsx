import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { config } from '@/lib/config'
import { formatPhone, telHref } from '@/lib/utils'
import { FAQ } from '@/components/sections/FAQ'

export function ContactPage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en') as 'en' | 'es'
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '', zip_code: '' })
  const [submitted, setSubmitted] = useState(false)

  const mutate = useMutation({
    mutationFn: apiClient.createContactLead,
    onSuccess: () => setSubmitted(true),
  })

  const update = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }))

  const canSubmit = form.full_name.length > 1 && form.phone.length >= 7 && form.message.length > 5

  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 py-16 text-white">
        <div className="container-x text-center">
          <span className="badge-brand">{t('nav.contact')}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-balance sm:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <aside className="lg:col-span-2">
            <div className="space-y-4">
              <ContactCard icon={Phone} title={t('contact.phone')}>
                <a href={telHref(config.businessPhone)} className="text-lg font-bold text-brand-600 hover:underline">
                  {formatPhone(config.businessPhone)}
                </a>
                <p className="mt-1 text-xs text-ink-500">24/7 emergency line</p>
              </ContactCard>

              <ContactCard icon={Mail} title={t('contact.email')}>
                <a href="mailto:info@lagaragedoorspro.com" className="font-semibold text-ink-900 hover:text-brand-600">
                  info@lagaragedoorspro.com
                </a>
              </ContactCard>

              <ContactCard icon={Clock} title={t('contact.hours')}>
                <p className="text-sm text-ink-700">Mon-Fri: 7am - 9pm</p>
                <p className="text-sm text-ink-700">Sat: 8am - 6pm</p>
                <p className="text-sm text-ink-700">Sun: 9am - 5pm</p>
                <p className="mt-1 text-xs font-semibold text-red-600">Emergency: 24/7</p>
              </ContactCard>

              <ContactCard icon={MapPin} title={t('contact.address')}>
                <p className="text-sm text-ink-700">Greater Los Angeles County</p>
                <p className="text-sm text-ink-700">Westside · SFV · DTLA · South Bay · SGV</p>
              </ContactCard>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink-900">
                {t('contact.formTitle')}
              </h2>
              {submitted ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-none text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-emerald-900">{t('contact.success')}</h3>
                  </div>
                </div>
              ) : (
                <form
                  className="mt-5 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!canSubmit) return
                    mutate.mutate({
                      full_name: form.full_name,
                      phone: form.phone,
                      email: form.email || undefined,
                      message: form.message,
                      zip_code: form.zip_code || undefined,
                      locale: lang,
                    })
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="c-name">{t('contact.name')}</label>
                      <input
                        id="c-name"
                        required
                        value={form.full_name}
                        onChange={(e) => update('full_name', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-phone">{t('contact.phoneField')}</label>
                      <input
                        id="c-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="c-email">{t('contact.emailField')}</label>
                      <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-zip">{t('quote.zip')}</label>
                      <input
                        id="c-zip"
                        inputMode="numeric"
                        maxLength={5}
                        value={form.zip_code}
                        onChange={(e) => update('zip_code', e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className="input"
                        placeholder="90210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="c-message">{t('contact.messageField')}</label>
                    <textarea
                      id="c-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className="input resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!canSubmit || mutate.isPending}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {mutate.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('contact.submitting')}
                      </>
                    ) : (
                      t('contact.submit')
                    )}
                  </button>
                  {mutate.isError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{t('common.error')}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  )
}

function ContactCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Phone
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-100 text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">{title}</h3>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  )
}
