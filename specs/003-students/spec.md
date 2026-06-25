# Feature Specification: Students Management

**Feature Branch**: `003-students`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Students management area: a paginated, searchable student list; a student detail view; and an activate/deactivate action. Level is an integer 0–4 (0=Rookie … 4=Platinum)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and search students (Priority: P1)

An administrator opens the students area and sees a paginated list of student accounts, and can
search by name or email to find a specific student.

**Why this priority**: Finding and viewing students is the core of the area and the prerequisite for
moderation. It is independently valuable on its own.

**Independent Test**: Open students → a paginated table renders with display name, email, total
points, level badge, active status, and join date; typing a query filters server-side by name/email
and pagination still works.

**Acceptance Scenarios**:

1. **Given** the students area, **When** it loads, **Then** a paginated table shows display name,
   email, total points, level (as a localized label + color badge), active status, and join date.
2. **Given** a search term, **When** it is entered, **Then** the list returns server-side matches on
   name or email (case-insensitive) and resets to page 1.
3. **Given** more results than one page, **When** the admin changes page, **Then** the next page
   loads using the standard pagination shape and the search term is preserved.
4. **Given** a brand-new student with 0 points, **When** the row renders, **Then** the level shows
   **Rookie** (level 0).

---

### User Story 2 - Inspect a single student (Priority: P2)

An administrator opens a student to see a profile header with initials avatar, level badge, total
points, join date, and active/inactive status.

**Why this priority**: Detail view supports investigation and is the natural entry point to
moderation, but depends on the list existing.

**Independent Test**: Click a student → detail view shows profile header (initials avatar), level
badge, total points, join date, status; no badges section is rendered.

**Acceptance Scenarios**:

1. **Given** a student row, **When** the admin opens it, **Then** the detail view shows an initials
   avatar, display name, email, level badge, total points, join date, and status.
2. **Given** the student detail response includes an empty `badges` array, **When** the view
   renders, **Then** NO badges section appears.
3. **Given** a student detail page, **When** the admin wants related activity, **Then** affordances
   link to that student's sessions/recycles (filtered by their id) — handled by features 04/05.

---

### User Story 3 - Activate / deactivate a student (Priority: P2)

An administrator can deactivate a misbehaving student (with confirmation) or reactivate them; the
row/status updates immediately.

**Why this priority**: This is the only write action in the area and the moderation lever; depends
on list/detail existing.

**Independent Test**: Toggle a student to inactive (after confirming) → status updates in place
without a full reload; toggle back to active works too.

**Acceptance Scenarios**:

1. **Given** an active student, **When** the admin deactivates them, **Then** a confirmation is
   required first, and on confirm only the `is_active` field is sent.
2. **Given** a successful toggle, **When** it returns, **Then** the new status reflects immediately
   in the row/detail without a full page reload.
3. **Given** a deactivation, **When** it succeeds, **Then** the admin understands it takes effect on
   the student's next request (their token stops working).
4. **Given** a failed toggle, **When** it errors, **Then** an Arabic error message (from the error
   envelope) is shown and the prior status is retained.

---

### Edge Cases

- Empty search result → Arabic empty state, pagination hidden.
- Unknown/out-of-range level integer → neutral "غير معروف" gray badge (never crash).
- Rapid double-click on the toggle → guarded against duplicate requests.
- Long names/emails → truncate gracefully in the table; full value in detail.
- Deep-linking to a non-existent student id → Arabic not-found state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a paginated student list with columns: display name, email, total
  points, level (localized label + color badge), active status, and join date.
- **FR-002**: The system MUST support server-side search by name or email (case-insensitive) and
  reset to page 1 on a new search.
- **FR-003**: The system MUST use the standard pagination shape (`data.data[]`, `data.total`,
  `data.page`, `data.limit`) and preserve the search term across pages.
- **FR-004**: The system MUST render the integer level as a localized label and color badge using
  the mapping 0=Rookie, 1=Bronze, 2=Silver, 3=Gold, 4=Platinum, and MUST correctly handle level 0.
- **FR-005**: The system MUST provide a student detail view with an initials avatar, display name,
  email, level badge, total points, join date, and active/inactive status.
- **FR-006**: The system MUST NOT render any badges section even though the detail response includes
  a (always-empty in v1) `badges` array.
- **FR-007**: The system MUST allow activating/deactivating a student via a status toggle that sends
  ONLY the `is_active` field.
- **FR-008**: Deactivation MUST require a confirmation step before the request is sent.
- **FR-009**: A successful toggle MUST update the row/detail status immediately without a full
  reload.
- **FR-010**: On any failure, the system MUST show the Arabic error message from the error envelope
  and retain the previous status.
- **FR-011**: The system MUST NOT offer editing a student's points or deleting a student.
- **FR-012**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Student (list row)**: `id`, `email`, `display_name`, `total_points`, `level` (int 0–4),
  `is_active`, `created_at`.
- **Student (detail)**: list fields + `badges: []` (always empty in v1 — not rendered).
- **Level**: integer 0–4 mapped to a localized label + color (shared mapping from feature 01).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can locate a specific student by name or email in under 15 seconds via search.
- **SC-002**: A level-0 student always renders as **Rookie** (verifies the int→label map includes 0).
- **SC-003**: Search and pagination work together: changing pages preserves the active search 100%
  of the time.
- **SC-004**: Toggling status updates the row without a full page reload 100% of the time, and a
  failure never leaves a misleading status.
- **SC-005**: No UI anywhere offers points editing, student deletion, or badges.

## Assumptions

- Endpoints per the constitution: `GET /admin/users?page=&limit=&search=`, `GET /admin/users/:id`,
  `PATCH /admin/users/:id { is_active }`.
- The list/detail use the shared table, badge, pagination, confirm-modal, and toast components from
  feature 01.
- Default page size is 20 (limit max 100 per the constitution).
- The display field is `display_name` (the locked contract); the prototype's `level` string and
  `photo_url` are NOT used (level is an int; avatar is initials).
