# Quickstart: Dashboard & Reports

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation in place (HTTP client, kit, charts, shell, auth).
- `unigreen_be` at `http://localhost:3000` with some recycle data.

## Acceptance walkthrough (maps to spec)

1. **US1 Overview**: open `/dashboard` → stat cards (users/recycles/points) + material breakdown
   with Arabic labels and API counts. (FR-001, FR-002, FR-008)
2. **US2 Trends**: chart defaults to last 30 days; change range → chart redraws with zero-filled
   days; pick > 90 days → Arabic limit message, no raw error. (FR-003–FR-005, SC-002, SC-003)
3. **US3 Top locations**: ranked descending by recycle_count, includes a deactivated location.
   (FR-006)
4. **Resilience**: kill one endpoint → only that section shows the Arabic error+retry; others stay
   usable. (FR-007, SC-005)

## Test ideas (Vitest + RTL)

- Range guard: > 90 days and inverted ranges are blocked client-side.
- Material map: missing `by_material` key renders 0, not a crash.
- Top-locations sort: descending by recycle_count.
