# SaaS Frontend Architecture

Proto's frontend is structured as a **forkable SaaS shell** — public marketing, auth flows, and a protected app workspace.

## Route Structure

```
app/
  (marketing)/          → Public site (no auth)
    page.jsx            → Landing page (/)
    pricing/page.jsx    → Pricing (/pricing)
  (auth)/               → Auth flows
    login/page.jsx
    signup/page.jsx
  (app)/                → Protected workspace (auth required)
    layout.jsx          → Sidebar + header shell
    dashboard/page.jsx  → App home (/dashboard)
    chat/...
    documents/...
    settings/
      layout.jsx        → Settings sub-nav
      profile/page.jsx
      page.jsx          → Organization
      billing/page.jsx
      team/page.jsx
```

## Configuration

Edit `proto-client/config/app.config.js` (mirrors root `app.config.js`) to customize:

- **Branding** — `app.name`, `app.tagline`, `app.description`
- **Features** — toggle modules (`chat`, `documents`, `billing`, etc.)
- **Auth** — `signupEnabled`, `loginRedirect`

Disabled features are hidden from navigation and gated with `FeatureGate` if accessed directly.

## Key Components

| Component | Purpose |
|-----------|---------|
| `components/shell/MarketingHeader` | Public site nav |
| `components/shell/MarketingFooter` | Public site footer |
| `components/shell/SettingsNav` | Settings sidebar |
| `components/shell/FeatureGate` | Blocks disabled features |
| `components/shared/Sidebar` | App workspace nav |
| `components/shared/AppHeader` | App page header |

## Fork Customization Checklist

1. Update `config/app.config.js` — name, features, redirects
2. Replace branding in marketing copy (or extend config)
3. Enable/disable features for the client
4. Add client pages under `app/(app)/` or future `client/` overlay
5. Wire billing/team stubs to Stripe or your provider

## Auth Flow

- Login/signup → JWT in `localStorage` + cookie (for middleware)
- `(app)/layout.jsx` wraps all app routes with `ProtectedRoute`
- `middleware.js` redirects unauthenticated users to `/login`
- Post-login redirect: `appConfig.auth.loginRedirect` (default `/dashboard`)
