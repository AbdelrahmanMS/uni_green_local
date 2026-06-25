# Phase 1 Data Model: Recycle Activities & Failed Attempts

## Activity (row)

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `user_id` | string (uuid) | deep-link filter |
| `student_name` | string | |
| `student_email` | string | |
| `material` | enum | glass/metal/paper/plastic/trash → Arabic |
| `points_earned` | number | shown in Successful; hidden in Failed (always 0) |
| `location_name` | string | |
| `bin_color` | string | |
| `created_at` | ISO datetime | |
| `status` | enum | `verified \| failed` (⏳ backend addition; default verified) |
| `failure_reason` | enum? | only when `status=failed` |

## Failure reason map (ar)

| reason | label (ar) |
|---|---|
| material_mismatch | عدم تطابق المادة |
| expired | منتهية الصلاحية |
| already_used | مستخدمة مسبقاً |
| bin_not_found | الحاوية غير موجودة |
| (unknown) | raw key fallback chip |

## Tabs / filters / query params

`?page=&limit=&material=&user_id=&from_date=&to_date=&status=` — `status` default `verified`.
Switching tab resets page→1 but keeps material/date/user filters. Default limit 20 (max 100).

## Pagination envelope

`data: { data: Activity[], total, page, limit }`.

## Degraded state (⏳ gap)

If `?status=failed` 400s or rows lack `status` → render Arabic "pending backend" notice for the
Failed tab; Successful tab unaffected.

## Read-only

No mutations (no delete, no points edit).
