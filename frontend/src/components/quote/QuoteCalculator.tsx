import { useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wrench,
} from 'lucide-react'
import {
  apiClient,
  type LeadSubmitRequest,
  type QuoteRequest,
  type QuoteResponse,
} from '@/lib/api'
import { cn, formatCurrency } from '@/lib/utils'

type DoorType = QuoteRequest['door_type']
type Material = QuoteRequest['door_material']

const DOOR_TYPES: { value: DoorType; key: string; emoji: string }[] = [
  { value: 'single', key: 'quote.doorType.single', emoji: '🚪' },
  { value: 'double', key: 'quote.doorType.double', emoji: '🚙' },
  { value: 'commercial', key: 'quote.doorType.commercial', emoji: '🏭' },
]

const MATERIALS: { value: Material; key: string }[] = [
  { value: 'steel', key: 'quote.material.steel' },
  { value: 'aluminum', key: 'quote.material.aluminum' },
  { value: 'wood', key: 'quote.material.wood' },
  { value: 'fiberglass', key: 'quote.material.fiberglass' },
  { value: 'vinyl', key: 'quote.material.vinyl' },
  { value: 'unknown', key: 'quote.material.unknown' },
]

const ISSUES: { value: string; key: string; icon: string }[] = [
  { value: 'spring_broken', key: 'quote.issue.spring_broken', icon: '🔧' },
  { value: 'opener_failure', key: 'quote.issue.opener_failure', icon: '⚙️' },
  { value: 'off_track', key: 'quote.issue.off_track', icon: '↔️' },
  { value: 'panel_damage', key: 'quote.issue.panel_damage', icon: '🪟' },
  { value: 'cable_snapped', key: 'quote.issue.cable_snapped', icon: '🔗' },
  { value: 'noisy', key: 'quote.issue.noisy', icon: '🔊' },
  { value: 'remote_issue', key: 'quote.issue.remote_issue', icon: '📡' },
  { value: 'new_install', key: 'quote.issue.new_install', icon: '🏠' },
  { value: 'tune_up', key: 'quote.issue.tune_up', icon: '🛠️' },
  { value: 'other', key: 'quote.issue.other', icon: '❓' },
]

type Step = 1 | 2 | 3

type FormState = {
  door_type: DoorType
  door_material: Material
  issue_type: string
  zip_code: string
  is_emergency: boolean
  full_name: string
  phone: string
  email: string
  address: string
  message: string
  consent: boolean
}

const initialState: FormState = {
  door_type: 'single',
  door_material: 'steel',
  issue_type: '',
  zip_code: '',
  is_emergency: false,
  full_name: '',
  phone: '',
  email: '',
  address: '',
  message: '',
  consent: true,
}

