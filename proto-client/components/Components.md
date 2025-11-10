### Design descision notes - Layered component design 

For this AI SaaS template we're using **shadcn/ui**, that means we already have a set of **primitive components** (buttons, inputs, dialogs, etc.) under `components/ui`.

This structure in a way that’s:

* scalable,
* consistent with enterprise patterns,
* and ready for modular AI SaaS features.

---

## 🧩 Folder Architecture Overview

```
components/
 ├── ui/                # Base shadcn components
 ├── core/              # Extended UI abstractions & generic wrappers
 ├── shared/            # Layout & navigation used across the app
 ├── modules/           # Feature or domain-specific components
 ├── layouts/           # High-level page scaffolds
 ├── hooks/             # Custom React hooks (optional, colocate small ones)
 └── index.ts           # Barrel export for all reusable components
```

---

## 🧱 Folder-by-Folder Breakdown

---

### 🧩 `components/ui/`

💡 **Source of truth for design tokens + atomic UI**
All components generated via `shadcn/ui` CLI live here.

**Examples:**

```
ui/
 ├── button.tsx
 ├── input.tsx
 ├── dialog.tsx
 ├── card.tsx
 ├── dropdown-menu.tsx
 ├── form.tsx
 ├── table.tsx
 ├── badge.tsx
 ├── skeleton.tsx
 └── tabs.tsx
```

**Purpose:**

* Atomic UI pieces — do not contain domain logic.
* Used by higher-level components (core/shared/modules).

---

### 🧠 `components/core/`

💡 **Your design system layer** — reusable *generic* composites built on top of `ui/`.

Think of this as your own “mini shadcn extension library.”

**Examples:**

```
core/
 ├── Modal.tsx             # Wraps shadcn Dialog with default sizing and close behavior
 ├── FormField.tsx         # Combines shadcn Form + Zod + RHF for convenience
 ├── Loader.tsx            # Central spinner or progress indicator
 ├── SkeletonLoader.tsx    # Custom shimmer skeleton wrapper
 ├── EmptyState.tsx        # Standardized “no data” component
 ├── ConfirmDialog.tsx     # Common confirmation modal pattern
 ├── AlertBanner.tsx       # Dismissible inline alert block
 ├── SectionHeader.tsx     # Page section header (title + subtitle)
 ├── CopyButton.tsx        # Copy-to-clipboard utility button
 └── ErrorBoundary.tsx     # Wrap pages/components for graceful error handling
```

**Purpose:**

* Composable building blocks — not feature-specific.
* Enforces brand, layout, and animation consistency.

---

### 🧭 `components/shared/`

💡 **Used across multiple pages and modules** — app-wide navigation, layout, and branding elements.

**Examples:**

```
shared/
 ├── Navbar.tsx            # Top navigation bar (logo, links, user menu)
 ├── Sidebar.tsx           # Dashboard side menu (responsive)
 ├── Footer.tsx            # App or marketing footer
 ├── ThemeSwitcher.tsx     # Light/Dark toggle
 ├── UserMenu.tsx          # Avatar + dropdown for account settings
 ├── SearchBar.tsx         # Global search / command menu
 ├── Breadcrumbs.tsx       # Navigation breadcrumb component
 ├── PageHeader.tsx        # Standardized title + action button area
 ├── NotificationsMenu.tsx # Dropdown for alerts/updates
 └── CommandPalette.tsx    # Cmd+K quick actions panel
```

**Purpose:**

* Defines global layout and user experience components.
* Reused across marketing, dashboard, and admin pages.

---

### 🔧 `components/layouts/`

💡 **Defines the high-level page scaffolds** — how pages are structured.

**Examples:**

```
layouts/
 ├── MarketingLayout.tsx   # Landing pages, pricing, about, etc.
 ├── AuthLayout.tsx        # Login/Signup page container
 ├── DashboardLayout.tsx   # Core app structure (navbar + sidebar + content)
 ├── AdminLayout.tsx       # Optional: Admin panel structure
 └── BlankLayout.tsx       # For pages with no chrome (errors, maintenance)
```

