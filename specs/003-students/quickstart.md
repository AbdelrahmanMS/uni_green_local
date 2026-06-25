# Quickstart: Students Management

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation. `unigreen_be` with several student accounts (including a 0-point one).

## Acceptance walkthrough (maps to spec)

1. **US1 List/search**: open `/students` → table with name/email/points/level badge/status/join
   date; search by name or email filters server-side and resets to page 1; paging preserves search.
   A 0-point student shows **Rookie**. (FR-001–FR-004, SC-002, SC-003)
2. **US2 Detail**: open a student → initials avatar, level badge, points, join date, status; NO
   badges section. (FR-005, FR-006)
3. **US3 Toggle**: deactivate (confirm first) → status updates in place; reactivate works; failure
   shows Arabic error and keeps prior status. (FR-007–FR-010, SC-004)
4. **Scope check**: confirm there is NO points-edit, NO delete, NO badges anywhere. (FR-011, SC-005)

## Test ideas (Vitest + RTL)

- Level badge: 0→Rookie, 4→Platinum, 99→fallback gray.
- Toggle mutation: only `is_active` sent; rollback on error.
- Search: new term resets page to 1; debounced.
