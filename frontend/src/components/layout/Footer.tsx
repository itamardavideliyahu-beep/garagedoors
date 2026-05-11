import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { config } from '@/lib/config'
import { formatPhone, telHref } from '@/lib/utils'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-950 text-ink-200">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-white">LA Garage Doors</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
                Pro
              </div>
            </div>
          </Link>
          <p className="mt-4 text-sm text-ink-400">{t('footer.tagline')}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink-500">
            <Award className="h-4 w-4" />
            {t('footer.license', { license: 'CSLB #1234567' })}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            {t('footer.navigation')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">{t('nav.home')}</Link></li>
            <li><Link to="/services" className="hover:text-white">{t('nav.services')}</Link></li>
            <li><Link to="/areas" className="hover:text-white">{t('nav.areas')}</Link></li>
            <li><Link to="/gallery" className="hover:text-white">{t('nav.gallery')}</Link></li>
            <li><Link to="/quote" className="hover:text-white">{t('nav.quote')}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            {t('footer.services')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-white">Spring Repair</Link></li>
            <li><Link to="/services" className="hover:text-white">Opener Install</Link></li>
            <li><Link to="/services" className="hover:text-white">Off-Track Repair</Link></li>
            <li><Link to="/services" className="hover:text-white">Panel Replacement</Link></li>
            <li><Link to="/services" className="hover:text-white">New Installation</Link></li>
            <li><Link to="/services" className="hover:text-white">25-Point Tune-Up</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            {t('footer.contact')}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <a href={telHref(config.businessPhone)} className="hover:text-white">
                {formatPhone(config.businessPhone)}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <a href="mailto:info@lagaragedoorspro.com" className="hover:text-white">
                info@lagaragedoorspro.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <span>Mon-Fri 7am-9pm · 24/7 Emergency</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
              <span>Greater Los Angeles area</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-500 sm:flex-row">
          <p>{t('footer.copyright', { year, brand: t('brand.name') })}</p>
          <p>Built with care for the City of Angels.</p>
        </div>
      </div>
    </footer>
  )
}
