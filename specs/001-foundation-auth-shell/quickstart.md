# Quickstart: Foundation — Auth & App Shell

> Planning artifact. No application code is written until `/speckit.implement` (not run yet).

## Prerequisites

- Node 18+ and the existing repo (`app/`, `vite.config.ts`, `react-router.config.ts`).
- `unigreen_be` running at `http://localhost:3000` with at least one `admin` and one `super_admin`
  account (one of them deactivated, to exercise the 403 path).

## Intended dev loop (once implemented)

1. `npm install`
2. Set `VITE_API_BASE_URL=http://localhost:3000`.
3. `npm run dev` → open the app; it should redirect to `/login` (RTL, Arabic, Tajawal).
4. Log in with valid `admin` creds → land on `/dashboard` shell.

## Acceptance walkthrough (maps to spec)

1. **US1 Login**:
   - Valid creds → reach shell. (SC-001)
   - Wrong password → one generic Arabic error. (FR-003)
   - Deactivated account → distinct Arabic "deactivated" message. (FR-003)
   - Confirm RTL + Tajawal on the login screen. (FR-014)
2. **US2 Shell & role nav**:
   - As `admin`: nav shows Dashboard/Students/Sessions/Recycles/Locations/Bins, NO Admins. (FR-009)
   - As `super_admin`: Admins also appears. (FR-009)
   - Top bar shows app name + admin name + Arabic role label + logout. (FR-008, FR-015)
   - Collapse sidebar / shrink viewport → still usable. (US2 AC4)
3. **US3 Guards & persistence**:
   - Refresh while logged in → still logged in. (FR-011)
   - Open a protected URL logged out → redirected to `/login`. (FR-010)
   - As `admin`, open `/admins` directly → redirected to `/dashboard`. (FR-010, SC-002)
   - Simulate expired token → next request bounces to login. (FR-006, FR-011)
   - Logout → returns to login, session cleared. (FR-012)
4. **US4 Profile**:
   - Open "My profile" → read-only name/email/role. (FR-013)

## Manual envelope checks

- Force a `401` (e.g., tamper token) → auto-logout + redirect. (Interceptor)
- Force a `403` → friendly Arabic message, NO logout. (Interceptor)
- Confirm successful responses are unwrapped to `data` (screens never see the envelope).

## Test ideas (Vitest + RTL)

- `auth.ts`: decode valid/expired/malformed tokens; `isExpired`; role fallback to `admin`.
- interceptor: success unwraps `data`; error normalizes to `{ code, message }`; 401 clears token.
- `levels.ts`: 0→Rookie, 4→Platinum, unknown→fallback.
- Sidebar: renders Admins only for `super_admin`.
- RequireAuth / RequireSuperAdmin: redirect behavior.
