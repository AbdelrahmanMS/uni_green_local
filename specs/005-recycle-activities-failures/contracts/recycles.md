# Contract: Recycle Activities

Requires admin Bearer token; success envelope unwrapped by the interceptor.

## GET /admin/recycles?page=&limit=&material=&user_id=&from_date=&to_date=&status=

Paginated. Successful (`status=verified`, default) `data`:
```json
{
  "data": [
    { "id": "uuid", "user_id": "uuid", "student_name": "Alice", "student_email": "alice@uni.edu",
      "material": "plastic", "points_earned": 12, "location_name": "Library Building",
      "bin_color": "blue", "created_at": "2026-04-18T09:30:00.000Z", "status": "verified" }
  ],
  "total": 1847, "page": 1, "limit": 20
}
```

Failed (`status=failed`) rows add `failure_reason` and `points_earned: 0`:
```json
{ "id": "uuid", "user_id": "uuid", "student_name": "Bob", "student_email": "bob@uni.edu",
  "material": "glass", "points_earned": 0, "location_name": "Canteen", "bin_color": "green",
  "created_at": "...", "status": "failed", "failure_reason": "material_mismatch" }
```

- `failure_reason ∈ material_mismatch | expired | already_used | bin_not_found`.
- `limit` max 100.

## ⏳ Backend dependency (the only known gap)

`?status=verified|failed` (default `verified`) and the `status` + `failure_reason` fields are the
required backend addition. The UI is built to this contract; if unshipped, the Failed view degrades
gracefully (Arabic notice) and the Successful view still works.

## Boundary note (constitution)

Failed verify attempts come from THIS endpoint (`?status=failed`), NOT from `/admin/sessions`.

## Read-only

No create/update/delete; no points editing.
