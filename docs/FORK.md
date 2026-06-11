# Fork Checklist — Day 1

Use this checklist when spinning up a new client project from Proto.

## 1. Fork & clone

- [ ] Fork the Proto repository
- [ ] Clone to your client project directory
- [ ] Rename remote/origin as needed

## 2. Configure branding

- [ ] Edit `app.config.js` — app name, tagline, support email
- [ ] Edit `proto-client/config/app.config.js` — keep in sync with root config
- [ ] Set feature flags (`features.chat`, `features.billing`, etc.)
- [ ] Replace assets in `proto-client/public/`

## 3. Environment setup

```bash
cp .env.example .env                          # docker compose defaults (optional)
cp proto-backend/.env.example proto-backend/.env
cp proto-client/.env.local.example proto-client/.env.local
```

- [ ] Set `SECURITY_TOKEN_SECRET` to a long random string (min 16 chars)
- [ ] Set `CORS_ORIGINS` to your frontend URL(s)
- [ ] Configure AI provider keys (`OLLAMA_BASE_URL`, `OPENROUTER_API_KEY`, etc.)

## 4. Boot the stack

```bash
npm install
npm run setup          # Docker MySQL + migrations + seed
npm run test           # Contract tests (requires DB)
npm run doctor         # Verify all checks pass
npm run dev            # Backend :8080 + Frontend :3000
```

## 5. Verify baseline

- [ ] Open http://localhost:3000 — marketing landing
- [ ] Sign up or log in with seed user: `dev@proto.local` / `password123`
- [ ] Dashboard loads at `/dashboard`
- [ ] Create a chat, send a message
- [ ] Upload a document (optional RAG test)
- [ ] `GET http://localhost:8080/proto/api/health` returns healthy
- [ ] `npm test` passes (16 contract tests)

## 6. Client-specific work

- [ ] Add client routes under `proto-client/app/(app)/`
- [ ] Register client API modules in `client/index.js` (see `docs/CUSTOMIZE.md`)
- [ ] Disable unused features in `app.config.js`
- [ ] Deploy using your chosen preset (see `docs/CUSTOMIZE.md`)

## 7. Before go-live

- [ ] Run `npm run security:check`
- [ ] Rotate all secrets (never use seed credentials in production)
- [ ] Set `ENVIRONMENT=production`
- [ ] Enable HTTPS and restrict `CORS_ORIGINS`
