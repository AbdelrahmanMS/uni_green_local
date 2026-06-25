# Phase 1 Data Model: Locations Management

## Location

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `name` | string | required |
| `description` | string? | optional |
| `latitude` | number | −90..90 |
| `longitude` | number | −180..180 |
| `is_active` | boolean | soft-delete flag |
| `created_at` | ISO datetime | list ordered newest first |

## Validation (zod)

- `name`: non-empty (trimmed).
- `latitude`: number, ≥ −90, ≤ 90.
- `longitude`: number, ≥ −180, ≤ 180.
- `description`: optional string.
- `is_active`: boolean (edit only).

## Operations

| Action | Endpoint | Body |
|---|---|---|
| List | GET /admin/locations | — (returns active+inactive, newest first) |
| Get | GET /admin/locations/:id | — |
| Create | POST /admin/locations | `{ name, description?, latitude, longitude }` |
| Edit | PATCH /admin/locations/:id | any subset of `{ name, description, latitude, longitude, is_active }` |
| Deactivate | DELETE /admin/locations/:id | — (soft-delete → `is_active=false`) |

## State transition

`active ⇄ inactive`: DELETE → inactive; PATCH `{is_active:true}` → active. No hard delete.

## Relationship

A location has many bins (feature 07, scoped by `location_id`). List provides a "view bins" link.
