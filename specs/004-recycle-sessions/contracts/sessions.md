# Contract: Recycle Sessions

Requires admin Bearer token; success envelope unwrapped by the interceptor.

## GET /admin/sessions?page=&limit=&user_id=&material=&state=&from_date=&to_date=

Paginated. `data`:
```json
{
  "data": [
    { "id": "uuid", "user_id": "uuid", "student_name": "Alice", "student_email": "alice@uni.edu",
      "material": "plastic", "state": "expired", "used": false,
      "expires_at": "2026-04-18T09:35:00.000Z", "created_at": "2026-04-18T09:30:00.000Z" }
  ],
  "total": 89, "page": 1, "limit": 20
}
```

- `state ∈ pending | completed | expired`, **computed server-side**:
  `used=true → completed`; else `expires_at > now → pending`; else `expired`.
- Filters all optional; `limit` max 100.

## Read-only

No create/update/delete endpoints for sessions.

## Boundary note (constitution)

This endpoint carries session **lifecycle** only. Verify-failure reasons (material_mismatch, etc.)
are NOT here — they come from `/admin/recycles?status=failed` (feature 05). Do not invent a
`failure_reason` field on this contract.
