# Upgrading a Client Fork from Upstream Proto

When Proto (the foundation) gets improvements — security fixes, new modules, logging, migrations — you can pull those changes into an existing client fork without losing client-specific work.

## Before you start

1. **Commit or stash** all local changes in the client fork.
2. **Back up the database** if you are applying migrations in production.
3. **Read upstream release notes** or diff the commits you plan to merge.

## Recommended git workflow

```bash
# In your client fork
git remote add upstream https://github.com/YOUR_ORG/proto.git   # once
git fetch upstream

# Create an upgrade branch
git checkout -b upgrade/proto-$(date +%Y%m%d)
git merge upstream/main
# Resolve conflicts (see below), then:
npm install
npm run db:migrate
npm run test
npm run doctor
```

Prefer merging `upstream/main` on a dedicated branch and opening a PR in the client repo so CI runs before production deploy.

## Conflict resolution guide

| Path | Usually keep (client) | Usually take (upstream) |
|------|----------------------|-------------------------|
| `client/index.js` | Client modules & overrides | — |
| `app.config.js` | Branding, feature flags | New config keys (merge manually) |
| `proto-client/config/app.config.js` | Client branding | New schema fields |
| `proto-backend/.env` | Never commit — merge `.env.example` manually | — |
| `proto-backend/db/migrations/` | Never edit old migrations | New migration files only |
| `proto-backend/modules/` | — | Foundation module changes |
| `proto-backend/routes/` | Client-only route files | Core route fixes |
| `docs/` | Client-specific docs | Foundation docs |

**Rule of thumb:** foundation code (`proto-backend/modules`, `lib`, `middleware`, `services`) → prefer upstream. Client overlay (`client/`, branding config) → prefer yours.

## Client overlay after upgrade

If upstream added new core modules or feature flags:

1. Check `app.config.js` for new `features.*` keys and set them for your product.
2. Re-verify `client/index.js` still exports valid `{ modules, configOverrides }`.
3. If you added custom modules, ensure their `id` values do not collide with core module IDs (`auth`, `sessions`, `chat`, `documents`, `ai`).

## Database migrations

Upstream may ship new files under `proto-backend/db/migrations/`. Always run:

```bash
cd proto-backend && npm run db:migrate
```

Migrations are append-only. Do not rename or edit migrations that have already run in any environment.

## Environment variables

Compare your `proto-backend/.env` against `proto-backend/.env.example` after each upgrade. New keys (e.g. `LOG_LEVEL`, `CORS_ORIGINS`) must be added manually — `.env` is never overwritten by git.

## Verify the upgrade

```bash
npm run test           # contract + unit tests
npm run security:check # regression guardrails
npm run doctor         # MySQL, env, migrations
npm run dev            # smoke test auth, chat, documents
```

## When upgrades are hard

If the fork has diverged heavily:

1. **Cherry-pick** individual upstream commits instead of merging all of `main`.
2. **Re-fork** for greenfield clients; migrate data and `client/` overlay manually.
3. **Pin** to a known-good upstream tag and schedule upgrades on a cadence (e.g. monthly).

## Getting help

- Foundation architecture: `docs/foundation-plan/README.md`
- Customization: `docs/CUSTOMIZE.md`
- Day-1 setup: `docs/FORK.md`
