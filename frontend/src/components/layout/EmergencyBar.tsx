import { Phone, Siren } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { config } from '@/lib/config'
import { formatPhone, telHref } from '@/lib/utils'

export function EmergencyBar() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
      <div className="container-x flex flex-col items-center justify-between gap-2 py-2 text-sm sm:flex-row">
        <div className="flex items-center gap-2">
          <Siren className="h-4 w-4 animate-pulse" />
          <span className="font-semibold">{t('emergencyBar.title')}</span>
          <span className="hidden text-red-100 sm:inline">{t('emergencyBar.subtitle')}</span>
        </div>
        <a
          href={telHref(config.emergencyPhone)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-red-700 transition hover:bg-red-50"
        >
          <Phone className="h-4 w-4" />
          {formatPhone(config.emergencyPhone)}
        </a>
      </div>
    </div>
  )
}
