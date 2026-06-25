# Quickstart: Recycle Activities & Failed Attempts

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation + feature 04 `FilterBar`.
- `unigreen_be` with completed recycles. **⏳ For the Failed view**: the backend must support
  `?status=failed` + `failure_reason`. If not shipped yet, the Failed view shows a pending notice.

## Acceptance walkthrough (maps to spec)

1. **US1 Successful**: open `/recycles` → default Successful view; table with name/email/material/
   points/location/bin color/created; points from API. (FR-001, FR-002, FR-008, SC-001)
2. **US2 Failed**: switch to "Failed" → rows show localized Arabic reason, points hidden. If backend
   gap → Arabic "pending backend" notice; Successful still works. (FR-003, FR-004, FR-009, SC-002,
   SC-004)
3. **US3 Filters**: material + date + `user_id` (deep-link) combine with the tab and pagination;
   switching tab resets to page 1 but keeps filters. (FR-005–FR-007, SC-003)

## Test ideas (Vitest + RTL)

- Failure-reason map: 4 known reasons + unknown→raw key.
- Tab→param + URL sync; tab switch resets page, keeps filters.
- Degradation: simulate 400 on `?status=failed` → notice; Successful unaffected.
