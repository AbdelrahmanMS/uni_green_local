# Contract: Locations

Requires admin Bearer token; success envelope unwrapped by the interceptor.

## POST /admin/locations
Body: `{ "name": "Library Building", "description": "Ground floor", "latitude": 30.0444, "longitude": 31.2357 }`
→ 201, full location object (`is_active: true`).

## GET /admin/locations
→ `data`: array of locations (active AND inactive), ordered by `created_at` descending.

## GET /admin/locations/:id
→ single location; 404 if not found.

## PATCH /admin/locations/:id
Body: any subset of `{ name, description, latitude, longitude, is_active }`. Reactivation =
`{ is_active: true }`.

## DELETE /admin/locations/:id
→ soft-delete: sets `is_active=false`. Row never removed (historical activity references it).

## Errors
Surface `error.message` (object-shaped envelope) — e.g., validation on coordinates.

## Out of scope (constitution)
No permanent deletion of locations.
