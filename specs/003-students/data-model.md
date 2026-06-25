# Phase 1 Data Model: Students Management

## Student (list row)

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `email` | string | searchable |
| `display_name` | string | searchable; source of initials avatar |
| `total_points` | number | read-only (no edit) |
| `level` | int 0–4 | → label+color via shared map (0=Rookie handled) |
| `is_active` | boolean | the only writable field |
| `created_at` | ISO datetime | "join date" |

## Student (detail)

List fields + `badges: []` — **always empty in v1, never rendered**.

## Level map (shared, from feature 01)

0=Rookie(مبتدئ, gray), 1=Bronze(برونزي), 2=Silver(فضي), 3=Gold(ذهبي), 4=Platinum(بلاتيني);
unknown → "غير معروف" gray.

## Pagination envelope

`data: { data: Student[], total: number, page: number, limit: number }` — default limit 20, max 100.

## List query params

`?page=&limit=&search=` — search is case-insensitive on name OR email; new search resets page→1.

## Status transition

`active ⇄ inactive` via `PATCH { is_active }` only. Deactivation requires confirmation; takes effect
on the student's next request (token rejected by the backend guard).

## Forbidden (v1 scope)

No points editing, no student deletion, no badges section.
