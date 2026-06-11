# Foundation Plan — TODO Checklist

Status key: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Tier 1: Must-Have

### M1 — Security Hardening
- [x] Auth audit: all routes protected appropriately
- [x] Remove generic `ModelRoutes` / `ModelService`
- [x] Add domain-scoped `SessionRoutes` (list sessions, get messages)
- [x] Session ownership check in `ChatService.sendMessage`
- [x] Table whitelist in data operations layer
- [x] Exclude password hashes from user queries
- [x] Wire `helmet`, CORS allowlist, rate limiting
- [x] Add `npm run security:check` script
- [x] Replace frontend `ModelService` with `SessionService`

### M2 — Environment Contract
- [x] `proto-backend/.env.example`
- [x] Root `.env.example`
- [x] Zod env validation at boot (fail-fast)
- [x] Config split: secrets (env) vs app config

### M3 — Database Schema + Migrations
- [x] `db/migrations/` SQL files
- [x] `db/seeds/dev.sql` (via seed script)
- [x] `npm run db:migrate`, `db:seed`, `db:setup`

### M4 — One-Command Local Stack
- [x] Root `docker-compose.yml` (MySQL)
- [x] Root `package.json` scripts
- [x] `scripts/doctor.js`
- [x] `npm run setup`, `npm run dev`

### M5 — Central App Configuration
- [x] Root `app.config.js`
- [x] Wire AI provider/model defaults from config
- [x] Feature flags for nav / coming-soon pages

### M6 — Cleanup + Reproducible Builds
- [x] Delete `requests/index.js`
- [x] Remove `uuidv4` dep (use `uuid` only)
- [x] Stop gitignoring `package-lock.json`
- [x] Remove duplicate coming-soon `.tsx` files

### M7 — Baseline Contract Tests + CI
- [x] Node test runner + supertest setup
- [x] Auth, sessions, health, security contract tests
- [x] Data layer unit tests (table whitelist)
- [x] `.github/workflows/ci.yml`

### M8 — Core + Client Overlay
- [ ] `client/` folder with registry skeleton
- [ ] Foundation loads client overlay if present
- [ ] `docs/UPGRADE.md`

### M9 — Backend Module Registry
- [ ] `modules/` with auth, chat, documents, ai, sessions
- [ ] Feature-flagged module loading from `app.config.js`

### M10 — Fork Documentation
- [x] `docs/FORK.md` day-1 checklist
- [x] `docs/CUSTOMIZE.md`
- [x] Update root README
- [ ] `docs/UPGRADE.md`

### SaaS Frontend (done)
- [x] Marketing landing at `/` + pricing page
- [x] App shell at `(app)/` with protected layout
- [x] Dashboard at `/dashboard`
- [x] Settings sub-pages (profile, org, billing, team)
- [x] Config-driven nav + feature flags
- [x] `config/app.config.js` + root `app.config.js`
- [x] Middleware auth redirects

---

## Tier 2: Good-to-Have

### G1 — Canonical AI Path + Registry
- [ ] Deprecate `AIServiceModule`; chains as canonical
- [ ] Formal `services/ai/registry.js`

### G2 — Frontend Feature Modules
- [ ] `features/` folder structure
- [ ] Config-driven nav composition

### G3 — Structured Logging + Health
- [ ] Pino JSON logging
- [ ] `GET /proto/api/health`

### G4 — RAG Ingestion Job Queue
- [ ] BullMQ + Redis profile
- [ ] Retry + status tracking

### G5 — Pluggable Vector Store
- [ ] VectorStore interface
- [ ] pgvector option via config

### G6 — Backend Linting
- [ ] ESLint + Prettier for backend
- [ ] CI lint gate

### G7 — Deployment Preset
- [ ] `deploy/vercel-railway/` guide + configs

### G8 — Auth Enhancements
- [ ] Roles (user/admin)
- [ ] Refresh tokens

---

## Tier 3: Optional

- [ ] O1 Multi-tenant SaaS mode
- [ ] O2 Billing & usage metering (Stripe)
- [ ] O3 `create-proto-app` CLI
- [ ] O4 AI evals & measurement layer
- [ ] O5 SSO / OAuth providers
- [ ] O6 Admin dashboard
- [ ] O7 Extract `@proto/core` npm packages
- [ ] O8 Second deployment preset (Docker VPS)
