#!/usr/bin/env node
/**
 * build-all.js
 * Generates one production build per area defined in areas.json.
 * Each build lands in dist-areas/<slug>/ ready for Cloudflare Pages upload.
 *
 * Usage:
 *   node build-all.js              → build all 15 areas
 *   node build-all.js westla sfv   → build only listed slugs
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const FRONTEND_DIR = path.join(ROOT, 'frontend')
const DIST_BASE = path.join(ROOT, 'dist-areas')
const AREAS_FILE = path.join(ROOT, 'areas.json')

// Read area configs
const allAreas = JSON.parse(fs.readFileSync(AREAS_FILE, 'utf8'))

// Filter to requested slugs (or build all)
const requested = process.argv.slice(2)
const areas = requested.length
  ? allAreas.filter((a) => requested.includes(a.slug))
  : allAreas

if (areas.length === 0) {
  console.error('No matching areas found. Check your slug names.')
  process.exit(1)
}

// Ensure dist-areas directory exists
fs.mkdirSync(DIST_BASE, { recursive: true })

let built = 0
let failed = 0

for (const area of areas) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`[${built + failed + 1}/${areas.length}] Building: ${area.businessName}`)
  console.log(`  Area    : ${area.areaName}`)
  console.log(`  Theme   : ${area.theme}`)
  console.log(`  Domain  : ${area.domain}`)
  console.log(`${'='.repeat(60)}`)

  // Write .env for this build
  const envContent = [
    `VITE_API_BASE_URL=https://garagedoors-api.up.railway.app/api/v1`,
    `VITE_SITE_ID=${area.slug}`,
    `VITE_BUSINESS_NAME=${area.businessName}`,
    `VITE_AREA_NAME=${area.areaName}`,
    `VITE_NEIGHBORHOODS=${area.neighborhoods}`,
    `VITE_BUSINESS_PHONE=${area.phone}`,
    `VITE_EMERGENCY_PHONE=${area.emergencyPhone}`,
    `VITE_WHATSAPP_NUMBER=${area.whatsappNumber}`,
    `VITE_THEME=${area.theme}`,
    `VITE_HERO_BADGE=${area.heroBadge}`,
    `VITE_HERO_ACCENT=${area.heroAccent}`,
    `VITE_HERO_SUBTITLE=${area.heroSubtitle}`,
    `VITE_DOMAIN=${area.domain}`,
  ].join('\n')

  const envPath = path.join(FRONTEND_DIR, '.env')
  fs.writeFileSync(envPath, envContent, 'utf8')

  try {
    execSync('npm run build', {
      cwd: FRONTEND_DIR,
      stdio: 'inherit',
    })

    // Move the output to dist-areas/<slug>
    const srcDist = path.join(FRONTEND_DIR, 'dist')
    const destDist = path.join(DIST_BASE, area.slug)

    if (fs.existsSync(destDist)) {
      fs.rmSync(destDist, { recursive: true, force: true })
    }
    fs.renameSync(srcDist, destDist)

    console.log(`\n[OK] ${area.businessName} → dist-areas/${area.slug}/`)
    built++
  } catch (err) {
    console.error(`\n[FAIL] ${area.businessName}: ${err.message}`)
    failed++
  }
}

// Restore a clean dev .env so the repo isn't left dirty
const devEnv = [
  `VITE_API_BASE_URL=http://localhost:8000/api/v1`,
  `VITE_SITE_ID=main`,
  `VITE_BUSINESS_NAME=Premier Garage Doors LA`,
  `VITE_AREA_NAME=Los Angeles`,
  `VITE_NEIGHBORHOODS=All of Los Angeles`,
  `VITE_BUSINESS_PHONE=+18188562046`,
  `VITE_EMERGENCY_PHONE=+18188562046`,
  `VITE_WHATSAPP_NUMBER=18188562046`,
  `VITE_THEME=orange`,
  `VITE_HERO_BADGE=60-minute response across Los Angeles`,
  `VITE_HERO_ACCENT=We'll be there in 60 minutes.`,
  `VITE_HERO_SUBTITLE=Same-day repair & installation across LA. Honest, upfront pricing. Licensed partners.`,
  `VITE_DOMAIN=lagaragedoorspro.com`,
].join('\n')

fs.writeFileSync(path.join(FRONTEND_DIR, '.env'), devEnv, 'utf8')

console.log(`\n${'='.repeat(60)}`)
console.log(`Build complete: ${built} succeeded, ${failed} failed`)
console.log(`Output: ${DIST_BASE}/`)
console.log(`${'='.repeat(60)}\n`)

if (failed > 0) process.exit(1)
