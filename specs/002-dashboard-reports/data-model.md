# Phase 1 Data Model: Dashboard & Reports

Client-side read models mirroring the locked report contract.

## Overview

| Field | Type | Notes |
|---|---|---|
| `total_users` | number | |
| `total_recycles` | number | |
| `total_points_awarded` | number | localized formatting on display |
| `by_material` | map | keys: `glass, metal, paper, plastic, trash` → count (missing key ⇒ 0) |

Material display map (Arabic): glass→زجاج, metal→معدن, paper→ورق, plastic→بلاستيك, trash→نفايات.

## TrendsResult

| Field | Type | Notes |
|---|---|---|
| `from` | ISO date | |
| `to` | ISO date | |
| `daily` | `TrendPoint[]` | zero-filled across [from,to] |

### TrendPoint

| Field | Type |
|---|---|
| `date` | ISO date |
| `count` | number |

Rules: default range = last 30 days; range > 90 days is rejected (Arabic limit message); inverted
range blocked client-side.

## TopLocation

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `name` | string | |
| `recycle_count` | number | sort descending; includes deactivated locations |

## Section state model

Each section ∈ `{ loading, error(message), empty, ready(data) }`, independent of the others.
