#!/usr/bin/env node
/**
 * deploy-s3.js
 * Builds all 15 area sites and deploys each to its own S3 static-website bucket.
 *
 * Prerequisites:
 *   - AWS CLI installed + configured (aws configure)
 *   - Node 18+ (comes with fetch / no extra deps)
 *   - frontend/node_modules already installed (npm install inside frontend/)
 *
 * Usage:
 *   node deploy-s3.js              → build + deploy all areas
 *   node deploy-s3.js westla sfv   → build + deploy specific slugs only
 *   node deploy-s3.js --skip-build → deploy from existing dist-areas/ (no rebuild)
 */

const { execSync } = require('child_process')
const fs   = require('fs')
const path = require('path')

// ── Config ─────────────────────────────────────────────────────────────────
const REGION      = 'us-west-2'          // closest AWS region to LA
const BUCKET_PREFIX = 'la-garage-'       // e.g. la-garage-westla
const ROOT        = __dirname
const FRONTEND    = path.join(ROOT, 'frontend')
const DIST_BASE   = path.join(ROOT, 'dist-areas')
const AREAS_FILE  = path.join(ROOT, 'areas.json')

// ── Helpers ─────────────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts })
}

function runOut(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

function bucketName(slug) {
  return `${BUCKET_PREFIX}${slug}`
}

function websiteUrl(slug) {
  return `http://${bucketName(slug)}.s3-website-${REGION}.amazonaws.com`
}

function bucketExists(name) {
  try {
    runOut(`aws s3api head-bucket --bucket ${name} --region ${REGION} 2>&1`)
    return true
  } catch {
    return false
  }
}

// ── Step 0: parse args ───────────────────────────────────────────────────────
const args       = process.argv.slice(2)
const skipBuild  = args.includes('--skip-build')
const slugFilter = args.filter(a => !a.startsWith('--'))

const allAreas = JSON.parse(fs.readFileSync(AREAS_FILE, 'utf8'))
const areas    = slugFilter.length
  ? allAreas.filter(a => slugFilter.includes(a.slug))
  : allAreas

if (areas.length === 0) {
  console.error('No matching areas. Check slug names.')
  process.exit(1)
}

console.log(`\n${'═'.repeat(60)}`)
console.log(`  LA Garage Doors — S3 Deploy`)
console.log(`  Region  : ${REGION}`)
console.log(`  Areas   : ${areas.length}`)
console.log(`  Rebuild : ${!skipBuild}`)
console.log(`${'═'.repeat(60)}\n`)

// ── Step 1: build ────────────────────────────────────────────────────────────
if (!skipBuild) {
  console.log('[1/3] Building all area sites...\n')
  const slugArgs = slugFilter.length ? slugFilter.join(' ') : ''
  run(`node build-all.js ${slugArgs}`, { cwd: ROOT })
} else {
  console.log('[1/3] Skipping build (--skip-build).\n')
}

// ── Step 2 & 3: create buckets + upload ──────────────────────────────────────
let deployed = 0
let failed   = 0
const results = []

for (const area of areas) {
  const bucket = bucketName(area.slug)
  const distDir = path.join(DIST_BASE, area.slug)

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`[${deployed + failed + 1}/${areas.length}] ${area.businessName}`)
  console.log(`  Bucket : s3://${bucket}`)
  console.log(`  Source : dist-areas/${area.slug}/`)
  console.log(`${'─'.repeat(60)}`)

  if (!fs.existsSync(distDir)) {
    console.error(`  [SKIP] Build not found: ${distDir}`)
    failed++
    continue
  }

  try {
    // ── Create bucket ──────────────────────────────────────────────────────
    if (!bucketExists(bucket)) {
      console.log('  Creating bucket...')
      if (REGION === 'us-east-1') {
        run(`aws s3api create-bucket --bucket ${bucket} --region ${REGION}`)
      } else {
        run(`aws s3api create-bucket --bucket ${bucket} --region ${REGION} --create-bucket-configuration LocationConstraint=${REGION}`)
      }
    } else {
      console.log('  Bucket already exists, reusing.')
    }

    // ── Disable Block Public Access ────────────────────────────────────────
    console.log('  Enabling public access...')
    run(`aws s3api put-public-access-block --bucket ${bucket} --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"`)

    // ── Bucket policy: public read ─────────────────────────────────────────
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucket}/*`,
      }],
    })
    const policyFile = path.join(DIST_BASE, `${area.slug}-policy.json`)
    fs.writeFileSync(policyFile, policy)
    run(`aws s3api put-bucket-policy --bucket ${bucket} --policy file://${policyFile}`)
    fs.unlinkSync(policyFile)

    // ── Static website hosting (SPA: error → index.html) ──────────────────
    console.log('  Configuring static website...')
    run(`aws s3 website s3://${bucket}/ --index-document index.html --error-document index.html`)

    // ── Upload files ───────────────────────────────────────────────────────
    console.log('  Uploading files...')
    // HTML files: no-cache so updates show immediately
    run(`aws s3 sync "${distDir}" "s3://${bucket}" --region ${REGION} --delete --cache-control "no-cache,no-store" --exclude "*" --include "*.html"`)
    // Assets (JS/CSS with content hashes): long cache
    run(`aws s3 sync "${distDir}" "s3://${bucket}" --region ${REGION} --delete --cache-control "public,max-age=31536000,immutable" --exclude "*.html"`)

    const url = websiteUrl(area.slug)
    console.log(`  ✓ Live at: ${url}`)
    results.push({ slug: area.slug, name: area.businessName, domain: area.domain, url })
    deployed++

  } catch (err) {
    console.error(`  [FAIL] ${err.message}`)
    failed++
    results.push({ slug: area.slug, name: area.businessName, domain: area.domain, url: 'FAILED' })
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`)
console.log(`  Deploy complete: ${deployed} succeeded, ${failed} failed`)
console.log(`${'═'.repeat(60)}\n`)

console.log('  Site URLs (point your domains here as CNAME → [bucket].s3-website-us-west-2.amazonaws.com):\n')
const maxName = Math.max(...results.map(r => r.name.length))
for (const r of results) {
  const status = r.url === 'FAILED' ? '❌' : '✅'
  console.log(`  ${status}  ${r.name.padEnd(maxName + 2)} ${r.url}`)
}

console.log(`\n  Next step: buy domains on Namecheap, add CNAME records:`)
for (const r of results) {
  if (r.url !== 'FAILED') {
    const endpoint = `${bucketName(r.slug)}.s3-website-${REGION}.amazonaws.com`
    console.log(`    ${r.domain.padEnd(35)} CNAME → ${endpoint}`)
  }
}
console.log()

if (failed > 0) process.exit(1)
