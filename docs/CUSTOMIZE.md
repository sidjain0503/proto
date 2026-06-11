# Customize Proto for a Client Fork

## Configuration files

| File | Purpose |
|------|---------|
| `app.config.js` | Root config (backend reads this for AI defaults) |
| `proto-client/config/app.config.js` | Frontend branding, features, nav |
| `proto-backend/.env` | Secrets and infrastructure |
| `proto-client/.env.local` | `NEXT_PUBLIC_API_URL` |

Keep `app.config.js` and `proto-client/config/app.config.js` in sync for branding and feature flags.

## Feature flags

```js
features: {
  chat: true,
  documents: true,
  chains: false,   // hide from nav + gate route
  models: false,
  usage: true,
  prompts: false,
  billing: true,
  team: true,
}
```

Disabled features are removed from the sidebar and show a `FeatureGate` message if accessed directly.

## AI providers

Set in `app.config.js`:

```js
ai: {
  defaultProvider: "local",       // local | openai | deepseek
  defaultModel: "gemma4:e2b",
  rag: { topK: 5, chunkSize: 512 },
}
```

Provider API keys go in `proto-backend/.env`:

- `OLLAMA_BASE_URL` — local models
- `OPENAI_API_KEY` — OpenAI
- `OPENROUTER_API_KEY` — OpenRouter / DeepSeek

## Database

Migrations live in `proto-backend/db/migrations/`.

```bash
npm run db:migrate    # apply pending migrations
npm run db:seed       # dev demo user (never in prod)
```

Add client-specific tables as new numbered migration files (e.g. `006_client_orders.sql`).

## Local development

```bash
npm run docker:up     # MySQL only
npm run db:setup      # ensure DB + migrate + seed
npm run dev           # backend + frontend
npm run doctor        # health checks
```

## Observability (optional)

Langfuse self-hosted setup is in `langfuse/`. See `langfuse/setup.sh`.

Set in `proto-backend/.env`:

```
LANGFUSE_SECRET_KEY=...
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_BASE_URL=http://localhost:3000
```

## Deployment

Recommended default: Vercel (frontend) + Railway/Render (backend + MySQL).

Minimum production checklist:

1. Managed MySQL with SSL
2. `ENVIRONMENT=production`
3. Strong `SECURITY_TOKEN_SECRET`
4. Restricted `CORS_ORIGINS`
5. Remove or disable seed user
6. File upload storage (S3) for multi-instance backends
