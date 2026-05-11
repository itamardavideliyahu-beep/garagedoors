# LA Garage Doors Pro Platform

> Professional garage-door service platform for Los Angeles. Marketing site + customer
> quote engine + lead capture + admin foundations. Bilingual (English / Spanish).

[![Backend CI](https://github.com/itamardavideliyahu-beep/garagedoors/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/itamardavideliyahu-beep/garagedoors/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/itamardavideliyahu-beep/garagedoors/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/itamardavideliyahu-beep/garagedoors/actions/workflows/frontend-ci.yml)
![Stack](https://img.shields.io/badge/Stack-FastAPI%20%2B%20React%20%2B%20Vite-ff7510)
![Status](https://img.shields.io/badge/Phase-1%20foundation-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Deploying to production?** See [DEPLOY.md](DEPLOY.md) for the full Railway setup.

---

## תקציר בעברית

פלטפורמה מקצועית לעסק תיקון/התקנת דלתות חניה בלוס אנג'לס:

- **אתר נחיתה דו-לשוני** (EN / ES) עם hero חזק, trust bar, גלריית לפני/אחרי, ביקורות,
  מותגים שאנחנו עובדים איתם, ו-FAQ אינטראקטיבי.
- **מחשבון הצעת מחיר מיידי** ב-3 שלבים (סוג דלת → בעיה → פרטי קשר) שמייצר מחיר משוער
  בזמן אמת ויוצר ליד במערכת.
- **מפת אזורי שירות אינטראקטיבית** (Leaflet + OpenStreetMap, ללא צורך ב-API key) עם
  פוליגונים של 5 אזורי LA וכלי בדיקת מיקוד.
- **כפתור Emergency 24/7 דביק** + WhatsApp FAB צף + Click-to-call בכל מקום.
- **REST API** ב-FastAPI עם Auth (JWT + roles), CRUD ללידים, ביקורות, שירותים, ו-seed
  data שמטעין שירותים, אזורי שירות, ולקוחות לדוגמה אוטומטית בעלייה הראשונה.
- **דוקר קומפוז** עם 4 שירותים (postgres / redis / backend / frontend) - `docker compose up`.

---

## Quick Start

### Option A: Docker Compose (recommended)

```bash
git clone <your-repo>
cd garagedoors
docker compose up --build
```

Open:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8000>
- API docs (Swagger): <http://localhost:8000/docs>

### Option B: Run locally without Docker

**Backend** (Python 3.11+):

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
copy .env.example .env          # then edit if needed
uvicorn app.main:app --reload
```

The first launch in `development` mode auto-creates tables and seeds the catalog,
service areas, sample reviews and an admin user.

**Frontend** (Node 20+):

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

You also need a running PostgreSQL 16 and Redis 7. If you don't want to install them
locally, just spin up the data services from compose:

```bash
docker compose up postgres redis
```

---

## Default credentials (development only)

After the first boot you get a pre-seeded admin:

- **Email:** `admin@lagaragedoorspro.com`
- **Password:** `ChangeMe123!`

> Change `SECRET_KEY` and admin password before anything that resembles production.

---

## Feature ideas baked into the marketing site

These are the conversion-focused features included in Phase 1, plus the ones
designed and reserved for upcoming phases:

### Conversion drivers (live in Phase 1)

- **24/7 Emergency sticky bar** with click-to-call CTA at the very top.
- **Instant quote calculator** - LA-realistic pricing with door type / material /
  issue / emergency surcharge multipliers (see `backend/app/services/pricing.py`).
- **Interactive LA service-area map** (Leaflet, no API key required) with zip-code
  coverage check.
- **Bilingual EN / ES** UI with a language switcher (critical for LA market).
- **Before / after gallery** with hover transition.
- **Featured 5-star reviews** seeded from Google / Yelp-like sources.
- **Trust signals bar** (Licensed CSLB · Bonded · Insured · BBB A+ · Same-Day · Lifetime warranty).
- **Brand showcase** (LiftMaster, Genie, Chamberlain, Clopay, Wayne Dalton, Amarr, Linear, Marantec).
- **Annual maintenance plan** card ($149/yr - tune-ups, 10% off, priority dispatch).
- **WhatsApp floating action button** with pre-filled message.
- **Stats band** (12,500+ customers, 15 yrs, 24 techs, avg response).
- **Live FAQ accordion** answering objections (price, license, warranty, financing).

### Coming in later phases (already designed in the data model)

- Online booking with Stripe deposit
- Customer portal (service history, warranty look-up)
- Technician PWA with live GPS tracking (Uber-style ETA)
- Admin / dispatch CRM with smart routing
- AI photo / video diagnosis (GPT-4 Vision)
- SMS automation via Twilio (status updates, review funnels)
- 0% APR financing partner integration (Affirm / Klarna)

---

## Project structure

```
garagedoors/
├── backend/                       # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/v1/endpoints/      # auth, leads, services, reviews, public, business
│   │   ├── core/                  # config, db, security, deps
│   │   ├── models/                # user, service, lead, review
│   │   ├── schemas/               # pydantic
│   │   ├── services/              # pricing, service-area logic
│   │   ├── seed.py                # demo-ready data
│   │   └── main.py
│   ├── alembic/                   # migrations
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.example
├── frontend/                      # Vite + React + TS + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Header, Footer, EmergencyBar, WhatsAppFab
│   │   │   ├── sections/          # Hero, Services, Reviews, Map, Gallery, FAQ, Brands, Stats
│   │   │   └── quote/             # 3-step QuoteCalculator
│   │   ├── pages/                 # Home, Services, Areas, Quote, Gallery, Contact, 404
│   │   ├── locales/               # en.json, es.json
│   │   ├── lib/                   # api, i18n, config, utils
│   │   ├── store/                 # zustand
│   │   └── styles/                # Tailwind index.css
│   ├── public/
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml             # postgres + redis + backend + frontend
├── README.md
└── .gitignore
```

---

## API Reference (Phase 1)

Browse the live interactive docs at <http://localhost:8000/docs>.

| Method | Endpoint                       | Auth      | Description                                  |
| ------ | ------------------------------ | --------- | -------------------------------------------- |
| GET    | `/health`                      | -         | Liveness check                               |
| POST   | `/api/v1/auth/register`        | -         | Create a customer account                    |
| POST   | `/api/v1/auth/login`           | -         | OAuth2 password flow → JWT pair              |
| POST   | `/api/v1/auth/refresh`         | -         | Refresh access token                         |
| GET    | `/api/v1/auth/me`              | Bearer    | Get current user                             |
| GET    | `/api/v1/services`             | -         | Catalog (bilingual)                          |
| GET    | `/api/v1/services/featured`    | -         | Featured-only catalog                        |
| GET    | `/api/v1/services/areas`       | -         | LA service-area polygons                     |
| POST   | `/api/v1/services/check-zip`   | -         | Is this zip in our service area?             |
| POST   | `/api/v1/leads`                | -         | Contact form lead                            |
| POST   | `/api/v1/leads/quote`          | -         | Instant quote estimate (no lead created)     |
| POST   | `/api/v1/leads/submit`         | -         | Quote + contact → creates a lead             |
| GET    | `/api/v1/leads`                | Staff     | List recent leads (dispatcher/admin)         |
| GET    | `/api/v1/reviews`              | -         | Published reviews                            |
| POST   | `/api/v1/reviews`              | -         | Submit a review (unpublished by default)     |
| PATCH  | `/api/v1/reviews/{id}/publish` | Admin     | Publish a review                             |
| GET    | `/api/v1/public/faqs`          | -         | FAQ items (bilingual)                        |
| GET    | `/api/v1/public/gallery`       | -         | Before/after items                           |
| GET    | `/api/v1/public/brands`        | -         | Brands we service                            |
| GET    | `/api/v1/public/stats`         | -         | Animated counters                            |
| GET    | `/api/v1/business/info`        | -         | Business hours, phone, badges                |

---

## Environment variables

### Backend - `backend/.env`

| Variable                        | Default                                                | Purpose                              |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| `APP_ENV`                       | `development`                                          | `production` skips auto-create+seed  |
| `DATABASE_URL`                  | `postgresql+psycopg://postgres:postgres@.../garagedoors` | Async-capable URL                  |
| `REDIS_URL`                     | `redis://localhost:6379/0`                             | Cache/queue (used in later phases)   |
| `SECRET_KEY`                    | `change-me-in-production`                              | JWT signing key                      |
| `ACCESS_TOKEN_EXPIRE_MINUTES`   | `30`                                                   | Access token lifetime                |
| `CORS_ORIGINS`                  | `http://localhost:5173,...`                            | Comma-separated allowed origins      |
| `BUSINESS_PHONE` / `EMERGENCY_PHONE` / `WHATSAPP_NUMBER` | demo values | Business contact info  |
| `STRIPE_SECRET_KEY` etc.        | empty                                                  | Reserved for Phase 2+                |

### Frontend - `frontend/.env`

| Variable                | Default                          |
| ----------------------- | -------------------------------- |
| `VITE_API_BASE_URL`     | `http://localhost:8000/api/v1`   |
| `VITE_BUSINESS_PHONE`   | `+13105551234`                   |
| `VITE_EMERGENCY_PHONE`  | `+13105550911`                   |
| `VITE_WHATSAPP_NUMBER`  | `13105551234`                    |

---

## Database migrations

Tables auto-create on startup in `APP_ENV=development`. For production:

```bash
cd backend
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

---

## Deployment

This project is designed to deploy on [Railway](https://railway.com) with GitHub-native
auto-deploy. Every push to `main`:

1. Runs CI in GitHub Actions (lint + type-check + build) — see `.github/workflows/`
2. Railway rebuilds and redeploys only the service whose code changed (backed by the
   `Watch Paths` setting on each service).

Walk through [DEPLOY.md](DEPLOY.md) for the one-time setup. Then it's just:

```bash
git push origin main
```

Dependabot opens weekly PRs for outdated packages (`backend`, `frontend`, GitHub
Actions, Docker base images).

## Roadmap

| Phase | Focus                                    | Status      |
| ----- | ---------------------------------------- | ----------- |
| **1** | Marketing site + quote engine + leads    | ✓ Done      |
| 2     | Online booking + calendar (no payments yet) | Planned  |
| 3     | Customer portal + SMS/Email automation (Twilio + SendGrid) | Planned |
| 4     | Technician PWA + live GPS tracking + dispatch board | Planned |
| 5     | Admin CRM + AI photo diagnosis + analytics | Planned   |
| later | Stripe payments + financing (Affirm/Klarna) | Backlog  |

---

## License

MIT - feel free to fork and adapt for your own service business.
