# Proto Client — SaaS Frontend

Next.js SaaS shell for Proto: public marketing, auth, and a protected app workspace.

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Marketing landing |
| `/pricing` | Public | Pricing page |
| `/login`, `/signup` | Public | Authentication |
| `/dashboard` | Auth | App home |
| `/chat`, `/documents`, … | Auth | Product features |
| `/settings/*` | Auth | Profile, org, billing, team |

## Quick Start

```bash
cd proto-client
cp .env.local.example .env.local   # if present
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to your backend (default `http://localhost:8080/proto/api`).

## Customize for a Client Fork

1. Edit `config/app.config.js` — app name, enabled features, login redirect
2. Update marketing copy in `app/(marketing)/page.jsx` or extend config
3. Replace logo/branding assets in `public/`
4. Enable features: `chains`, `models`, `prompts`, `billing`, `team`

See [SaaS Frontend Guide](../docs/foundation-plan/SAAS-FRONTEND.md) for full architecture.

## Project Structure

```
app/
  (marketing)/     Public site
  (auth)/          Login & signup
  (app)/           Protected workspace
components/
  shell/           Marketing, settings nav, feature gates
  shared/          Sidebar, header, layouts
config/
  app.config.js    Feature flags & branding
```
