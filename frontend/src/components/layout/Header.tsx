import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, Phone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, formatPhone, telHref } from '@/lib/utils'
import { config } from '@/lib/config'
import { siteConfig } from '@/lib/siteConfig'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/areas', label: t('nav.areas') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white shadow-soft">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-ink-900">{siteConfig.logoLine1}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
              {siteConfig.logoLine2}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-600'
                    : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a href={telHref(config.businessPhone)} className="flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-600">
            <Phone className="h-4 w-4" />
            {formatPhone(config.businessPhone)}
          </a>
          <Link to="/quote" className="btn-primary text-sm">
            {t('cta.getFreeQuote')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
          aria-label={t('nav.menu')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-ink-50',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-3">
              <LanguageSwitcher />
              <a
                href={telHref(config.businessPhone)}
                className="flex items-center gap-2 text-sm font-semibold text-brand-600"
              >
                <Phone className="h-4 w-4" />
                {formatPhone(config.businessPhone)}
              </a>
            </div>
            <Link to="/quote" onClick={() => setOpen(false)} className="btn-primary mt-3">
              {t('cta.getFreeQuote')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
