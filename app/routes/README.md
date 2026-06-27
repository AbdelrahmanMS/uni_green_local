# `app/routes/` — Screens & Navigation

## Purpose
Every page of the admin panel. Each file is one screen (or the layout that wraps them). The route
table in `../routes.ts` maps URLs to these files. Because the panel's screens are flat files (not
nested folders), this single README documents them all.

## Where it sits
The top of the UI: screens compose `components/*`, fetch through `lib/api/*` with React Query, and
live inside the `shell` layout (except `login` and `not-found`).

## The route table (`routes.ts`)
```
/login                → login.tsx           (public)
shell.tsx (layout, guards + sidebar) wraps:
  /                    → dashboard.tsx       (index)
  /students            → students.tsx
  /students/:id        → student-detail.tsx
  /sessions            → sessions.tsx
  /recycles            → recycles.tsx
  /locations           → locations.tsx
  /bins                → bins.tsx
  /admins              → admins.tsx          (super_admin only)
  /profile             → profile.tsx
*                      → not-found.tsx
```

## The screens
| File | What it does |
|---|---|
| `login.tsx` | Email/password form → `useAuth().login`. On success redirects into the panel. |
| `shell.tsx` | The authenticated **layout + guard**: redirects to `/login` if not logged in, renders the RTL sidebar nav + header, and hides the **Admins** link unless `isSuperAdmin`. |
| `dashboard.tsx` | Overview cards (users, recycles, points), material breakdown, a daily-trends line chart (date range, 90-day guard), and top locations. Reads `reportsApi`. |
| `students.tsx` | Paginated, searchable student list. Row → detail. Reads `studentsApi.list`. |
| `student-detail.tsx` | One student's info + an **activate/deactivate** toggle (`studentsApi.setActive`). |
| `sessions.tsx` | Audit of photo→QR sessions with color-coded state badges (pending/completed/expired) and filters. Reads `sessionsApi`. |
| `recycles.tsx` | Audit of finished activities with **Successful / Failed** tabs (the tab sets `status`). Reads `recyclesApi`. |
| `locations.tsx` | Locations CRUD (create/edit via form modal, soft-delete + reactivate). Reads `locationsApi`. |
| `bins.tsx` | Bins CRUD scoped by location, with the client-side QR card/print. Material is one of the five types; color/QR are server-owned. Reads `binsApi`. |
| `admins.tsx` | Admin-account CRUD (super-admin only), including hard-delete and self-protection. Reads `adminsApi`. |
| `profile.tsx` | The logged-in admin's own profile + logout. |
| `not-found.tsx` | 404 page. |

## How it works (the common pattern)
Almost every screen follows the same shape:
1. `useQuery` (via a `lib/api/*` function) to load data, wrapped in `<QueryState>` for
   loading/error/empty.
2. A `<Table>` (or cards/charts) to display it.
3. For writes: a `<Modal>` with a `react-hook-form` + `zod` form, submitted through a `useMutation`
   that **invalidates** the relevant query key on success and shows a `useToast()` message.
4. List filters/pagination are kept in the **URL** (`useSearchParams`) so a filtered view is
   shareable and survives refresh.

## Why we built it this way (and the business reasoning)
- **A guarded layout route (`shell`) instead of per-page checks.** Wrapping every authenticated page
  in one layout means the auth guard, sidebar, and header are written once. A page literally cannot
  render outside the guard, and the role-based nav (hiding *Admins*) lives in one place. Defense in
  depth: the UI hides super-admin actions, and the backend still enforces the role.
- **One consistent screen pattern.** Query → `QueryState` → table → modal-form → mutation →
  invalidate → toast is repeated everywhere, so once a student understands one screen they understand
  all of them. Consistency is the whole point of a management panel.
- **Filters/pagination in the URL.** Staff often share "the failed-recycles for this student" — URL
  state makes those views linkable and refresh-safe, and lets React Query key its cache by the exact
  query.
- **Read-mostly, write-carefully.** Most screens are audits/reports (read). The few writes
  (student status, locations/bins, admins) are mutations guarded by confirm dialogs, matching the
  backend's soft-delete/self-protection rules so the UI can't push the user toward a destructive
  mistake.
- **Tabs for verified vs. failed recycles.** The same endpoint with a `status` flag powers both
  tabs, keeping the "what went wrong" view one click away from the "what succeeded" view.

## Gotchas
- `shell.tsx` is both the layout **and** the auth guard — there's no separate guard component.
- The **Admins** nav item and `/admins` screen are super-admin-only in the UI, but security is
  ultimately enforced by the backend (`RolesGuard`), not the hidden link.
- Student badges are never shown (the backend badge feature is a v1 scope cut).

## Related
- `routes.ts` — the route table.
- `components/` — the building blocks each screen composes.
- `lib/api/` — the data each screen fetches.
- `unigreen_admin/specs/` — the per-screen Spec Kit specs (001–008).
