# Contract: Bins

Requires admin Bearer token; success envelope unwrapped by the interceptor.

## POST /admin/bins
Body: `{ "location_id": "uuid", "material": "plastic", "color": "blue" }` (NEVER send `qr_code`).
→ 201:
```json
{ "id": "uuid", "location_id": "uuid", "material": "plastic", "color": "blue",
  "qr_code": "550e8400-e29b-41d4-a716-446655440000", "is_active": true, "created_at": "..." }
```
- `material ∈ glass | metal | paper | plastic | trash` (no cardboard).
- 404 if `location_id` doesn't exist or is inactive → show backend message.

## GET /admin/bins?location_id=
→ `data`: array of bins (optionally filtered by location).

## GET /admin/bins/:id
→ single bin; 404 if not found.

## PATCH /admin/bins/:id
Body: any subset of `{ location_id, material, color, is_active }`. **Never** expose `qr_code` for
edit.

## DELETE /admin/bins/:id
→ soft-delete (`is_active=false`). Inactive bins cannot be scanned (verify returns 404).

## QR (constitution)
Render `qr_code` **client-side** (e.g., qrcode.react) + Print. There is NO server-side QR-image
endpoint.

## Out of scope
No permanent deletion; no editable `qr_code`.
