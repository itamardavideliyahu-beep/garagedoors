import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'en'

  const change = (lng: 'en' | 'es') => {
    if (lng !== current) {
      i18n.changeLanguage(lng)
    }
  }

  return (
    <div className={cn('flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1', className)}>
      <Globe className="ml-1 h-4 w-4 text-ink-400" />
      <button
        type="button"
        onClick={() => change('en')}
        className={cn(
          'rounded-full px-2.5 py-1 text-xs font-bold transition',
          current.startsWith('en')
            ? 'bg-ink-900 text-white'
            : 'text-ink-500 hover:text-ink-900',
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => change('es')}
        className={cn(
          'rounded-full px-2.5 py-1 text-xs font-bold transition',
          current.startsWith('es')
            ? 'bg-ink-900 text-white'
            : 'text-ink-500 hover:text-ink-900',
        )}
      >
        ES
      </button>
    </div>
  )
}
