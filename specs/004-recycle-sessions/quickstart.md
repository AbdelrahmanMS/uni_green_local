# Quickstart: Recycle Sessions Audit

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation. `unigreen_be` with sessions in all three states.

## Acceptance walkthrough (maps to spec)

1. **US1 List**: open `/sessions` → table with name/email/material(Arabic)/state badge/created/expiry;
   completed=green, pending=blue, expired=red. (FR-001, FR-002, SC-002)
2. **US2 Filters**: filter `state=expired` → only expired; add material + date range → combine;
   arrive with `user_id` (from a student) → pre-filtered; paging preserves all filters.
   (FR-003–FR-005, SC-001, SC-003)
3. **Boundary check**: confirm NO failure_reason column/field anywhere. (FR-008, SC-005)

## Test ideas (Vitest + RTL)

- State badge map: completed/pending/expired + unknown→gray.
- Filter→query-param composition; URL sync; page preserved with filters.
