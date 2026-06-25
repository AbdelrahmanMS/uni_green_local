# Quickstart: Locations Management

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation. `unigreen_be` reachable.

## Acceptance walkthrough (maps to spec)

1. **US1 Browse**: open `/locations` → all locations (active+inactive), newest first; inactive
   visually distinct; each row links to its bins. (FR-001, FR-002, FR-008, SC-004)
2. **US2 Create**: submit valid name + coords → appears active; missing name blocked; lat/lng out of
   range blocked client-side / backend message shown. (FR-003, SC-001, SC-002)
3. **US3 Edit/deactivate/reactivate**: edit a field → persists; delete → becomes inactive (still
   listed); reactivate via edit `is_active=true`. (FR-004–FR-007, SC-003)
4. **Scope check**: no permanent-delete affordance anywhere. (FR-009, SC-005)

## Test ideas (Vitest + RTL)

- zod schema: name required; lat/lng boundary values (−90/90, −180/180) accepted, beyond rejected.
- Soft-delete: DELETE then list still contains the location marked inactive.
