import { useTranslation } from 'react-i18next'
import { config } from '@/lib/config'
import { whatsappHref } from '@/lib/utils'

export function WhatsAppFab() {
  const { t } = useTranslation()
  return (
    <a
      href={whatsappHref(config.whatsappNumber, 'Hi! I need help with my garage door.')}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-soft transition hover:scale-105 hover:bg-[#1ebe5d]"
      aria-label={t('cta.whatsapp')}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0012.04 0C5.43 0 .04 5.39.04 12c0 2.12.55 4.18 1.59 6L0 24l6.18-1.62A11.96 11.96 0 0012.04 24c6.61 0 12-5.39 12-12 0-3.21-1.25-6.22-3.52-8.52zM12.04 22a9.94 9.94 0 01-5.07-1.39l-.36-.21-3.66.96.98-3.57-.24-.37A9.92 9.92 0 012.04 12c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.46-7.49c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.51l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.21 5.08 4.5 1.13.48 2.01.77 2.69.99.85.27 1.63.23 2.24.14.68-.1 2.05-.84 2.34-1.65.29-.81.29-1.5.2-1.65-.09-.15-.27-.22-.57-.37z" />
      </svg>
      <span className="hidden sm:inline">{t('cta.whatsapp')}</span>
    </a>
  )
}
