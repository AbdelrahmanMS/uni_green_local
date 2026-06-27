# `app/lib/` — Foundation (HTTP, Auth, i18n, Helpers)

## Purpose
The non-visual foundation every screen depends on: the HTTP client (with envelope unwrapping and
auth), the logged-in-admin context, the Arabic string/label maps, and small formatting helpers for
levels and dates. The `api/` sub-folder (typed endpoint modules) has its own README.

## Where it sits
Sits between the screens (`routes/`, `components/`) and the backend. Screens never call `axios`
directly — they go through `lib/api/*` → `lib/http`. They never hard-code Arabic strings — they use
`lib/i18n`.

## Key files
| File | Role |
|---|---|
| `http.ts` | The axios instance + `api.get/post/patch/delete` helpers. Adds the bearer token, unwraps the `{ data }` envelope, normalizes errors, and bounces to `/login` on 401. |
| `auth.tsx` | `AuthProvider` + `useAuth()`. Decodes the admin JWT, exposes `admin`, `isAuthenticated`, `isSuperAdmin`, `login()`, `logout()`. |
| `i18n.ts` | The central Arabic copy (`ar`), plus label/color maps for materials, session states, failure reasons. |
| `levels.ts` | `levelInfo(level)` — maps the backend integer level (0–4) to an Arabic label + badge color. |
| `datetime.ts` | `formatDateTime` / `formatDate` — render UTC ISO timestamps in the device's local timezone. |
| `api/` | Typed per-resource endpoint modules (see its own README). |

## How it works
- **`http.ts`** mirrors the backend's response envelope: a request interceptor attaches
  `Authorization: Bearer <token>` from `localStorage`; a response interceptor returns just `body.data`
  on success and rejects with a normalized `{ code, message }` on error. A global `401` clears the
  token and redirects to `/login`.
- **`auth.tsx`** stores the token in `localStorage` and decodes it with `jwt-decode` to get the
  admin's id, email, and role. It also caches `full_name` separately (the JWT may not carry it).
  `isSuperAdmin` gates super-admin-only UI.
- **`i18n.ts`** keeps backend keys (e.g. `glass`, `pending`, `material_mismatch`) in English
  internally and translates them to Arabic only for display, with matching color maps so material/
  state badges look consistent.

## Why we built it this way (and the business reasoning)
- **One HTTP choke-point.** Auth headers, envelope unwrapping, and 401 handling must be identical on
  every call. Centralizing them in `http.ts` means each `api/*` module is a one-liner and no screen
  can forget the token or mis-parse the envelope. It deliberately mirrors the mobile app's
  interceptor approach so both clients treat the backend identically.
- **Translate at the display layer, store keys in English.** The backend speaks in stable English
  enums (materials, states, roles). Keeping those as keys and translating only when rendering means
  the API contract stays language-neutral and adding/adjusting Arabic copy is a one-file change in
  `i18n.ts`.
- **Level as an integer mapped client-side.** Like the mobile app, the backend sends a number; the
  admin owns the Arabic label + badge color. Re-tuning labels never touches the backend.
- **Local-timezone date rendering.** Backend timestamps are UTC; staff want to read them in local
  time, so the helpers parse the `Z` ISO string and format locally — in one place, consistently.

## Gotchas
- The token lives in `localStorage` (key `unigreen_admin_token`), not a cookie — there's no SSR auth;
  this is a client-rendered SPA.
- `http.ts`'s error messages fall back to Arabic copy when the server/network gives nothing usable.
- There's no token refresh here (unlike the mobile app) — admin tokens are long-lived (7 days); a
  401 simply sends the user back to login.

## Related
- `lib/api/README.md` — the typed endpoint modules built on `http.ts`.
- `unigreen_be/src/common/` — the backend side of the same response envelope + auth.