export function QuoteCalculator() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en') as 'en' | 'es'
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(initialState)
  const [estimate, setEstimate] = useState<QuoteResponse | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const estimateQuery = useMutation({
    mutationFn: (payload: QuoteRequest) => apiClient.estimateQuote(payload),
    onSuccess: setEstimate,
  })

  const submitLead = useMutation({
    mutationFn: (payload: LeadSubmitRequest) => apiClient.submitLead(payload),
    onSuccess: () => setSubmitted(true),
  })

  const quotePayload: QuoteRequest = useMemo(
    () => ({
      door_type: form.door_type,
      door_material: form.door_material,
      issue_type: form.issue_type || 'other',
      zip_code: form.zip_code || undefined,
      is_emergency: form.is_emergency,
      locale: lang,
    }),
    [form, lang],
  )

  useEffect(() => {
    if (step >= 2 && form.issue_type) {
      const handle = setTimeout(() => estimateQuery.mutate(quotePayload), 250)
      return () => clearTimeout(handle)
    }
  }, [step, quotePayload, form.issue_type])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const canNextStep1 = !!form.door_type
  const canNextStep2 = !!form.issue_type
  const canSubmit = form.full_name.length > 1 && form.phone.length >= 7 && form.consent

  const handleSubmit = () => {
    submitLead.mutate({
      quote: quotePayload,
      full_name: form.full_name,
      phone: form.phone,
      email: form.email || undefined,
      address: form.address || undefined,
      message: form.message || undefined,
      urgency: form.is_emergency ? 'emergency' : 'this_week',
      consent: form.consent,
    })
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-8 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 font-display text-2xl font-bold text-ink-900">
          {t('quote.thankYou', { name: form.full_name })}
        </h3>
        <p className="mt-2 text-ink-700">
          {t('quote.thankYouMessage', { phone: form.phone })}
        </p>
        {estimate && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {t('quote.estimateTitle')}
            </div>
            <div className="mt-1 font-display text-3xl font-extrabold text-ink-900">
              {formatCurrency(estimate.estimated_low)} -{' '}
              {formatCurrency(estimate.estimated_high)}
            </div>
            <p className="mt-2 text-sm text-ink-600">{t('quote.estimateNote')}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
            {t('quote.step', { current: step, total: 3 })}
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink-900">
            {step === 1 && t('quote.step1Title')}
            {step === 2 && t('quote.step2Title')}
            {step === 3 && t('quote.step3Title')}
          </h2>
        </div>
        <Sparkles className="h-6 w-6 text-brand-400" />
      </div>

      <div className="mt-4 flex gap-1.5">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={cn(
              'h-1.5 flex-1 rounded-full transition',
              n <= step ? 'bg-brand-500' : 'bg-ink-100',
            )}
          />
        ))}
      </div>

      <div className="mt-6">
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DOOR_TYPES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => update('door_type', d.value)}
                  className={cn(
                    'rounded-2xl border-2 p-4 text-left transition',
                    form.door_type === d.value
                      ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100'
                      : 'border-ink-100 hover:border-ink-200 hover:bg-ink-50',
                  )}
                >
                  <div className="text-3xl">{d.emoji}</div>
                  <div className="mt-2 font-semibold text-ink-900">{t(d.key)}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="label">{t('quote.material.label')}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MATERIALS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => update('door_material', m.value)}
                    className={cn(
                      'rounded-xl border-2 px-3 py-2 text-sm font-medium transition',
                      form.door_material === m.value
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-ink-100 text-ink-700 hover:border-ink-200',
                    )}
                  >
                    {t(m.key)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="zip" className="label">
                {t('quote.zip')}
              </label>
              <input
                id="zip"
                inputMode="numeric"
                maxLength={5}
                value={form.zip_code}
                onChange={(e) => update('zip_code', e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="input"
                placeholder="90210"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ISSUES.map((it) => (
                <button
                  key={it.value}
                  type="button"
                  onClick={() => update('issue_type', it.value)}
                  className={cn(
                    'flex flex-col items-start rounded-2xl border-2 p-4 text-left transition',
                    form.issue_type === it.value
                      ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100'
                      : 'border-ink-100 hover:border-ink-200 hover:bg-ink-50',
                  )}
                >
                  <span className="text-2xl">{it.icon}</span>
                  <span className="mt-1.5 text-sm font-semibold text-ink-900">{t(it.key)}</span>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 rounded-2xl border-2 border-red-100 bg-red-50 p-4 transition hover:border-red-200">
              <input
                type="checkbox"
                checked={form.is_emergency}
                onChange={(e) => update('is_emergency', e.target.checked)}
                className="h-5 w-5 rounded border-red-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-red-600" />
                <span className="text-sm font-semibold text-red-900">
                  {t('quote.isEmergency')}
                </span>
              </div>
            </label>

            {estimate && form.issue_type && (
              <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 shadow-soft">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <Wrench className="h-4 w-4" />
                  {t('quote.estimateTitle')}
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
                  {formatCurrency(estimate.estimated_low)} -{' '}
                  {formatCurrency(estimate.estimated_high)}
                </div>
                <div className="mt-1 text-sm font-medium text-ink-700">
                  {lang === 'es' ? estimate.issue_label_es : estimate.issue_label_en} · ~
                  {estimate.typical_duration_min} min
                </div>
                <p className="mt-3 text-xs text-ink-600">{t('quote.estimateNote')}</p>
                {estimate.in_service_area === true && (
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    ✓ {t('quote.inAreaYes')}{' '}
                    {estimate.response_time_min &&
                      t('quote.inAreaResponse', { minutes: estimate.response_time_min })}
                  </p>
                )}
              </div>
            )}
            {estimateQuery.isPending && (
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('quote.submitting')}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="full_name">
                  {t('quote.fullName')}
                </label>
                <input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="phone">
                  {t('quote.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">
                {t('quote.email')}
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="address">
                {t('quote.address')}
              </label>
              <input
                id="address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="message">
                {t('quote.message')}
              </label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className="input resize-none"
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update('consent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              <span>{t('quote.consent')}</span>
            </label>

            {estimate && (
              <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  {t('quote.estimateTitle')}
                </div>
                <div className="mt-1 font-display text-2xl font-extrabold text-ink-900">
                  {formatCurrency(estimate.estimated_low)} -{' '}
                  {formatCurrency(estimate.estimated_high)}
                </div>
              </div>
            )}

            {submitLead.isError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{t('common.error')}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="btn-ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('quote.back')}
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            disabled={step === 1 ? !canNextStep1 : !canNextStep2}
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="btn-primary"
          >
            {t('quote.next')}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canSubmit || submitLead.isPending}
            onClick={handleSubmit}
            className="btn-primary"
          >
            {submitLead.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('quote.submitting')}
              </>
            ) : (
              <>
                {t('quote.submit')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
