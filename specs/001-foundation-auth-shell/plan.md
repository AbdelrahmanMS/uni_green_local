# Implementation Plan: Foundation — Auth & App Shell

**Branch**: `001-foundation-auth-shell` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-foundation-auth-shell/spec.md`

## Summary

Stand up the base of the UniGreen admin panel: an Arabic/RTL login, a JWT-decoded session, an
authenticated HTTP layer that honors the locked success/error envelopes, role-aware navigation, and
route guards. This feature also **establishes the shared design system** (color tokens, Tajawal
typography, and the reusable component kit — buttons, inputs, selects, badges, tables, pagination,
cards, stat cards, modals, confirm dialog, toasts, page header, charts) derived from the attached
design prototype, so features 02–08 stay visually consistent. No data pages are built here beyond
empty placeholders behind each nav item.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18
**Primary Dependencies**: React Router (routing + guards), axios (HTTP client with envelope
interceptor), @tanstack/react-query (server cache — wired here, used heavily from 02 on),
react-hook-form + zod (forms/validation, used from 02 on), a JWT decode helper (e.g. `jwt-decode`).
UI is built as a small in-repo component kit styled with CSS variables/tokens (no heavy component
library is mandated; the constitution permits shadcn/ui or Ant Design, but the prototype's bespoke
kit is lighter and matches the design exactly — see Research).
**Storage**: Browser `localStorage` for the access token (graduation-project simplicity, per spec
assumption). No client database.
**Testing**: Vitest + React Testing Library for unit/component tests; Playwright optional for E2E
(not required for v1).
**Target Platform**: Modern evergreen browsers (desktop-first, responsive down to tablet/mobile).
**Project Type**: Web application (single-page admin frontend; backend already exists as
`unigreen_be`).
**Performance Goals**: First meaningful login screen < 2s on a warm cache; navigation transitions
feel instant (< 100ms perceived). These are UX targets, not hard SLAs.
**Constraints**: Arabic-first RTL throughout; must consume the locked `/admin/*` contract verbatim;
token-based auth with no `/admin/auth/me`; 401 → logout, 403 → friendly message.
**Scale/Scope**: Small admin audience (tens of admins). Scope here ≈ 4 user stories, ~1 login
screen + shell + profile + the shared component kit (~14 components) + HTTP/auth layer.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 🔒 Principle | How this feature complies |
|---|---|
| I. Backend is source of truth | Only calls `POST /admin/auth/login`; invents no data shapes. Role comes from the token, not a hardcoded map. |
| II. Response envelopes fixed | The HTTP client unwraps `data` on success and reads `error.code`/`error.message` on failure (object form). This is implemented once here for all features. |
| III. Auth & RBAC | Bearer token on every request; role decoded from JWT (`payload.role`); 401→clear+login; 403→friendly message; Admins area gated to `super_admin`. |
| IV. Data conventions | No level/material/pagination rendering here, but the shared kit ships the level→label/color badge mapping (0=Rookie…4=Platinum) and pagination component for downstream use. |
| V. Scope discipline (v1) | No badges, no points editing, no QR endpoint, no extra reports introduced. Shell only. |
| VI. Localization & RTL | `dir="rtl"`, Tajawal font, Arabic labels and role names baked into the shell and kit. |
| VII. Simplicity | Small, well-known stack; bespoke-but-obvious component kit; no custom abstractions a reviewer must learn. |

**Result**: PASS (no violations). Complexity Tracking not required.

## How this plan follows the attached design

The prototype (`admin/layout.jsx`, `admin/pages.jsx`, `uploads/ADMIN.md`) is the **visual/UX
reference**. This plan reproduces its look while replacing its throwaway CDN-React + inline-style
code with clean, typed, componentized source.

- **Color palette** → design tokens (CSS variables): `primary #2d6a4f`, `primaryHover #1b4332`,
  `accent #40916c`, `light #52b788`, `lightBg #d8f3dc`, `veryLight #f0faf5`, `pageBg #f4f6f4`,
  `text #111827`, `muted #6b7280`, `border #e5e7eb`, plus semantic `danger/warning/info/success`.
- **Typography** → Tajawal, RTL.
- **Shell** → fixed right-anchored collapsible sidebar (240px / 64px) over `primary`, sticky top
  bar (60px), 24px content padding. Nav items and Arabic page labels match the prototype.
- **Component kit** → Button (primary/secondary/danger/ghost; sm/md/lg), Input, Select, Badge
  (incl. level colors), Table (RTL headers, empty state "لا توجد بيانات"), Pagination, Card,
  StatCard, Modal, ConfirmModal, Toast, PageHeader, LineChart, PieChart — all reproduced as
  reusable, accessible components.
- **Login** → centered card matching the prototype's `LoginPage`.

### Enhancements over the prototype (intentional improvements)

1. **Real architecture**: typed components + CSS-variable theming instead of inline styles and
   `Object.assign(window, …)` globals; a real router instead of a `page` string switch.
2. **Accessibility**: semantic landmarks (`<nav> <main> <header>`), focus-visible rings, ARIA on
   the modal (role="dialog", focus trap, Esc to close), keyboard-navigable sidebar and table rows,
   labelled form inputs, sufficient color contrast on badges.
3. **Responsive**: sidebar collapses to an overlay drawer on small screens (prototype only shrinks);
   tables scroll within a bounded container.
4. **Consistent loading/empty/error UX**: shared `<QueryState>` wrapper (spinner / Arabic empty /
   Arabic error with retry) used by every later feature, instead of ad-hoc states.
5. **Robust auth**: token expiry checked on load (decode `exp`) so an expired token redirects to
   login proactively, not only on the next 401; malformed token treated as logged-out.
6. **Single source of error text**: the axios response interceptor normalizes the error envelope to
   `{ code, message }` so screens never parse raw responses.

### Deviations from the design, corrected to honor the constitution

- **Error envelope**: the prototype/ADMIN.md use `{ message, error:"CODE", statusCode }`. We
  implement the **constitution** shape `{ success:false, error:{ code, message }, timestamp }`. The
  interceptor reads `error.message` / `error.code` (object), not a string.
- **Roles only**: no badges concept is wired anywhere in the shell (prototype has a `badge` icon —
  unused in nav; kept out of the design system's "business" surfaces).
- Login error handling distinguishes **401 (generic)** vs **403 (deactivated)** exactly per the
  constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-auth-shell/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth.md          # POST /admin/auth/login contract + envelope handling
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── main.tsx                     # App bootstrap, providers (Router, QueryClient), dir="rtl"
├── routes.tsx                   # Route table + guards (public /login, protected shell, super-only)
├── styles/
│   ├── tokens.css               # Design tokens (colors, spacing, radius) as CSS variables
│   └── global.css               # RTL base, Tajawal font-face, resets
├── lib/
│   ├── http.ts                  # axios instance + request (Bearer) & response (envelope) interceptors
│   ├── auth.ts                  # token storage, decode (id/email/role/exp), isExpired, login(), logout()
│   └── levels.ts                # int→{label,color} mapping (0=Rookie…4=Platinum) for downstream use
├── auth/
│   ├── AuthContext.tsx          # session state (current admin) from decoded token
│   ├── RequireAuth.tsx          # guard: redirect unauthenticated → /login
│   └── RequireSuperAdmin.tsx    # guard: redirect regular admin → /dashboard
├── shell/
│   ├── AppShell.tsx             # layout: Sidebar + TopBar + <Outlet/>
│   ├── Sidebar.tsx              # role-filtered nav, collapsible, RTL
│   └── TopBar.tsx               # page title, admin identity, logout
├── components/                  # shared design-system kit (reused by 02–08)
│   ├── Button.tsx  Input.tsx  Select.tsx  Badge.tsx  Card.tsx  StatCard.tsx
│   ├── Table.tsx   Pagination.tsx  Modal.tsx  ConfirmModal.tsx  Toast.tsx
│   ├── PageHeader.tsx  QueryState.tsx  Icon.tsx
│   └── charts/ LineChart.tsx  PieChart.tsx
├── i18n/
│   └── ar.ts                    # Arabic strings (nav labels, role labels, errors, common)
└── pages/
    ├── LoginPage.tsx
    ├── ProfilePage.tsx
    ├── NotFoundPage.tsx
    └── placeholders/            # empty stubs behind each nav item (replaced by 02–08)

tests/
├── unit/                        # auth decode, level map, interceptor envelope handling
└── component/                   # login flow, guard redirects, role-filtered nav
```

**Structure Decision**: Single-page React frontend rooted at `app/` (the repo is already a React
Router project — see existing `app/`, `react-router.config.ts`, `vite.config.ts`). The `lib/`,
`auth/`, `shell/`, and `components/` folders created here are the shared foundation every later
feature imports; features 02–08 add `pages/<feature>/` and `lib/api/<feature>.ts` modules only.

## Complexity Tracking

No constitution violations — table intentionally omitted.
