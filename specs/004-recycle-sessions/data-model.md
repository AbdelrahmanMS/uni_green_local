# Phase 1 Data Model: Recycle Sessions Audit

## Session (row)

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `user_id` | string (uuid) | used for deep-link filter |
| `student_name` | string | |
| `student_email` | string | |
| `material` | enum | glass/metal/paper/plastic/trash → Arabic label |
| `state` | enum | `pending \| completed \| expired` — **server-computed**, rendered as-is |
| `used` | boolean | informational (not recomputed) |
| `expires_at` | ISO datetime | "expiry time" column |
| `created_at` | ISO datetime | "created time" column |

## State badge map

| state | label (ar) | color |
|---|---|---|
| pending | معلقة | blue |
| completed | مكتملة | green |
| expired | منتهية | red |
| (unknown) | — | gray fallback |

## Material labels (ar)

glass→زجاج, metal→معدن, paper→ورق, plastic→بلاستيك, trash→نفايات.

## Filters / query params

`?page=&limit=&user_id=&material=&state=&from_date=&to_date=` — all optional, combine with
pagination; default limit 20 (max 100). Dates ISO-8601; inverted range blocked client-side.

## Pagination envelope

`data: { data: Session[], total, page, limit }`.

## Explicitly excluded

No `failure_reason` / verify-failure data (feature 05). Read-only — no mutations.
