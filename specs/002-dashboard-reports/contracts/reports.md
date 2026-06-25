# Contract: Reports

All require the admin Bearer token; responses use the success envelope (interceptor unwraps `data`).

## GET /admin/reports/overview

`data`:
```json
{
  "total_users": 342,
  "total_recycles": 1847,
  "total_points_awarded": 24510,
  "by_material": { "glass": 210, "metal": 430, "paper": 380, "plastic": 620, "trash": 207 }
}
```

## GET /admin/reports/trends?from=&to=

- `from`, `to` required (ISO date). Range **> 90 days → 400** (show Arabic limit message).
- `data`:
```json
{ "from": "2026-04-01", "to": "2026-04-17", "daily": [ { "date": "2026-04-01", "count": 12 }, { "date": "2026-04-02", "count": 0 } ] }
```
- `daily` is zero-filled for every day in the range.

## GET /admin/reports/top-locations

- `data` (array), ranked descending by `recycle_count`, includes deactivated locations:
```json
[ { "id": "uuid", "name": "Library Building", "recycle_count": 420 } ]
```

## Notes

- No other report endpoints exist in v1 (constitution scope).
- All counts are authoritative — never recomputed on the client.