**Purpose:**

* Keeps Next.js page files clean.
* Central place to manage responsive grid and structure.

---

### 🧩 `components/modules/`

💡 **Feature-specific or domain-specific components**
Each subfolder corresponds to a SaaS module (Chat, Billing, Settings, etc.).

**Examples:**

```
modules/
 ├── chat/
 │   ├── ChatWindow.tsx
 │   ├── MessageBubble.tsx
 │   ├── MessageInput.tsx
 │   ├── ModelSelector.tsx
 │   └── FileUploadZone.tsx
 │
 ├── billing/
 │   ├── PricingTable.tsx
 │   ├── PlanCard.tsx
 │   ├── UsageMeter.tsx
 │   ├── SubscriptionStatus.tsx
 │   └── BillingHistoryTable.tsx
 │
 ├── settings/
 │   ├── SettingsForm.tsx
 │   ├── APIKeyManager.tsx
 │   ├── PreferencesSection.tsx
 │   └── DangerZone.tsx
 │
 ├── auth/
 │   ├── LoginForm.tsx
 │   ├── SignupForm.tsx
 │   ├── ForgotPasswordForm.tsx
 │   └── SocialLoginButtons.tsx
```

**Purpose:**

* Houses logic tied to a specific app feature or route group.
* Uses `core` + `ui` + `shared` components to assemble complex UIs.

---

### 🪄 `components/hooks/` (optional)

💡 Small reusable custom hooks that serve your components.

**Examples:**

```
hooks/
 ├── useDialog.ts          # State handling for modals
 ├── useToastMessage.ts    # Centralized toast notifications
 ├── useMediaQuery.ts      # Detect viewport size for responsive UI
 ├── useTheme.ts           # Light/dark state management
 ├── useCopyToClipboard.ts # Copy handler for CopyButton
 └── usePaginatedData.ts   # Shared pagination logic
```

**Purpose:**

* Keeps state logic organized and decoupled from UI render logic.

---

### 📦 `components/index.ts`

💡 Barrel file to simplify imports:

```ts
export * from "@/components/ui";
export * from "@/components/core";
export * from "@/components/shared";
export * from "@/components/layouts";
```

Now this enables us to use anywhere in the app:

```js
import { Button, Modal, EmptyState, Navbar } from "@/components";
```

---

## 🧠 How Everything Connects

Here’s how the dependency flow looks conceptually:

```
[ ui ]         → shadcn primitives
   ↓
[ core ]       → reusable abstractions (Modal, FormField, EmptyState)
   ↓
[ shared ]     → layout & navigation
   ↓
[ modules ]    → domain-specific features (chat, billing, settings)
   ↓
[ pages ]      → Next.js route pages using modules/layouts
```

This creates **a clean downward dependency flow** — no circular imports, no tangled mess, and easy scalability.

---

## 🧩 Example File Description 

| File                               | Purpose                                           |
| ---------------------------------- | ------------------------------------------------- |
| `core/Modal.tsx`                   | Wrapper for shadcn Dialog with app-wide defaults  |
| `core/EmptyState.tsx`              | Display “no results” message with optional action |
| `shared/Navbar.tsx`                | App-wide top navigation bar                       |
| `layouts/DashboardLayout.tsx`      | Contains Navbar + Sidebar + content area          |
| `modules/chat/ChatWindow.tsx`      | Composes chat bubbles, input, and header          |
| `modules/billing/PricingTable.tsx` | Displays plan tiers and Stripe integration        |
| `hooks/useDialog.ts`               | Hook for opening/closing any modal globally       |

---

### Final notes

✅ **Scalable:** add new features as new `modules/`
✅ **Composed:** each layer builds on the last
✅ **Replaceable:** swap out shadcn with another UI lib easily
✅ **Team-friendly:** clean separation between design, core logic, and feature logic
✅ **Ideal for white-label templates** — drop-in for multiple products
