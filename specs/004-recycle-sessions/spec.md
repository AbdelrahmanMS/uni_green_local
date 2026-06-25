# Feature Specification: Recycle Sessions Audit

**Feature Branch**: `004-recycle-sessions`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Recycle Sessions audit area: a paginated, filterable session list with computed state (pending/completed/expired) shown as color-coded badges. Read-only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit the session lifecycle (Priority: P1)

An administrator browses a paginated list of recycle sessions to understand who is completing the
"submit photo → scan within 5 minutes" flow, who runs out of time, and who is mid-flow.

**Why this priority**: This is the primary troubleshooting tool and the core value of the area; it
works on its own.

**Independent Test**: Open sessions → a paginated table shows student name, student email, material
(Arabic), state (color badge), created time, and expiry time.

**Acceptance Scenarios**:

1. **Given** the sessions area, **When** it loads, **Then** a paginated table shows student name,
   student email, localized material, state badge, created time, and expiry time.
2. **Given** a session with `used=true`, **When** its row renders, **Then** the state badge is
   "مكتملة" (green); `pending` → "معلقة" (blue); `expired` → "منتهية" (red).
3. **Given** more results than one page, **When** the admin pages, **Then** the standard pagination
   shape drives the next page and any active filters are preserved.

---

### User Story 2 - Filter to investigate (Priority: P2)

An administrator filters sessions by state, material, date range, and/or a specific student to
investigate a problem (e.g., all expired sessions last week, or one student's history).

**Why this priority**: Filtering turns the raw audit list into an investigation tool; depends on the
list existing.

**Independent Test**: Apply `state=expired` → only incomplete-in-time sessions show; arrive from a
student detail page with `user_id` preset → only that student's sessions show; filters combine with
pagination.

**Acceptance Scenarios**:

1. **Given** the list, **When** the admin selects `state=expired`, **Then** only expired sessions
   are shown; `state=completed` shows only successful ones.
2. **Given** a material filter, **When** applied, **Then** only sessions of that material show
   (Arabic label).
3. **Given** a date range, **When** applied, **Then** only sessions created within it show.
4. **Given** navigation from a student's detail page, **When** the sessions list opens, **Then** it
   is pre-filtered to that `user_id`.
5. **Given** several filters plus paging, **When** combined, **Then** they all apply together and
   page state is consistent.

---

### Edge Cases

- No sessions / no matches → Arabic empty state, pagination hidden.
- A computed `state` value outside the three known values → neutral gray badge (never crash).
- Date range inverted/invalid → blocked client-side or backend message surfaced.
- Expiry time in the past for a `pending`-looking row → trust the server-computed `state`.
- This view does NOT show verify-failure reasons (wrong bin, material mismatch) — those live in
  feature 05; no `failure_reason` field is invented here.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a paginated session list with columns: student name, student
  email, material (localized), state (color badge), created time, expiry time.
- **FR-002**: The system MUST render the server-computed `state` as a color badge: `pending` →
  "معلقة" (blue), `completed` → "مكتملة" (green), `expired` → "منتهية" (red).
- **FR-003**: The system MUST support filtering by state, material, date range, and `user_id`, and
  these MUST combine with pagination.
- **FR-004**: The system MUST accept an incoming `user_id` filter (e.g., deep-linked from a student
  detail page) and pre-apply it.
- **FR-005**: The system MUST use the standard pagination shape and preserve active filters across
  pages.
- **FR-006**: The system MUST provide loading, empty, and error states using shared Arabic handling.
- **FR-007**: The view MUST be read-only (no editing or deleting sessions).
- **FR-008**: The system MUST NOT display or invent any `failure_reason`/verify-failure data here
  (that belongs to feature 05).
- **FR-009**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Session**: `id`, `user_id`, `student_name`, `student_email`, `material`, `state`
  (`pending|completed|expired`, server-computed), `used`, `expires_at`, `created_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can isolate all expired sessions in a date range in under 20 seconds via
  filters.
- **SC-002**: State badges render with the correct Arabic label and color for 100% of rows.
- **SC-003**: Filters + pagination always apply together; changing pages never drops a filter.
- **SC-004**: Material and state labels are Arabic for 100% of rows.
- **SC-005**: No `failure_reason` or verify-failure information appears anywhere in this view.

## Assumptions

- Endpoint per the constitution:
  `GET /admin/sessions?page=&limit=&user_id=&material=&state=&from_date=&to_date=`; `state` is
  computed server-side (used→completed; else expires_at>now→pending; else expired).
- Reuses the shared table, badge, pagination, and filter UI patterns from feature 01.
- Default page size 20 (limit max 100). Dates are ISO-8601.
