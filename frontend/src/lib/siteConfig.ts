/**
 * Site-specific configuration injected at build time via VITE_ env vars.
 * Each area build sets its own values via build-all.js → .env.
 * Falls back to Premier Garage Doors LA (the main / dev build).
 */

export const siteConfig = {
  siteId:        import.meta.env.VITE_SITE_ID        || 'main',
  businessName:  import.meta.env.VITE_BUSINESS_NAME  || 'Premier Garage Doors LA',
  areaName:      import.meta.env.VITE_AREA_NAME      || 'Los Angeles',
  neighborhoods: import.meta.env.VITE_NEIGHBORHOODS  || 'All of Los Angeles',
  domain:        import.meta.env.VITE_DOMAIN         || 'lagaragedoorspro.com',
  theme:         import.meta.env.VITE_THEME          || 'orange',

  heroBadge:    import.meta.env.VITE_HERO_BADGE    || '60-minute response across Los Angeles',
  heroAccent:   import.meta.env.VITE_HERO_ACCENT   || "We'll be there in 60 minutes.",
  heroSubtitle: import.meta.env.VITE_HERO_SUBTITLE ||
    'Same-day repair & installation across LA. Honest, upfront pricing. Licensed partners.',

  /** Splits businessName into two lines for the logo/header */
  get logoLine1(): string {
    const parts = this.businessName.split(' ')
    return parts.slice(0, -1).join(' ') || this.businessName
  },
  get logoLine2(): string {
    const parts = this.businessName.split(' ')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  },
} as const
