# Phase 1 Data Model: Admin Accounts Management

## AdminAccount

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | compared to current admin id for self-protection |
| `email` | string | unique (409 on duplicate) |
| `full_name` | string | |
| `role` | enum | `admin \| super_admin` (Arabic: مشرف / مشرف رئيسي) |
| `is_active` | boolean | |
| `created_at` | ISO datetime | |
| `password` | string | **write-only** (create/reset); never returned/displayed |

## Validation (zod)

- `email`: valid email.
- `password`: required + strength on create; optional on edit (reset only when provided).
- `full_name`: non-empty.
- `role`: enum (`admin`|`super_admin`).
- `is_active`: boolean (edit only).

## Operations

| Action | Endpoint | Body | Notes |
|---|---|---|---|
| List | GET /admin/admins | — | passwords never included |
| Get | GET /admin/admins/:id | — | |
| Create | POST /admin/admins | `{ email, password, full_name }` | role defaults to `admin`; 409 on dup email |
| Edit | PATCH /admin/admins/:id | subset of `{ full_name, role, is_active, password }` | 403 on self |
| Delete | DELETE /admin/admins/:id | — | **hard delete**; 403 on self |

## Self-protection rule

For the row where `row.id === currentAdmin.id`: disable deactivate, demote (role away from
super_admin), and delete. Any API 403 on a self action → surface Arabic self-protection message; no
change.

## Exception to soft-delete

Admins are **hard-deleted** (unlike locations/bins). Confirm copy states permanence.
