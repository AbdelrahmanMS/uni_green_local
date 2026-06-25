# UniGreen Admin Panel

The administrative web panel for **UniGreen** — a university recycling incentive platform. It is a
frontend client of the existing `unigreen_be` NestJS backend. Arabic-first, right-to-left.

Built with **React 19 + React Router v8 (SPA mode) + TypeScript + Tailwind v4**, with
React Query for server state, axios for HTTP, react-hook-form + zod for forms, and `qrcode.react`
for client-side bin QR codes.

## Features

- 🔐 JWT login + role-aware shell (`admin` / `super_admin`), route guards, RTL Arabic UI (Tajawal).
- 📊 Dashboard: overview stats, material breakdown, daily trends (date range, 90-day guard), top locations.
- 👥 Students: searchable paginated list, detail view, activate/deactivate (level mapped 0=Rookie … 4=Platinum).
- ♻️ Sessions audit: filter by state/material/date/student with color-coded state badges.
- 🧾 Recycle activities: successful + failed tabs (graceful degradation if the backend `?status=` add-on is pending).
- 📍 Locations: CRUD with soft-delete + reactivate, coordinate validation.
- 🗑️ Bins: per-location CRUD, client-side QR + print, soft-delete (material limited to the five valid types).
- 🛡️ Admin accounts (super_admin only): CRUD, hard-delete, self-protection.

## Getting Started

```bash
npm install
cp .env.example .env       # set VITE_API_BASE_URL if the backend is not on localhost:3000
npm run dev                # http://localhost:5173
```

The backend (`unigreen_be`) must be running and reachable at `VITE_API_BASE_URL`
(default `http://localhost:3000`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run typecheck` | Route typegen + `tsc` |
| `npm run build` | Production build (SPA) |
| `npm start` | Serve the production build |

## Backend dependency (⏳)

Everything the panel needs is live in `unigreen_be` **except one addition**, required for the
**Failed** tab on the Recycle Activities screen: `GET /admin/recycles` must accept
`?status=verified|failed` (default `verified`) and return `status` + `failure_reason` per row.
Until that ships, the **Successful** tab works normally and the **Failed** tab shows an Arabic
"pending backend" notice instead of an error. See
`specs/005-recycle-activities-failures/` for the contract.

## Project layout

```
app/
├── components/   # design-system kit (Button, Table, Modal, Toast, charts, FilterBar, BinQrCard, …)
├── lib/          # http client + interceptors, auth context, levels, i18n, api/ modules
└── routes/       # login, shell (layout + guard), dashboard, students, sessions, recycles,
                  # locations, bins, admins, profile, not-found
specs/            # Spec Kit artifacts (spec / plan / tasks) per feature
.specify/         # constitution + Spec Kit templates and scripts
```

The locked conventions (response envelopes, JWT role, pagination shape, RTL, v1 scope cuts) are
defined in `.specify/memory/constitution.md`.
