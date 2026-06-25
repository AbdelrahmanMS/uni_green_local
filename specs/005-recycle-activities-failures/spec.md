# Feature Specification: Recycle Activities & Failed Attempts

**Feature Branch**: `005-recycle-activities-failures`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Recycle Activities area: successful recycles (points awarded) plus failed verify attempts, with a Successful/Failed status toggle, filters, and pagination."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit successful recycles (points) (Priority: P1)

An administrator browses the permanent record of completed recycles to audit points per student and
material.

**Why this priority**: The successful-activities view is the default and the primary points audit;
it is valuable on its own and is the safe baseline if the failed-attempts backend addition is not
yet shipped.

**Independent Test**: Open recycles → the default "Successful" view shows a paginated table of
student name, email, material (Arabic), points earned, location name, bin color, and created time.

**Acceptance Scenarios**:

1. **Given** the recycles area, **When** it loads, **Then** the default view shows successful
   activities (`status=verified`) with name, email, material (Arabic), points earned, location name,
   bin color, created time.
2. **Given** points values, **When** rows render, **Then** points come straight from the API (never
   hardcoded).
3. **Given** more results than one page, **When** the admin pages, **Then** the standard pagination
   shape drives it and filters + the status tab are preserved.

---

### User Story 2 - Review failed verify attempts (Priority: P2)

An administrator switches to the "Failed" view to spot problem bins (e.g., a bin students keep
scanning with the wrong material — a signage issue), seeing a readable Arabic failure reason.

**Why this priority**: High operational value, but depends on the ⏳ backend addition
(`?status=failed` + `status`/`failure_reason`). Built against the contract; flagged if not shipped.

**Independent Test**: Switch to "Failed" → the list shows failed attempts with a localized
`failure_reason` and points hidden (always 0).

**Acceptance Scenarios**:

1. **Given** the status toggle, **When** the admin selects "Failed", **Then** the list queries
   `status=failed` and shows a localized `failure_reason` per row.
2. **Given** a failed row, **When** it renders, **Then** points are hidden (they are always 0).
3. **Given** the backend has NOT yet shipped the `?status=` addition, **When** the failed view is
   opened, **Then** the UI degrades gracefully with a clear Arabic "feature pending backend" notice
   rather than an error dump.
4. **Given** the failure reasons, **When** localized, **Then** `material_mismatch`, `expired`,
   `already_used`, `bin_not_found` each map to a readable Arabic phrase.

---

### User Story 3 - Filter activities (Priority: P2)

An administrator filters by material, date range, and a specific student (`user_id`), combined with
the status tab and pagination.

**Why this priority**: Filtering scopes both audits to an investigation; depends on the lists.

**Independent Test**: Apply a material + date filter in either tab → results narrow; arrive from a
student detail page with `user_id` → pre-filtered; filters combine with the tab and pagination.

**Acceptance Scenarios**:

1. **Given** either tab, **When** a material/date/user filter is applied, **Then** results narrow
   accordingly and the active status tab is retained.
2. **Given** arrival from a student's detail page, **When** the list opens, **Then** it is
   pre-filtered to that `user_id`.
3. **Given** filters + paging + tab, **When** combined, **Then** all apply together consistently.

---

### Edge Cases

- No results in a tab → Arabic empty state, pagination hidden.
- Unknown `failure_reason` value → show the raw key as a fallback chip (never crash).
- Switching tabs resets to page 1 but keeps material/date/user filters.
- The ⏳ backend gap affects ONLY the Failed view; the Successful view must work regardless.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a paginated activities list with columns: student name, email,
  material (localized), points earned, location name, bin color, created time.
- **FR-002**: The system MUST default to the "Successful" view (`status=verified`).
- **FR-003**: The system MUST provide a status toggle/tabs: "Successful" (`status=verified`) and
  "Failed" (`status=failed`).
- **FR-004**: In the Failed view, the system MUST show a localized `failure_reason` and hide points
  (always 0). Reasons: `material_mismatch`, `expired`, `already_used`, `bin_not_found`.
- **FR-005**: The system MUST support filtering by material, date range, and `user_id`, combined
  with the status tab and pagination.
- **FR-006**: The system MUST accept an incoming `user_id` (deep-link from a student detail page) and
  pre-apply it.
- **FR-007**: The system MUST use the standard pagination shape; switching tabs resets to page 1 but
  retains material/date/user filters.
- **FR-008**: Points and material values MUST come straight from the API (not hardcoded).
- **FR-009**: If the backend `?status=` addition is not yet available, the Failed view MUST degrade
  gracefully with a clear Arabic notice (and the Successful view MUST remain fully functional).
- **FR-010**: The view MUST be read-only (no deleting activities, no editing points).
- **FR-011**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Activity (successful)**: `id`, `user_id`, `student_name`, `student_email`, `material`,
  `points_earned`, `location_name`, `bin_color`, `created_at`, `status='verified'`.
- **Activity (failed)**: same identity fields, `points_earned=0`, `status='failed'`,
  `failure_reason ∈ material_mismatch | expired | already_used | bin_not_found`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The default Successful view loads and shows API-sourced points for 100% of rows.
- **SC-002**: Switching to Failed shows a readable Arabic reason for 100% of failed rows and never
  shows points.
- **SC-003**: Filters + tab + pagination always apply together.
- **SC-004**: If the backend gap exists, the Failed view shows the Arabic pending notice and the
  Successful view still works 100% of the time.
- **SC-005**: Material labels are Arabic and points/materials match the API exactly.

## Assumptions

- Endpoint per the constitution:
  `GET /admin/recycles?page=&limit=&material=&user_id=&from_date=&to_date=&status=`.
- ⏳ **Backend dependency**: `?status=verified|failed` (default `verified`) plus `status` and
  `failure_reason` per row is the only known backend gap; the UI is built to this contract and
  flags it if absent.
- Reuses the shared table, badge, pagination, and the `FilterBar` introduced in feature 04.
- Default page size 20 (limit max 100). Dates ISO-8601.
