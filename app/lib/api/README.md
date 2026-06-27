# `app/lib/api/` — Typed Backend Endpoint Modules

## Purpose
One small, strongly-typed module per backend resource. Each exposes simple functions
(`list`, `get`, `create`, …) that map directly to `/admin/*` endpoints, so screens call
`studentsApi.list(...)` instead of fiddling with URLs and params.

## Where it sits
The seam between the UI and the backend. Screens (`routes/*`) call these via React Query; these call
`lib/http`'s `api` helper (which already handles auth + envelope unwrapping).

## Key files
| File | Wraps | Functions |
|---|---|---|
| `types.ts` | — | The TypeScript shapes for every response (`Student`, `Session`, `Activity`, `Location`, `Bin`, `AdminAccount`, `Paged<T>`, report types). |
| `students.ts` | `/admin/users` | `list` (page/search), `get`, `setActive`. |
| `reports.ts` | `/admin/reports/*` | `overview`, `trends(from,to)`, `topLocations`. |
| `sessions.ts` | `/admin/sessions` | `list` (filter by state/material/student). |
| `recycles.ts` | `/admin/recycles` | `list` (filter by status verified/failed, material, student). |
| `locations.ts` | `/admin/locations` | `list`, `get`, `create`, `update`, `deactivate`. |
| `bins.ts` | `/admin/bins` | `list` (by location), `get`, `create`, `update`, `deactivate`. |
| `admins.ts` | `/admin/admins` | `list`, `get`, `create`, `update`, `remove`. |

## How it works
- Each function is a thin call like `api.get<Paged<Student>>("/admin/users", params)`. The generic
  type parameter (`<Paged<Student>>`) tells TypeScript exactly what comes back.
- Query modules include a small `clean()` helper that drops empty filter params so the URL only
  carries the filters that are actually set.
- Inputs that the backend *derives or generates* are deliberately **not** part of the input types:
  `bins.create` sends only `{ location_id, material }` (the server makes the `qr_code` and `color`).

## Why we built it this way (and the business reasoning)
- **A typed contract mirror.** Putting every endpoint and response shape in one place makes the
  front-end's view of the backend explicit and compiler-checked. If the backend changes a field, the
  type breaks here first — a cheap, early failure instead of a runtime surprise in a screen.
- **Screens stay declarative.** Because the API layer hides URLs/params, a screen reads like intent
  (`recyclesApi.list({ status: "failed", … })`), which is easy to follow and present.
- **Encoding backend rules in the input types.** Omitting `color`/`qr_code` from `BinInput` makes it
  *impossible* for the UI to try to set server-owned values — the type system enforces the backend's
  "color follows material, QR is server-generated" rules.
- **Reusing `Paged<T>` everywhere** keeps every list screen's pagination handling identical.

## Gotchas
- `StudentDetail.badges` is typed `unknown[]` and is **always empty** — the badge feature isn't
  implemented on the backend, so the UI never renders it (a v1 scope cut).
- `recycles.list` always sends a `status` (defaults to `verified`); the "Failed" tab passes
  `status: "failed"`.
- These modules don't catch errors — React Query surfaces them, and `lib/http` already normalized
  them to `{ code, message }`.

## Related
- `lib/http.ts` — the `api` helper these are built on.
- `lib/api/types.ts` — the shared response types.
- `unigreen_be/src/modules/admin/` — the endpoints being wrapped.
