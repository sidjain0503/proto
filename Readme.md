# Proto — AI SaaS Foundation for JS Devs

**Proto is a forkable full-stack SaaS template that treats AI as infrastructure, not a feature.**

<img width="1710" height="771" alt="image" src="https://github.com/user-attachments/assets/e72b64d0-20fc-407f-b21e-8d8125659ec2" />

## What's Inside

- **Backend** (`proto-backend/`) — Node.js/Express, JWT auth, RAG, streaming chat
- **Frontend** (`proto-client/`) — Next.js SaaS shell (marketing, auth, dashboard, settings)
- **AI Layer** — Provider-agnostic chains, streaming, Langfuse tracing
- **Foundation tooling** — Migrations, Docker MySQL, config-driven features

## Quick Start (< 15 min)

```bash
# 1. Install dependencies
npm install
npm install --prefix proto-backend
npm install --prefix proto-client

# 2. Configure environment
cp proto-backend/.env.example proto-backend/.env
cp proto-client/.env.local.example proto-client/.env.local
# Edit proto-backend/.env — set SECURITY_TOKEN_SECRET (min 16 chars)

# 3. Boot MySQL + migrate + seed
npm run setup

# 4. Verify & run
npm run doctor
npm run dev
```

- **Marketing site:** http://localhost:3000
- **App dashboard:** http://localhost:3000/dashboard (after login)
- **API health:** http://localhost:8080/proto/api/health
- **Seed user:** `dev@proto.local` / `password123`

## Fork for a Client Project

See **[docs/FORK.md](./docs/FORK.md)** for the day-1 checklist and **[docs/CUSTOMIZE.md](./docs/CUSTOMIZE.md)** for branding, features, and deployment.

Edit `app.config.js` to set app name, enabled features, and AI defaults.

## Core Features

- Multi-provider LLM support (Ollama, OpenAI, OpenRouter)
- Streaming chat with session history
- Document upload + RAG
- JWT authentication with protected app shell
- Usage tracking hooks
- Langfuse observability (optional)
- Config-driven SaaS UI (billing/team stubs included)

## Documentation

| Doc | Description |
|-----|-------------|
| [FORK.md](./docs/FORK.md) | Day-1 fork checklist |
| [CUSTOMIZE.md](./docs/CUSTOMIZE.md) | Branding, features, deploy |
| [Foundation Plan](./docs/foundation-plan/README.md) | Roadmap & todos |
| [SaaS Frontend](./docs/foundation-plan/SAAS-FRONTEND.md) | Frontend architecture |
| [AI Architecture](./proto-backend/docs/ai/Readme.md) | AI layer design |
| [RAG Guide](./proto-backend/docs/ai/RAG.md) | Document ingestion & retrieval |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Docker MySQL + migrations + seed |
| `npm run dev` | Backend + frontend concurrently |
| `npm run doctor` | Health checks for local stack |
| `npm run db:migrate` | Apply pending migrations |
| `npm run test` | Run backend contract tests (16 tests) |
| `npm run security:check` | Backend security regression |

---

*Proto explores how intelligence layers live inside real software products without breaking everything.*
