# `app/` — Admin Panel Application (Overview)

## Purpose
The entire admin web app lives under `app/`. It's a React Router v8 application that serves as the
**dashboard front-end** for the UniGreen backend — university staff use it to manage students,
locations, bins, and admins, and to view reports. It has no backend of its own; it's a pure client
of `unigreen_be`.

## Where it sits
The top of the front-end stack. The browser loads this; every screen calls `unigreen_be`'s
`/admin/*` endpoints. Arabic-first, right-to-left (Tajawal font).

## Structure
| Folder/file | What it is | Has its own README |
|---|---|---|
| `root.tsx` | App root: HTML shell (`<html dir="rtl">`), providers (React Query, Auth, Toast), error boundary. | — |
| `routes.ts` | The route table (which path renders which screen). | — |
| `routes/` | One file per screen (login, shell, dashboard, students, sessions, …). | ✅ |
| `components/` | The reusable design-system kit (Button, Table, Modal, charts, …). | ✅ |
| `lib/` | Foundation: HTTP client, auth context, i18n, level/date helpers. | ✅ |
| `lib/api/` | One typed module per backend resource (students, reports, bins, …). | ✅ |
| `app.css` | Tailwind v4 styles + design tokens. | — |

## How it works (the big picture)
- **Routing:** `routes.ts` defines a public `/login`, then a `shell` layout that wraps every
  authenticated page, plus a `*` not-found. React Router renders the matching `routes/*` file.
- **Data fetching:** every screen uses **TanStack React Query** — `useQuery` for reads,
  `useMutation` for writes — calling the typed `lib/api/*` modules, which call `lib/http`.
- **Auth:** `lib/auth` holds the logged-in admin (decoded from the JWT) in React context; the
  `shell` route redirects to `/login` if there's no admin, and hides super-admin-only nav.
- **Forms:** create/edit dialogs use `react-hook-form` + `zod` validation.
- **Providers** (set up in `root.tsx`): `QueryClientProvider` (30s stale time, 1 retry),
  `AuthProvider`, `ToastProvider`.

## Why we built it this way (and the business reasoning)
- **A thin, separate web client.** Staff need a desktop management UI with tables, filters, charts,
  and print — very different from the student mobile app. Building it as its own React app (instead
  of cramming admin features into the mobile app) keeps each surface focused on its audience.
- **React Query for all server state.** The dashboard is overwhelmingly read-heavy (lists, audits,
  reports). React Query gives caching, loading/error states, and automatic refetch/invalidation for
  free, so screens stay simple and consistent and the app feels fast.
- **Arabic RTL throughout.** The users are Arabic-speaking staff, so the document is `dir="rtl"`,
  the font is Tajawal, and all UI copy is Arabic (English keys like materials/roles are translated
  only at display time).
- **Strictly typed API layer.** Every endpoint has a TypeScript type, so the compiler catches a
  mismatch with the backend contract before it reaches the browser.

## Related
- `unigreen_be/src/modules/admin/` — the backend this app consumes.
- `unigreen_admin/.specify/memory/constitution.md` — the locked conventions (envelope, RTL,
  pagination, v1 scope).
- `unigreen_admin/specs/` — the per-feature Spec Kit artifacts.
