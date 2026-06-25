# Phase 1 Data Model: Bins Management

## Bin

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `location_id` | string (uuid) | scope/filter |
| `material` | enum | glass/metal/paper/plastic/trash (no cardboard) → Arabic label |
| `color` | string | free text/swatch (not an enum) |
| `qr_code` | string (uuid) | **server-generated, read-only**; rendered client-side |
| `is_active` | boolean | soft-delete flag |
| `created_at` | ISO datetime | |

## Validation (zod)

- `location_id`: required uuid.
- `material`: enum of the five values.
- `color`: non-empty string.
- `is_active`: boolean (edit only).
- `qr_code`: NEVER in the schema/payload.

## Operations

| Action | Endpoint | Body |
|---|---|---|
| List | GET /admin/bins?location_id= | — (optional filter) |
| Get | GET /admin/bins/:id | — |
| Create | POST /admin/bins | `{ location_id, material, color }` → returns `{ …, qr_code }` |
| Edit | PATCH /admin/bins/:id | any subset of `{ location_id, material, color, is_active }` |
| Deactivate | DELETE /admin/bins/:id | — (soft-delete → `is_active=false`) |

## Material labels (ar)

glass→زجاج, metal→معدن, paper→ورق, plastic→بلاستيك, trash→نفايات.

## QR rendering

`qr_code` → client-side QR image (qrcode.react) + raw value + Print. No server QR endpoint.

## State transition

`active ⇄ inactive`: DELETE → inactive (unscannable; verify 404); PATCH `{is_active:true}` → active.
No hard delete.
