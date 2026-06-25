# Contract: Students (users)

All require the admin Bearer token; success envelope unwrapped by the interceptor.

## GET /admin/users?page=&limit=&search=

Paginated. `data`:
```json
{ "data": [ { "id": "uuid", "email": "alice@uni.edu", "display_name": "Alice", "total_points": 1250, "level": 2, "is_active": true, "created_at": "2026-01-15T08:00:00.000Z" } ], "total": 342, "page": 1, "limit": 20 }
```
- `search` matches name OR email, case-insensitive. `limit` max 100.
- **`level` is an integer 0–4** (NOT a string). **No `photo_url`** in v1.

## GET /admin/users/:id

`data` = the list shape + `badges: []` (always empty — DO NOT render).

## PATCH /admin/users/:id

Body: `{ "is_active": false }` — **only** `is_active` is accepted; all other fields ignored.
Effect: takes effect on the student's next request (existing token becomes useless).

## Out of scope (constitution)

No endpoint for editing points, deleting students, or badges.

## Deviation note (design → constitution)

ADMIN.md shows `level: "Silver"` (string) and `photo_url`. This contract follows the
**constitution**: integer `level` (mapped client-side, Rookie=0) and an initials avatar (no photo).
